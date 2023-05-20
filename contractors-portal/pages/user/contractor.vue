<template>
  <base-material-card
    class="mt-12"
    icon="mdi-account"
    title="Crear Contratista"
  >
    <v-card-text class="mb-0">
      <v-window v-model="step" touchless>
        <v-window-item :value="0">
          <p>
            Digite el número de documento y presione el ícono de lupa
            <v-icon>mdi-magnify</v-icon>
            para buscar coincidencias en SECOP.
          </p>
          <validation-observer ref="secop_form" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(onSECOPFind)">
              <v-row>
                <!-- Document -->
                <v-col cols="12" md="12" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_document_required"
                    vid="document"
                    name="número de documento"
                  >
                    <v-text-field
                      id="document"
                      v-model.number="user.document"
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
                <!-- Create User -->
                <v-col cols="12" class="text-right">
                  <v-btn
                    color="primary"
                    :loading="finding"
                    :disabled="finding"
                    outlined
                    :to="
                      localePath({
                        name: 'contractors',
                      })
                    "
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    v-if="form_manual"
                    color="primary"
                    :loading="finding"
                    :disabled="finding"
                    outlined
                    @click="onManual"
                  >
                    <v-icon left dark>mdi-account-plus</v-icon> Crear Contratista
                  </v-btn>
                  <v-btn
                    color="primary"
                    :loading="finding"
                    :disabled="finding"
                    type="submit"
                  >
                    <v-icon left dark>mdi-send</v-icon> Buscar Contratista
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
        </v-window-item>
        <v-window-item :value="1">
          <v-item-group v-model="selected" mandatory active-class="primary">
            <v-row>
              <v-col
                v-for="(contract, key) in contracts"
                :key="key"
                cols="12"
                sm="12"
                md="6"
              >
                <v-item v-slot="{ active, toggle }" :value="contract">
                  <v-card
                    :color="active ? 'primary' : 'transparent'"
                    :dark="active"
                    @click="toggle"
                  >
                    <v-card-title>
                      <v-list dense color="transparent">
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon>mdi-account</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-text="contract.name" />
                            <v-list-item-title v-text="contract.contract" />
                            <v-list-item-title v-text="contract.entity" />
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-title>
                    <v-card-text>
                      <v-row align="center" class="mx-0">
                        <v-avatar color="success" rounded size="14" />
                        <div class="grey--text ms-4">
                          {{ contract.status }} -
                        </div>
                        <div class="mx-2 text-subtitle-1">
                          $ {{ contract.value }}
                        </div>
                      </v-row>
                      <v-timeline align-top dense>
                        <v-timeline-item small>
                          <div>
                            <div class="font-weight-normal">
                              <strong>Fecha de inicio:</strong>
                            </div>
                            <div>{{ contract.start_date }}</div>
                          </div>
                        </v-timeline-item>
                        <v-timeline-item small>
                          <div>
                            <div class="font-weight-normal">
                              <strong>Fecha de firma:</strong>
                            </div>
                            <div>{{ contract.sign_date }}</div>
                          </div>
                        </v-timeline-item>
                        <v-timeline-item small>
                          <div>
                            <div class="font-weight-normal">
                              <strong>Fecha de finalización:</strong>
                            </div>
                            <div>{{ contract.final_date }}</div>
                          </div>
                        </v-timeline-item>
                      </v-timeline>
                      <v-divider class="my-2" />
                      <h3 class="my-2">Objeto del contrato</h3>
                      <div v-text="contract.object" />
                    </v-card-text>
                  </v-card>
                </v-item>
              </v-col>
              <!-- Create User -->
              <v-col cols="12" class="text-right">
                <v-btn
                  color="primary"
                  :loading="finding"
                  :disabled="finding"
                  outlined
                  @click="[step = 0, user.document=null]"
                >
                  Regresar
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="finding"
                  :disabled="finding || !selected"
                  @click="step = 2"
                >
                  Continuar
                </v-btn>
              </v-col>
            </v-row>
          </v-item-group>
        </v-window-item>
        <v-window-item :value="2">
          <validation-observer ref="contractor_form" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(onSubmit)">
              <v-row>
                <!-- Document Type -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.required"
                    vid="document_type"
                    name="tipo de documento"
                  >
                    <v-select
                      id="document_type"
                      v-model="user.document_type_id"
                      name="document_type"
                      item-value="id"
                      item-text="combined"
                      clearable
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      min="3"
                      autocomplete="off"
                      required="required"
                      :items="document_types"
                      prepend-icon="mdi-card-account-details"
                      menu-props="auto"
                      label="Tipo de Documento"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Document -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_document_required"
                    vid="document"
                    name="número de documento"
                  >
                    <v-text-field
                      id="document"
                      v-model.number="user.document"
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
                <!-- Name -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_alpha_spaces_required"
                    vid="name"
                    name="nombre"
                  >
                    <v-text-field
                      id="name"
                      v-model="user.name"
                      name="name"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Nombres"
                      clearable
                      counter
                      :maxlength="
                        user.validations.input_alpha_spaces_required.max
                      "
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-face-agent"
                    />
                  </validation-provider>
                </v-col>
                <!-- Surname -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_alpha_spaces_required"
                    vid="surname"
                    name="apellidos"
                  >
                    <v-text-field
                      id="surname"
                      v-model="user.surname"
                      name="surname"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Apellidos"
                      clearable
                      counter
                      :maxlength="
                        user.validations.input_alpha_spaces_required.max
                      "
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-face-agent"
                    />
                  </validation-provider>
                </v-col>
                <!-- Email -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_email_required"
                    vid="email"
                    name="correo electrónico personal"
                  >
                    <v-text-field
                      id="email"
                      v-model="user.email"
                      name="email"
                      type="email"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Correo electrónico personal"
                      clearable
                      counter
                      :maxlength="user.validations.input_email_required.max"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-email-outline"
                    />
                  </validation-provider>
                </v-col>
                <!-- Email Confirmation -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_email_confirmation('email')"
                    vid="email_confirmation"
                    name="confirmar correo electrónico"
                  >
                    <v-text-field
                      id="email_confirmation"
                      v-model="user.email_confirmation"
                      name="email_confirmation"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Confirmar correo electrónico"
                      clearable
                      counter
                      :maxlength="user.validations.input_email_required.max"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-email-outline"
                    />
                  </validation-provider>
                </v-col>
                <!-- Phone -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_number_required"
                    vid="phone"
                    name="teléfono de contácto"
                  >
                    <v-text-field
                      id="phone"
                      v-model="user.phone"
                      name="phone"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Teléfono de contácto"
                      clearable
                      :counter="12"
                      :maxlength="12"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-phone"
                    />
                  </validation-provider>
                </v-col>
                <!-- Contract Type -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.required"
                    vid="contract_type_id"
                    name="tipo de trámite"
                  >
                    <v-select
                      id="contract_type_id"
                      v-model="user.contract_type_id"
                      name="contract_type_id"
                      item-text="name"
                      item-value="id"
                      clearable
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      min="3"
                      autocomplete="off"
                      required="required"
                      :items="contract_types"
                      prepend-icon="mdi-clipboard-text-outline"
                      menu-props="auto"
                      label="Tipo de Trámite"
                      @change="onChangeContract"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Contract -->
                <v-col cols="12" md="3" sm="6">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_number_required"
                    vid="contract"
                    name="número de contraro"
                  >
                    <v-text-field
                      id="contract"
                      v-model="user.contract"
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
                      prepend-icon="mdi-numeric"
                    />
                  </validation-provider>
                </v-col>
                <!-- Year -->
                <v-col cols="12" md="3" sm="6">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="
                      user.validations.input_number_required_between(2019, 2999)
                    "
                    vid="contract_year"
                    name="año de contraro"
                  >
                    <v-text-field
                      id="contract_year"
                      v-model="user.contract_year"
                      type="number"
                      name="contract_year"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      persistent-hint
                      :hint="`Ejemplo: ${$moment().year()}`"
                      color="primary"
                      label="Año de contrato"
                      clearable
                      counter
                      :min="2019"
                      :max="2999"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-calendar"
                    />
                  </validation-provider>
                </v-col>
                <!-- Start Date -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    vid="start_date"
                    name="fecha inicio del contrato"
                  >
                    <v-dialog
                      ref="dialog_start"
                      v-model="start_date"
                      :return-value.sync="user.start_date"
                      persistent
                      width="290px"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          id="start_date"
                          v-model="user.start_date"
                          name="start_date"
                          :error-messages="errors"
                          color="primary"
                          label="Fecha inicio del contrato"
                          clearable
                          counter
                          :maxlength="191"
                          autocomplete="off"
                          required="required"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        ref="start_date_picker"
                        v-model="user.start_date"
                        locale="es"
                        :max="user.final_date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="start_date = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="$refs.dialog_start.save(user.start_date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </validation-provider>
                </v-col>
                <!-- Final Date -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    vid="final_date"
                    name="fecha terminación del contrato"
                  >
                    <v-dialog
                      ref="dialog_final"
                      v-model="final_date"
                      :return-value.sync="user.final_date"
                      persistent
                      width="290px"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          id="final_date"
                          v-model="user.final_date"
                          name="final_date"
                          :error-messages="errors"
                          color="primary"
                          label="Fecha terminación del contrato"
                          clearable
                          counter
                          :maxlength="191"
                          autocomplete="off"
                          required="required"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        ref="final_date_picker"
                        v-model="user.final_date"
                        locale="es"
                        :min="user.start_date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="final_date = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="$refs.dialog_final.save(user.final_date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </validation-provider>
                </v-col>
                <!-- Total -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_number_required"
                    vid="total"
                    name="valor total del contrato o adición"
                  >
                    <v-text-field
                      id="total"
                      v-model="user.total"
                      name="total"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Valor total del contrato o adición"
                      clearable
                      counter
                      :maxlength="12"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-currency-usd"
                    />
                  </validation-provider>
                </v-col>
                <!-- Duration -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_number_required"
                    vid="duration"
                    name="duración del contrato"
                  >
                    <v-text-field
                      id="duration"
                      v-model="user.duration"
                      name="duration"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      label="Duración del contrato en meses"
                      clearable
                      counter
                      :maxlength="4"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-clipboard-text-clock-outline"
                    />
                  </validation-provider>
                </v-col>
                <template v-if="user.contract_type_id === 3">
                  <!-- Start Date -->
                  <v-col cols="12" md="6" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      vid="start_suspension_date"
                      name="fecha inicio suspención"
                    >
                      <v-dialog
                        ref="dialog_start_suspension"
                        v-model="start_suspension_date"
                        :return-value.sync="user.start_suspension_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="start_suspension_date"
                            v-model="user.start_suspension_date"
                            name="start_suspension_date"
                            :error-messages="errors"
                            color="primary"
                            label="Fecha inicio suspención"
                            clearable
                            counter
                            :maxlength="191"
                            autocomplete="off"
                            required="required"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          ref="start_suspension_date_picker"
                          v-model="user.start_suspension_date"
                          locale="es"
                          :max="user.final_suspension_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="start_suspension_date = false"
                          >
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="
                              $refs.dialog_start_suspension.save(
                                user.start_suspension_date
                              )
                            "
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </validation-provider>
                  </v-col>
                  <!-- Final Date -->
                  <v-col cols="12" md="6" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      vid="final_suspension_date"
                      name="fecha terminación suspención"
                    >
                      <v-dialog
                        ref="dialog_final_suspension_date"
                        v-model="final_suspension_date"
                        :return-value.sync="user.final_suspension_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="final_suspension_date"
                            v-model="user.final_suspension_date"
                            name="final_suspension_date"
                            :error-messages="errors"
                            color="primary"
                            label="Fecha terminación de la suspención"
                            clearable
                            counter
                            :maxlength="191"
                            autocomplete="off"
                            required="required"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          ref="final_date_picker"
                          v-model="user.final_suspension_date"
                          locale="es"
                          :min="user.start_suspension_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="final_suspension_date = false"
                          >
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="
                              $refs.dialog_final_suspension_date.save(
                                user.final_suspension_date
                              )
                            "
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </validation-provider>
                  </v-col>
                </template>

                <!-- Create User -->
                <v-col cols="12" class="text-right">
                  <v-btn
                    color="primary"
                    :loading="finding"
                    :disabled="finding"
                    outlined
                    @click="onChaneBack"
                  >
                    Regresar
                  </v-btn>
                  <v-btn
                    color="primary"
                    :loading="finding"
                    :disabled="finding"
                    type="submit"
                  >
                    <v-icon left dark>mdi-send</v-icon> Crear Contratista
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
        </v-window-item>
      </v-window>
    </v-card-text>
  </base-material-card>
</template>

<script>
import { DocumentType } from '~/models/services/portal/DocumentType'
import { Contractor } from '~/models/services/portal/Contractor'
import { ContractType } from '~/models/services/portal/ContractType'

export default {
  name: 'ContractorForm',
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
  },
  auth: 'auth',
  middleware: ['permissions'],
  meta: {
    can: ['contractors-portal-super-admin', 'contractors-portal-hiring'],
  },
  data: () => ({
    step: 0,
    form_manual: false,
    document_type: new DocumentType(),
    document_types: [],
    contract_type: new ContractType(),
    contract_types: [],
    user: new Contractor(),
    finding: false,
    start_date: false,
    final_date: false,
    start_suspension_date: false,
    final_suspension_date: false,
    contracts: [],
    selected: {},
    email_confirmation: null,
  }),
  fetch() {
    this.getDocumentTypes()
    this.getContractTypes()
  },
  head: (vm) => ({
    title: vm.$t('titles.Profile'),
  }),
  watch: {
    start_date(val) {
      val &&
        setTimeout(() => (this.$refs.start_date_picker.activePicker = 'YEAR'))
    },
    final_date(val) {
      val &&
        setTimeout(() => (this.$refs.final_date_picker.activePicker = 'YEAR'))
    },
    selected(val) {
      const contract = (val.contract || '').split('-')
      const names = (val.name || '').split(' ')
      const f = `${names[0] || ''} ${names[1] || ''}`.trim()
      const s = `${names[2] || ''} ${names[3] || ''}`.trim()
      this.user.name = f || null
      this.user.surname = s || null
      this.user.document = val.document || null
      this.user.contract = contract[2] || null
      this.user.contract_year = contract[3] || null
      this.user.start_date = val.start_date || null
      this.user.final_date = val.final_date || null
      this.user.total = val.value || null
      const start = new Date(val.start_date);
      const final = new Date(val.final_date);
      this.user.duration = final.getMonth() - start.getMonth() + (12 * (final.getFullYear() - start.getFullYear()))
    },
  },
  mounted() {
    this.user.setFormInstance(this.$refs.contractor_form)
  },
  methods: {
    getDocumentTypes() {
      this.start()
      this.document_type
        .index()
        .then((response) => {
          this.document_types = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    getContractTypes() {
      this.start()
      this.contract_type
        .index()
        .then((response) => {
          this.contract_types = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onSubmit() {
      this.start()
      this.user.setFormInstance(this.$refs.contractor_form)
      this.user
        .store()
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
          this.$router.push(
            this.localePath({
              name: 'user-id-contractor',
              params: { id: response.details.id },
            })
          )
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onSECOPFind() {
      this.start()
      this.$snackbar({
        message: 'Buscando contratista en SECOP',
        color: 'info',
        icon: 'mdi-account-search-outline'
      })
      this.user.setFormInstance(this.$refs.contractor_form)
      const params = {
        document: this.user.document,
      }
      this.user
        .findByDocumentSecop({ params })
        .then((response) => {
          this.contracts = response.data.map((contract) => {
            return {
              name: contract.proveedor_adjudicado,
              document: contract.documento_proveedor,
              contract: contract.referencia_del_contrato,
              status: contract.estado_contrato,
              value: contract.valor_del_contrato,
              entity: contract.nombre_entidad,
              object: contract.objeto_del_contrato,
              start_date: this.$moment(contract.fecha_de_inicio_del_contrato).isValid()
                ? this.$moment(contract.fecha_de_inicio_del_contrato).format('YYYY-MM-DD')
                : contract.fecha_de_inicio_del_contrato,
              sign_date: this.$moment(contract.fecha_de_firma).isValid()
                ? this.$moment(contract.fecha_de_firma).format('YYYY-MM-DD')
                : contract.fecha_de_firma,
              final_date: this.$moment(contract.fecha_de_fin_del_contrato).isValid()
                ? this.$moment(contract.fecha_de_fin_del_contrato).format('YYYY-MM-DD')
                : contract.fecha_de_fin_del_contrato,
            }
          })
        })
        .then(() => {
          this.step = 1
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message, timeout: 6000, })
          this.form_manual = true
        })
        .finally(() => this.stop())
    },
    onFind() {
      this.start()
      this.user.setFormInstance(this.$refs.contractor_form)
      this.user
        .findByDocument()
        .then((response) => {
          this.$router.push(
            this.localePath({
              name: 'user-id-contractor',
              params: { id: response.data.id },
            })
          )
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onChangeContract(id) {
      this.user.start_suspension_date = null
      this.user.final_suspension_date = null
    },
    onManual() {
      this.step = 2
      this.user.document_type_id = null
      this.user.name = null
      this.user.surname = null
      this.user.email = null
      this.user.email_confirmation = null
      this.user.phone = null
      this.user.contract = null
      this.user.contract_type_id = null
      this.user.contract_year = null
      this.user.start_date = null
      this.user.final_date = null
      this.user.total = null
      this.user.duration = null
    },
    onChaneBack() {
      this.step = 1
      if (this.form_manual) {
        this.step = 0
        this.form_manual = false
        this.user.document = null
      }
    },
    // Loading
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
    },
  },
}
</script>
