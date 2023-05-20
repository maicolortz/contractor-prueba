<template>
  <v-app>
    <app-bar :dark="true" />
    <v-landing-parallax>
      <v-jumbotron :src="bg" opacity="0.3">
        <v-container class="fill-height justify-center" tag="section">
          <v-row align="center" class="text-center" justify="center">
            <v-col cols="12" md="12" class="mb-10">
              <v-landing-heading>Portal Contratista</v-landing-heading>
              <v-landing-subheading>
                Certificados y Paz y Salvos del IDRD
              </v-landing-subheading>
              <!--<v-btn
                outlined
                icon
                class="mt-4"
                @click="$vuetify.goTo(target, options)"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>-->
            </v-col>
            <v-col cols="12" md="12">
              <v-row justify="space-around" align="end">
                <div :key="avatar.title" v-for="avatar in avatars" class="my-6">
                  <v-btn
                    fab
                    icon
                    :to="avatar.to ? localePath(avatar.to) : undefined"
                    :href="avatar.href"
                    :target="avatar.href ? '_blank' : undefined"
                    class="mx-auto">
                    <v-avatar size="80">
                      <v-img
                        :src="avatar.src"
                        alt="certificates"
                      ></v-img>
                    </v-avatar>
                  </v-btn>
                  <v-card-text
                    v-text="avatar.title"
                    class="mt-2">
                  </v-card-text>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-jumbotron>
    </v-landing-parallax>
    <nuxt />
    <core-footer />
    <snack />
    <update-notification />
  </v-app>
</template>

<script>
export default {
  name: 'Landing',
  auth: false,
  components: {
    AppBar: () => import('~/components/base/LandingAppBar'),
    VLandingParallax: () => import('~/components/base/Parallax'),
    VJumbotron: () => import('~/components/base/Jumbotron'),
    VLandingHeading: () => import('~/components/base/Heading'),
    VLandingSubheading: () => import('~/components/base/Subheading'),
    CoreFooter: () => import('~/components/base/LandingFooter'),
    Snack: () => import('~/components/base/SnackBar'),
    UpdateNotification: () => import('@/components/base/UpdateAvailable'),
  },
  data: () => ({
    bg: require('@/static/bg.jpg'),
    duration: 300,
    offset: 0,
    easing: 'easeInOutCubic',
    target: '#certificates',
    avatars: [
      {
        title: 'Certificados Contractuales',
        src: 'certificate-1-mod.png',
        to: { name: 'certificadoscontractuales' },
      },
      {
        title: 'Certificados Tributarios',
        src: 'certificate-2-mod.png',
        to: { name: 'certificadostributarios' },
      },
      {
        title: 'Paz y Salvo Sistemas',
        src: 'certificate-3-mod.png',
        to: { name: 'peaceandsave' },
      },
      {
        title: 'Paz y Salvo Almacén',
        src: 'certificate-4-mod.png',
        to: { name: 'warehousepeaceandsave' },
      },
      {
        title: 'Verificar Certificado',
        src: 'certificate-5-mod.png',
        to: { name: 'validate-document' },
      },
    ],
  }),
  computed: {
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.theme--light
  .main
    background: #FFFFFF
    position: relative
.theme--dark
  .main
    background: #1E1E1E
    position: relative
</style>
