<template>
  <v-sheet max-width="900" class="mx-auto pt-2 pb-2" color="background2">
    <span class="text-h4 font-weight-bold px-2">Информация</span>
    <v-row class="mt-4 px-2" dense>
      <v-col cols="12" sm="8">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title class="pb-0"> О группе </v-card-title>
          <v-card-text class="pb-0"> {{ this.group.note }} </v-card-text>
          <v-card-title> ID группы в telegram </v-card-title>
          <v-card-subtitle class="pb-0"> {{ this.group.id }} </v-card-subtitle>
          <v-card-title> Имя группы </v-card-title>
          <v-card-subtitle> {{ this.group.name }} </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title> Действия </v-card-title>
          <v-card-text>
            <v-btn depressed block @click="groupEditDialog.show = true">
              <v-icon left> {{ icons.mdiPencil }} </v-icon>
              Изменить
            </v-btn>
            <v-btn
              depressed
              block
              class="mt-1"
              @click="groupDeleteDialog.show = true"
            >
              <v-icon left> {{ icons.mdiTrashCan }} </v-icon>
              Удалить
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="groupEditDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Изменить группу </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="groupEditDialog.data.name"
              outlined
              dense
              hide-details="auto"
              class="pb-2"
              label="Имя группы"
            />
            <v-text-field
              v-model="groupEditDialog.data.id"
              outlined
              dense
              hide-details="auto"
              class="pb-2"
              label="ID группы"
            />
            <v-textarea
              v-model="groupEditDialog.data.note"
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
          <v-btn text @click="groupEditDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="updateGroup"> Изменить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="groupDeleteDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Удалить группу </v-card-title>
        <v-card-text> Вы уверенны, что хотите удалить группу? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="groupDeleteDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="deleteGroup"> Удалить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { mdiPencil, mdiTrashCan } from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiPencil,
      mdiTrashCan,
    },
    group: {
      id: '',
      name: '',
      note: '',
    },
    groupEditDialog: {
      show: false,
      data: {
        id: '',
        name: '',
        note: '',
      },
    },
    groupDeleteDialog: {
      show: false,
    },
    formValid: false,
  }),
  created() {
    const index = this.$store.state.groups.groups.findIndex(
      (group) => group.id === this.$route.params.groupId
    )
    const tempGroup = this.$store.state.groups.groups[index]
    this.group = {
      id: tempGroup.id,
      name: tempGroup.name,
      note: tempGroup.note,
    }
    this.groupEditDialog.data = {
      id: tempGroup.id,
      name: tempGroup.name,
      note: tempGroup.note,
    }
  },
  methods: {
    async updateGroup() {
      await this.$store
        .dispatch('groups/update', {
          id: this.$route.params.groupId,
          group: {
            id: this.groupEditDialog.data.id,
            name: this.groupEditDialog.data.name,
            note: this.groupEditDialog.data.note,
          },
        })
        .then(() => {
          this.groupEditDialog.show = false
          this.group = {
            id: this.groupEditDialog.data.id,
            name: this.groupEditDialog.data.name,
            note: this.groupEditDialog.data.note,
          }
          if (this.$route.params.groupId != this.groupEditDialog.data.id)
            this.$router.replace('/group/' + this.groupEditDialog.data.id)
        })
        .catch(() => {})
    },
    async deleteGroup() {
      await this.$store
        .dispatch('groups/delete', this.$route.params.groupId)
        .then(() => {
          this.groupDeleteDialog.show = false
          this.$router.push('/')
        })
        .catch(() => {})
    },
  },
}
</script>