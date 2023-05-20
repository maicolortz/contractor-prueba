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
                  subtitle="Expedición de Certificados de Contratistas, Personas Naturales y Jurídicas"
                  class="mb-0"
                >
                  <v-card flat color="transparent" class="mt-0 px-5">
                    <v-card-title v-if="errors.message">
                      <v-alert
                        elevation="2"
                        border="top"
                        colored-border
                        type="info"
                      >
                        <span class="body-2">{{ errors.message }}</span>
                        <v-divider
                          v-if="errorsKeys.length > 0 || !!errors.details"
                          class="my-4"
                        />
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
                        <template #close>
                          <v-btn icon @click="errors = {}">
                            <v-icon dark>mdi-close</v-icon>
                          </v-btn>
                        </template>
                      </v-alert>
                    </v-card-title>
                    <v-card-text v-if="!email">
                      <validation-observer
                        ref="peace"
                        v-slot="{ handleSubmit }"
                      >
                        <v-form @submit.prevent="handleSubmit(onValidate)">
                          <v-row dense>
                            <!-- DocumentType -->
                            <v-col cols="12">
                              <validation-provider
                                v-slot="{ errors }"
                                :rules="form.validations.required"
                                vid="documenType"
                                name="Tipo de Documento"
                              >
                                <v-select
                                  id="documentType"
                                  v-model="form.Tipo_Documento"
                                  name="documentType"
                                  :loading="finding"
                                  :readonly="finding"
                                  :error-messages="errors"
                                  color="primary"
                                  label="Tipo de Documento"
                                  clearable
                                  :items="documentType"
                                  item-value="id"
                                  item-text="name"
                                  required="required"
                                  prepend-icon="mdi-file"
                                  @change="clearMonth"
                                />
                              </validation-provider>
                            </v-col>
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
                                  v-model.number="form.Documento"
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
                            <!-- Year -->
                            <v-col cols="12" md="12">
                              
                              <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      :rules="form.validations.input_number_required"
                                      vid="year"
                                      name="Año del Contrato"
                                    >
                                    <v-text-field
                                      v-model="form.Anio"
                                      label="Año del Contrato a Certificar"
                                      :loading="finding"
                                      :error-messages="errors"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      clearable
                                      autocomplete="off"
                                      required="required"
                                    ></v-text-field>
                                    </validation-provider>
                                  </template>
                                  <v-date-picker
                                  id="year"
                                  ref="inputYear"
                                  :active-picker.sync="activePicker"
                                  v-model="date"
                                  name="year"
                                  :loading="finding"
                                  :readonly="finding"
                                  :error-messages="errors"
                                  color="primary"
                                  label="Año del Contrato a Certificar"
                                  clearable
                                  min="1900-01-01"
                                  :max="$moment().format('yyyy-mm-dd')"
                                  autocomplete="off"
                                  required="required"
                                  prepend-icon="mdi-numeric"
                                  no-title
                                  scrollable
                                  @click:year="saveYear"
                                >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
                                <v-btn text color="primary" @click="saveYear(date)">OK</v-btn>                              
                                </v-date-picker>
                                </v-menu>
                            </v-col>

                            <!-- check -->
                            <v-col cols="12" md="12" sm="12">
                              <v-checkbox
                                v-model="form.ObligacionesCheck"
                                label="Desea descargar la certificación con las obligaciones específicas."
                                :true-value="1"
                                :false-value="null"
                              ></v-checkbox>
                            </v-col>
                            <!-- Create User -->
                            <v-col cols="12" class="justify-space-between">
                              <v-row dense>
                                <v-col cols="12" sm="12" md="6" class="text-left">
                                  <!-- solicitud -->
                                  <v-dialog
                                    v-model="dialogRequest"
                                    persistent
                                    max-width="800px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        color="warning"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        Hacer Solicitud
                                      </v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-title>
                                        <span class="text-h5">Drear Solicitud</span>
                                      </v-card-title>
                                      <v-card-subtitle>
                                        Datos Básicos para realizar la solicitud
                                      </v-card-subtitle>
                                      <v-card-text>
                                        <validation-observer
                                          ref="requestform"
                                          v-slot="{ handleSubmit }"
                                        >
                                          <v-form @submit.prevent="handleSubmit(onRequest)">
                                            <v-row dense>
                                              <!-- DocumentType -->
                                              <v-col cols="12" sm="12" md="6">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :rules="formRequest.validations.required"
                                                  vid="documenType_request"
                                                  name="Tipo de Documento"
                                                >
                                                  <v-select
                                                    id="documenType_request"
                                                    v-model="formRequest.Tipo_DocumentoS"
                                                    name="documenType_request"
                                                    :loading="finding"
                                                    :readonly="finding"
                                                    :error-messages="errors"
                                                    color="primary"
                                                    label="Tipo de Documento"
                                                    clearable
                                                    :items="documentType"
                                                    item-value="id"
                                                    item-text="name"
                                                    required="required"
                                                    prepend-icon="mdi-file"
                                                  />
                                                </validation-provider>
                                              </v-col>
                                              <!-- Document -->
                                              <v-col cols="12" md="6" sm="12">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :rules="
                                                    formRequest.validations.input_document_required
                                                  "
                                                  vid="document_request"
                                                  :name="$t('inputs.Document')"
                                                >
                                                  <v-text-field
                                                    id="document_request"
                                                    v-model.number="formRequest.DocumentoS"
                                                    name="document_request"
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
                                              <!-- name -->
                                              <v-col cols="12" md="6" sm="12">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :rules="
                                                    formRequest.validations.required
                                                  "
                                                  vid="name_request"
                                                  :name="$t('inputs.Document')"
                                                >
                                                  <v-text-field
                                                    id="name_request"
                                                    v-model.number="formRequest.Nombres"
                                                    name="name_request"
                                                    :loading="finding"
                                                    :readonly="finding"
                                                    :error-messages="errors"
                                                    color="primary"
                                                    label="Nombres"
                                                    clearable
                                                    counter
                                                    :maxlength="191"
                                                    autocomplete="off"
                                                    required="required"
                                                    prepend-icon="mdi-text"
                                                  />
                                                </validation-provider>
                                              </v-col>
                                              <!--email-->
                                              <v-col cols="12" md="6" sm="12">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :rules="formRequest.validations.input_email_required"
                                                  vid="email_request"
                                                  name="correo electrónico personal"
                                                >
                                                  <v-text-field
                                                    id="email_request"
                                                    v-model="formRequest.Correo"
                                                    name="email_request"
                                                    type="email"
                                                    :loading="finding"
                                                    :readonly="finding"
                                                    :error-messages="errors"
                                                    color="primary"
                                                    label="Correo electrónico personal"
                                                    clearable
                                                    counter
                                                    :maxlength="formRequest.validations.input_email_required.max"
                                                    autocomplete="off"
                                                    required="required"
                                                    prepend-icon="mdi-email-outline"
                                                  />
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols=12>
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :rules="
                                                    formRequest.validations.text_required
                                                  "
                                                  vid="desc_request"
                                                  :name="$t('inputs.Description')"
                                                >
                                                  <v-textarea
                                                    id="desc_request"
                                                    v-model.number="formRequest.Descripcion"
                                                    name="desc_request"
                                                    :loading="finding"
                                                    :readonly="finding"
                                                    :error-messages="errors"
                                                    color="primary"
                                                    label="Descripción"
                                                    clearable
                                                    counter
                                                    :maxlength="2500"
                                                    autocomplete="off"
                                                    required="required"
                                                    prepend-icon="mdi-text"
                                                  />
                                                </validation-provider>
                                              </v-col>
                                              <v-col>
                                                <v-btn
                                                  color="primary"
                                                  outlined
                                                  :loading="finding"
                                                  :disabled="finding"
                                                  @click="dialogRequest = false"
                                                >
                                                  Cancelar
                                                </v-btn>
                                                <v-btn
                                                  color="primary"
                                                  :loading="finding"
                                                  :disabled="finding"
                                                  type="submit"
                                                >
                                                  <v-icon left dark>mdi-send</v-icon>
                                                  Generar
                                                </v-btn>
                                              </v-col>
                                            </v-row>
                                          </v-form>
                                        </validation-observer>
                                      </v-card-text>
                                    </v-card>
                                  </v-dialog>
                                  <!-- fin solicitud -->
                                </v-col>
                                <v-col cols="12" sm="12" md="6" class="text-right">
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
                                    Generar Certificado
                                  </v-btn>
                                </v-col> 
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-form>
                      </validation-observer>
                    </v-card-text>
                  </v-card>
                </info-content>
              </v-col>
              <v-col v-if="datatable.length > 0" cols="12">
                <v-card flat class="m-auto">
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="datatable"
                      :items-per-page="5"
                      class="elevation-1"
                      >
                      <template v-slot:[`item.Id`]="{item}">
                        <v-btn icon color="primary" @click="onDownload(item.Id)">
                          <v-icon>mdi-cloud-download</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
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
import Base64ToBlob from '~/utils/Base64ToBlob'
import { Arrow } from '~/plugins/Arrow'
import { CertificadoContractual } from '~/models/services/portal/CertificadoContractual'

export default {
  name: 'CertificadoContractual',
  nuxtI18n: {
    paths: {
      en: '/tax-certificates',
      es: '/certificados-contractuales',
    },
  },
  components: {
    InfoContent: () => import('~/components/base/InfoContent'),
    VEmptyState: () => import('~/components/base/EmptyState'),
    // VVerificationInput: () => import('~/components/base/VVerificationInput'),
    // VTimer: () => import('~/components/base/Timer'),
  },
  layout: 'landing',
  middleware: ['token'],
  auth: false,
  data: () => ({
    dialogRequest: false,
    date: null,
    menu: false,
    activePicker: 'YEAR',
    min_age: 18,
    max_age: 120,
    birthdate_dialog: false,
    arrow: new Arrow(window, window.document, 'primary'),
    finding: false,
    form: new CertificadoContractual({Tipo_Documento: null, Documento: null, Anio: null, ObligacionesCheck: null}),
    formRequest: new CertificadoContractual({
      Nombres: null,
      Tipo_DocumentoS: null,
      DocumentoS: null,
      Correo: null,
      Descripcion: null,
    }),
    email: null,
    elements: 0,
    errors: {},
    success: false,
    code: null,
    disableResend: true,
    setTimeOut: null,
    certificates: [
      { id: 'CCO', name: 'CERTIFICACIÓN DE CONTRATO' },
      { id: 'COB', name: 'CERTIFICACIÓN DE CONTRATO CON OBLIGACIONES ESPECÍFICAS' },
    ],
    documentType: [
      { id: 1, name: 'CÉDULA DE CIUDADANÍA' },
      { id: 4, name: 'CÉDULA DE EXTRANJERÍA' },
      { id: 6, name: 'PASAPORTE' },
      { id: 14, name: 'PERMISO ESPECIAL DE PERMANENCIA' },
      { id: 15, name: 'PERMISO DE PROTECCIÓN TEMPORAL' },
      { id: 7, name: 'NIT' },
    ],
    headers: [
      {
        text: 'Cédula',
        align: 'start',
        sortable: false,
        value: 'Cedula',
      },
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'Nombre_Contratista',
      },
      {
        text: 'Contrato',
        align: 'start',
        sortable: false,
        value: 'Numero_Contrato',
      },
      {
        text: 'Fecha de firma',
        align: 'start',
        sortable: false,
        value: 'Fecha_Firma',
      },
      {
        text: 'Descargar',
        align: 'start',
        sortable: false,
        value: 'Id',
      },
    ],
    datatable: [],
  }),
  computed: {
    errorsKeys() {
      return this.errors.errors ? Object.keys(this.errors.errors) : []
    },
  },
  watch: {
    menu(val) {
      val &&
      setTimeout(() => (this.activePicker = 'YEAR'), 50)
    },
  },
  mounted() {
    this.$vuetify.goTo('#certificates', {
      duration: 800,
      offset: 0,
      easing: 'easeInOutCubic',
    })
  },
  beforeDestroy() {
    if (this.setTimeOut) {
      clearTimeout(this.setTimeOut)
    }
  },
  methods: {
    onRequest() {
      this.finding = true
      this.formRequest.resetOnlyWhenUpdate = false
      this.formRequest
        .solicitud()
        .then((response) => {
          if (response.status === 'success') {
            this.$snackbar({ message: response.Mensaje, color: 'success' })
          } else {
            this.$snackbar({ message: response.Mensaje })
          }
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false;
          this.dialogRequest = false;
        })

    },
    saveYear(year) {
        this.$refs.menu.save(year ? year + '-01-01' : year)

        // Reset activePicker to type YEAR
        this.activePicker = 'YEAR'

        // Close the menu/datepicker
        this.menu = false

        this.form.Anio = year
    },
    onDownload(id) {
      window.open('https://sim1.idrd.gov.co/SIM/CertificacionContratos/descargarContrato/'+id+'/'+this.form.ObligacionesCheck,'_blank');
    },
    onValidate() {
      this.finding = true
      this.form.resetOnlyWhenUpdate = false
      this.form
        .consulta()
        .then((response) => {
        if (response.Contrato === "Unico"){
          if (response.ObligacionesCheck === 1 && response.ConteoObligacion === 0){
            this.$snackbar({ message: "Este contrato aún no cuenta con las obligaciones específicas. Haga clic en Solicitar Certificación con Obligaciones Específicas"})
          } else {
           window.open('https://sim1.idrd.gov.co/SIM/CertificacionContratos/descargarContrato/'+response.Id+'/'+response.ObligacionesCheck,'_blank');
          }
          if (response.ObligacionesCheck === 1 && response.ConteoObligacion === 0){
            this.$snackbar({ message: "Este contrato aún no cuenta con las obligaciones específicas. Haga clic en Solicitar Certificación con Obligaciones Específicas"})
          } else {
           window.open('https://sim1.idrd.gov.co/SIM/CertificacionContratos/descargarContrato/'+response.Id+'/'+response.ObligacionesCheck,'_blank');
          }
        } else if (response.Contrato === "Varios") {
          this.datatable = response.DatosContrato;
        } else {
          this.$snackbar({ message: "No existen contratos con los datos proporcionados." })
        }
        })
        .catch((errors) => {
          this.errors = errors
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onCode(code) {
      this.finding = true
      this.form.code = code
      this.form
        .token()
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
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.finding = false
        })
    },
    onOk() {
      this.disableResend = false
    },
    onBack() {
      this.email = null
      this.form.reset()
    },
    setMonths(value) {
      switch (value) {
        case 1:
          this.form.mesini = 1
          this.form.mesfin = 12
          break
        case 2:
          this.form.mesini = 1
          this.form.mesfin = 2
          break
        case 3:
          this.form.mesini = 3
          this.form.mesfin = 4
          break
        case 4:
          this.form.mesini = 5
          this.form.mesfin = 6
          break
        case 5:
          this.form.mesini = 7
          this.form.mesfin = 8
          break
        case 6:
          this.form.mesini = 9
          this.form.mesfin = 10
          break
        case 7:
          this.form.mesini = 11
          this.form.mesfin = 12
          break
        default:
          this.form.mesini = null
          this.form.mesfin = null
          break
      }
    },
    clearMonth() {
      this.form.month = null
      this.form.mesini = null
      this.form.mesfin = null
    },
  },
}
</script>
