<template>
  <v-app-bar
    v-scroll="onScroll"
    elevate-on-scroll
    fixed
    :color="color"
    :dark="dark"
  >
    <v-container class="px-0 text-right d-flex align-center">
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="title"
      />

      <v-spacer />
      <v-btn
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        min-height="48"
        min-width="40"
        text
      >
        <v-icon
          :left="$vuetify.breakpoint.mdAndUp"
          size="20"
          v-text="item.icon"
        />

        <span class="hidden-sm-and-down" v-text="item.text" />
      </v-btn>
      <Language />
      <v-menu left>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip left>
            <template #activator="{ on: tooltip }">
              <v-btn
                :aria-label="$t('sidebar.dark')"
                icon
                v-bind="attrs"
                v-on="{ ...menu, ...tooltip }"
              >
                <v-icon>mdi-theme-light-dark</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('sidebar.dark') }}</span>
          </v-tooltip>
        </template>
        <v-card flat>
          <DarkLight />
        </v-card>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'LandingCoreAppBar',
  components: {
    Language: () => import('~/components/base/Language'),
    DarkLight: () => import('~/components/base/DarkLight'),
  },
  data: (vm) => ({
    dark: true,
    color: 'transparent',
    items: [
      {
        icon: 'mdi-file',
        text: 'Certificados',
        to: vm.localePath({ name: 'certificates' }),
      },
      {
        icon: 'mdi-fingerprint',
        text: 'Iniciar Sesión',
        to: vm.localePath({ name: 'login' }),
      },
    ],
  }),
  computed: {
    title() {
      return 'Portal Contratista'
    },
    darkTheme() {
      return this.$store.getters['app/getIsDark']
    },
  },
  methods: {
    onScroll() {
      const color = this.darkTheme ? '' : 'white'
      this.color = window.scrollY > 100 ? color : 'transparent'
      this.dark = !(window.scrollY > 100)
    },
  },
}
</script>
