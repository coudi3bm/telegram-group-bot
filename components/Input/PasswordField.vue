<template>
  <v-text-field
    label="Пароль"
    outlined
    autocomplete="on"
    :counter="counter"
    :value="value"
    :rules="rules"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? icons.mdiEyeOff : icons.mdiEye"
    @click:append="show = !show"
    @input="$emit('input', $event)"
    hide-details="auto"
  />
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  props: {
    value: {
      type: String,
      default: () => '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    counter: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    icons: {
      mdiEye,
      mdiEyeOff,
    },
    show: false,
  }),
}
</script>