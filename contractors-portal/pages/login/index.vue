<template>
  <v-row justify="center" align-content="center">
    <v-slide-y-transition appear>
      <v-card
        class="d-inline-block mx-auto my-auto"
        elevation="6"
        :max-width="$vuetify.breakpoint.mdAndUp ? '710' : '300'"
      >
        <validation-observer v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(onSubmit)">
            <v-card-text>
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                  class="hidden-sm-and-down"
                  align-self="center"
                >
                  <div id="office-man" style="max-width: 400px" />
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <Sim></Sim>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|min:3|max:45"
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
                      :maxlength="45"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-account-circle-outline"
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|min:8|max:32"
                    vid="password"
                    :name="$t('inputs.Password')"
                  >
                    <v-text-field
                      v-model.trim="form.password"
                      name="password"
                      color="primary"
                      :label="$t('inputs.Password')"
                      prepend-icon="mdi-lock-outline"
                      :error-messages="errors"
                      clearable
                      counter
                      :maxlength="32"
                      autocomplete="off"
                      required="required"
                      :type="show ? 'text' : 'password'"
                      :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="show = !show"
                    />
                  </validation-provider>
                  <v-checkbox v-model="form.remember" type="checkbox" required>
                    <template #label>
                      {{ $t('inputs.RememberMe') }}
                      <v-spacer></v-spacer>
                      <!--
                      <nuxt-link
                        :to="localePath('/password/forgot')"
                        class="primary--text caption hidden-sm-and-down"
                      >
                        {{ $t('texts.ForgotPassword') }}
                      </nuxt-link>
                      <v-tooltip top>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            icon
                            color="primary"
                            class="hidden-md-and-up"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-help-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('texts.ForgotPassword') }}</span>
                      </v-tooltip>
                      -->
                    </template>
                  </v-checkbox>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loading"
                      :disabled="loading"
                      type="submit"
                      color="primary"
                    >
                      {{ $t('buttons.Login') }}
                    </v-btn>
                  </v-card-actions>
                  <v-card-actions class="hidden-sm-and-down">
                    <Town></Town>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-col>
              </div>
            </v-card-text>
          </v-form>
        </validation-observer>
      </v-card>
    </v-slide-y-transition>
    <v-dialog v-model="dialog" max-width="500">
      <v-card flat>
        <v-card-title>
          <v-icon class="text-center" color="amber" large>mdi-alert</v-icon>
        </v-card-title>
        <v-card-text>
          <p>Acceso para funcionarios con permisos al Portal Contratista</p>
        </v-card-text>
        <v-card-actions class="text-right">
          <v-spacer />
          <v-btn outlined color="primary" @click="dialog = !dialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<router lang="yaml">
path: /login
meta:
  title: Login
</router>

<script>
import lottie from 'lottie-web/build/player/lottie'
import * as office from '~/static/lottie/office.json'
import Sim from '~/components/icons/Sim'
import Town from '~/components/icons/Town'
export default {
  name: 'Login',
  components: {
    Sim,
    Town,
  },
  layout: 'page',
  auth: 'guest',
  middleware: ['token'],
  data: () => ({
    dialog: false,
    show: false,
    loading: false,
    form: {
      username: null,
      password: null,
      remember: false,
    },
  }),
  head: (vm) => ({
    title: vm.$t('titles.Login'),
  }),
  computed: {
    styles: (vm) => (vm.$vuetify.breakpoint.mdAndUp ? 'min-width: 400px;' : ''),
  },
  mounted() {
    lottie.loadAnimation({
      container: document.getElementById('office-man'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: office.default,
    })
    const that = this
    setTimeout(function () {
      that.dialog = true
    }, 500)
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.$auth
        .loginWith('local', { data: this.form })
        .then(() => {
          this.$router.push(this.localePath({ name: 'index' }))
        })
        .catch((errors) => {
          this.loading = false
          const error = errors.response ? errors.response.data.message : errors
          this.$snackbar({ message: error })
        })
    },
  },
}
</script>
