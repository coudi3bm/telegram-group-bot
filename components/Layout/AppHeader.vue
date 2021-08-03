<template>
  <div>
    <v-app-bar
      app
      clipped-left
      clipped-right
      flat
      dense
      :scroll-threshold="50"
      :hide-on-scroll="false"
      color="header"
      :style="`border-bottom: 1px solid ${$vuetify.theme.currentTheme.headerBorder} !important`"
    >
      <v-toolbar
        max-width="900"
        dense
        flat
        class="mx-auto toolbar"
        color="transparent"
      >
        <v-btn
          icon
          class="hidden-md-and-up"
          @click="navigationDrawer = !navigationDrawer"
        >
          <v-icon>{{ icons.mdiMenu }}</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold pa-0">
          <nuxt-link to="/" style="text-decoration: none; color: inherit">
            telegram-group-bot
          </nuxt-link>
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="themeDrawer = !themeDrawer">
          <v-icon v-if="$vuetify.theme.dark">
            {{ icons.mdiWeatherNight }}
          </v-icon>
          <v-icon v-else> {{ icons.mdiWhiteBalanceSunny }} </v-icon>
        </v-btn>
      </v-toolbar>
    </v-app-bar>

    <v-navigation-drawer
      v-model="navigationDrawer"
      mobile-breakpoint="960"
      clipped
      app
      overlay-color="black"
      overlay-opacity="0.5"
      color="content"
      style="box-shadow: none"
    >
      <v-list nav dense>
        <v-list-item to="/">
          <v-list-item-title>Главная</v-list-item-title>
        </v-list-item>
        <v-list-group
          :value="true"
          v-if="
            $store.state.auth.loggedIn === true &&
            $store.state.groups.groups.length !== 0
          "
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Группы</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            :to="`/group/${group.id}`"
            v-for="(group, i) in $store.state.groups.groups"
            :key="i"
          >
            <v-list-item-content>
              <v-list-item-title>{{ group.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <v-list v-if="$route.params.groupId" nav dense>
        <v-subheader>Настройки</v-subheader>
        <v-list-item :to="`/group/${$route.params.groupId}`" exact>
          <v-list-item-action>
            <v-icon>{{ icons.mdiInformation }}</v-icon>
          </v-list-item-action>
          <v-list-item-title>Информация</v-list-item-title>
        </v-list-item>

        <v-list-item :to="`/group/${$route.params.groupId}/stats`">
          <v-list-item-action>
            <v-icon>{{ icons.mdiTableAccount }}</v-icon>
          </v-list-item-action>
          <v-list-item-title>Статистика</v-list-item-title>
        </v-list-item>

        <v-list-item :to="`/group/${$route.params.groupId}/triggers`">
          <v-list-item-action>
            <v-icon>{{ icons.mdiLightningBolt }}</v-icon>
          </v-list-item-action>
          <v-list-item-title>Триггеры</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      temporary
      right
      app
      overlay-color="black"
      overlay-opacity="0.5"
      color="content"
      style="box-shadow: none"
      clipped
      v-model="themeDrawer"
      disable-resize-watcher
      width="300"
    >
      <v-toolbar flat underline color="transparent">
        <v-toolbar-title> Настройки темы </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="themeDrawer = false">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-item-group
        active-class="primary"
        mandatory
        @change="changeTheme"
        v-model="themeValue"
      >
        <v-row dense class="ma-1">
          <v-col :cols="item.cols" v-for="(item, i) in themeButtons" :key="i">
            <v-item v-slot="{ toggle }" :value="item.value">
              <v-btn
                height="50"
                block
                depressed
                @click="toggle"
                style="text-transform: none"
              >
                {{ item.text }}
                <v-icon right>{{ item.icon }}</v-icon>
              </v-btn>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiDesktopTowerMonitor,
  mdiClose,
  mdiMenu,
  mdiLightningBolt,
  mdiTableAccount,
  mdiInformation,
} from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiClose,
      mdiWhiteBalanceSunny,
      mdiWeatherNight,
      mdiMenu,
      mdiLightningBolt,
      mdiTableAccount,
      mdiInformation,
    },
    themeButtons: [
      {
        text: 'Светлая',
        value: 'light',
        cols: '6',
        icon: mdiWhiteBalanceSunny,
      },
      { text: 'Темная', value: 'dark', cols: '6', icon: mdiWeatherNight },
      {
        text: 'Системная',
        value: 'system',
        cols: '12',
        icon: mdiDesktopTowerMonitor,
      },
    ],
    navigationDrawer: null,
    themeDrawer: null,
    themeValue: 'system',
  }),
  mounted() {
    switch (localStorage.theme) {
      case 'light':
        this.themeValue = 'light'
        break
      case 'dark':
        this.themeValue = 'dark'
        break
      case 'system':
        this.themeValue = 'system'
        break
    }
  },
  methods: {
    changeTheme(value) {
      switch (value) {
        case 'light':
          this.$vuetify.theme.dark = false
          localStorage.theme = 'light'
          break
        case 'dark':
          this.$vuetify.theme.dark = true
          localStorage.theme = 'dark'
          break
        case 'system':
          localStorage.theme = 'system'
          if (
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
          ) {
            this.$vuetify.theme.dark = true
          } else {
            this.$vuetify.theme.dark = false
          }
          break
      }
    },
  },
}
</script>