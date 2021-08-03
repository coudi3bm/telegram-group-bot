export const state = () => ({
    loggedIn: false,
})

export const mutations = {
    set(state, payload) {
        state.loggedIn = payload.loggedIn
    }
}

export const actions = {}