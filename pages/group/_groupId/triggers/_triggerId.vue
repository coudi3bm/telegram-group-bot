<template>
  <v-sheet max-width="900" class="mx-auto pt-2 pb-2" color="background2">
    <v-row class="px-2" no-gutters justify="center" align="center">
      <v-col>
        <span class="text-h4 font-weight-bold">Триггер</span>
      </v-col>
      <v-col cols="auto">
        <v-btn
          style="text-transform: none"
          depressed
          color="primary"
          small
          @click="saveTrigger"
        >
          <v-icon left>{{ icons.mdiContentSave }}</v-icon>
          <span>Сохранить</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-4 px-2" dense>
      <v-col cols="12" sm="8">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title class="pb-0"> Название </v-card-title>
          <v-card-text> {{ trigger.name }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title> Действия </v-card-title>
          <v-card-text>
            <v-btn
              depressed
              block
              @click="
                triggerEditDialog = {
                  show: true,
                  data: {
                    name: trigger.name,
                  },
                }
              "
            >
              <v-icon left> {{ icons.mdiPencil }} </v-icon>
              Изменить
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4 px-2" dense>
      <v-col cols="12" sm="6">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title> Условия </v-card-title>
          <v-card-text>
            <v-select
              v-model="trigger.condition.type"
              label="Тип условия"
              outlined
              dense
              :items="inputData.conditionType"
              hide-details="auto"
              class="mb-2"
            />
            <v-combobox
              v-if="
                trigger.condition.type === 'onMessageType' ||
                trigger.condition.type === 'hearsRegExp'
              "
              class="mb-2"
              v-model="trigger.condition.data"
              label="Значение"
              multiple
              outlined
              deletable-chips
              chips
              hide-details="auto"
            />

            <v-item-group
              v-model="trigger.condition.whoAffected"
              active-class="primary"
              multiple
              mandatory
            >
              <v-subheader>На кого срабатывает триггер?</v-subheader>
              <v-row dense>
                <v-col>
                  <v-item v-slot="{ toggle }" value="users">
                    <v-btn
                      height="50"
                      block
                      depressed
                      @click="toggle"
                      style="text-transform: none"
                    >
                      Пользователи
                    </v-btn>
                  </v-item>
                </v-col>
                <v-col>
                  <v-item v-slot="{ toggle }" value="admins">
                    <v-btn
                      height="50"
                      block
                      depressed
                      @click="toggle"
                      style="text-transform: none"
                    >
                      Админы
                    </v-btn>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title>
            <v-row no-gutters justify="center" align="center">
              <v-col>
                <span>Действия</span>
              </v-col>
              <v-col cols="auto">
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      style="text-transform: none"
                      depressed
                      color="primary"
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon left>{{ icons.mdiPlus }}</v-icon>
                      <span>Добавить</span>
                    </v-btn>
                  </template>

                  <v-list color="content" dense>
                    <v-list-item @click="addAction('sendMessage')">
                      <v-list-item-title>Отправить сообщение</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="addAction('deleteMessage')">
                      <v-list-item-title>Удалить сообщение</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="addAction('blockInput')">
                      <v-list-item-title>Заблокировать ввод </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="addAction('countingStatistics')">
                      <v-list-item-title>Подсчет статистики</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-card
              class="mb-2"
              outlined
              v-for="(action, i) in trigger.actions"
              :key="i"
            >
              <v-card-title>
                {{ getNameOfActionType(action.type) }}
              </v-card-title>
              <v-card-text v-if="action.type === 'sendMessage'">
                <send-message v-model="action.data" />
              </v-card-text>
              <v-card-text v-else-if="action.type === 'blockInput'">
                <block-input v-model="action.data" />
              </v-card-text>
              <v-card-text v-else-if="action.type === 'countingStatistics'">
                <counting-statistics v-model="action.data" />
              </v-card-text>
              <span v-else-if="action.type === 'deleteMessage'" />

              <v-card-actions>
                <v-spacer />
                <v-btn x-small icon @click="moveAction(i, 'up')">
                  <v-icon>{{ icons.mdiChevronUp }}</v-icon>
                </v-btn>
                <v-btn x-small icon @click="moveAction(i, 'down')">
                  <v-icon>{{ icons.mdiChevronDown }}</v-icon>
                </v-btn>
                <v-btn x-small icon @click="removeAction(i)">
                  <v-icon>{{ icons.mdiCloseCircleOutline }}</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-title class="pb-0"> Подсказка </v-card-title>
          <v-card-text>
            Для разметки используется язык Markdown
            <br />Для жирного текста оберните его в символ: * <br />Пример:
            <b>*жирный текст*</b>
            <br />
            <br />
            Также вы можете всатить сслыку на пользователя используя: {userLink}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="triggerEditDialog.show"
      persistent
      max-width="400"
      overlay-color="black"
      overlay-opacity="0.5"
    >
      <v-card>
        <v-card-title class="headline"> Изменить триггер </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="triggerEditDialog.data.name"
              outlined
              dense
              hide-details="auto"
              class="pb-2"
              label="Имя триггера"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="triggerEditDialog.show = false"> Отмена </v-btn>
          <v-btn text @click="updateTrigger"> Изменить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import {
  mdiPlus,
  mdiTrashCan,
  mdiPencil,
  mdiClose,
  mdiContentSave,
  mdiChevronUp,
  mdiChevronDown,
  mdiCloseCircleOutline,
} from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiPlus,
      mdiTrashCan,
      mdiPencil,
      mdiClose,
      mdiContentSave,
      mdiChevronUp,
      mdiChevronDown,
      mdiCloseCircleOutline,
    },
    inputData: {
      conditionType: [
        {
          value: 'onMessageType',
          text: 'Тип сообщения',
        },
        {
          value: 'hearsRegExp',
          text: 'Регулярное выражение',
        },
        {
          value: 'newUser',
          text: 'Новый пользователь',
        },
      ],
    },
    formValid: false,
    triggerEditDialog: {
      show: false,
      data: {
        name: '',
      },
    },
  }),
  async asyncData({ params, $axios }) {
    const trigger = await $axios.$get(
      `/api/triggers/${params.triggerId}?groupId=${params.groupId}`
    )
    return { trigger }
  },
  methods: {
    getNameOfActionType(type) {
      const types = {
        sendMessage: 'Отправить сообщение',
        deleteMessage: 'Удалить сообщение',
        blockInput: 'Блокировать ввод',
        countingStatistics: 'Подсчет статистики',
      }
      return types[type]
    },
    async saveTrigger() {
      await this.$axios
        .$put(
          `/api/triggers/${this.$route.params.triggerId}?groupId=${this.$route.params.groupId}`,
          {
            name: this.trigger.name,
            actions: this.trigger.actions,
            condition: this.trigger.condition,
          }
        )
        .then((data) => {
          this.$notifier.showMessage({
            content: 'Триггер сохранен',
            color: 'success',
          })
        })
    },
    addAction(type) {
      let data = null
      if (type === 'sendMessage') {
        data = { message: '', webPreview: false }
      } else if (type === 'deleteMessage') {
      } else if (type === 'blockInput') {
        data = { blockTime: 0, buttonText: '', message: '' }
      } else if (type === 'countingStatistics') {
        data = { table: '' }
      }
      this.trigger.actions.push({
        data: data,
        type: type,
      })
    },
    updateTrigger() {
      this.trigger.name = this.triggerEditDialog.data.name
      this.triggerEditDialog = {
        show: false,
        data: {
          name: '',
        },
      }
    },
    removeAction(index) {
      this.trigger.actions.splice(index, 1)
    },
    moveAction(index, direction) {
      console.log(index, direction)
      const item = this.trigger.actions[index]
      direction = direction === 'up' ? -1 : 1
      this.trigger.actions.splice(index, 1)
      if (index === 0 && direction === -1) direction = 0
      this.trigger.actions.splice(index + direction, 0, item)
    },
  },
}
</script>
