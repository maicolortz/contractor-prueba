<template>
  <v-main>
    <v-row justify="center" align-content="center">
      <v-col cols="12" md="12" class="mx-auto">
        <v-card flat color="transparent"></v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: 'Certificates',
  nuxtI18n: {
    paths: {
      en: '/certificates',
      es: '/certificados',
    },
  },
  layout: 'landing',
  components: {
    //
  },
  auth: false,
  middleware: ['token'],
  data: () => ({
    //
  }),
}
</script>
