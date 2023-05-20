<template>
  <v-main id="certificates" class="main main-raised elevation-24">
    <v-row justify="center" align-content="center">
      <v-col cols="12" class="mx-auto">
        <v-card flat color="transparent">
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-0 my-0">
                <info-content
                  info-horizontal
                  icon="mdi-information-outline"
                  icon-color="success"
                  subtitle="Validación Documento"
                  class="mb-0"
                >
                  <v-card-text>
                    <validation-observer
                      ref="user_update"
                      v-slot="{ handleSubmit }"
                    >
                      <v-form @submit.prevent="handleSubmit(onSubmit)">
                        <validation-provider
                          v-slot="{ errors }"
                          :rules="form.validations.required"
                          vid="token"
                          name="token de verificación"
                        >
                          <v-text-field
                            v-model="token"
                            :error-messages="errors"
                            label="Token de verificación"
                          />
                        </validation-provider>
                        <v-btn
                          :disabled="finding || user.id"
                          :loading="finding"
                          color="primary"
                          type="submit"
                        >
                          Validar Token {{ token }}
                        </v-btn>
                      </v-form>
                    </validation-observer>
                  </v-card-text>
                  <v-card-text v-if="user.id">
                    <v-banner>
                      <v-icon slot="icon" color="success" size="36">
                        mdi-check-circle
                      </v-icon>
                      {{ user.message }}
                      <template #actions>
                        <v-btn color="primary" text @click="user = {}">
                          Ok
                        </v-btn>
                      </template>
                    </v-banner>
                  </v-card-text>
                  <v-card-text v-if="errors.message">
                    <v-banner>
                      <v-icon slot="icon" color="red" size="36">
                        mdi-alert-circle
                      </v-icon>
                      {{ errors.message }}
                      <template #actions>
                        <v-btn color="primary" text @click="errors = {}">
                          Ok
                        </v-btn>
                      </template>
                    </v-banner>
                  </v-card-text>
                </info-content>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import { Certification } from '~/models/services/portal/Certification'

export default {
  name: 'ValidateDocument',
  nuxtI18n: {
    paths: {
      en: '/validate-document',
      es: '/validar-documento',
    },
  },
  components: {
    InfoContent: () => import('~/components/base/InfoContent'),
  },
  layout: 'landing',
  data: () => ({
    finding: false,
    form: new Certification(),
    user: {},
    errors: {},
    token: null,
  }),
  mounted() {
    this.$vuetify.goTo('#certificates', {
      duration: 800,
      offset: 0,
      easing: 'easeInOutCubic',
    })
    if (this.$route.query.validate) {
      this.token = this.$route.query.validate
    }
  },
  methods: {
    onSubmit() {
      this.finding = true
      this.form
        .show(this.token)
        .then((response) => {
          this.user = response.data
        })
        .catch((errors) => {
          this.errors = errors.message
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
  },
}
</script>
