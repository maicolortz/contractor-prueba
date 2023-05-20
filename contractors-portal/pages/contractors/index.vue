<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <base-material-card
          class="mt-6"
          icon="mdi-account-multiple"
          title="Contratistas"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="12">
                <v-switch
                  v-model="filters.doesnt_have_secop"
                  :loading="finding"
                  :disabled="finding"
                  value="true"
                  label="Pendientes por Secop"
                  @change="onSearch"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12">
                <v-switch
                  v-model="filters.doesnt_have_arl"
                  :loading="finding"
                  :disabled="finding"
                  value="true"
                  label="Pendientes por ARL"
                  @change="onSearch"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12">
                <v-switch
                  v-model="filters.doesnt_have_data"
                  :loading="finding"
                  :disabled="finding"
                  value="true"
                  label="Contratistas pendientes por actualizar datos personales"
                  @change="onSearch"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12">
                <v-switch
                  v-model="filters.last_year"
                  :loading="finding"
                  :disabled="finding"
                  value="true"
                  :label="`Contratos ` + new Date().getFullYear()"
                  @change="onSearch"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12">
                <v-switch
                  v-model="filters.recreation"
                  :loading="finding"
                  :disabled="finding"
                  value="true"
                  label="Subdirección Recreación y Deportes"
                  @change="onSearch"
                />
              </v-col>
            </v-row>
            <v-skeleton-loader
              ref="skeleton"
              :loading="finding"
              transition="scale-transition"
              type="table"
              class="mx-auto"
            >
              <v-data-table
                v-model="selected"
                :options.sync="pagination"
                :items-per-page.sync="itemsPerPage"
                :server-items-length="total"
                :headers="headers"
                :items="items"
                item-key="id"
                :show-expand="expanded.length > 0"
                :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
              >
                <template #top>
                  <v-toolbar flat color="transparent">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      clearable
                      label="Buscar por número de documento"
                      persistent-hint
                      hint="Digite el número de documento y después de clic sobre la lupa para buscar"
                      @click:append="onSearch"
                      @click:clear="onClearSearch"
                    >
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          color="primary"
                          class="mr-2 my-2"
                          :loading="finding"
                          :disabled="finding"
                          fab
                          small
                          v-on="on"
                          @click="getData"
                        >
                          <v-icon color="white" dark>mdi-reload</v-icon>
                        </v-btn>
                      </template>
                      <span>Recargar</span>
                    </v-tooltip>
                    <v-tooltip v-if="userIsA('contractors-portal-hiring')" top>
                      <template #activator="{ on }">
                        <v-btn
                          color="primary"
                          class="mr-2 my-2"
                          :loading="finding"
                          :disabled="finding"
                          fab
                          small
                          :to="
                            localePath({
                              name: 'user-contractor',
                            })
                          "
                          v-on="on"
                        >
                          <v-icon color="white" dark>mdi-account</v-icon>
                        </v-btn>
                      </template>
                      <span>Crear Contratista</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-btn
                          color="primary"
                          class="mr-2 my-2"
                          :loading="finding"
                          :disabled="finding"
                          fab
                          small
                          hidden
                          v-on="on"
                          @click="getDataBank"
                        >
                          <v-icon color="white" dark>mdi-cash-sync</v-icon>
                        </v-btn>
                      </template>
                      <span>Sincronizar cuentas bancarias</span>
                    </v-tooltip>
                    <v-btn
                      class="my-2 hidden-sm-and-down"
                      color="primary"
                      @click="onExcel"
                    >
                      <v-icon color="white" left dark>
                        mdi-cloud-download
                      </v-icon>
                      Descargar Excel
                    </v-btn>
                  </v-toolbar>
                </template>
                <template #[`item.view`]="{ item }">
                  <v-btn
                    icon
                    color="info"
                    :to="
                      localePath({
                        name: 'user-id-contractor',
                        params: { id: item.id },
                      })
                    "
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <template #[`item.secop_file`]="{ item }">
                  <v-btn
                    :color="getColor(item.secop_file)"
                    fab
                    x-small
                    @click="onFile(item)"
                  >
                    <v-badge
                      color="error"
                      :content="item.secop_file"
                      :value="!!item.secop_file"
                    >
                      <v-icon dark>mdi-image</v-icon>
                    </v-badge>
                  </v-btn>
                </template>
                <template #[`item.arl_file`]="{ item }">
                  <v-btn
                    :color="getColor(item.arl_file)"
                    fab
                    x-small
                    @click="onFile(item)"
                  >
                    <v-badge
                      color="error"
                      :content="item.arl_file"
                      :value="!!item.arl_file"
                    >
                      <v-icon dark>mdi-file</v-icon>
                    </v-badge>
                  </v-btn>
                </template>
                <template #[`item.third_party_text`]="{ item }">
                  <v-btn
                    :color="item.third_party ? 'success' : 'error'"
                    fab
                    x-small
                    @click="onThird(item)"
                  >
                    <v-icon dark>mdi-archive-arrow-up</v-icon>
                  </v-btn>
                </template>
                <template #expanded-item="{ headers: data, item }">
                  <td :colspan="data.length">
                    <v-row
                      v-for="(expanded_item, key) in expanded"
                      :key="`expanded-${key}`"
                    >
                      <v-col cols="12" sm="12" md="6">
                        <div class="font-weight-bold">
                          {{ expanded_item.label }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <template
                          v-if="['rut', 'bank'].includes(expanded_item.field)"
                        >
                          <v-btn
                            color="primary"
                            :href="item[`${expanded_item.field}_file`]"
                            target="_blank"
                          >
                            {{ expanded_item.label }}
                          </v-btn>
                        </template>
                        <template
                          v-else-if="expanded_item.field === 'third_party'"
                        >
                          {{
                            `${
                              item[expanded_item.field] ? 'CREADO' : 'SIN CREAR'
                            }`
                          }}
                        </template>
                        <template v-else>
                          {{ item[expanded_item.field] }}
                        </template>
                      </v-col>
                    </v-row>
                  </td>
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-dialog v-model="file_dialog">
      <v-card>
        <v-card-title>
          <h2 class="font-weight-regular">
            <v-icon color="primary" large>mdi-folder-file-outline</v-icon>
            {{ `ARCHIVOS CONTRATO ${selectedUser.contract}` }}
          </h2>
          <v-spacer />
          <v-btn icon @click="onCloseFileDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template v-for="(f, k) in selectedUser.files">
              <v-col
                v-if="f.file_type_id === arl_file"
                :key="`f-al-${k}`"
                cols="12"
              >
                <v-alert
                  v-if="!!f.status_coverage"
                  :type="f.covered < 0 ? 'success' : 'error'"
                  colored-border
                  border="left"
                >
                  {{ f.status_coverage }}
                  <br />
                  <span class="caption">
                    {{
                      `Fecha de cobertura ARL: ${f.coverage_final_date} - Fecha fin del contrato ${f.contract_final_date}`
                    }}
                  </span>
                </v-alert>
              </v-col>
              <v-col :key="`f-${k}`" cols="12" md="6" sm="12">
                <v-list>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>
                        {{
                          f.mime.includes('image') ? 'mdi-image' : 'mdi-file'
                        }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="f.name" />
                      <v-list-item-subtitle v-text="f.file_type" />
                      <v-list-item-subtitle v-text="f.user" />
                      <v-list-item-subtitle v-text="f.created_at" />
                      <v-list-item-subtitle>
                        <v-btn
                          :href="f.path"
                          target="_blank"
                          block
                          small
                          text
                          color="primary"
                        >
                          Ver Archivo
                        </v-btn>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action
                      v-if="
                        userIsA([
                          'contractors-portal-hiring',
                          'contractors-portal-arl',
                        ]) && $moment().isBefore(selectedUser.final_date)
                      "
                    >
                      <v-tooltip top>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            icon
                            small
                            color="error"
                            v-bind="attrs"
                            v-on="on"
                            @click="onDeleteFile(f)"
                          >
                            <v-icon small>mdi-close</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('buttons.Delete') }}</span>
                      </v-tooltip>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions
          v-if="
            userIsA(['contractors-portal-hiring', 'contractors-portal-arl'])
          "
        >
          <v-spacer />
          <v-dialog v-model="upload_dialog">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Cargar Archivos
              </v-btn>
            </template>
            <validation-observer ref="file_form" v-slot:="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(onUpload)">
                <v-card>
                  <v-card-title>
                    <h2 class="font-weight-regular">
                      <v-icon color="primary" large>mdi-paperclip-plus</v-icon>
                      {{ `AGREGAR ARCHIVO AL CONTRATO ${selectedUser.contract}` }}
                    </h2>
                    <v-spacer />
                    <v-btn icon @click="upload_dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row v-if="!!file.validations" class="mx-auto align-content-center">
                      <!-- File Type -->
                      <v-col cols="12" md="12" sm="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :rules="file.validations.required"
                          vid="file_type_id"
                          name="tipo de archivo"
                        >
                          <v-select
                            id="file_type_id"
                            v-model="file.file_type_id"
                            name="file_type_id"
                            item-text="name"
                            item-value="id"
                            clearable
                            :loading="finding"
                            :readonly="finding"
                            :error-messages="errors"
                            autocomplete="off"
                            required="required"
                            :items="file_types"
                            prepend-icon="mdi-clipboard-text-outline"
                            menu-props="auto"
                            label="Tipo de Archivo"
                            @change="onMime"
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <!-- File -->
                      <v-col cols="12" md="12" sm="12">
                        <validation-provider
                          v-slot="{ errors }"
                          :rules="form.validations.required"
                          vid="file"
                          name="Archivo"
                        >
                          <v-file-input
                            id="arl_file"
                            v-model="file.files"
                            :disabled="!file.file_type_id || finding"
                            :error-messages="errors"
                            :loading="finding"
                            name="arl_file"
                            clearable
                            autocomplete="off"
                            prepend-icon="mdi-file"
                            label="Adjuntar Archivo"
                            :accept="mimes"
                            multiple
                          >
                          </v-file-input>
                        </validation-provider>
                      </v-col>
                      <template v-if="arl_file === file.file_type_id">
                        <!-- Start Date -->
                        <v-col cols="12" md="6" sm="12">
                          <v-dialog
                            ref="dialog_coverage_start_date"
                            v-model="coverage_start_date"
                            :return-value.sync="file.coverage_start_date"
                            persistent
                            width="290px"
                          >
                            <template #activator="{ on }">
                              <validation-provider
                                v-slot="{ errors }"
                                rules="required"
                                vid="coverage_final_date"
                                name="fecha inicio de la cobertura"
                              >
                                <v-text-field
                                  id="coverage_start_date"
                                  v-model="file.coverage_start_date"
                                  name="coverage_start_date"
                                  :error-messages="errors"
                                  color="primary"
                                  label="Fecha inicio de la cobertura"
                                  clearable
                                  counter
                                  :maxlength="191"
                                  autocomplete="off"
                                  required="required"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="on"
                                />
                              </validation-provider>
                            </template>
                            <v-date-picker
                              ref="coverage_start_date_picker"
                              v-model="file.coverage_start_date"
                              locale="es"
                              :max="file.coverage_final_date"
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="coverage_start_date = false"
                              >
                                Cancelar
                              </v-btn>
                              <v-btn
                                color="primary"
                                @click="
                                  $refs.dialog_coverage_start_date.save(
                                    file.coverage_start_date
                                  )
                                "
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                        <!-- Final Date -->
                        <v-col cols="12" md="6" sm="12">
                          <v-dialog
                            ref="dialog_coverage_final_date"
                            v-model="coverage_final_date"
                            :return-value.sync="file.coverage_final_date"
                            persistent
                            width="290px"
                          >
                            <template #activator="{ on }">
                              <validation-provider
                                v-slot="{ errors }"
                                rules="required"
                                vid="coverage_final_date"
                                name="fecha final de la cobertura"
                              >
                                <v-text-field
                                  id="coverage_final_date"
                                  v-model="file.coverage_final_date"
                                  name="coverage_final_date"
                                  :error-messages="errors"
                                  color="primary"
                                  label="Fecha final de la cobertura"
                                  clearable
                                  counter
                                  :maxlength="191"
                                  autocomplete="off"
                                  required="required"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="on"
                                />
                              </validation-provider>
                            </template>
                            <v-date-picker
                              ref="coverage_final_date_picker"
                              v-model="file.coverage_final_date"
                              locale="es"
                              :min="file.coverage_start_date"
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="coverage_final_date = false"
                              >
                                Cancelar
                              </v-btn>
                              <v-btn
                                color="primary"
                                @click="
                                  $refs.dialog_coverage_final_date.save(
                                    file.coverage_final_date
                                  )
                                "
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                      </template>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer class="hidden-sm-and-down" />
                    <v-btn
                      color="primary"
                      :loading="finding"
                      :disabled="finding"
                      outlined
                      @click="file_dialog = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="primary"
                      :loading="finding"
                      :disabled="finding"
                      type="submit"
                    >
                      <v-icon left dark>mdi-send</v-icon> Agregar Archivo
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </validation-observer>
          </v-dialog>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="third_dialog">
      <v-card>
        <v-card-title>
          <h2 class="font-weight-regular">
            <v-icon color="primary" large>mdi-folder-file-outline</v-icon>
            {{ `ARCHIVOS CONTRATO ${selectedUser.contract}` }}
          </h2>
          <v-spacer />
          <v-btn icon @click="onCloseFileDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="selectedUser.rut" />
                    <v-list-item-subtitle v-text="'RUT'" />
                    <v-list-item-subtitle>
                      <v-btn
                        :href="selectedUser.rut_file"
                        target="_blank"
                        block
                        small
                        text
                        color="primary"
                      >
                        Ver Archivo
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="selectedUser.bank" />
                    <v-list-item-subtitle v-text="'Certificado Bancario'" />
                    <v-list-item-subtitle>
                      <v-btn
                        :href="selectedUser.bank_file"
                        target="_blank"
                        block
                        small
                        text
                        color="primary"
                      >
                        Ver Archivo
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-switch
                v-if="userIsA('contractors-portal-third-party')"
                v-model="selectedUser.third_party"
                :label="selectedUser.third_party_text"
                hint="Da clic para activar o inactivar el switch e indicar que el tercero está creado o actualizado"
                persistent-hint
                @change="onVerify"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-check-dialog ref="confirmDialog">
      {{ $t('confirm.delete') }}
    </v-check-dialog>
  </v-container>
</template>

<script>
import { Contractor } from '~/models/services/portal/Contractor'
import { ContractFile } from '~/models/services/portal/ContractFile'
import { Permission } from '~/models/services/portal/Permission'
import { FileType } from '~/models/services/portal/FileType'
import { Bank } from "~/models/services/portal/Bank";

/**
 * ID tomado de la base de datos para identificar el tipo de
 * archivo a cargar para el caso de ARL
 *
 * @type {number}
 */
const ARL = 1

export default {
  name: 'Contractors',
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
  },
  auth: 'auth',
  data: () => ({
    perm: new Permission(),
    permissions: [],
    form: new Contractor(),
    bank: new Bank(),
    finding: false,
    headers: [],
    expanded: [],
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    selected: [],
    // Toolbar
    search: null,
    selectedUser: {
      files: [],
    },
    // File
    coverage_start_date: false,
    coverage_final_date: false,
    file: {},
    file_type: new FileType(),
    arl_file: ARL,
    file_types: [],
    upload_dialog: false,
    file_dialog: false,
    third_dialog: false,
    mimes: 'application/pdf,image/*',
    filters: {
      doesnt_have_arl: null,
      doesnt_have_secop: null,
      doesnt_have_data: null,
      last_year: null,
      recreation: null
    },
  }),
  fetch() {
    this.getPermissions()
    this.getFileTypes()
  },
  watch: {
    'pagination.page'() {
      return this.getData()
    },
    itemsPerPage() {
      return this.getData()
    },
  },
  methods: {
    onSearch() {
      this.pagination.page = 1
      this.getData()
    },
    onClearSearch() {
      this.search = null
      this.getData()
    },
    getData() {
      if (this.$route.query) {
        this.filters = {
          ...this.filters,
          ...this.$route.query,
        }
      }
      const params = {
        query: this.search,
        page: this.pagination.page,
        per_page: this.itemsPerPage,
        ...this.filters,
      }
      this.start()
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data
          this.total = response.meta.total
          this.headers = response.details.headers
          this.expanded = response.details.expanded
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => {
          this.$router.push({ path: this.$route.path })
          this.stop()
        })
    },
    getDataBank() {
      this.start()
      this.bank
        .sync()
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .then(() => this.getData())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    getColor(value) {
      return value && value > 0 ? 'success' : 'error'
    },
    onCloseFileDialog() {
      this.file = {}
      this.selectedUser = {
        files: [],
      }
      this.file_dialog = false
      this.third_dialog = false
    },
    onDeleteFile(item) {
      this.$refs.confirmDialog.open().then(() => {
        if (item.id) {
          this.file = new ContractFile(item.contract_id)
          this.start()
          this.file
            .destroy(item.id)
            .then((response) => {
              this.$snackbar({
                message: response.data,
                color: 'success',
              })
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message })
            })
            .finally(() => {
              this.stop()
              this.getData()
              this.file = {}
            })
        }
      })
    },
    onVerify(val) {
      if (this.selectedUser.id) {
        new Contractor({ third_party: val })
          .thirdParty(this.selectedUser.id)
          .then((response) => {
            this.$snackbar({ message: response.data, color: 'success' })
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.onCloseFileDialog()
            this.getData()
          })
      }
    },
    // Loading
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
      this.file_dialog = false
      this.upload_dialog = false
    },
    // File
    getFileTypes() {
      this.start()
      this.file_type
        .index()
        .then((response) => {
          this.file_types = response.data.filter((f) => f.can)
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onFile(item) {
      const open = () => {
        this.file = new ContractFile(item.contract_id)
        this.selectedUser = item
        setTimeout(() => (this.file_dialog = true), 200)
      }
      if (this.file_dialog) {
        this.selectedUser = {
          files: [],
        }
        this.file_dialog = false
        setTimeout(open, 200)
      } else {
        open()
      }
    },
    onThird(item) {
      const open = () => {
        this.selectedUser = item
        setTimeout(() => (this.third_dialog = true), 200)
      }
      if (this.third_dialog) {
        this.selectedUser = {
          files: [],
        }
        this.third_dialog = false
        setTimeout(open, 200)
      } else {
        open()
      }
    },
    onMime(id) {
      const mimes = this.file_types.find((f) => f.id === id)
      this.mimes = mimes.mimes ? mimes.mimes : 'application/pdf,image/*'
      this.file.coverage_start_date = null
      this.file.coverage_final_date = null
    },
    onUpload() {
      this.start()
      this.file.setFormInstance(this.$refs.file_form)
      this.file
        .storeWithFiles()
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .then(() => this.getData())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    // Permissions
    getPermissions() {
      this.perm
        .index()
        .then((response) => {
          this.permissions = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
    },
    userIsA(permission) {
      if (permission && typeof permission === 'string') {
        const admin = this.permissions.find(
          (p) => p.name === 'contractors-portal-super-admin'
        )
        const can = this.permissions.find((p) => p.name === permission)
        return (can && can.can) || (admin && admin.can)
      }
      if (permission && typeof Array.isArray(permission)) {
        permission.push('contractors-portal-super-admin')
        const flag = this.permissions.map((perm) => {
          return permission.includes(perm.name) && perm.can
        })
        return flag.includes(true)
      }
      return false
    },
    // Excel
    onExcel() {
      this.$router.push(this.localePath({ name: 'reports' }))
    },
  },
}
</script>
