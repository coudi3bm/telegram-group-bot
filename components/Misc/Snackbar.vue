<template>
  <v-snackbar
    v-model="show"
    class="snackbar"
    :color="color"
    top
    timeout="3000"
    right
    multi-line
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn icon v-bind="attrs" @click="show = false">
        <v-icon> {{ icons.mdiClose }} </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiClose,
    },
    show: false,
    message: '',
    color: '',
  }),

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  },
}
</script>