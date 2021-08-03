export default ({ store, $axios, $cookies }, inject) => {
    inject('auth', {
        async login(loginData) {
            return new Promise((resolve, reject) => {
                $axios.$post('/api/auth/login', loginData)
                    .then(async (res) => {
                        store.commit('auth/set', { loggedIn: true })
                        $cookies.set('auth.password', loginData.password, {
                            path: '/',
                        })
                        await store.dispatch('groups/fetch')
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
    })
}