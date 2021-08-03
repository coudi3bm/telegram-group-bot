<template>
  <v-sheet max-width="900" class="mx-auto pt-2 pb-2" color="background2">
    <v-row class="px-2" no-gutters justify="center" align="center">
      <v-col>
        <span class="text-h4 font-weight-bold">Группы</span>
      </v-col>
      <v-col cols="auto">
        <v-btn
          style="text-transform: none"
          depressed
          color="primary"
          small
          @click="groupAddDialog.show = true"
        >
          <v-icon left>{{ icons.mdiPlus }}</v-icon>
          <span>Добавить</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-4 px-2" dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(group, i) in $store.state.groups.groups"
        :key="i"
      >
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title>
            <span class="text-truncate"> {{ group.name }} </span>
          </v-card-title>
          <v-card-subtitle class="pb-0">id: {{ group.id }}</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn
              style="text-transform: none"
              depressed
              small
              :to="`/group/${group.id}`"
            >
              <v-icon left>{{ icons.mdiCog }}</v-icon>
              <span>Настройки</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="groupAddDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Добавить группу </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="groupAddDialog.data.name"
              outlined
              dense
              hide-details="auto"
              class="pb-2"
              label="Имя группы"
            />
            <v-text-field
              v-model="groupAddDialog.data.id"
              outlined
              dense
              hide-details="auto"
              class="pb-2"
              label="ID группы"
            />
            <v-textarea
              v-model="groupAddDialog.data.note"
              outlined
              dense
              no-resize
              hide-details="auto"
              label="Заметка"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="groupAddDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="addGroup"> Добавить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { mdiPlus, mdiCog } from '@mdi/js'

export default {
  data: () => ({
    icons: { mdiPlus, mdiCog },
    groupAddDialog: {
      show: false,
      data: {
        id: '',
        name: '',
        note: '',
      },
    },
    formValid: false,
  }),
  methods: {
    async addGroup() {
      await this.$store
        .dispatch('groups/create', {
          id: this.groupAddDialog.data.id,
          name: this.groupAddDialog.data.name,
          note: this.groupAddDialog.data.note,
        })
        .then(() => {
          this.groupAddDialog.show = false
        })
        .catch(() => {
          this.$notifier.showMessage({
            content: 'Группа с таким ID уже существует',
            color: 'error',
          })
        })
    },
  },
}
</script>