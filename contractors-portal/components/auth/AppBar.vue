<template>
  <v-app-bar :dark="isDark" absolute color="transparent" flat height="85">
    <v-container class="px-0 text-right d-flex align-center">
      <v-toolbar-title class="font-weight-light" v-text="title" />
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
  name: 'AppBar',
  components: {
    Language: () => import('~/components/base/Language'),
    DarkLight: () => import('~/components/base/DarkLight'),
  },
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data: (vm) => ({
    items: [
      {
        icon: 'mdi-file',
        text: 'Certificados',
        to: vm.localePath({ name: 'certificates' }),
      },
    ],
  }),
  computed: {
    title() {
      return this.$t(`titles.${this.$route.meta.title || 'Dashboard'}`)
    },
  },
}
</script>
