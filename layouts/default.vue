<template>
  <app-body :style="`background: ${$vuetify.theme.currentTheme.background1}`">
    <app-header />

    <v-main class="ma-0 mx-md-2">
      <v-container fluid class="pa-0" v-if="$store.state.auth.loggedIn">
        <nuxt />
      </v-container>
    </v-main>

    <app-footer />

    <snackbar />
  </app-body>
</template>

<script>
export default {
  name: 'default',
  middleware: ['isAuth'],
}
</script>