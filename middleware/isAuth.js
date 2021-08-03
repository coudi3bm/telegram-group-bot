export default function ({ $auth, store, $cookies }) {
    if (store.state.auth.loggedIn === false && $cookies.get('auth.password')) {
        return $auth.login({ password: $cookies.get('auth.password') })
    }
}