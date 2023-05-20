<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <base-material-card class="mt-12" icon="mdi-account">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                Contratista
              </v-toolbar-title>
              <v-spacer />
              <time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu offset-y left>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip left>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :aria-label="$t('buttons.MoreOptions')"
                        icon
                        v-bind="attrs"
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.MoreOptions') }}</span>
                  </v-tooltip>
                </template>
                <v-list dense>
                  <v-list-item @click="getUser">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      userIsA([
                        'contractors-portal-hiring',
                        'contractors-portal-arl',
                        'contractors-portal-observer'
                      ])
                    "
                    @click="onNotifyAgain"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-send</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      Notificar Nuevamente a Contratista
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      userIsA([
                        'contractors-portal-hiring',
                        'contractors-portal-arl',
                      ])
                    "
                    @click="dialog_update_user = true"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Modificar Contratista</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="
                      userIsA([
                        'contractors-portal-hiring',
                        'contractors-portal-arl',
                        'contractors-portal-observer'
                      ])
                    "
                    @click="qr_dialog = true"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-link</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      Enviar Enlace Manualmente
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="userIsA('contractors-portal-hiring')"
                    @click="dialog = true"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Agregar Contrato</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-skeleton-loader
              :loading="finding"
              type="list-item-avatar-two-line@10"
            >
              <v-row>
                <v-col
                  v-for="(key, i) in userData"
                  :key="i"
                  cols="12"
                  sm="12"
                  md="6"
                >
                  <v-list v-if="!!user[key.value || key.field]">
                    <v-list-item>
                      <v-list-item-icon v-if="!!key.icon">
                        <v-icon v-text="key.icon" />
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="user[key.value || key.field]"
                        />
                        <v-list-item-subtitle v-if="!!(key.label || key.text)">
                          {{ key.label || key.text }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action
                        v-if="
                          ['third_party_text'].includes(
                            key.value || key.field
                          ) && userIsA('contractors-portal-third-party')
                        "
                      >
                        <v-switch
                          v-model="user.third_party"
                          @change="onVerify"
                        />
                      </v-list-item-action>
                      <v-list-item-action
                        v-if="['rut', 'bank'].includes(key.value || key.field)"
                      >
                        <v-icon
                          v-if="user[`${key.value || key.field}`]"
                          tag="a"
                          color="primary"
                          :href="user[`${key.value || key.field}_file`]"
                          target="_blank"
                        >
                          mdi-eye
                        </v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-skeleton-loader>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12">
        <base-material-card class="mt-12" icon="mdi-file-document-outline">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                Contratos
              </v-toolbar-title>
              <v-spacer />
              <time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="requested_at"
              />
              <v-menu offset-y left>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip left>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        :aria-label="$t('buttons.MoreOptions')"
                        icon
                        v-bind="attrs"
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.MoreOptions') }}</span>
                  </v-tooltip>
                </template>
                <v-list dense>
                  <v-list-item @click="getUser">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="userIsA('contractors-portal-hiring')"
                    @click="dialog = true"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Agregar Contrato</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-actions v-if="userIsA('contractors-portal-hiring')">
            <v-btn text block color="primary" @click="dialog_update_contract = true">
              Modificación Contractual
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-expansion-panels v-if="!!user.contracts">
              <v-expansion-panel
                v-for="(contract, i) in user.contracts"
                :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
                  {{ `${contract.contract} - ${contract.contract_type} ` }}
                  <span class="caption mx-1" v-text="contract.days_left_text" />
                  <template #actions>
                    <v-badge
                      :color="contract.files.length > 0 ? 'success' : 'error'"
                      :content="contract.files.length"
                    >
                      <v-icon>mdi-file</v-icon>
                    </v-badge>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col
                      v-if="
                        userIsA('contractors-portal-hiring')
                      "
                      cols="12"
                      md="12"
                    >
                      <v-btn
                        text
                        block
                        color="warning"
                        @click="onSelectUpdate(contract)"
                      >
                        Correción datos del Contrato
                      </v-btn>
                    </v-col>
                    <template v-for="(keyH, j) in userContracts">
                      <v-col
                        v-if="!!contract[keyH.value || keyH.field]"
                        :key="`c-${j}`"
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-list>
                          <v-list-item>
                            <v-list-item-icon v-if="!!keyH.icon">
                              <v-icon v-text="keyH.icon" />
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="contract[keyH.value || keyH.field]"
                              />
                              <v-list-item-subtitle
                                v-if="!!(keyH.label || keyH.text)"
                              >
                                {{ keyH.label || keyH.text }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </template>
                    <v-col cols="12" sm="12">
                      <v-divider />
                    </v-col>
                    <template v-for="(f, k) in contract.files">
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
                                  f.mime.includes('image')
                                    ? 'mdi-image'
                                    : 'mdi-file'
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
                                ]) && $moment().isBefore(contract.final_date)
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
                    <v-col
                      v-if="
                        userIsA([
                          'contractors-portal-hiring',
                          'contractors-portal-arl',
                        ])
                      "
                      cols="12"
                      md="12"
                    >
                      <v-btn
                        block
                        outlined
                        color="primary"
                        @click="onFile(contract)"
                      >
                        Añadir Archivo
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <empty-state
              v-else
              icon="mdi-file"
              :rounded="$vuetify.breakpoint.mdAndUp"
              description="No tiene contratos"
            >
              <v-btn
                v-if="userIsA('contractors-portal-hiring')"
                color="primary"
                @click="dialog = true"
              >
                Agregar Contrato
              </v-btn>
            </empty-state>
          </v-card-text>
          <v-card-actions v-if="userIsA('contractors-portal-hiring')">
            <v-btn text block color="primary" @click="dialog = true">
              Agregar Contrato
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-col>
    </v-row>
    <v-dialog v-if="userIsA('contractors-portal-hiring')" v-model="dialog">
      <validation-observer ref="contract_form" v-slot:="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card>
            <v-card-title>
              <h2 class="font-weight-regular">
                <v-icon color="primary" large>mdi-file-document-plus</v-icon>
                AGREGAR CONTRATO
              </h2>
              <v-spacer />
              <v-btn icon @click="stop">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row class="mx-auto align-content-center">
                <!-- banner info -->
                <v-col cols="12" md="12" sm="12">
                  <v-alert
                    icon="mdi-alert"
                    prominent
                    text
                    type="warning"
                  >
                    Las fechas obtenidas de SECOP son tentativas, se recomienda revisar y actualizar.
                  </v-alert>
                </v-col>
                <!-- Contract Type -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.required"
                    vid="contract_type_id"
                    name="tipo de trámite"
                  >
                    <v-select
                      id="contract_type_id"
                      v-model="contract.contract_type_id"
                      name="contract_type_id"
                      item-text="name"
                      item-value="id"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      min="3"
                      autocomplete="off"
                      required="required"
                      :items="contract_types_create"
                      prepend-icon="mdi-clipboard-text-outline"
                      menu-props="auto"
                      label="Tipo de Trámite"
                      @change="onSECOPContractFind"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Select Contracts Secop -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    vid="selected_secop"
                    name="contrato secop"
                  >
                    <v-autocomplete
                      v-model="selected_secop"
                      item-value="contract"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      min="3"
                      return-object
                      autocomplete="on"
                      auto-select-first
                      required="required"
                      :items="contracts_secop"
                      prepend-icon="mdi-file-document-check-outline"
                      label="Lista de contratos activos secop"
                    >
                      <template #selection="{ item }">
                        {{ item.contract }}
                      </template>
                      <template #item="{ item, on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-regular" v-text="item.contract" />
                            <v-list-item-icon class="mt-auto">
                              <v-icon v-if="item.status === 'Activo' || item.status === 'En aprobación'" color="success" left size="12">mdi-checkbox-blank</v-icon>
                              <v-icon v-else color="warning" left size="12">mdi-checkbox-blank</v-icon>
                              <v-list-item-subtitle class="caption" v-text="item.status"/>
                            </v-list-item-icon>
                            <v-list-item-subtitle
                              class="caption"
                              v-text="
                                  `${item.start_date} - ${item.final_date}`
                                "
                            />
                            <v-list-item-subtitle
                              class="caption"
                              v-text="'$' + item.value"
                            />
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </validation-provider>
                </v-col>
                <template v-if="selected_secop">
                  <!-- Contract -->
                  <v-col cols="12" md="3" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="contract.validations.input_number_required"
                      vid="contract"
                      name="número de contrato"
                    >
                      <v-text-field
                        id="contract"
                        v-model="contract.contract"
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
                      contract.validations.input_number_required_between(
                        2019,
                        2999
                      )
                    "
                      vid="contract_year"
                      name="año de contraro"
                    >
                      <v-text-field
                        id="contract_year"
                        v-model="contract.contract_year"
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
                      name="fecha de inicio del contrato"
                    >
                      <v-dialog
                        ref="dialog_start"
                        v-model="start_date"
                        :return-value.sync="contract.start_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="start_date"
                            v-model="contract.start_date"
                            name="start_date"
                            :error-messages="errors"
                            color="primary"
                            label="Fecha inicio tentativa del contrato"
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
                          v-model="contract.start_date"
                          locale="es"
                          :max="contract.final_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="start_date = false">
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="$refs.dialog_start.save(contract.start_date)"
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
                        :return-value.sync="contract.final_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="final_date"
                            v-model="contract.final_date"
                            name="final_date"
                            :error-messages="errors"
                            color="primary"
                            label="Fecha terminación tentativa del contrato"
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
                          v-model="contract.final_date"
                          locale="es"
                          :min="contract.start_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="final_date = false">
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="$refs.dialog_final.save(contract.final_date)"
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
                      :rules="contract.validations.input_number_required"
                      vid="total"
                      name="valor total del contrato o adición"
                    >
                      <v-text-field
                        id="total"
                        v-model="contract.total"
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
                      :rules="contract.validations.required"
                      vid="duration"
                      name="duración del contrato"
                    >
                      <v-text-field
                        id="duration"
                        v-model="contract.duration"
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
                </template>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer class="hidden-sm-and-down" />
              <v-btn color="primary" outlined @click="stop">
                Cancelar
              </v-btn>
              <v-btn
                v-if="form_manual"
                color="primary"
                outlined
                @click="onManual"
              >
                <v-icon left dark>mdi-file-document-plus</v-icon>
                Crear Contrato
              </v-btn>
              <v-btn
                color="primary"
                :loading="finding"
                :disabled="finding"
                type="submit"
              >
                <v-icon left dark>mdi-send</v-icon>
                Agregar Contrato
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </validation-observer>
    </v-dialog>
    <v-dialog v-if="userIsA('contractors-portal-hiring')" v-model="dialog_update_contract">
      <validation-observer ref="contract_form" v-slot:="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card>
            <v-card-title>
              <h2 class="font-weight-regular">
                <v-icon color="primary" large>mdi-file-document-edit</v-icon>
                MODIFICACIÓN CONTRACTUAL
              </h2>
              <v-spacer />
              <v-btn icon @click="stop">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row class="mx-auto align-content-center">
                <!-- Contract Type -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.required"
                    vid="contract_type_id"
                    name="tipo de trámite"
                  >
                    <v-select
                      id="contract_type_id"
                      v-model="contract.contract_type_id"
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
                      :items="contract_types_update"
                      prepend-icon="mdi-clipboard-text-search-outline"
                      menu-props="auto"
                      label="Tipo de Trámite"
                      @change="onChangeContract"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Select Contracts -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.required"
                    vid="contract_selector"
                    name="número de contrato"
                  >
                    <v-autocomplete
                      id="contract"
                      v-model="contract_selector"
                      name="contract"
                      clearable
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      min="3"
                      return-object
                      autocomplete="off"
                      required="required"
                      :items="availableContracts"
                      prepend-icon="mdi-clipboard-text-outline"
                      menu-props="auto"
                      label="Lista de contratos"
                    >
                      <template #selection="{ item }">
                        {{ item.contract }}
                      </template>
                      <template #item="{ item, on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.contract" />
                            <v-list-item-icon class="mt-auto">
                              <v-icon color="success" left size="12">mdi-checkbox-blank</v-icon>
                              <v-list-item-subtitle
                                class="caption"
                                v-text="item.contract_type"
                              />
                            </v-list-item-icon>
                            <v-list-item-subtitle
                              class="caption"
                              v-text="
                                  `${item.start_date} - ${item.final_date}`
                                "
                            />
                            <v-list-item-subtitle
                              class="caption"
                              v-text="item.days_left_text"
                            />
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </validation-provider>
                </v-col>
                <template v-if="contract.contract_type_id && contract_selector">
                  <!-- Contract -->
                  <v-col cols="12" md="3" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      :rules="contract.validations.input_number_required"
                      vid="contract"
                      name="número de contrato"
                    >
                      <v-text-field
                        id="contract"
                        v-model="contract.contract"
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
                      contract.validations.input_number_required_between(
                        2019,
                        2999
                      )
                    "
                      vid="contract_year"
                      name="año de contraro"
                    >
                      <v-text-field
                        id="contract_year"
                        v-model="contract.contract_year"
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
                        :return-value.sync="contract.start_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="start_date"
                            v-model="contract.start_date"
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
                          v-model="contract.start_date"
                          locale="es"
                          :max="contract.final_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="start_date = false">
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="$refs.dialog_start.save(contract.start_date)"
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
                        :return-value.sync="contract.final_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="final_date"
                            v-model="contract.final_date"
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
                          v-model="contract.final_date"
                          locale="es"
                          :min="contract.start_date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="final_date = false">
                            Cancelar
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="$refs.dialog_final.save(contract.final_date)"
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
                      :rules="contract.validations.input_number_required"
                      vid="total"
                      name="valor total del contrato o adición"
                    >
                      <v-text-field
                        id="total"
                        v-model="contract.total"
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
                      :rules="contract.validations.required"
                      vid="duration"
                      name="duración del contrato"
                    >
                      <v-text-field
                        id="duration"
                        v-model="contract.duration"
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
                  <template v-if="contract.contract_type_id === suspension">
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
                          :return-value.sync="contract.start_suspension_date"
                          persistent
                          width="290px"
                        >
                          <template #activator="{ on }">
                            <v-text-field
                              id="start_suspension_date"
                              v-model="contract.start_suspension_date"
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
                            v-model="contract.start_suspension_date"
                            locale="es"
                            :max="contract.final_suspension_date"
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
                                contract.start_suspension_date
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
                          :return-value.sync="contract.final_suspension_date"
                          persistent
                          width="290px"
                        >
                          <template #activator="{ on }">
                            <v-text-field
                              id="final_suspension_date"
                              v-model="contract.final_suspension_date"
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
                            v-model="contract.final_suspension_date"
                            locale="es"
                            :min="contract.start_suspension_date"
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
                                contract.final_suspension_date
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
                </template>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer class="hidden-sm-and-down" />
              <v-btn color="primary" outlined @click="stop()">
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                :loading="finding"
                :disabled="finding"
                type="submit"
              >
                <v-icon left dark>mdi-send</v-icon>
                Modificar Contrato
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </validation-observer>
    </v-dialog>
    <v-dialog
      v-if="userIsA('contractors-portal-hiring')"
      v-model="dialog_update"
    >
      <validation-observer ref="contract_form" v-slot:="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onUpdateContract)">
          <v-card>
            <v-card-title>
              <h2 class="font-weight-regular">
                <v-icon color="primary" large>mdi-file-document-edit-outline</v-icon>
                CORREGIR DATOS DEL CONTRATO
              </h2>
              <v-spacer />
              <v-btn icon @click="stop">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row class="mx-auto align-content-center">
                <!-- Contract Type -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.required"
                    vid="contract_type_id"
                    name="tipo de trámite"
                  >
                    <v-select
                      id="contract_type_id"
                      v-model="contract.contract_type_id"
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
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.input_text_required"
                    vid="contract"
                    name="número de contraro"
                  >
                    <v-text-field
                      id="contract"
                      v-model="contract.contract"
                      name="contract"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      persistent-hint
                      hint="Ejemplo: IDRD-CTO-1234-2020"
                      color="primary"
                      label="Número de contrato"
                      clearable
                      counter
                      :maxlength="contract.validations.input_text_required.max"
                      autocomplete="off"
                      required="required"
                      prepend-icon="mdi-face-agent"
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
                      :return-value.sync="contract.start_date"
                      persistent
                      width="290px"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          id="start_date"
                          v-model="contract.start_date"
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
                        v-model="contract.start_date"
                        locale="es"
                        :max="contract.final_date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="start_date = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="$refs.dialog_start.save(contract.start_date)"
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
                      :return-value.sync="contract.final_date"
                      persistent
                      width="290px"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          id="final_date"
                          v-model="contract.final_date"
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
                        v-model="contract.final_date"
                        locale="es"
                        :min="contract.start_date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="final_date = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="$refs.dialog_final.save(contract.final_date)"
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
                    :rules="contract.validations.input_number_required"
                    vid="total"
                    name="valor total del contrato o adición"
                  >
                    <v-text-field
                      id="total"
                      v-model="contract.total"
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
                    :rules="contract.validations.required"
                    vid="duration"
                    name="duración del contrato"
                  >
                    <v-text-field
                      id="duration"
                      v-model="contract.duration"
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
                <template v-if="contract.contract_type_id === 3">
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
                        :return-value.sync="contract.start_suspension_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="start_suspension_date"
                            v-model="contract.start_suspension_date"
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
                          v-model="contract.start_suspension_date"
                          locale="es"
                          :max="contract.final_suspension_date"
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
                                contract.start_suspension_date
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
                        :return-value.sync="contract.final_suspension_date"
                        persistent
                        width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            id="final_suspension_date"
                            v-model="contract.final_suspension_date"
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
                          v-model="contract.final_suspension_date"
                          locale="es"
                          :min="contract.start_suspension_date"
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
                                contract.final_suspension_date
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
                <!-- Divider -->
                <v-col cols="12" sm="12">
                  <v-divider />
                </v-col>
                <!-- Transport -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.required"
                    vid="transport"
                    name="se suminitra transporte"
                  >
                    <v-switch
                      id="transport"
                      v-model="contract.transport"
                      name="transport"
                      label="¿Se suministra transporte?"
                      :error-messages="errors"
                      persistent-hint
                      hint="Seleccione si se suministra transporte"
                    />
                  </validation-provider>
                </v-col>
                <!-- Position -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.input_text"
                    vid="position"
                    name="cargo a desempeñar"
                  >
                    <v-text-field
                      id="position"
                      v-model="contract.position"
                      name="position"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      color="primary"
                      hint="Ej: auxiliar, técnico, recreador, abogado, ingeniería (especifique cuál), asesor, etc."
                      persistent-hint
                      label="Cargo a desempeñar"
                      clearable
                      counter
                      :maxlength="contract.validations.input_text_required.max"
                      autocomplete="off"
                      prepend-icon="mdi-book-account-outline"
                    />
                  </validation-provider>
                </v-col>
                <!-- Day -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    vid="day"
                    name="día que no trabaja"
                  >
                    <v-select
                      id="day"
                      v-model="contract.day"
                      name="day"
                      item-text="name"
                      item-value="id"
                      clearable
                      persistent-hint
                      hint="Seleccione el día o días ya que no se permite de domingo a domingo"
                      :loading="finding"
                      multiple
                      :readonly="finding"
                      :error-messages="errors"
                      autocomplete="off"
                      :items="days"
                      prepend-icon="mdi-calendar"
                      menu-props="auto"
                      label="Día que no trabaja"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Risk -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    vid="risk"
                    name="nivel de riesgo"
                  >
                    <v-select
                      id="risk"
                      v-model.number="contract.risk"
                      name="risk"
                      item-text="name"
                      item-value="id"
                      clearable
                      :hint="`Si su nivel de riesgo es 5 por favor verificar que esté incluido en la resolución para este riesgo. Si requiere ayuda de clic sobre el ícono (?)`"
                      persistent-hint
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      autocomplete="off"
                      :items="risk"
                      prepend-icon="mdi-alert-outline"
                      menu-props="auto"
                      label="Nivel de Riesgo"
                    />
                  </validation-provider>
                </v-col>
                <!-- Office -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.input_number"
                    vid="subdirectorate_id"
                    name="subdirección"
                  >
                    <v-select
                      id="subdirectorate_id"
                      v-model.number="contract.subdirectorate_id"
                      name="subdirectorate_id"
                      :error-messages="errors"
                      :loading="finding"
                      :readonly="finding"
                      item-text="name"
                      item-value="id"
                      autocomplete="off"
                      clearable
                      :items="subdirectorates"
                      prepend-icon="mdi-domain"
                      menu-props="auto"
                      label="Subdirección"
                      @change="onChangeOffice"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Area -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="contract.validations.input_number"
                    vid="dependency_id"
                    name="dependencia"
                  >
                    <v-select
                      id="dependency_id"
                      v-model.number="contract.dependency_id"
                      name="dependency_id"
                      :error-messages="errors"
                      :loading="finding"
                      :readonly="finding"
                      item-text="name"
                      item-value="id"
                      autocomplete="off"
                      clearable
                      :items="dependencies"
                      prepend-icon="mdi-layers"
                      menu-props="auto"
                      label="Dependencia"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <!-- Other Area -->
                <v-col
                  v-if="other_deps.includes(contract.dependency_id)"
                  cols="12"
                  md="6"
                  sm="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="{
                      required: other_deps.includes(contract.dependency_id),
                      min: 3,
                      max: 191,
                    }"
                    vid="other_dependency_subdirectorate"
                    name="otra área o subdirección"
                  >
                    <v-text-field
                      id="other_dependency_subdirectorate"
                      v-model="form.other_dependency_subdirectorate"
                      name="other_dependency_subdirectorate"
                      :loading="finding"
                      :readonly="
                        finding || !other_deps.includes(contract.dependency_id)
                      "
                      :error-messages="errors"
                      color="primary"
                      label="¿Cuál área o subdirección?"
                      clearable
                      counter
                      :maxlength="contract.validations.input_text_required.max"
                      autocomplete="off"
                      :required="other_deps.includes(contract.dependency_id)"
                      prepend-icon="mdi-clipboard"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer class="hidden-sm-and-down" />
              <v-btn color="primary" outlined @click="dialog_update = false">
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                :loading="finding"
                :disabled="finding"
                type="submit"
              >
                <v-icon left dark>mdi-send</v-icon>
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </validation-observer>
    </v-dialog>
    <v-dialog
      v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl'])"
      v-model="file_dialog"
    >
      <validation-observer ref="file_form" v-slot:="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onUpload)">
          <v-card>
            <v-card-title>
              <h2 class="font-weight-regular">
                <v-icon color="primary" large>mdi-paperclip-plus</v-icon>
                {{ `AGREGAR ARCHIVO AL CONTRATO ${selectedContract.contract}` }}
              </h2>
              <v-spacer />
              <v-btn icon @click="file_dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row v-if="!!file.validations">
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
                <v-icon left dark>mdi-send</v-icon>
                Agregar Archivo
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </validation-observer>
    </v-dialog>
    <v-dialog
      v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl'])"
      v-model="dialog_update_user"
    >
      <validation-observer ref="contractor_form" v-slot:="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onUpdateContractor)">
          <v-card>
            <v-card-title>
              <h2 class="font-weight-regular">
                <v-icon color="primary" large>mdi-account-edit</v-icon>
                MODIFICAR CONTRATISTA
              </h2>
              <v-spacer />
              <v-btn icon @click="stop">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row class="mx-auto align-content-center">
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
                <!-- Notify -->
                <v-col cols="12" md="6" sm="12">
                  <validation-provider
                    v-slot="{ errors }"
                    :rules="user.validations.input_text"
                    vid="notify"
                    name="notificar a contratista"
                  >
                    <v-switch
                      id="notify"
                      v-model="user.notify"
                      name="notify"
                      :loading="finding"
                      :readonly="finding"
                      :error-messages="errors"
                      label="Notificar contratista"
                      hint="Se envía notificación vía email al contrtista para que modifique sus datos adicionales"
                      persistent-hint
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer class="hidden-sm-and-down" />
              <v-btn
                color="primary"
                outlined
                @click="dialog_update_user = false"
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
                Modificar Contratista
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </validation-observer>
    </v-dialog>
    <v-dialog
      v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl', 'contractors-portal-observer'])"
      v-model="qr_dialog"
      max-width="600"
    >
      <v-card flat>
        <v-card-title>
          Portal Contratista - Enlaces
          <v-spacer />
          <v-btn icon @click="qr_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p>
                Puede copiar este enlace para enviar al contratista si se
                presenta algún inconveniente con el correo electrónico o envíar
                a través de WhatsApp si la opción está disponible.
              </p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-link"
                label="Enlace de modificación"
                :value="user.modifiable_link"
                readonly
              >
                <template #append-outer>
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        small
                        fab
                        color="primary"
                        v-on="tooltip"
                        @click="onCopy(user.modifiable_link)"
                      >
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copiar al portapeles</span>
                  </v-tooltip>
                  <v-tooltip v-if="!!user.whatsapp_link" top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        fab
                        small
                        color="success"
                        class="mx-1"
                        target="_blank"
                        :href="user.whatsapp_link"
                        v-on="tooltip"
                      >
                        <v-icon>mdi-whatsapp</v-icon>
                      </v-btn>
                    </template>
                    <span>Enviar por WhatsApp</span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <template v-if="!!user.whatsapp_link">
              <v-col cols="12">
                <p>
                  También puede escanear desde un dispositivo móvil el código QR
                  que se muestra a continuación para enviar el enlace por
                  WhatsApp
                </p>
              </v-col>
              <v-col
                cols="12"
                class="align-content-center align-items-center align-self-center justify-content-center text-center"
              >
                <vue-qrcode :width="300" :value="user.whatsapp_link" />
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-check-dialog ref="confirmDialog">
      {{ $t("confirm.delete") }}
    </v-check-dialog>
    <v-snackbar v-model="copied" bottom>
      Se ha copiado el enlace al portapales
    </v-snackbar>
  </v-container>
</template>

<script>
import VueQrcode from 'vue-qrcode'
import { Contractor } from '~/models/services/portal/Contractor'
import { DocumentType } from '~/models/services/portal/DocumentType'
import { Contract } from '~/models/services/portal/Contract'
import { ContractType } from '~/models/services/portal/ContractType'
import { FileType } from '~/models/services/portal/FileType'
import { ContractFile } from '~/models/services/portal/ContractFile'
import { Permission } from '~/models/services/portal/Permission'
import { Office } from '~/models/services/portal/Office'

/**
 * ID tomado de la base de datos para identificar el tipo de
 * contrato para el caso de NUEVOS CONTRATOS
 *
 * @type {number}
 */
const NUEVO = 1
/**
 * @type {number}
 */
const ADICION = 2
/**
 * @type {number}
 */
const SUSPENSION = 3
/**
 * @type {number}
 */
const PRORROGA = 4
/**
 * @type {number}
 */
const CESION = 5
/**
 * @type {number}
 */
const ARL = 1

export default {
  name: 'ContractorData',
  auth: 'auth',
  components: {
    VueQrcode,
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    TimeAgo: () => import('~/components/base/TimeAgo'),
    VCheckDialog: () => import('@/components/base/VCheckDialog'),
    EmptyState: () => import('~/components/base/EmptyState'),
  },
  data: (vm) => ({
    perm: new Permission(),
    permissions: [],
    form: new Contractor(),
    form_manual: false,
    contract: new Contract(vm.$route.params.id),
    document_type: new DocumentType(),
    document_types: [],
    contract_type: new ContractType(),
    contract_types: [],
    contract_types_update: [],
    contract_types_create: [],
    user: new Contractor(),
    data: [],
    finding: false,
    requested_at: null,
    copied: false,
    qr_dialog: false,
    dialog_update: false,
    dialog_update_user: false,
    dialog: false,
    dialog_update_contract: false,
    start_date: false,
    final_date: false,
    coverage_start_date: false,
    coverage_final_date: false,
    start_suspension_date: false,
    final_suspension_date: false,
    office: new Office(),
    subdirectorates: [],
    dependencies: [],
    other_deps: [3, 10, 14, 26, 30, 36, 42, 46, 47],
    days: [
      { id: 'DOMINGO', name: 'DOMINGO' },
      { id: 'LUNES', name: 'LUNES' },
      { id: 'MARTES', name: 'MARTES' },
      { id: 'MIÉRCOLES', name: 'MIÉRCOLES' },
      { id: 'JUEVES', name: 'JUEVES' },
      { id: 'VIERNES', name: 'VIERNES' },
      { id: 'SÁBADO', name: 'SÁBADO' },
    ],
    risk: [
      { id: 1, name: 'NIVEL 1 - RIESGO MÍMINO' },
      { id: 2, name: 'NIVEL 2 - RIESGO BAJO' },
      { id: 3, name: 'NIVEL 3 - RIESGO MEDIO' },
      { id: 4, name: 'NIVEL 4 - RIESGO ALTO' },
      { id: 5, name: 'NIVEL 5 - RIESGO MÁXIMO' },
    ],
    // File
    file: {},
    file_type: new FileType(),
    arl_file: ARL,
    file_types: [],
    file_dialog: false,
    selectedContract: {},
    mimes: 'application/pdf',
    suspension: SUSPENSION,
    contract_selector: null,
    selected_secop: null,
    contracts_secop: [],
  }),
  fetch() {
    this.getUser()
    this.getDocumentTypes()
    this.contract_type
      .index()
      .then((response) => {
        this.contract_types = response.data
        this.contract_types_update = response.data.filter(type => {return type.id === ADICION || type.id === SUSPENSION || type.id === PRORROGA})
        this.contract_types_create = response.data.filter(type => {return type.id === NUEVO || type.id === CESION})
      })
      .catch((errors) => {
        this.$snackbar({ message: errors.message })
      })
    this.office
      .index()
      .then((response) => {
        this.subdirectorates = response.data
      })
      .catch((errors) => {
        this.$snackbar({ message: errors.message })
      })
    this.getFileTypes()
    this.getPermissions()
  },
  computed: {
    userData() {
      return this.data.filter((key) => {
        return !!this.user[key.value || key.field] && key.icon
      })
    },
    userContracts() {
      return this.user.contract_headers.filter((key) => !!key.icon)
    },
    availableContracts() {
      return (
        this.user &&
        this.user.contracts.filter(
          (contract) =>
            contract.days_left > 0 && contract.contract_type_id !== SUSPENSION
        )
      )
    },
  },
  watch: {
    contract_selector(val) {
      if (val && val.contract) {
        const arr = (val.contract || '').split('-')
        const { [arr.length - 2]: cto } = arr
        const year = (val.contract || '').split('-').pop()
        this.contract.contract = cto
        this.contract.contract_year = year
        this.contract.start_date = val.start_date
        this.contract.final_date = val.final_date
        this.contract.total = 0
        this.contract.duration = val.duration
      } else {
        this.contract.contract = null
        this.contract.contract_year = null
        this.contract.start_date = null
        this.contract.final_date = null
        this.contract.total = null
        this.contract.duration = null
      }
    },
    selected_secop(val) {
      if (val && val.contract) {
        const contract = (val.contract || '').split('-')
        const start = new Date(val.start_date)
        const final = new Date(val.final_date)
        this.contract.contract = contract[2] || null
        this.contract.contract_year = contract[3] || null
        this.contract.start_date = val.start_date || null
        this.contract.final_date = val.final_date || null
        this.contract.total = val.value || null
        this.contract.duration = final.getMonth() - start.getMonth() + (12 * (final.getFullYear() - start.getFullYear()))
      } else {
        this.contract.contract = null
        this.contract.contract_year = null
        this.contract.start_date = null
        this.contract.final_date = null
        this.contract.total = null
        this.contract.duration = null
      }
    },
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
    getUser() {
      this.start()
      this.form
        .show(this.$route.params.id)
        .then((response) => {
          this.user = new Contractor({
            ...response.data,
            notify: null,
          })
          this.requested_at = response.requested_at
          this.data = response.details.keys
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onNotifyAgain() {
      this.start()
      this.form
        .resendNotification(this.$route.params.id)
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onSubmit() {
      this.start()
      this.contract.setFormInstance(this.$refs.contract_form)
      this.contract
        .store()
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .then(() => this.getUser())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
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
        this.selectedContract = item
        setTimeout(() => (this.file_dialog = true), 200)
      }
      if (this.file_dialog) {
        this.selectedContract = {}
        this.file_dialog = false
        setTimeout(open, 200)
      } else {
        open()
      }
    },
    onMime(id) {
      const mimes = this.file_types.find((f) => f.id === id)
      this.mimes = mimes.mimes ? mimes.mimes : 'application/pdf'
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
        .then(() => this.getUser())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
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
              this.getUser()
            })
        }
      })
    },
    onChangeOffice(id) {
      this.dependencies = []
      if (id) {
        this.office
          .areas(id)
          .then((response) => {
            this.dependencies = response.data
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.finding = false
          })
      }
    },
    getOffice(id) {
      if (id) {
        this.office
          .areas(id)
          .then((response) => {
            this.dependencies = response.data
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.finding = false
          })
      }
    },
    onSelectUpdate(item) {
      const open = () => {
        const data = {
          ...new Contract(this.$route.params.id).data(),
          ...item,
        }
        this.contract = new Contract(this.$route.params.id, data)
        this.getOffice(item.subdirectorate_id)
        this.selectedContract = item
        setTimeout(() => (this.dialog_update = true), 200)
      }
      if (this.dialog_update) {
        this.contract = new Contract(this.$route.params.id)
        this.selectedContract = {}
        this.dialog_update = false
        setTimeout(open, 200)
      } else {
        open()
      }
    },
    onUpdateContract() {
      if (this.selectedContract.contract_id) {
        this.start()
        this.contract.setFormInstance(this.$refs.contract_form)
        this.contract
          .update(this.selectedContract.contract_id)
          .then((response) => {
            this.$snackbar({ message: response.data, color: 'success' })
          })
          .then(() => this.getUser())
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => this.stop())
      }
    },
    onChangeContract(id) {
      this.contract.start_suspension_date = null
      this.contract.final_suspension_date = null
      this.contract_selector = null
    },
    onUpdateContractor() {
      this.start()
      this.user
        .hiringUpdate(this.$route.params.id)
        .then((response) => {
          this.$snackbar({ message: response.data, color: 'success' })
        })
        .then(() => this.getUser())
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    onVerify(val) {
      if (this.user.id) {
        new Contractor({ third_party: val })
          .thirdParty(this.user.id)
          .then((response) => {
            this.$snackbar({ message: response.data, color: 'success' })
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message })
          })
          .finally(() => {
            this.getUser()
          })
      }
    },
    // Copy
    onCopy(url) {
      const container = document.querySelector('.v-dialog')
      this.$copyText(url, container).then(() => {
        this.copied = true
      })
    },
    // Loading
    start() {
      this.finding = true
    },
    stop() {
      this.finding = false
      this.dialog = false
      this.dialog_update_contract = false
      this.file_dialog = false
      this.dialog_update = false
      this.dialog_update_user = false
      this.file = {}
      this.selectedContract = {}
      this.contract_selector = null
      this.selected_secop = null
      this.contracts_secop = []
      // this.$refs.contract_form.reset()
      this.contract.contract_type_id = null
      this.form_manual = false
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
      if (permission && Array.isArray(permission)) {
        permission.push('contractors-portal-super-admin')
        const flag = this.permissions.map((perm) => {
          return permission.includes(perm.name) && perm.can
        })
        return flag.includes(true)
      }
      return false
    },
    onSECOPContractFind() {
      this.start()
      this.$snackbar({
        message: 'Buscando contratos en SECOP',
        color: 'info',
        icon: 'mdi-clipboard-text-search-outline'
      })
      const params = {
        document: this.user.document,
      }
      this.user
        .findContractByDocumentSecop({ params })
        .then((response) => {
          this.contracts_secop = response.data.map((contract) => {
            return {
              contract: contract.referencia_del_contrato,
              status: contract.estado_contrato,
              start_date: this.$moment(contract.fecha_de_firma).isValid()
                ? this.$moment(contract.fecha_de_firma).format('YYYY-MM-DD')
                : contract.fecha_de_firma,
              final_date: this.$moment(contract.fecha_de_fin_del_contrato).isValid()
                ? this.$moment(contract.fecha_de_fin_del_contrato).format('YYYY-MM-DD')
                : contract.fecha_de_fin_del_contrato,
              value: contract.valor_del_contrato,
            }
          })
        })
        .then(() => {
          this.$snackbar({ message: this.user.name + ' Tiene contratos nuevos.',
            color: 'success',
            icon: 'mdi-file-document-check-outline',
            timeout: 6000
          })
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message, icon: 'mdi-file-document-remove-outline', timeout: 6000 })
          this.form_manual = true
        })
        .finally(() => {
          this.finding = false
          this.dialog = true
        })
    },
    onManual() {
      this.form_manual = false
      this.selected_secop = true
    }
  },
}
</script>
