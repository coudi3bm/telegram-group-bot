<template>
  <div>
    <v-textarea
      v-model="data.message"
      @input="$emit('input', data)"
      rows="6"
      no-resize
      dense
      outlined
      hide-details="auto"
      class="mb-2"
    />
    <v-checkbox
      v-model="data.webPreview"
      @input="$emit('input', data)"
      :label="`WebPreview`"
      hide-details="auto"
    />
  </div>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    data() {
      return this.value
    },
  },
}
</script>