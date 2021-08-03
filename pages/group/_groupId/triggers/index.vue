<template>
  <v-sheet max-width="900" class="mx-auto pt-2 pb-2" color="background2">
    <v-row class="px-2" no-gutters justify="center" align="center">
      <v-col>
        <span class="text-h4 font-weight-bold">Триггеры</span>
      </v-col>
      <v-col cols="auto">
        <v-btn
          style="text-transform: none"
          depressed
          color="primary"
          small
          @click="triggerAddDialog.show = true"
        >
          <v-icon left>{{ icons.mdiPlus }}</v-icon>
          <span>Добавить</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-4 px-2" dense>
      <v-col cols="12" sm="6" lg="4" v-for="(trigger, i) in triggers" :key="i">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title>
            <span class="text-truncate"> {{ trigger.name }} </span>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              depressed
              style="text-transform: none"
              small
              @click="
                triggerDeleteDialog = {
                  show: true,
                  data: {
                    id: trigger.id,
                  },
                }
              "
            >
              <v-icon left>{{ icons.mdiTrashCan }}</v-icon>
              Удалить
            </v-btn>
            <v-btn
              depressed
              style="text-transform: none"
              small
              :to="`/group/${$route.params.groupId}/triggers/${trigger.id}`"
            >
              <v-icon left>{{ icons.mdiPencil }}</v-icon>
              Изменить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="triggerAddDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Добавить триггер </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="addTrigger">
            <v-text-field
              v-model="triggerAddDialog.data.name"
              hide-details="auto"
              outlined
              dense
              label="Имя триггера"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="triggerAddDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="addTrigger" type="submit"> Добавить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="triggerDeleteDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Удалить триггер </v-card-title>
        <v-card-text> Вы уверенны, что хотите удалить триггер? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="triggerDeleteDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="deleteTrigger"> Удалить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { mdiPlus, mdiTrashCan, mdiPencil, mdiClose } from '@mdi/js'

export default {
  data: () => ({
    icons: { mdiPlus, mdiTrashCan, mdiPencil, mdiClose },
    triggerAddDialog: {
      show: false,
      data: {
        name: '',
      },
    },
    triggerDeleteDialog: {
      show: false,
      data: {
        id: null,
      },
    },
    formValid: false,
  }),
  async asyncData({ params, $axios }) {
    const triggers = await $axios.$get(
      `/api/triggers?groupId=${params.groupId}`
    )
    return { triggers }
  },
  methods: {
    async addTrigger() {
      await this.$axios
        .$post(`/api/triggers?groupId=${this.$route.params.groupId}`, {
          name: this.triggerAddDialog.data.name,
        })
        .then((data) => {
          this.triggers.push(data)
          this.triggerAddDialog.show = false
          this.triggerAddDialog.data = {
            name: '',
          }
        })
    },
    async deleteTrigger() {
      await this.$axios
        .$delete(
          `/api/triggers/${this.triggerDeleteDialog.data.id}/?groupId=${this.$route.params.groupId}`
        )
        .then(async () => {
          const index = this.triggers.findIndex(
            (trigger) => trigger.id === this.triggerDeleteDialog.data.id
          )
          this.triggers.splice(index, 1)
          this.triggerDeleteDialog = {
            show: false,
            data: {
              id: null,
            },
          }
        })
    },
  },
}
</script>