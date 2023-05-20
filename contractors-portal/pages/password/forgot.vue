<template>
  <v-row justify="center" align-content="center" class="mx-2">
    <v-col cols="12" md="6" sm="8" class="mx-auto">
      <v-card v-if="success" elevation="6">
        <v-card-text>
          <empty-state icon="mdi-email-outline" rounded :description="message">
            <v-btn color="primary" :to="localePath('/login')">
              {{ `${$t('buttons.GoTo')} ${$t('buttons.Login')}` }}
            </v-btn>
          </empty-state>
        </v-card-text>
      </v-card>
      <v-slide-y-transition v-else appear>
        <validation-observer ref="forgot" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(onSubmit)">
            <v-card elevation="6">
              <v-card-text>
                <v-row class="mx-md-2">
                  <v-col cols="12" class="py-0 my-0">
                    <info-content
                      info-horizontal
                      icon="mdi-alert"
                      icon-color="warning"
                      :subtitle="$t('titles.Remember')"
                      class="mb-0"
                    >
                      <p
                        class="ml-md-9 body-1 font-weight-medium"
                        v-text="$t('texts.PasswordWarning')"
                      />
                    </info-content>
                  </v-col>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="form.validations.input_alpha_dots_required"
                      vid="username"
                      :name="$t('inputs.Username')"
                    >
                      <v-text-field
                        v-model.trim="form.username"
                        type="text"
                        name="username"
                        class="mt-8"
                        :label="$t('inputs.Username')"
                        :error-messages="errors"
                        clearable
                        counter
                        :disabled="loading"
                        :loading="loading"
                        :maxlength="30"
                        autocomplete="off"
                        required="required"
                        prepend-icon="mdi-account-circle-outline"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="form.validations.input_document_required"
                      vid="document"
                      :name="$t('inputs.Document')"
                    >
                      <v-text-field
                        v-model.trim="form.document"
                        name="password"
                        color="primary"
                        :label="$t('inputs.Document')"
                        prepend-icon="mdi-card-account-details-outline"
                        :error-messages="errors"
                        clearable
                        counter
                        :disabled="loading"
                        :loading="loading"
                        :maxlength="45"
                        autocomplete="off"
                        required="required"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="form.validations.input_email_required"
                      vid="email"
                      :name="$t('inputs.Email')"
                    >
                      <v-text-field
                        v-model.trim="form.email"
                        type="email"
                        name="email"
                        color="primary"
                        :label="$t('inputs.Email')"
                        prepend-icon="mdi-email-outline"
                        :error-messages="errors"
                        clearable
                        :hint="$t('helper.ContactForgotMail')"
                        persistent-hint
                        counter
                        :disabled="loading"
                        :loading="loading"
                        :maxlength="45"
                        autocomplete="off"
                        required="required"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="
                        form.validations.input_email_confirmation('email')
                      "
                      vid="email_confirmation"
                      :name="$t('inputs.EmailConfirmation')"
                    >
                      <v-text-field
                        v-model.trim="form.email_confirmation"
                        type="email"
                        name="email_confirmation"
                        color="primary"
                        :label="$t('inputs.EmailConfirmation')"
                        prepend-icon="mdi-email-outline"
                        :error-messages="errors"
                        clearable
                        counter
                        :disabled="loading"
                        :loading="loading"
                        :maxlength="45"
                        autocomplete="off"
                        required="required"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    class="justify-center align-center align-content-center text-center mx-auto"
                  >
                    <v-input name="captcha">
                      <recaptcha
                        :data-theme="$vuetify.theme.dark ? 'dark' : 'light'"
                        class="justify-center align-center align-content-center text-center mx-auto"
                        @error="onError"
                        @success="onSuccess"
                        @expired="onExpired"
                      />
                    </v-input>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  outlined
                  :to="localePath('/login')"
                >
                  {{ $t('buttons.Cancel') }}
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  type="submit"
                >
                  {{ $t('buttons.Submit') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </validation-observer>
      </v-slide-y-transition>
    </v-col>
  </v-row>
</template>

<router lang="yaml">
path: /password/forgot
meta:
  title: Password
</router>

<script>
import { ForgotPassword } from '@/models/services/auth/ForgotPassword'

export default {
  name: 'Forgot',
  components: {
    InfoContent: () => import('~/components/base/InfoContent'),
    EmptyState: () => import('@/components/base/EmptyState'),
  },
  layout: 'password',
  auth: 'guest',
  middleware: ['token'],
  data: () => ({
    loading: false,
    success: false,
    message: null,
    form: new ForgotPassword(),
  }),
  head: (vm) => ({
    title: vm.$t('titles.Password'),
  }),
  mounted() {
    this.form.setFormInstance(this.$refs.forgot)
  },
  methods: {
    onSubmit() {
      if (this.form.token) {
        this.loading = true
        this.form
          .store()
          .then((response) => {
            this.$snackbar({
              message: response.data,
              color: 'success',
            })
            this.success = true
            this.message = response.data
          })
          .catch((errors) => {
            this.$snackbar({
              show: true,
              message: errors.message,
            })
          })
          .finally(() => (this.loading = false))
      } else {
        this.$snackbar({ message: this.$t('inputs.Captcha') })
      }
    },
    onSuccess(token) {
      this.form.token = token
    },
    onExpired() {
      this.$recaptcha.reset()
      this.form.token = null
    },
    onError(error) {
      this.$snackbar({ message: error })
    },
  },
}
</script>

<style lang="css">
.g-recaptcha > div > div {
  margin: 10px auto !important;
  text-align: center;
  width: auto !important;
  height: auto !important;
}
#rc-imageselect {
  -webkit-transform: scale(0.84);
  -moz-transform: scale(0.84);
  -ms-transform: scale(0.84);
  -o-transform: scale(0.84);
  transform: scale(0.84);
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
}
</style>
