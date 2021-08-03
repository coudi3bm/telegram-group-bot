import { Telegraf, Extra, Markup } from 'telegraf'
import Session from 'telegraf/session'
import { formatDate, getUnixTime, clearTime } from '../utils'
import { Trigger, Stats } from "./db"

const botMiddleware = {
    notAdmin: async ({ state }, next) => {
        if (!state.isAdmin) {
            next()
        }
    },
    isAdmin: async ({ state }, next) => {
        if (state.isAdmin) {
            next()
        }
    },
    setIsAdmin: async ({ message, telegram, state }, next) => {
        try {
            const member = await telegram.getChatMember(message.chat.id, message.from.id)
            state.isAdmin = member.status === 'creator' || member.status === 'administrator' ? true : false
        } catch (err) { }
        next()
    },
    getConfig: async ({ state, chat }, next) => {
        state.config = {}
        if (chat.type === 'group' || chat.type === 'supergroup') {
            const config = await Trigger.findAll({ where: { groupId: chat.id } })
            state.config = config
        }
        next()
    }
}
function userLink(from) {
    return `[${from.first_name}${from.last_name ? ' ' + from.last_name : ''}](tg://user?id=${from.id})`
}
async function resolveActions(actions, ctx) {
    for (const action of actions) {
        if (action.type === 'sendMessage') {
            await ctx.replyWithMarkdown(action.data.message.replace('{userLink}', userLink(ctx.from)), Extra.webPreview(action.data.webPreview))
        } else if (action.type === 'deleteMessage') {
            await ctx.deleteMessage()
        } else if (action.type === 'blockInput') {
            ctx.session.unBlockButtonClick = false
            ctx.session.blockTime = action.data.blockTime * 60
            ctx.replyWithMarkdown(action.data.message.replace('{userLink}', userLink(ctx.from)), Extra.webPreview(false).markup(Markup.inlineKeyboard([
                Markup.callbackButton(action.data.buttonText, 'unBlock')
            ])))
        } else if (action.type === 'countingStatistics') {
            console.log('Статистика')
            const stat = await Stats.findOne({ where: { groupId: ctx.chat.id, name: action.data.table, key: ctx.from.username, date: clearTime(new Date()) } })
            if (stat) {
                stat.update({ count: stat.count + 1 })
            } else {
                await Stats.create({
                    groupId: ctx.chat.id,
                    name: action.data.table,
                    key: ctx.from.username,
                    date: clearTime(new Date()),
                    count: 1,
                })
            }
        }
    }
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(Session())
bot.use(botMiddleware.getConfig)
bot.use(botMiddleware.setIsAdmin)

bot.command('me', ({ reply, from, chat }) => {
    if (chat.type === 'private')
        reply(from)
    else
        reply('Это не приватный чат')
})
bot.command('chatData', botMiddleware.isAdmin, ({ reply, chat }) => {
    if (chat.type === 'group' || chat.type === 'supergroup')
        reply(chat)
})

bot.action('unBlock', ({ session, from }) => {
    if (session.unBlockButtonClick === false) {
        console.log('unBlock', from, session)
        session.unBlockButtonClick = true
        session.blockInputToTime = getUnixTime() + session.blockTime
    }
})

bot.on('message', ({ deleteMessage, session, state }, next) => {
    if ((session.blockInputToTime > getUnixTime() || session.unBlockButtonClick === false) && state.isAdmin === false) {
        deleteMessage()
    } else {
        next()
    }
})
bot.on('message', async ({ updateSubTypes, message, replyWithMarkdown, from, deleteMessage, session, state, chat }, next) => {
    console.log(from, session)
    const ctx = { replyWithMarkdown, from, deleteMessage, session, chat }
    for (const trigger of state.config) {
        if (trigger.condition.whoAffected.includes(state.isAdmin ? 'admins' : 'users')) {
            if (trigger.condition.type === 'onMessageType' && updateSubTypes.some((item) => trigger.condition.data.includes(item))) {
                await resolveActions(trigger.actions, ctx)
            } else if (trigger.condition.type === 'hearsRegExp' && updateSubTypes.some((item) => item === 'text') && trigger.condition.data.some((item) => message.text.toLowerCase().match(RegExp(item.toLowerCase())))) {
                await resolveActions(trigger.actions, ctx)
            }
        }
    }
    next()
})
bot.on('new_chat_members', async ({ replyWithMarkdown, deleteMessage, from, session, state }, next) => {
    const ctx = { replyWithMarkdown, from, deleteMessage, session }
    for (const trigger of state.config) {
        if (trigger.condition.type === 'newUser' && trigger.condition.whoAffected.includes(state.isAdmin ? 'admins' : 'users')) {
            await resolveActions(trigger.actions, ctx)
        }
    }
})

export default bot