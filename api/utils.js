export const config = {
    api_token: process.env.API_TOKEN,
    bot_token: process.env.BOT_TOKEN,
}

export const middleware = {
    requireAuthentication: function (req, res, next) {
        if (req.cookies['auth.password'] === config.api_token) {
            next()
        } else {
            res.status(403).json({ status: 403, message: 'bad password' })
        }
    },
    checkGroupId: function (req, res, next) {
        if (!req.query.groupId) {
            res.status(404).json({ status: 404, message: 'not found' })
        } else {
            next()
        }
    }
}