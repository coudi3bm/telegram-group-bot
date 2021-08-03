<template>
  <v-sheet max-width="900" class="mx-auto pt-2 pb-2" color="background2">
    <v-row class="px-2" no-gutters justify="center" align="center">
      <v-col>
        <span class="text-h4 font-weight-bold">Статистика</span>
      </v-col>
      <v-col cols="auto"> </v-col>
    </v-row>
    <v-row class="mt-4 px-2" dense>
      <v-col cols="12">
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="selects.table"
                  :items="selectsItems.table"
                  label="Таблицы"
                  no-data-text="Нет таблиц"
                  outlined
                  dense
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="selects.rangeType"
                  :items="[
                    {
                      text: 'День',
                      value: 'day',
                    },
                    {
                      text: 'Месяц',
                      value: 'month',
                    },
                  ]"
                  :disabled="!selects.table"
                  label="Тип диапазона"
                  outlined
                  dense
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="selects.date"
                  :items="selectsItems.date"
                  :disabled="!selects.rangeType"
                  label="Дата"
                  no-data-text="Нет записей"
                  outlined
                  dense
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4 px-2" dense>
      <v-col>
        <v-card
          color="content"
          style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <v-card-text>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th
                      class="text-left"
                      v-for="(item, i) in data.headers"
                      :key="i"
                    >
                      {{ item.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in data.items" :key="i">
                    <td>{{ item.key }}</td>
                    <td>{{ item.count }}</td>
                    <td>
                      <span v-if="item.date">
                        {{
                          formatDate(Math.floor(Date.parse(item.date)) / 1000)
                            .date
                        }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import {} from '@mdi/js'
import { formatDate, getUnixTime, months } from '~/utils'
import {
  eachMonthOfInterval,
  isSameMonth,
  getMonth,
  getYear,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns'

export default {
  data: () => ({
    icons: {},
    selects: {
      table: '',
      rangeType: '',
      date: '',
    },
    selectsItems: {
      table: [],
      date: [],
    },
    data: {
      headers: [
        {
          text: 'Ключ',
          sortable: false,
          value: 'key',
        },
        {
          text: 'Значение',
          sortable: true,
          value: 'count',
        },
        {
          text: 'Дата',
          sortable: true,
          value: 'date',
        },
      ],
      items: [],
    },
    stats: [],
  }),
  async fetch() {
    this.stats = await this.$axios.$get(
      `/api/stats?groupId=${this.$route.params.groupId}`
    )
    this.selectsItems.table = [...new Set(this.stats.map((item) => item.name))]
  },
  watch: {
    'selects.table': function (newValue, oldValue) {
      this.selects.date = ''
      this.selects.rangeType = ''
      this.data.items = []
    },
    'selects.rangeType': function (newValue, oldValue) {
      this.selects.date = ''
      this.data.items = []
      let items = this.stats.filter((item) => {
        return item.name === this.selects.table
      })
      if (this.selects.rangeType === 'day') {
        this.selectsItems.date = items.map((item) => {
          return {
            text: formatDate(Math.floor(Date.parse(item.date)) / 1000).date,
            value: Math.floor(Date.parse(item.date)) / 1000,
          }
        })
      } else if (this.selects.rangeType === 'month') {
        this.selectsItems.date = eachMonthOfInterval({
          start: new Date(Date.parse(this.stats[0].date)),
          end: new Date(Date.parse(this.stats[this.stats.length - 1].date)),
        }).map((item) => {
          return {
            text: `${getYear(item)} ${months[getMonth(item)]}`,
            value: item,
          }
        })
      }
    },
    'selects.date': function (newValue, oldValue) {
      if (!this.selects.date) return
      let items = this.stats.map((item) => {
        return {
          key: item.key,
          name: item.name,
          date: item.date,
          count: item.count,
        }
      })
      items = items.filter((item) => {
        return item.name === this.selects.table
      })
      if (this.selects.rangeType === 'day') {
        const date = formatDate(this.selects.date).date
        this.data.items = items.filter((item) => {
          return (
            formatDate(Math.floor(Date.parse(item.date)) / 1000).date == date
          )
        })
      } else if (this.selects.rangeType === 'month') {
        // console.log(this.selects.date)
        const startEnd = {
          start: startOfMonth(this.selects.date),
          end: endOfMonth(this.selects.date),
        }
        let temp = []
        // console.log(startEnd)
        // console.log(formatDate(Math.floor(Date.parse(items[0].date)) / 1000).date)
        items.map((item) => {
          if (isWithinInterval(new Date(Date.parse(item.date)), startEnd)) {
            const index = temp.findIndex((x) => x.key === item.key)
            if (index != -1) {
              temp[index].count += item.count
            } else {
              temp.push({
                key: item.key,
                name: item.name,
                date: null,
                count: item.count,
              })
            }
          }
        })
        // console.log(temp)
        this.data.items = temp
      }
    },
  },
  methods: {
    formatDate,
  },
}
</script>
