<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col class="mt-8" cols="12" sm="12" md="4">
        <base-material-card
          class="v-card-profile"
          :ident-icon="profile.username || 'SIM'"
        >
          <v-card-text class="text-center">
            <h4 class="display-serif-2 font-weight-bold">{{ shortName }}</h4>

            <h6 class="subtitle-1 mb-1 grey--text mb-3">
              {{ profile.description }}
            </h6>

            <p class="font-weight-light grey--text">
              {{ `${profile.dependency} - ${profile.company}` }}
            </p>

            <p class="font-weight-light grey--text">
              {{ profile.document }}
            </p>

            <v-btn
              text
              color="primary"
              small
              block
              :href="`mailto:${profile.email}`"
            >
              <v-icon left small>mdi-email</v-icon>
              {{ profile.email }}
            </v-btn>
            <p class="body-1">
              <v-icon left small>mdi-phone</v-icon>
              {{
                `${profile.phone} ${profile.ext ? 'ext. ' + profile.ext : ''}`
              }}
            </p>
            <p class="body-1">
              <v-icon left small>mdi-calendar</v-icon>
              {{ expiresAt }}
            </p>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MaterialCard from '~/components/base/MaterialCard'
export default {
  name: 'Profile',
  auth: 'auth',
  components: {
    BaseMaterialCard: MaterialCard,
  },
  head: (vm) => ({
    title: vm.$t('titles.Profile'),
  }),
  computed: {
    shortName() {
      return `${(this.$store.state.auth.user.name || '').split(' ').shift()} ${(
        this.$store.state.auth.user.surname || ''
      )
        .split(' ')
        .shift()}`
    },
    profile() {
      return this.$store.state.auth.user
    },
    expiresAt() {
      return this.$moment(this.profile.expires_at).isValid()
        ? this.$moment(this.profile.expires_at).toNow()
        : ''
    },
  },
}
</script>
