<template>
  <v-main id="certificates" class="main main-raised elevation-24">
    <v-row justify="center" align-content="center" class="mx-2">
      <v-col v-show="!success" cols="12" class="mx-auto">
        <v-card flat color="transparent">
          <v-card-text>
            <v-row class="mx-md-2">
              <v-col cols="12" class="py-0 my-0">
                <info-content
                  info-horizontal
                  icon="mdi-information-outline"
                  icon-color="success"
                  subtitle="Paz y Salvo del Área de Almacén"
                  class="mb-0"
                >
                  <v-card flat color="transparent" class="mt-0 px-5">
                    <v-card-text v-if="elements === 0">
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
                        <template v-if="errors.details">
                          {{ errors.details }}
                          <v-divider class="my-4" />
                        </template>
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
                        <v-form @submit.prevent="handleSubmit(onSubmit)">
                          <v-row dense>
                            <!-- Document -->
                            <v-col cols="12">
                              <validation-provider
                                v-slot="{ errors }"
                                :rules="
                                  form.validations.input_document_required
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
                                :rules="form.validations.input_number_required"
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
                                :rules="form.validations.input_text_required"
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
                                  :maxlength="form.validations.input_text.max"
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
                                Generar Paz y Salvo
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </validation-observer>
                    </v-card-text>
                  </v-card>
                </info-content>
              </v-col>
              <v-col v-if="elements > 0" cols="12">
                <v-card v-show="!email" flat class="mx-auto">
                  <v-card-text>
                    <v-row align="center">
                      <v-col cols="12">
                        <h2 class="text-h2 text-center">
                          Actualmente cuenta con
                        </h2>
                        <h2 class="display-serif-4 text-center">
                          {{ elements }}
                        </h2>
                        <h3 class="text-center">activos a cargo</h3>
                      </v-col>
                      <v-col cols="12">
                        <p class="text-center">
                          Si desea ver a detalle información de los activos o
                          descargar el formato traslados de clic en el botón
                          "Consultar Reporte"
                        </p>
                      </v-col>
                      <v-col cols="12" class="text-center">
                        <v-btn
                          outlined
                          color="primary"
                          :loading="finding"
                          :disabled="finding"
                          @click="elements = 0"
                        >
                          Regresar
                        </v-btn>
                        <v-btn
                          color="primary"
                          :loading="finding"
                          :disabled="finding"
                          @click="onNotify"
                        >
                          Consultar Reporte
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card v-show="!!email" flat class="m-auto">
                  <v-card-text>
                    <v-empty-state
                      v-if="resource.length === 0"
                      icon="mdi-email"
                      label="Código de Verificación"
                      :description="`Hemos enviado un código de verificación al correo ${email}`"
                    >
                      <v-card flat color="transparent">
                        <v-card-text>
                          <v-verification-input
                            title="Digite el código recibido"
                            :loading="finding"
                            :disabled="finding"
                            required
                            @complete="onValidate"
                          />
                        </v-card-text>
                        <v-card-text>
                          <small>
                            Verifique en la carpeta de Entrada, Spam o No
                            Deseados de su correo electrónico, de lo contrario
                            intente reenviar un código nuevamente. Si no recibe
                            ninguna notificación o no conoce el correo
                            electrónico asociado a su número de documento por
                            favor envíe un correo a
                            <a
                              href="mailto:soporte@idrd.gov.co?subject='Portal Contratista: Solicitud de Código de Verificación - Paz y Salvo'"
                            >
                              soporte@idrd.gov.co
                            </a>
                          </small>
                          <v-timer ref="timer" :secs="60" @onFinish="onOk" />
                          <v-btn
                            class="my-1"
                            color="primary"
                            :loading="finding"
                            :disabled="finding || disableResend"
                            @click="onNotify"
                          >
                            Reenviar Código
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-empty-state>
                    <v-skeleton-loader
                      v-else
                      ref="skeleton"
                      :loading="finding"
                      transition="scale-transition"
                      type="table"
                      class="mx-auto"
                    >
                      <v-data-table
                        :options.sync="pagination"
                        :items-per-page.sync="itemsPerPage"
                        :server-items-length="total"
                        :headers="headers"
                        :items="resource"
                        item-key="id"
                        :footer-props="{
                          'items-per-page-options': itemsPerPageArray,
                        }"
                      >
                        <template #top>
                          <v-toolbar flat color="transparent">
                            <v-spacer></v-spacer>
                            <v-btn
                              class="my-2 hidden-sm-and-down"
                              color="primary"
                              @click="onExcel"
                            >
                              <v-icon color="white" left dark>
                                mdi-cloud-download
                              </v-icon>
                              Formato de traslados
                            </v-btn>
                            <v-btn
                              icon
                              class="my-2 hidden-md-and-up"
                              color="primary"
                              @click="onExcel"
                            >
                              <v-icon color="white" left dark>
                                mdi-cloud-download
                              </v-icon>
                            </v-btn>
                          </v-toolbar>
                        </template>
                      </v-data-table>
                    </v-skeleton-loader>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-show="success" cols="12" class="mx-auto">
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
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import FileSaver from 'file-saver'
import { has } from 'lodash'
import { Arrow } from '~/plugins/Arrow'
import { Warehouse } from '~/models/services/portal/Warehouse'
import Base64ToBlob from '~/utils/Base64ToBlob'

export default {
  name: 'WarehousePeaceAndSave',
  nuxtI18n: {
    paths: {
      en: '/warehouse-peace-and-save',
      es: '/paz-y-salvo-almacen',
    },
  },
  components: {
    InfoContent: () => import('~/components/base/InfoContent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
    VVerificationInput: () => import('~/components/base/VVerificationInput'),
    VTimer: () => import('~/components/base/Timer'),
  },
  layout: 'landing',
  middleware: ['token'],
  auth: false,
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    finding: false,
    form: new Warehouse(),
    email: null,
    elements: 0,
    errors: {},
    resource: [],
    success: false,
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10],
    headers: [],
    code: null,
    disableResend: true,
  }),
  computed: {
    errorsKeys() {
      return this.errors.errors ? Object.keys(this.errors.errors) : []
    },
    years() {
      const years = []
      for (let i = this.$moment().add(1, 'year').year(); i >= 2019; i--) {
        years.push(i)
      }
      return years
    },
  },
  watch: {
    'pagination.page'() {
      return this.onMoreData()
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
    onOk() {
      this.disableResend = false
    },
    onSubmit() {
      this.finding = true
      this.form.setFormInstance(this.$refs.warehouse)
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
          const data = errors
          if (has(data, 'message.data')) {
            this.elements = data.message.data
          } else {
            this.errors = data
            this.$snackbar({ message: this.errors.message })
          }
        })
        .finally(() => {
          this.finding = false
        })
    },
    onNotify() {
      this.finding = true
      this.disableResend = true
      this.form.resetOnlyWhenUpdate = false
      this.form
        .notification()
        .then((response) => {
          this.email = response.data
        })
        .then(() => {
          this.$refs.timer.start()
        })
        .catch((errors) => {
          this.errors = errors
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onValidate(code) {
      this.code = code
      this.finding = true
      this.form.resetOnlyWhenUpdate = false
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      }
      this.form
        .validation(code, { params })
        .then((response) => {
          this.resource = response.data.data.map((d, i) => {
            return {
              ...d,
              consecutive:
                (this.pagination.page - 1) * this.itemsPerPage + (i + 1),
            }
          })
          this.total = response.data.meta.total
          this.headers = response.data.details.headers
        })
        .catch((errors) => {
          this.errors = errors
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onMoreData() {
      this.finding = true
      this.form.resetOnlyWhenUpdate = false
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      }
      this.form
        .more({ params })
        .then((response) => {
          this.resource = response.data.data.map((d, i) => {
            return {
              ...d,
              consecutive:
                (this.pagination.page - 1) * this.itemsPerPage + (i + 1),
            }
          })
          this.total = response.data.meta.total
          this.headers = response.data.details.headers
        })
        .catch((errors) => {
          this.errors = errors
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onExcel() {
      this.finding = true
      this.form.resetOnlyWhenUpdate = false
      this.form
        .excel({
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          FileSaver.saveAs(new Blob([response]), 'INVENTARIO_ALMACEN.xlsx')
          this.arrow.show(6000)
        })
        .catch((errors) => {
          this.errors = JSON.parse(Buffer.from(errors).toString('utf8'))
          this.$snackbar({ message: this.errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
  },
}
</script>
