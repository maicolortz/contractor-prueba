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
                  subtitle="Paz y Salvo del Área de Sistemas"
                  class="mb-0"
                >
                  <v-material-tabs
                    v-model="tab"
                    background-color="transparent"
                    centered
                    color="primary"
                  >
                    <v-tab v-for="(tab, i) in tabs3" :key="i">
                      {{ tab.text }}
                    </v-tab>
                    <v-tabs-items v-model="tab" class="pt-12 transparent">
                      <v-tab-item>
                        <v-card flat color="transparent" class="mt-0 px-5">
                          <v-card-text v-show="!success">
                            <template v-if="folders.length === 0">
                              <v-alert
                                dismissible
                                color="warning"
                                border="left"
                                elevation="2"
                                colored-border
                                icon="mdi-alert"
                              >
                                {{ errors.message }}
                                <v-divider v-if="!!errors.details" />
                                <small class="caption">
                                  {{ errors.details }}
                                </small>
                                <v-divider v-if="errorsKeys.length > 0" />
                                <ul v-for="(k, i) in errorsKeys" :key="i">
                                  <li
                                    v-for="(val, j) in errors.errors[k]"
                                    :key="`i-${j}`"
                                  >
                                    {{ val }}
                                  </li>
                                </ul>
                                <template #close>
                                  <v-btn icon x-small>
                                    <v-icon x>mdi-close</v-icon>
                                  </v-btn>
                                </template>
                              </v-alert>
                              <v-banner
                                v-if="errors.message"
                                color="error"
                                class="white--text"
                              >
                                <v-avatar slot="icon" color="white" size="40">
                                  <v-icon color="error">mdi-alert</v-icon>
                                </v-avatar>
                                {{ errors.message }}
                                <v-divider class="my-4" />
                                <template
                                  v-if="typeof errors.details === 'string'"
                                >
                                  {{ errors.details }}
                                  <v-divider class="my-4" />
                                </template>
                                <!--
                                <template
                                  v-if="typeof errors.details === 'object'"
                                >
                                  <p>
                                    Carpetas y cantidad de radicados por procesar
                                  </p>
                                  <ul
                                    v-for="(f, i) in errors.details.folders"
                                    :key="i"
                                  >
                                    <li>{{ `${f.folder}: ${f.filed_count}` }}</li>
                                  </ul>
                                </template>
                                -->
                                <ul v-for="(k, i) in errorsKeys" :key="i">
                                  <li
                                    v-for="(val, j) in errors.errors[k]"
                                    :key="`i-${j}`"
                                  >
                                    {{ val }}
                                  </li>
                                </ul>
                                <template #actions>
                                  <v-btn icon @click="errors = {}">
                                    <v-icon dark>mdi-close</v-icon>
                                  </v-btn>
                                </template>
                              </v-banner>
                              <validation-observer
                                ref="peace"
                                v-slot="{ handleSubmit }"
                              >
                                <v-form
                                  @submit.prevent="handleSubmit(onSubmit)"
                                >
                                  <v-row dense>
                                    <!-- Document -->
                                    <v-col cols="12">
                                      <validation-provider
                                        v-slot="{ errors }"
                                        :rules="
                                          form.validations
                                            .input_document_required
                                        "
                                        vid="document"
                                        :name="$t('inputs.Document')"
                                      >
                                        <v-text-field
                                          id="document"
                                          v-model.number="form.document"
                                          name="document"
                                          :loading="finding"
                                          :readonly="finding"
                                          :error-messages="errors"
                                          color="primary"
                                          label="Número de Documento"
                                          clearable
                                          counter
                                          :maxlength="12"
                                          autocomplete="off"
                                          required="required"
                                          prepend-icon="mdi-numeric"
                                        />
                                      </validation-provider>
                                    </v-col>
                                    <!-- Contract -->
                                    <v-col cols="12" md="6">
                                      <validation-provider
                                        v-slot="{ errors }"
                                        :rules="
                                          form.validations.input_number_required
                                        "
                                        vid="contract"
                                        name="número de contrato"
                                      >
                                        <v-text-field
                                          id="contract"
                                          v-model="form.contract"
                                          name="contract"
                                          :loading="finding"
                                          :readonly="finding"
                                          :error-messages="errors"
                                          persistent-hint
                                          hint="Ejemplo: 0933"
                                          color="primary"
                                          label="Número de contrato"
                                          clearable
                                          counter
                                          :maxlength="4"
                                          autocomplete="off"
                                          required="required"
                                          prepend-icon="mdi-file"
                                        />
                                      </validation-provider>
                                    </v-col>
                                    <!-- Year -->
                                    <v-col cols="12" md="6">
                                      <validation-provider
                                        v-slot="{ errors }"
                                        :rules="
                                          form.validations.input_text_required
                                        "
                                        vid="contract"
                                        name="año de contrato"
                                      >
                                        <v-autocomplete
                                          id="contract"
                                          v-model="form.year"
                                          name="contract"
                                          :loading="finding"
                                          :readonly="finding"
                                          :error-messages="errors"
                                          persistent-hint
                                          :items="years"
                                          :hint="`Ejemplo: ${$moment().year()}`"
                                          color="primary"
                                          label="Año de contrato"
                                          clearable
                                          counter
                                          :maxlength="4"
                                          autocomplete="off"
                                          required="required"
                                          prepend-icon="mdi-file"
                                        />
                                      </validation-provider>
                                    </v-col>
                                    <!-- Virtual File -->
                                    <v-col cols="12">
                                      <validation-provider
                                        v-slot="{ errors }"
                                        :rules="form.validations.input_text"
                                        vid="virtual_file"
                                        name="expediente virtual"
                                      >
                                        <v-text-field
                                          id="virtual_file"
                                          v-model="form.virtual_file"
                                          name="virtual_file"
                                          :loading="finding"
                                          :readonly="finding"
                                          :error-messages="errors"
                                          persistent-hint
                                          hint="Ejemplo: 123456789075E"
                                          color="primary"
                                          label="Expediente Virtual (Opcional)"
                                          clearable
                                          counter
                                          :maxlength="
                                            form.validations.input_text.max
                                          "
                                          autocomplete="off"
                                          prepend-icon="mdi-numeric"
                                        />
                                      </validation-provider>
                                    </v-col>
                                    <!-- Create User -->
                                    <v-col cols="12" class="text-right">
                                      <v-btn
                                        outlined
                                        color="primary"
                                        :loading="finding"
                                        :disabled="finding"
                                        :to="
                                          localePath({ name: 'certificates' })
                                        "
                                      >
                                        <v-icon left dark>
                                          mdi-arrow-left
                                        </v-icon>
                                        Regresar
                                      </v-btn>
                                      <v-btn
                                        color="primary"
                                        :loading="finding"
                                        :disabled="finding"
                                        type="submit"
                                      >
                                        <v-icon left dark>mdi-send</v-icon>
                                        Generar Paz y Salvo
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-form>
                              </validation-observer>
                            </template>
                            <template v-else>
                              <v-row align="center">
                                <v-col cols="12">
                                  <h2 class="text-h2 text-center">
                                    Actualmente cuenta con
                                  </h2>
                                  <h2 class="display-serif-4 text-center">
                                    {{ errors.details.total }}
                                  </h2>
                                  <h3 class="text-center">
                                    radicado(s) sin procesar
                                  </h3>
                                </v-col>
                                <v-col cols="12">
                                  <v-card
                                    class="mx-auto"
                                    max-width="300"
                                    flat
                                    color="transparent"
                                  >
                                    <v-list subheader>
                                      <v-subheader>
                                        Por favor revise las siguientes carpetas
                                      </v-subheader>
                                      <v-list-item
                                        v-for="(folder, i) in folders"
                                        :key="i"
                                      >
                                        <v-list-item-avatar>
                                          <v-icon class="grey lighten-1" dark>
                                            mdi-folder
                                          </v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                          <v-list-item-title
                                            v-text="folder.folder"
                                          />
                                        </v-list-item-content>
                                        <v-list-item-action>
                                          <v-btn fab x-small color="red">
                                            <span class="display-serif-1">
                                              {{ folder.filed_count }}
                                            </span>
                                          </v-btn>
                                        </v-list-item-action>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                  <v-btn
                                    outlined
                                    color="primary"
                                    :loading="finding"
                                    :disabled="finding"
                                    @click="folders = []"
                                  >
                                    Regresar
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </template>
                          </v-card-text>
                          <v-card-text v-show="success">
                            <v-empty-state
                              icon="mdi-file"
                              label="Certificado Generado"
                              description="Se ha generado el certificado satisfactoriamente. Por favor revise su carpeta de descargas."
                            >
                              <v-btn
                                color="primary"
                                :loading="finding"
                                :disabled="finding"
                                :to="localePath({ name: 'certificates' })"
                              >
                                <v-icon left dark>mdi-arrow-left</v-icon>
                                Regresar
                              </v-btn>
                            </v-empty-state>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat color="transparent" class="mt-0">
                          <v-card-text v-show="!successCons">
                            <p class="body-2 font-weight-light">
                              Puede realizar la consulta por número de documento
                              y número de contrato o directamente por el código
                              de verificación.
                            </p>
                            <v-banner
                              v-if="errorsConsult.message"
                              color="error"
                              class="white--text"
                            >
                              <v-avatar slot="icon" color="white" size="40">
                                <v-icon color="error">mdi-alert</v-icon>
                              </v-avatar>
                              {{ errorsConsult.message }}
                              <v-divider class="my-4" />
                              <template v-if="errorsConsult.details">
                                {{ errorsConsult.details }}
                                <v-divider class="my-4" />
                              </template>
                              <ul v-for="(k, i) in errorsKeysConsult" :key="i">
                                <li
                                  v-for="(val, j) in errorsConsult.errors[k]"
                                  :key="`i-${j}`"
                                >
                                  {{ val }}
                                </li>
                              </ul>
                              <template #actions>
                                <v-btn icon @click="errorsConsult = {}">
                                  <v-icon dark>mdi-close</v-icon>
                                </v-btn>
                              </template>
                            </v-banner>
                            <validation-observer
                              ref="consult"
                              v-slot="{ handleSubmit }"
                            >
                              <v-form @submit.prevent="handleSubmit(onConsult)">
                                <v-row dense>
                                  <!-- Document -->
                                  <v-col cols="12">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      :rules="{
                                        required: !consult.token,
                                        numeric: true,
                                      }"
                                      vid="document"
                                      :name="$t('inputs.Document')"
                                    >
                                      <v-text-field
                                        id="document"
                                        v-model.number="consult.document"
                                        name="document"
                                        :loading="finding"
                                        :readonly="finding"
                                        :error-messages="errors"
                                        color="primary"
                                        label="Número de Documento"
                                        clearable
                                        counter
                                        :maxlength="12"
                                        autocomplete="off"
                                        required="required"
                                        prepend-icon="mdi-numeric"
                                      />
                                    </validation-provider>
                                  </v-col>
                                  <!-- Contract -->
                                  <v-col cols="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      :rules="{
                                        required: !consult.token,
                                        numeric: true,
                                      }"
                                      vid="contract"
                                      name="número de contrato"
                                    >
                                      <v-text-field
                                        id="contract"
                                        v-model="consult.contract"
                                        name="contract"
                                        :loading="finding"
                                        :readonly="finding"
                                        :required="!consult.token"
                                        :error-messages="errors"
                                        persistent-hint
                                        hint="Ejemplo: 0933"
                                        color="primary"
                                        label="Número de contrato"
                                        clearable
                                        counter
                                        :maxlength="4"
                                        autocomplete="off"
                                        prepend-icon="mdi-file"
                                      />
                                    </validation-provider>
                                  </v-col>
                                  <!-- Year -->
                                  <v-col cols="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      :rules="{
                                        required: !consult.token,
                                        numeric: true,
                                      }"
                                      vid="contract"
                                      name="año de contrato"
                                    >
                                      <v-autocomplete
                                        id="contract"
                                        v-model="consult.year"
                                        name="contract"
                                        :loading="finding"
                                        :readonly="finding"
                                        :error-messages="errors"
                                        persistent-hint
                                        :items="years"
                                        :hint="`Ejemplo: ${$moment().year()}`"
                                        color="primary"
                                        label="Año de contrato"
                                        clearable
                                        counter
                                        :maxlength="4"
                                        autocomplete="off"
                                        :required="!consult.token"
                                        prepend-icon="mdi-file"
                                      />
                                    </validation-provider>
                                  </v-col>
                                  <!-- Token -->
                                  <v-col cols="12">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      :rules="{
                                        required:
                                          !consult.contract && !consult.year,
                                        max: 15,
                                      }"
                                      vid="token"
                                      name="código de verificación"
                                    >
                                      <v-text-field
                                        id="token"
                                        v-model="consult.token"
                                        name="token"
                                        :loading="finding"
                                        :readonly="finding"
                                        :error-messages="errors"
                                        persistent-hint
                                        color="primary"
                                        label="Código de verificación"
                                        clearable
                                        counter
                                        :maxlength="15"
                                        :required="
                                          !consult.contract && !consult.year
                                        "
                                        autocomplete="off"
                                        prepend-icon="mdi-numeric"
                                      />
                                    </validation-provider>
                                  </v-col>
                                  <!-- Create User -->
                                  <v-col cols="12" class="text-right">
                                    <v-btn
                                      outlined
                                      color="primary"
                                      :loading="finding"
                                      :disabled="finding"
                                      :to="localePath({ name: 'certificates' })"
                                    >
                                      <v-icon left dark>mdi-arrow-left</v-icon>
                                      Regresar
                                    </v-btn>
                                    <v-btn
                                      color="primary"
                                      :loading="finding"
                                      :disabled="finding"
                                      type="submit"
                                    >
                                      <v-icon left dark>mdi-send</v-icon>
                                      Consultar Paz y Salvo
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-form>
                            </validation-observer>
                          </v-card-text>
                          <v-card-text v-show="successCons">
                            <v-empty-state
                              icon="mdi-file"
                              label="Certificado Generado"
                              description="Se ha generado el certificado satisfactoriamente. Por favor revise su carpeta de descargas."
                            >
                              <v-btn
                                color="primary"
                                :loading="finding"
                                :disabled="finding"
                                :to="localePath({ name: 'certificates' })"
                              >
                                <v-icon left dark>mdi-arrow-left</v-icon>
                                Regresar
                              </v-btn>
                            </v-empty-state>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-material-tabs>
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
import FileSaver from 'file-saver'
import { has } from 'lodash'
import { Arrow } from '~/plugins/Arrow'
import { Certification } from '~/models/services/portal/Certification'
import Base64ToBlob from '~/utils/Base64ToBlob'

export default {
  name: 'PeaceAndSave',
  nuxtI18n: {
    paths: {
      en: '/peace-and-save',
      es: '/paz-y-salvos',
    },
  },
  components: {
    InfoContent: () => import('~/components/base/InfoContent'),
    VMaterialTabs: () => import('~/components/base/MaterialTabs'),
    VEmptyState: () => import('~/components/base/EmptyState'),
  },
  layout: 'landing',
  middleware: ['token'],
  auth: false,
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    finding: false,
    success: false,
    successCons: false,
    form: new Certification(),
    consult: new Certification(),
    errors: {},
    errorsConsult: {},
    tab: 0,
    tabs3: [
      {
        text: 'Crear Paz y Salvo',
      },
      {
        text: 'Consultar Paz y Salvo',
      },
    ],
    folders: [],
  }),
  computed: {
    errorsKeys() {
      return this.errors.errors ? Object.keys(this.errors.errors) : []
    },
    errorsKeysConsult() {
      return this.errorsConsult.errors
        ? Object.keys(this.errorsConsult.errors)
        : []
    },
    years() {
      const years = []
      for (let i = this.$moment().add(1, 'year').year(); i >= 2019; i--) {
        years.push(i)
      }
      return years
    },
  },
  mounted() {
    this.$vuetify.goTo('#certificates', {
      duration: 800,
      offset: 0,
      easing: 'easeInOutCubic',
    })
  },
  methods: {
    onSubmit() {
      this.finding = true
      this.form.setFormInstance(this.$refs.peace)
      this.form
        .store()
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.file_name
          )
        })
        .then(() => {
          this.success = true
          this.arrow.show(6000)
        })
        .catch((errors) => {
          this.errors = errors
          if (has(this.errors, 'details.folders')) {
            this.folders = this.errors.details.folders
          }
          this.$snackbar({ message: this.errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onConsult() {
      this.finding = true
      this.consult.setFormInstance(this.$refs.consult)
      this.consult
        .validate()
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.file_name
          )
        })
        .then(() => {
          this.successCons = true
          this.arrow.show(6000)
        })
        .catch((errors) => {
          this.errorsConsult = errors
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
  },
}
</script>
