<template>
  <div>
    <v-text-field
      v-model="data.table"
      @input="$emit('input', data)"
      label="Имя таблицы"
      outlined
      dense
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