<template>
  <v-app>
    <slot />

    <v-dialog
      v-model="dialogLogin"
      width="500"
      persistent
      class="rounded-t-xl"
      color="content"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card class="rounded-t-lg" color="content" flat>
        <v-card-title class="headline"> Вход </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="login" ref="form" v-model="validForm">
            <password-field
              v-model="password"
              :rules="[
                (v) => !!v || 'Введите пароль',
                (v) => v.length >= 8 || 'Минимум 8 символов',
              ]"
            />
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="login()"> Войти </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {} from '@mdi/js'

export default {
  data: () => ({
    icons: {},
    password: '',
    validForm: false,
    dialogLogin: false,
  }),
  mounted() {
    this.dialogLogin = !this.$store.state.auth.loggedIn
    this.$meta().refresh()
    if (localStorage.theme === undefined) {
      localStorage.theme = 'system'
    }
    switch (localStorage.theme) {
      case 'light':
        this.$vuetify.theme.dark = false
        break
      case 'dark':
        this.$vuetify.theme.dark = true
        break
      case 'system':
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          this.$vuetify.theme.dark = true
        } else {
          this.$vuetify.theme.dark = false
        }
        break
      default:
        break
    }
  },
  methods: {
    login() {
      this.$refs.form.validate()
      if (this.validForm) {
        this.$auth
          .login({ password: this.password })
          .then((res) => {
            this.dialogLogin = false
          })
          .catch((err) => {
            this.$notifier.showMessage({
              content: 'Неверный пароль',
              color: 'error',
            })
          })
      }
    },
  },
}
</script>

<style>
::-webkit-scrollbar {
  width: 15px;
  height: 10px;
  background: var(--v-scrollBackground-base);
  border: 1px solid var(--v-scrollBorder-base);
}

::-webkit-scrollbar-thumb {
  min-height: 28;
  background: var(--v-scrollThumbBackground-base);
  transition: 0.1s;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--v-scrollThumbBackgroundHover-base);
}

::-webkit-scrollbar-thumb:active {
  background: var(--v-scrollThumbBackgroundActive-base);
}
</style>