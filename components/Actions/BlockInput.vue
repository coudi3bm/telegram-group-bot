<template>
  <div>
    <v-text-field
      v-model="data.blockTime"
      @input="$emit('input', data)"
      outlined
      dense
      type="number"
      label="Минуты"
      hide-details="auto"
      class="mb-2"
    />
    <v-text-field
      v-model="data.buttonText"
      @input="$emit('input', data)"
      label="Текст на кнопке"
      dense
      outlined
      hide-details="auto"
      class="mb-2"
    />
    <v-textarea
      v-model="data.message"
      @input="$emit('input', data)"
      label="Сообщение"
      rows="6"
      no-resize
      dense
      outlined
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