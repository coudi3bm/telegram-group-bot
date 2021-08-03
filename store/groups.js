export const state = () => ({
    groups: []
})

export const mutations = {
    set(state, payload) {
        state.groups = payload
    },
    create(state, payload) {
        state.groups.push(payload)
    },
    update(state, payload) {
        const index = state.groups.findIndex((group) => group.id === payload.id)
        state.groups[index] = payload.group
    },
    delete(state, payload) {
        const index = state.groups.findIndex((group) => group.id === payload)
        state.groups.splice(index, 1)
    },
}

export const actions = {
    async fetch(context, payload) {
        const groups = await this.$axios.$get('/api/groups')
        context.commit('set', groups)
    },
    async create(context, payload) {
        await this.$axios.$post('/api/groups', payload).then(async () => {
            await context.commit('create', payload)
        })
    },
    async update(context, payload) {
        await this.$axios.$put('/api/groups/' + payload.id, payload.group).then(async () => {
            await context.commit('update', payload)
        })
    },
    async delete(context, payload) {
        await this.$axios.$delete('/api/groups/' + payload).then(async () => {
            await context.commit('delete', payload)
        })
    },
}