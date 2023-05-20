<template>
  <v-row justify="center" align-content="center" class="mx-2">
    <v-col cols="12" md="8" sm="8" class="mx-auto">
      <v-card elevation="6">
        <v-card v-if="success" elevation="6">
          <v-card-text>
            <empty-state icon="mdi-check-circle" rounded :description="message">
              <v-btn color="primary" :to="localePath({ name: 'login' })">
                Salir de Aquí
              </v-btn>
            </empty-state>
          </v-card-text>
        </v-card>
        <v-slide-y-transition v-else appear>
          <v-card>
            <v-col cols="12" class="mt-n12 mx-auto">
              <v-avatar
                color="primary lighten-2"
                class="white--text"
                size="24"
                v-text="step"
              ></v-avatar>
            </v-col>
            <v-col cols="12">
              <info-content
                info-horizontal
                :icon="currentTitle.icon"
                icon-color="primary"
                :subtitle="currentTitle.text"
                class="text-center"
              ></info-content>
            </v-col>
            <v-card-text>
              <v-banner
                v-if="errorsKeys.length > 0"
                color="error"
                class="white--text mt-n12 mx-auto"
              >
                <v-avatar slot="icon" color="white" size="40">
                  <v-icon color="error">mdi-alert</v-icon>
                </v-avatar>
                {{ errors.message }}
                <v-divider class="my-4" />
                <ul v-for="(k, i) in errorsKeys" :key="i">
                  <li v-for="(val, j) in errors.errors[k]" :key="`i-${j}`">
                    {{ val }}
                  </li>
                </ul>
                <template #actions>
                  <v-btn icon @click="errors = {}">
                    <v-icon dark>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-banner>
            </v-card-text>
            <v-window v-model="step">
              <v-window-item :value="1">
                <validation-observer
                  :ref="`user_update_step_${step}`"
                  v-slot="{ handleSubmit }"
                >
                  <form @submit.prevent="handleSubmit(onSubmit)">
                    <v-card-text>
                      <v-row class="pa-md-4 mx-lg-auto mt-n12 mx-auto">
                        <!-- Alert Warning -->
                        <v-col cols="12">
                          <info-content
                            info-horizontal
                            icon="mdi-alert"
                            icon-color="warning"
                            subtitle="Nota"
                          >
                            <p
                              class="ml-md-9 body-1 font-weight-medium"
                              v-text="'Lea atentamente la información que aquí se solicita y complete el registro.'"
                            />
                          </info-content>
                        </v-col>
                        <!-- Document Type -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="document_type_id"
                            name="tipo de documento"
                          >
                            <v-select
                              id="document_type_id"
                              v-model.number="form.document_type_id"
                              name="document_type_id"
                              item-text="combined"
                              item-value="id"
                              :clearable="!form.document_type_id"
                              :loading="finding"
                              :readonly="finding || !!form.document_type_id"
                              :error-messages="errors"
                              min="3"
                              autocomplete="off"
                              required
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
                            :rules="form.validations.input_document_required"
                            vid="document"
                            name="número de documento"
                          >
                            <v-text-field
                              id="document"
                              v-model.number="form.document"
                              name="document"
                              :loading="finding"
                              readonly
                              :error-messages="errors"
                              color="primary"
                              label="Número de Documento"
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
                            :rules="
                              form.validations.input_alpha_spaces_required
                            "
                            vid="name"
                            name="nombre"
                          >
                            <v-text-field
                              id="name"
                              v-model="form.name"
                              name="name"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Nombres"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_alpha_spaces_required.max
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
                            :rules="
                              form.validations.input_alpha_spaces_required
                            "
                            vid="surname"
                            name="apellidos"
                          >
                            <v-text-field
                              id="surname"
                              v-model="form.surname"
                              name="surname"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Apellidos"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_alpha_spaces_required.max
                              "
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-face-agent"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Birthday -->
                        <v-col cols="12" md="6" sm="12">
                          <v-dialog
                            ref="birthday_dialog"
                            v-model="birthday_dialog"
                            :return-value.sync="form.birthdate"
                            persistent
                            width="290px"
                          >
                            <template #activator="{ on }">
                              <validation-provider
                                v-slot="{ errors }"
                                :rules="form.validations.required"
                                vid="birthday"
                                name="fecha de nacimiento"
                              >
                                <v-text-field
                                  id="birthday"
                                  v-model="form.birthdate"
                                  name="birthday"
                                  :loading="finding"
                                  label="Fecha de nacimiento"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  :error-messages="errors"
                                  color="primary"
                                  clearable
                                  autocomplete="off"
                                  required="required"
                                  v-on="on"
                                ></v-text-field>
                              </validation-provider>
                            </template>
                            <v-date-picker
                              v-if="birthday_dialog"
                              ref="birthday_picker"
                              v-model="form.birthdate"
                              locale="es"
                              :max="
                                $moment($moment().subtract(1, 'day'))
                                  .subtract(min_age, 'years')
                                  .toISOString()
                              "
                              :min="
                                $moment()
                                  .subtract(max_age, 'years')
                                  .toISOString()
                              "
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="birthday_dialog = false"
                              >
                                Cancelar
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="
                                  $refs.birthday_dialog.save(form.birthdate)
                                "
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                        <!-- Birthday Country -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="birthdate_country_id"
                            name="país de nacimiento"
                          >
                            <v-select
                              id="birthdate_country_id"
                              v-model.number="form.birthdate_country_id"
                              name="birthdate_country_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="birthdate_countries"
                              prepend-icon="mdi-map"
                              menu-props="auto"
                              label="País de nacimiento"
                              @change="onChangeBirthdateCountry"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Birthday State -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="birthdate_state_id"
                            name="departamento de nacimiento"
                          >
                            <v-select
                              id="birthdate_state_id"
                              v-model.number="form.birthdate_state_id"
                              name="birthdate_state_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="birthdate_states"
                              prepend-icon="mdi-map-marker"
                              menu-props="auto"
                              label="Departamento de nacimiento"
                              @change="onChangeBirthdateState"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Birthday City -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="birthdate_city_id"
                            name="ciudad de nacimiento"
                          >
                            <v-select
                              id="birthdate_city_id"
                              v-model.number="form.birthdate_city_id"
                              :loading="finding"
                              name="birthdate_city_id"
                              :error-messages="errors"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="birthdate_cities"
                              prepend-icon="mdi-crosshairs-gps"
                              menu-props="auto"
                              label="Ciudad de nacimiento"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Sex -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="sex_id"
                            name="sexo"
                          >
                            <v-select
                              id="sex_id"
                              v-model="form.sex_id"
                              name="sex_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="genders"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-human-male-female"
                              menu-props="auto"
                              label="Sexo"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Gender Identity -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="gender"
                            name="identidad de género"
                          >
                            <v-select
                              id="gender_id"
                              v-model="form.gender_id"
                              name="gender_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="sexes"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-gender-male-female"
                              menu-props="auto"
                              label="Identidad de Género"
                            >
                              <template #append-outer>
                                <v-dialog
                                  ref="help_dialog_gender"
                                  v-model="dialog_help_gender"
                                >
                                  <template #activator="{ on }">
                                    <v-icon v-on="on">
                                      mdi-help-circle-outline
                                    </v-icon>
                                  </template>
                                  <v-card class="mx-auto" max-width="1200">
                                    <v-card-title>
                                      <span class="text-h4 font-weight-medium">Identidad de género (Como quiero ser reconocido)</span>
                                      <v-spacer />
                                      <v-icon @click="dialog_help_gender = false">
                                        mdi-close
                                      </v-icon>
                                    </v-card-title>
                                    <v-card-text>
                                      <span class="text-caption font-weight-medium">Este es un campo obligatorio, por lo tanto, si la persona no desea dar a conocer su identidad de género, podrá seleccionar la opción PREFIERO NO INFORMAR.</span>
                                    </v-card-text>
                                    <v-expansion-panels>
                                      <v-expansion-panel
                                        v-for="(item, i) in identity_genders"
                                        :key="i.id"
                                      >
                                        <v-expansion-panel-header>
                                          {{item.title}}
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                          {{item.text}}
                                        </v-expansion-panel-content>
                                      </v-expansion-panel>
                                    </v-expansion-panels>
                                  </v-card>
                                </v-dialog>
                              </template>
                            </v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Orientation Group -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="orientation_id"
                            name="Orientacion sexual"
                          >
                            <v-select
                              id="orientation_id"
                              v-model="form.orientation_id"
                              name="orientation_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="orientations"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-human-non-binary"
                              menu-props="auto"
                              label="Orientacion Sexual"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Population Group -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="population_id"
                            name="Grupo poblacional"
                          >
                            <v-select
                              id="population_id"
                              v-model="form.population_id"
                              name="population_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="populations"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-account-group"
                              menu-props="auto"
                              label="Grupo Poblacional"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Ethnic Group -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="ethnic_id"
                            name="Grupo Étnico"
                          >
                            <v-select
                              id="ethnic_id"
                              v-model="form.ethnic_id"
                              name="ethnic_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="ethnics"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-account-supervisor-circle"
                              menu-props="auto"
                              label="Grupo Étnico"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Disability -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="disability_id"
                            name="Discapacidad"
                          >
                            <v-select
                              id="disability_id"
                              v-model="form.disability_id"
                              name="disability_id"
                              clearable
                              :loading="finding"
                              :readonly="finding"
                              required="required"
                              :error-messages="errors"
                              :items="disabilities"
                              item-text="name"
                              item-value="id"
                              prepend-icon="mdi-wheelchair"
                              menu-props="auto"
                              label="Discapacidad"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- PERSON TYPE -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.text_required"
                            vid="person_type"
                            name="tipo de persona"
                          >
                            <v-select
                              id="person_type"
                              v-model.number="form.person_type"
                              name="person_type"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="name"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="person_types"
                              prepend-icon="mdi-account-tie"
                              menu-props="auto"
                              label="Tipo de persona"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- MARITAL STATUS -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.text_required"
                            vid="marital_status"
                            name="estado cívil"
                          >
                            <v-select
                              id="marital_status"
                              v-model.number="form.marital_status"
                              name="marital_status"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="name"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="marital_statuses"
                              prepend-icon="mdi-account-heart"
                              menu-props="auto"
                              label="Estado cívil"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        color="primary"
                        depressed
                        default
                        type="submit"
                      >
                        {{ $t(`buttons.Next`) }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
              <v-window-item :value="2">
                <validation-observer
                  :ref="`user_update_step_${step}`"
                  v-slot="{ handleSubmit }"
                >
                  <form @submit.prevent="handleSubmit(onSubmit)">
                    <v-card-text>
                      <v-row class="mx-md-2">
                        <!-- Email -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_email_required"
                            vid="email"
                            name="correo electrónico personal"
                          >
                            <v-text-field
                              id="email"
                              v-model="form.email"
                              name="email"
                              type="email"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Correo electrónico personal"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_email_required.max
                              "
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-email-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Institutional Email -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_email"
                            vid="institutional_email"
                            name="correo electrónico institucional"
                          >
                            <v-text-field
                              id="institutional_email"
                              v-model="form.institutional_email"
                              name="institutional_email"
                              type="email"
                              hint="Si tiene correo institucional, por favor indíquelo, de lo contrario deje el campo vacío"
                              persistent-hint
                              :loading="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Correo electrónico institucional"
                              counter
                              :maxlength="
                                form.validations.input_email_required.max
                              "
                              autocomplete="off"
                              prepend-icon="mdi-email-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Phone -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="phone"
                            name="teléfono de contácto"
                          >
                            <v-text-field
                              id="phone"
                              v-model="form.phone"
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
                        <!-- Residence Country -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="residence_country_id"
                            name="país de residencia"
                          >
                            <v-select
                              id="residence_country_id"
                              v-model.number="form.residence_country_id"
                              name="residence_country_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="residence_countries"
                              prepend-icon="mdi-map"
                              menu-props="auto"
                              label="País de residencia"
                              @change="onChangeResidenceCountry"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Residence State -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="residence_state_id"
                            name="departamento de residencia"
                          >
                            <v-select
                              id="residence_state_id"
                              v-model.number="form.residence_state_id"
                              name="residence_state_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="residence_states"
                              prepend-icon="mdi-map-marker"
                              menu-props="auto"
                              label="Departamento de residencia"
                              @change="onChangeResidenceState"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Residence City -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="residence_city_id"
                            name="ciudad de residencia"
                          >
                            <v-select
                              id="residence_city_id"
                              v-model.number="form.residence_city_id"
                              :loading="finding"
                              name="residence_city_id"
                              :error-messages="errors"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="residence_cities"
                              prepend-icon="mdi-crosshairs-gps"
                              menu-props="auto"
                              label="Ciudad de residencia"
                              @change="onChangeCity"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Location -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="locality_id"
                            name="localidad"
                          >
                            <v-select
                              id="locality_id"
                              v-model.number="form.locality_id"
                              name="locality_id"
                              :loading="finding"
                              :error-messages="errors"
                              :readonly="finding"
                              item-text="name"
                              hint="Si es fuera de Bogotá selecione la opción OTRO"
                              persistent-hint
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="locations"
                              prepend-icon="mdi-sign-real-estate"
                              menu-props="auto"
                              label="Localidad de Residencia"
                              @change="onChangeLocation"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Upz -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="upz_id"
                            name="upz"
                          >
                            <v-select
                              id="upz_id"
                              v-model.number="form.upz_id"
                              name="upz_id"
                              hint="Si es fuera de Bogotá selecione la opción OTRO"
                              :error-messages="errors"
                              persistent-hint
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="upz"
                              prepend-icon="mdi-tag"
                              menu-props="auto"
                              label="Upz de Residencia"
                              @change="onChangeUpz"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Neighborhoods -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="neighborhood_id"
                            name="barrio"
                          >
                            <v-select
                              id="neighborhood_id"
                              v-model.number="form.neighborhood_id"
                              hint="Si es fuera de Bogotá selecione la opción OTRO"
                              name="neighborhood_id"
                              :error-messages="errors"
                              persistent-hint
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="neighborhoods"
                              prepend-icon="mdi-city"
                              menu-props="auto"
                              label="Barrio de Residencia"
                              @change="onChangeNeighborhood"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Other Neighborhood -->
                        <v-col
                          v-if="form.neighborhood_id === 9999"
                          cols="12"
                          md="6"
                          sm="12"
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="{
                              required: form.neighborhood_id === 9999,
                              min: 3,
                              max: 80,
                            }"
                            vid="neighborhood"
                            name="nombre del barrio"
                          >
                            <v-text-field
                              id="neighborhood"
                              v-model="form.neighborhood"
                              name="neighborhood"
                              :readonly="
                                finding || form.neighborhood_id !== 9999
                              "
                              :loading="finding"
                              :error-messages="errors"
                              color="primary"
                              label="¿Cuál barrio?"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              :required="form.neighborhood_id === 9999"
                              prepend-icon="mdi-city"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Address -->
                        <v-col cols="12" sm="12" md="6">
                          <v-dialog
                            ref="address_dialog"
                            v-model="address_dialog"
                            persistent
                            fullscreen
                            hide-overlay
                            transition="dialog-bottom-transition"
                          >
                            <template #activator="{ on, attrs: addressMenu }">
                              <validation-provider
                                v-slot="{ errors }"
                                :rules="form.validations.input_text_required"
                                vid="address"
                                name="dirección de residencia"
                              >
                                <v-text-field
                                  id="address"
                                  v-model="form.address"
                                  name="address"
                                  :loading="finding"
                                  readonly
                                  :error-messages="errors"
                                  color="primary"
                                  label="Dirección de residencia"
                                  clearable
                                  autocomplete="off"
                                  required="required"
                                  prepend-icon="mdi-routes"
                                  :counter="120"
                                  :maxlength="120"
                                  v-bind="{ ...addressMenu }"
                                  v-on="on"
                                />
                              </validation-provider>
                            </template>
                            <v-address-field
                              v-model="form.address"
                              @close="address_dialog = false"
                              @save="address_dialog = false"
                            >
                              <v-spacer />
                              <v-btn
                                color="primary"
                                text
                                @click="address_dialog = false"
                                v-text="$t('buttons.Cancel')"
                              />
                              <v-btn
                                color="primary"
                                @click="address_dialog = false"
                              >
                                <v-icon left>mdi-content-save</v-icon>
                                {{ $t("buttons.Save") }}
                              </v-btn>
                            </v-address-field>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        text
                        @click="step--"
                      >
                        {{ $t("buttons.Back") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        color="primary"
                        depressed
                        default
                        type="submit"
                      >
                        {{ $t(`buttons.Next`) }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
              <v-window-item :value="3">
                <validation-observer
                  :ref="`user_update_step_${step}`"
                  v-slot="{ handleSubmit }"
                >
                  <form @submit.prevent="handleSubmit(onSubmit)">
                    <v-card-text>
                      <v-row class="mt-n12 mx-auto">
                        <v-col cols="12" class="py-0 my-0">
                          <info-content
                            info-horizontal
                            icon="mdi-alert"
                            icon-color="warning"
                            subtitle="Nota"
                            class="mb-0"
                          >
                            <p
                              class="ml-md-9 body-1 font-weight-medium"
                              v-text="
                                'Por favor relacione el último título académico obtenido o en proceso de obtener.'
                              "
                            />
                          </info-content>
                        </v-col>
                        <!-- Academic Level -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="academic_level_id"
                            name="nivel académico"
                          >
                            <v-select
                              id="academic_level_id"
                              v-model.number="form.academic_level_id"
                              name="academic_level_id"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="levels"
                              prepend-icon="mdi-book"
                              menu-props="auto"
                              label="Nivel Académico"
                              @change="onChangeLevel"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Careers -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="career_id"
                            name="título académico"
                          >
                            <v-autocomplete
                              id="career_id"
                              v-model.number="form.career_id"
                              name="career_id"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="careers"
                              prepend-icon="mdi-school"
                              menu-props="auto"
                              hint="Por favor escriba una palabra relacionada a su carrera para mostrar sugerencias"
                              persistent-hint
                              label="Título Académico"
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>
                        <!-- Graduated -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="graduate"
                            name="graduado"
                          >
                            <v-switch
                              id="graduate"
                              v-model="form.graduate"
                              name="graduate"
                              label="¿Es graduado?"
                              :error-messages="errors"
                              persistent-hint
                              hint="Seleccione si ya se graduó"
                              @change="form.year_approved = null"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Approved -->
                        <v-col v-if="!form.graduate" cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="year_approved"
                            name="último semestre o año aprobado"
                          >
                            <v-select
                              id="year_approved"
                              v-model.number="form.year_approved"
                              name="year_approved"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="years"
                              prepend-icon="mdi-book"
                              menu-props="auto"
                              label="Último semestre o año aprobado"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        text
                        @click="step--"
                      >
                        {{ $t("buttons.Back") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        color="primary"
                        depressed
                        default
                        type="submit"
                      >
                        {{ $t(`buttons.Next`) }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
              <v-window-item :value="4">
                <validation-observer
                  :ref="`user_update_step_${step}`"
                  v-slot="{ handleSubmit }"
                >
                  <form @submit.prevent="handleSubmit(onSubmit)">
                    <v-card-text>
                      <v-row>
                        <!-- Contract Type -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="contract_type"
                            name="tipo de trámite"
                          >
                            <v-select
                              id="contract_type"
                              v-model="form.contract_type_id"
                              name="contract_type"
                              item-text="name"
                              item-value="id"
                              :loading="finding"
                              readonly
                              :error-messages="errors"
                              min="3"
                              autocomplete="off"
                              required
                              :items="contract_types"
                              prepend-icon="mdi-clipboard-text-outline"
                              menu-props="auto"
                              label="Tipo de Trámite"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Contract -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_text_required"
                            vid="contract"
                            name="número de contraro"
                          >
                            <v-text-field
                              id="contract"
                              v-model="form.contract"
                              name="contract"
                              :loading="finding"
                              readonly
                              :error-messages="errors"
                              persistent-hint
                              color="primary"
                              label="Número de contrato"
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-pound"
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
                            <v-text-field
                              id="start_date"
                              v-model="form.start_date"
                              name="start_date"
                              :error-messages="errors"
                              color="primary"
                              label="Fecha inicio del contrato"
                              counter
                              :maxlength="191"
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-calendar"
                              readonly
                            />
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
                            <v-text-field
                              id="final_date"
                              v-model="form.final_date"
                              name="final_date"
                              :error-messages="errors"
                              color="primary"
                              label="Fecha terminación del contrato"
                              counter
                              :maxlength="191"
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-calendar"
                              readonly
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Total -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="total"
                            name="valor total del contrato o adición"
                          >
                            <v-text-field
                              id="total"
                              v-model="form.total"
                              name="total"
                              :loading="finding"
                              readonly
                              :error-messages="errors"
                              color="primary"
                              label="Valor total del contrato o adición"
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
                            :rules="form.validations.required"
                            vid="duration"
                            name="duración del contrato"
                          >
                            <v-text-field
                              id="duration"
                              v-model="form.duration_days_text"
                              name="duration"
                              :loading="finding"
                              readonly
                              :error-messages="errors"
                              color="primary"
                              label="Duración del contrato"
                              persistent-hint
                              :maxlength="4"
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-clipboard-text-clock-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Eps -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="eps_id"
                            name="eps"
                          >
                            <v-select
                              id="eps_id"
                              v-model.number="form.eps_id"
                              name="eps_id"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="health_companies"
                              prepend-icon="mdi-hospital"
                              menu-props="auto"
                              label="EPS"
                              @change="form.eps = null"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Other Eps -->
                        <v-col
                          v-if="form.eps_id === 62"
                          cols="12"
                          md="6"
                          sm="12"
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="{
                              required: form.eps_id === 62,
                              min: 3,
                              max: 80,
                            }"
                            vid="eps"
                            name="otra eps"
                          >
                            <v-text-field
                              id="eps"
                              v-model="form.eps"
                              name="eps"
                              :loading="finding"
                              :readonly="finding || form.eps_id !== 62"
                              :error-messages="errors"
                              color="primary"
                              label="¿Cuál EPS?"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              :required="form.eps_id === 62"
                              prepend-icon="mdi-hospital"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Afp -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="afp_id"
                            name="fondo de pensiones"
                          >
                            <v-select
                              id="afp_id"
                              v-model.number="form.afp_id"
                              name="afp_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="afp_companies"
                              prepend-icon="mdi-piggy-bank-outline"
                              menu-props="auto"
                              label="Fondo de pensiones"
                              @change="form.afp = null"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Other Afp -->
                        <v-col
                          v-if="form.afp_id === 10"
                          cols="12"
                          md="6"
                          sm="12"
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="{
                              required: form.afp_id === 10,
                              min: 3,
                              max: 80,
                            }"
                            vid="afp"
                            name="otro fondo de pensiones"
                          >
                            <v-text-field
                              id="afp"
                              v-model="form.afp"
                              name="afp"
                              :loading="finding"
                              :readonly="finding || form.afp_id !== 10"
                              :error-messages="errors"
                              color="primary"
                              label="¿Cuál fondo de pensiones?"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              :required="form.afp_id === 10"
                              prepend-icon="mdi-piggy-bank-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Office -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="subdirectorate_id"
                            name="subdirección"
                          >
                            <v-select
                              id="subdirectorate_id"
                              v-model.number="form.subdirectorate_id"
                              name="subdirectorate_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
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
                            :rules="form.validations.required"
                            vid="dependency_id"
                            name="dependencia"
                          >
                            <v-select
                              id="dependency_id"
                              v-model.number="form.dependency_id"
                              name="dependency_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="dependencies"
                              prepend-icon="mdi-layers"
                              menu-props="auto"
                              label="Dependencia"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Other Area -->
                        <v-col
                          v-if="other_deps.includes(form.dependency_id)"
                          cols="12"
                          md="6"
                          sm="12"
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="{
                              required: other_deps.includes(form.dependency_id),
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
                                finding ||
                                !other_deps.includes(form.dependency_id)
                              "
                              :error-messages="errors"
                              color="primary"
                              label="¿Cuál área o subdirección?"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              :required="
                                other_deps.includes(form.dependency_id)
                              "
                              prepend-icon="mdi-clipboard"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Position -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_text_required"
                            vid="position"
                            name="Actividad a desempeñar"
                          >
                            <v-text-field
                              id="position"
                              v-model="form.position"
                              name="position"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              hint="Ej: auxiliar, técnico, recreador, abogado, ingeniería (especifique cuál), asesor, etc."
                              persistent-hint
                              label="Actividad a Desempeñar"
                              clearable
                              counter
                              :maxlength="
                                form.validations.input_text_required.max
                              "
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-book-account-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Risk -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="risk"
                            name="nivel de riesgo"
                          >
                            <v-select
                              id="risk"
                              v-model="form.risk"
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
                              required="required"
                              :items="risk"
                              prepend-icon="mdi-alert-outline"
                              menu-props="auto"
                              label="Nivel de Riesgo"
                            >
                              <template #append-outer>
                                <v-dialog
                                  ref="help_dialog"
                                  v-model="dialog_help"
                                >
                                  <template #activator="{ on }">
                                    <v-icon v-on="on">
                                      mdi-help-circle-outline
                                    </v-icon>
                                  </template>
                                  <v-card flat>
                                    <v-card-title>
                                      Tipos de Riesgos
                                      <v-spacer />
                                      <v-icon @click="dialog_help = false">
                                        mdi-close
                                      </v-icon>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-simple-table>
                                        <thead>
                                        <tr>
                                          <th width="70%">Actividad</th>
                                          <th>Nivel de Riesgo</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                          <td>{{ risk_text[1] }}</td>
                                          <td>Nivel I</td>
                                        </tr>
                                        <tr>
                                          <td>{{ risk_text[2] }}</td>
                                          <td>Nivel II</td>
                                        </tr>
                                        <tr>
                                          <td>{{ risk_text[3] }}</td>
                                          <td>Nivel III</td>
                                        </tr>
                                        <tr>
                                          <td>{{ risk_text[4] }}</td>
                                          <td>Nivel V</td>
                                        </tr>
                                        </tbody>
                                      </v-simple-table>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                              </template>
                            </v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Supervisor Email -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_email"
                            vid="supervisor_email"
                            name="correo electrónico institucional del supervisor"
                          >
                            <v-text-field
                              id="supervisor_email"
                              v-model="form.supervisor_email"
                              name="supervisor_email"
                              type="email"
                              :loading="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Correo electrónico insitucional del supervisor"
                              hint="Si no conoce el correo, deje el campo vacío."
                              persistent-hint
                              counter
                              :maxlength="form.validations.input_email.max"
                              autocomplete="off"
                              prepend-icon="mdi-email-outline"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Day -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="day"
                            name="día que no trabaja"
                          >
                            <v-select
                              id="day"
                              v-model="form.day"
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
                              required="required"
                              :items="days"
                              prepend-icon="mdi-calendar"
                              menu-props="auto"
                              label="Día que no trabaja"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Transport -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="transport"
                            name="se suminitra transporte"
                          >
                            <v-switch
                              id="transport"
                              v-model="form.transport"
                              name="transport"
                              label="¿Se suministra transporte?"
                              :error-messages="errors"
                              persistent-hint
                              hint="Seleccione si se suministra transporte"
                            />
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        text
                        @click="step--"
                      >
                        {{ $t("buttons.Back") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        color="primary"
                        depressed
                        default
                        type="submit"
                      >
                        {{ $t(`buttons.Next`) }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
              <v-window-item :value="5">
                <validation-observer
                  :ref="`user_update_step_${step}`"
                  v-slot="{ handleSubmit }"
                >
                  <form @submit.prevent="handleSubmit(onSubmit)">
                    <v-card-text>
                      <v-row class="mx-md-2">
                        <!-- Bank -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="bank_id"
                            name="nombre del banco"
                          >
                            <v-select
                              id="bank_id"
                              v-model.number="form.bank_id"
                              name="bank_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="banks"
                              prepend-icon="mdi-bank"
                              menu-props="auto"
                              label="Nombre del banco"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Account Type -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.required"
                            vid="account_type_id"
                            name="Tipo de cuenta"
                          >
                            <v-select
                              id="account_type_id"
                              v-model.number="form.account_type_id"
                              name="account_type_id"
                              :error-messages="errors"
                              :loading="finding"
                              :readonly="finding"
                              item-text="name"
                              item-value="id"
                              autocomplete="off"
                              clearable
                              required="required"
                              :items="account_types"
                              prepend-icon="mdi-piggy-bank"
                              menu-props="auto"
                              label="Tipo de cuenta"
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <!-- Number -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_required"
                            vid="number"
                            name="número de cuenta"
                          >
                            <v-text-field
                              id="number"
                              v-model="form.number"
                              name="number"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Número de cuenta"
                              clearable
                              counter
                              :maxlength="20"
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-numeric"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Number Bank Confirmation -->
                        <v-col cols="12" md="6" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.input_number_bank_confirmation('number')"
                            vid="number_confirmation"
                            name="confirmar número de cuenta"
                          >
                            <v-text-field
                              id="number_confirmation"
                              v-model="number_confirmation"
                              name="number_confirmation"
                              :loading="finding"
                              :readonly="finding"
                              :error-messages="errors"
                              color="primary"
                              label="Confirmar número de cuenta"
                              clearable
                              counter
                              :maxlength="20"
                              autocomplete="off"
                              required="required"
                              prepend-icon="mdi-numeric"
                            />
                          </validation-provider>
                        </v-col>
                        <!-- Rut file -->
                        <v-col cols="6" md="6" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.pdf_file_required"
                            vid="rut"
                            name="rut"
                          >
                            <v-file-input
                              id="rut"
                              v-model="form.rut"
                              :disabled="finding"
                              :error-messages="errors"
                              :loading="finding"
                              name="rut"
                              clearable
                              autocomplete="off"
                              prepend-icon="mdi-file"
                              hint="Adjunta el certificado del RUT en formato PDF"
                              persistent-hint
                              label="Adjuntar Archivo Rut"
                              accept="application/pdf"
                            >
                            </v-file-input>
                          </validation-provider>
                        </v-col>
                        <!-- Bank file -->
                        <v-col cols="6" md="6" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="form.validations.pdf_file_required"
                            vid="bank"
                            name="certificación bancaria"
                          >
                            <v-file-input
                              id="bank"
                              v-model="form.bank"
                              :disabled="finding"
                              :error-messages="errors"
                              :loading="finding"
                              name="bank"
                              clearable
                              autocomplete="off"
                              prepend-icon="mdi-file"
                              hint="Adjunta la certificación bancaria en formato PDF"
                              persistent-hint
                              label="Adjuntar Certificado Bancario"
                              accept="application/pdf"
                            >
                            </v-file-input>
                          </validation-provider>
                        </v-col>
                        <!-- Consent -->
                        <v-col cols="12" md="12" sm="12">
                          <v-dialog
                            v-model="dialog"
                            scrollable
                            max-width="600px"
                          >
                            <template #activator="{ on, attrs }">
                              <v-btn
                                text
                                block
                                color="primary"
                                v-bind="attrs"
                                v-on="on"
                              >
                                {{
                                  $vuetify.breakpoint.smAndDown
                                    ? consent.mini
                                    : consent.text
                                }}
                              </v-btn>
                            </template>
                            <v-card flat>
                              <v-card-title>
                                {{ consent.title }}
                              </v-card-title>
                              <v-divider></v-divider>
                              <v-card-text style="height: 600px">
                                <p
                                  v-for="(p, key) in consent.paragraphs"
                                  :key="`${key}-paragraph`"
                                  class="font-weight-medium"
                                >
                                  {{ p }}
                                </p>
                              </v-card-text>
                              <v-card-actions>
                                <v-switch
                                  v-model="accept"
                                  label="Acepto los términos y condiciones"
                                >
                                </v-switch>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="primary"
                                  default
                                  @click="dialog = false"
                                >
                                  Cerrar
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        :disabled="overlay"
                        :loading="overlay"
                        text
                        @click="step--"
                      >
                        {{ $t("buttons.Back") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="!accept || overlay"
                        :loading="overlay"
                        color="primary"
                        depressed
                        default
                        type="submit"
                      >
                        {{ $t(`buttons.Send`) }}
                      </v-btn>
                    </v-card-actions>
                  </form>
                </validation-observer>
              </v-window-item>
            </v-window>
          </v-card>
        </v-slide-y-transition>
      </v-card>
    </v-col>
  </v-row>
</template>

<router lang="yaml">
meta:
title: Contractor
</router>

<script>
import _ from "lodash";
import { Contractor } from "~/models/services/portal/Contractor";
import { ContractType } from "~/models/services/portal/ContractType";
import { DocumentType } from "~/models/services/portal/DocumentType";
import { Eps } from "~/models/services/portal/Eps";
import { Sex } from "~/models/services/portal/Sex";
import { Orientation } from "~/models/services/portal/Orientation";
import { Population } from "~/models/services/portal/Population";
import { Ethnic } from "~/models/services/portal/Ethnic";
import { Disability } from "~/models/services/portal/Disability";
import { Afp } from "~/models/services/portal/Afp";
import { Country } from "~/models/services/portal/Country";
import { Location } from "~/models/services/portal/Location";
import { Office } from "~/models/services/portal/Office";
import { Career } from "~/models/services/portal/Career";
import { AcademicLevel } from "~/models/services/portal/AcademicLevel";
import { Bank } from "~/models/services/portal/Bank";
import { AccountType } from "~/models/services/portal/AccountType";
import { Gender } from "~/models/services/portal/Gender";

const COLOMBIA = 47;

export default {
  name: "Contracts",
  components: {
    InfoContent: () => import("~/components/base/InfoContent"),
    VAddressField: () => import("~/components/base/VAddressField"),
    EmptyState: () => import("@/components/base/EmptyState")
  },
  layout: "password",
  data: () => ({
    step: 1,
    overlay: false,
    dialog: false,
    dialog_help: false,
    dialog_help_gender: false,
    accept: false,
    success: true,
    message: "Consultando...",
    form: new Contractor(),
    min_age: 18,
    max_age: 100,
    address_dialog: false,
    birthday_dialog: false,
    sex: new Sex(),
    sexes: [],
    gender: new Gender(),
    genders: [],
    orientation: new Orientation(),
    orientations: [],
    population: new Population(),
    populations: [],
    ethnic: new Ethnic(),
    ethnics: [],
    disability: new Disability(),
    disabilities: [],
    bank: new Bank(),
    banks: [],
    account_type: new AccountType(),
    account_types: [],
    location: new Location(),
    locations: [],
    upz: [],
    neighborhoods: [],
    risk_text: {
      1: "Actividades Administrativas",
      2: "Actividades de almacenamiento, cargue y descargue de material y personal del Área de Archivo y Correspondencia",
      3: "Actividades de conducción, personal de parques y escenarios, acompañamiento de eventos deportivos y recreativos, personal de TEC, Recreovía, Escuelas de mi Barrio, Promoción de Servicios, Profesores y Deportistas.",
      4: "Actividades de Interventoría en obra permanente, actividades que requieran trabajo en alturas y personal de Ciclovía."
    },
    days: [
      { id: "DOMINGO", name: "DOMINGO" },
      { id: "LUNES", name: "LUNES" },
      { id: "MARTES", name: "MARTES" },
      { id: "MIÉRCOLES", name: "MIÉRCOLES" },
      { id: "JUEVES", name: "JUEVES" },
      { id: "VIERNES", name: "VIERNES" },
      { id: "SÁBADO", name: "SÁBADO" }
    ],
    risk: [
      { id: 1, name: "NIVEL 1 - RIESGO MÍMINO" },
      { id: 2, name: "NIVEL 2 - RIESGO BAJO" },
      { id: 3, name: "NIVEL 3 - RIESGO MEDIO" },
      { id: 4, name: "NIVEL 4 - RIESGO ALTO" },
      { id: 5, name: "NIVEL 5 - RIESGO MÁXIMO" }
    ],
    identity_genders: [
      { id: 1, title: "1. Cisgénero", text: "Cuando la expectativa social del género de las personas se alinea con el sexo asignado al nacer. En consecuencia, existen mujeres y hombres cis." },
      { id: 2, title: "2. Trans femenino", text: "Persona a la que se le ha asignado sexo masculino al nacer, pero percibe su identidad de género como femenina." },
      { id: 3, title: "3. Trans masculino", text: "Persona a la que se le ha asignado sexo femenino al nacer, pero percibe su identidad de género como masculino." },
      { id: 4, title: "4. Otro", text: "Una identidad de género diferente a las mostradas en la lista." }
    ],
    years: [
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
      { id: 6, name: 6 },
      { id: 7, name: 7 },
      { id: 8, name: 8 },
      { id: 9, name: 9 },
      { id: 10, name: 10 },
      { id: 11, name: 11 },
      { id: 12, name: 12 },
      { id: 13, name: 13 }
    ],
    person_types: [
      { id: 1, name: "PERSONA NATURAL" },
    ],
    marital_statuses: [
      { id: 1, name: "SOLTERO/A" },
      { id: 2, name: "CASADO/A" },
      { id: 3, name: "UNION LIBRE" },
      { id: 4, name: "SEPARADO/A" },
      { id: 5, name: "DIVORCIADO/A" },
      { id: 6, name: "VIUDO/A" }
    ],
    health_company: new Eps(),
    health_companies: [],
    afp: new Afp(),
    afp_companies: [],
    country: new Country(),
    residence_countries: [],
    residence_states: [],
    residence_cities: [],
    birthdate_countries: [],
    birthdate_states: [],
    birthdate_cities: [],
    office: new Office(),
    subdirectorates: [],
    dependencies: [],
    other_deps: [3, 10, 14, 26, 30, 36, 42, 46, 47],
    document_type: new DocumentType(),
    document_types: [],
    contract_type: new ContractType(),
    contract_types: [],
    finding: false,
    start_date: false,
    final_date: false,
    number_confirmation: null,
    consent: {
      title: "CONSENTIMIENTO INFORMADO",
      text: "Aceptar términos y condiciones",
      mini: "Aceptar T&C",
      paragraphs: [
        "Mediante el diligenciamiento de este formulario, autorizo al Instituto Distrital de Recreación y Deporte – IDRD, así como a cualquier dependencia aliada o filial del Instituto, a realizar el tratamiento sobre mis datos personales, conforme a la ley 1581 de 2012, con la finalidad de ser utilizados para realizar registros de participación en los diferentes eventos, convocatorias y estadísticas.",
        "Por último, autorizo al Instituto Distrital de Recreación y Deporte – IDRD a iniciar las acciones que consideren pertinentes, en caso de que por mi participación genere un hecho que pueda afectar los intereses de la entidad. Igualmente, autorizo al IDRD para que haga uso de las fotografías, películas, videos, grabaciones y cualquier otro medio de registro de este programa para su uso legítimo y legal sin reclamación o compensación económica, material, inmaterial o financiera alguna en el desarrollo de las actividades recreativas, tanto en formato papel (impreso) como digital, teniendo en cuenta la normatividad vigente Colombiana aplicable para tales fines, en especial aquella que proteja los derechos a la intimidad, buen nombre y protección de datos de carácter personal."
      ]
    },
    errors: {},
    careers: [],
    levels: []
  }),
  fetch() {
    this.getContractor();
  },
  head: (vm) => ({
    title: vm.$t("titles.Contractor")
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return {
            'text': 'DATOS PERSONALES',
            'icon': 'mdi-badge-account-horizontal'
          }
        case 2:
          return {
            'text': 'DATOS DE CONTACTO',
            'icon': 'mdi-card-account-mail'
          }
        case 3:
          return {
            'text': 'INFORMACIÓN ACADÉMICA',
            'icon': 'mdi-account-school'
          }
        case 4:
          return {
            'text': 'DATOS DE CONTRATO',
            'icon': 'mdi-file-sign'
          }
        case 5:
          return {
            'text': 'DATOS FINANCIEROS Y CERTIFICADOS',
            'icon': 'mdi-bank-plus'
          }
        default:
          return {
            'text': 'DATOS PERSONALES',
            'icon': 'mdi-badge-account-horizontal'
          }
      }
    },
    numberBankConfirmationRules() {
      return [
        () => (this.form.number === this.number_confirm) || 'El número de cuenta coincide.',
        v => !!v || 'La confirmación del número de cuenta es requqerida.'
      ];
    },
    errorsKeys() {
      return _.has(this.errors, "errors") ? Object.keys(this.errors.errors) : [];
    }
  },
  watch: {
    birthday_dialog(val) {
      val &&
      setTimeout(() => (this.$refs.birthday_picker.activePicker = "YEAR"));
    },
    start_date(val) {
      val &&
      setTimeout(() => (this.$refs.start_date_picker.activePicker = "YEAR"));
    },
    final_date(val) {
      val &&
      setTimeout(() => (this.$refs.final_date_picker.activePicker = "YEAR"));
    }
  },
  methods: {
    getContractor() {
      this.form
        .user(this.$route.query.payload)
        .then((response) => {
          this.form = new Contractor(response.data);
          this.success = false;
        })
        .then(async () => {
          const request = [
            await this.document_type.index(),
            await this.contract_type.index(),
            await this.health_company.index(),
            await this.country.index(),
            await this.office.index(),
            await this.afp.index(),
            await this.sex.index(),
            await this.gender.index(),
            await this.orientation.index(),
            await this.population.index(),
            await this.ethnic.index(),
            await this.disability.index(),
            await this.bank.index(),
            await this.account_type.index()
          ];
          const [
            documentType,
            contractType,
            healthCompany,
            country,
            office,
            afp,
            gender,
            sex,
            orientation,
            population,
            ethnic,
            disability,
            bank,
            accountType
          ] = await Promise.all(request);

          if (!this.form.birthdate_country_id) {
            this.form.birthdate_country_id = COLOMBIA;
            this.onChangeBirthdateCountry(COLOMBIA);
          }

          if (!this.form.residence_country_id) {
            this.form.residence_country_id = COLOMBIA;
            this.onChangeResidenceCountry(COLOMBIA);
          }
          this.document_types = documentType.data;
          this.contract_types = contractType.data;
          this.health_companies = healthCompany.data;
          this.afp_companies = afp.data;
          this.residence_countries = country.data;
          this.birthdate_countries = country.data;
          this.subdirectorates = office.data;
          this.sexes = sex.data;
          this.genders = gender.data;
          this.orientations = orientation.data;
          this.populations = population.data;
          this.ethnics = ethnic.data;
          this.disabilities = disability.data;
          this.banks = bank.data;
          this.account_types = accountType.data;
          this.getBirthdateCountry(this.form.birthdate_country_id);
          this.getBirthdateState(this.form.birthdate_state_id);
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message });
          this.success = true;
          this.message = errors.message;
        });
    },
    getResidenceData() {
      this.getResidenceCountry(this.form.residence_country_id);
      this.getResidenceState(this.form.residence_state_id);
      this.getCity(this.form.residence_city_id);
      this.getLocation(this.form.locality_id);
      this.getUpz(this.form.upz_id);
      this.getNeighborhood(this.form.neighborhood_id);
      this.getOffice(this.form.subdirectorate_id);
    },
    onSubmit() {
      this.form.setFormInstance(this.$refs[`user_update_step_${this.step}`]);
      this.step++;
      if (this.step === 2) {
        this.getResidenceData();
      }
      if (this.step === 3) {
        new AcademicLevel()
          .index()
          .then((response) => {
            this.levels = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.onChangeLevel(this.form.academic_level_id);
          });
      }
      if (this.step > 5) {
        this.finding = true;
        this.form
          .updateWithFiles(this.$route.query.payload)
          .then((response) => {
            this.$snackbar({ message: response.data, color: "success" });
            this.success = true;
            this.message = response.data;
          })
          .catch((errors) => {
            this.step = 1;
            this.errors = errors;
            if (_.has(errors, "errors")) {
              Array.from(5).forEach((v, i) => {
                if (_.has(this.$refs, `user_update_step_${i}`)) {
                  this.$refs[`user_update_step_${i}`].setErrors(errors.errors);
                }
              });
            }
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    getDocumentTypes() {
      this.start();
      this.document_type
        .index()
        .then((response) => {
          this.document_types = response.data;
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message });
        })
        .finally(() => this.stop());
    },
    getContractTypes() {
      this.start();
      this.contract_type
        .index()
        .then((response) => {
          this.contract_types = response.data;
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message });
        })
        .finally(() => this.stop());
    },
    getBirthdateCountry(id) {
      if (id) {
        this.finding = true;
        this.country
          .states(id)
          .then((response) => {
            this.birthdate_states = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    getBirthdateState(id) {
      if (id) {
        this.finding = true;
        this.country
          .cities(this.form.birthdate_country_id, id)
          .then((response) => {
            this.birthdate_cities = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    getResidenceCountry(id) {
      if (id) {
        this.finding = true;
        this.country
          .states(id)
          .then((response) => {
            this.residence_states = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    getResidenceState(id) {
      if (id) {
        this.finding = true;
        this.country
          .cities(this.form.residence_country_id, id)
          .then((response) => {
            this.residence_cities = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    getCity(id) {
      if (id === 12688) {
        this.finding = true;
        this.location
          .index()
          .then((response) => {
            this.locations = response.data;
            this.locations.push({
              id: 9999,
              name: "OTRO"
            });
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      } else if (id) {
        this.locations.push({
          id: 9999,
          name: "OTRO"
        });
      }
    },
    getLocation(id) {
      if (id) {
        if (id === 9999) {
          this.upz.push({
            id: 9999,
            name: "OTRO"
          });
        } else {
          this.finding = true;
          this.location
            .upz(id)
            .then((response) => {
              this.upz = response.data;
              this.upz.push({
                id: 9999,
                name: "OTRO"
              });
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message });
            })
            .finally(() => {
              this.finding = false;
            });
        }
      }
    },
    getUpz(id) {
      if (id) {
        if (id === 9999) {
          this.neighborhoods.push({
            id: 9999,
            name: "OTRO"
          });
        } else {
          this.finding = true;
          this.location
            .neighborhood(this.form.locality_id, id)
            .then((response) => {
              this.neighborhoods = response.data;
              this.neighborhoods.push({
                id: 9999,
                name: "OTRO"
              });
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message });
            })
            .finally(() => {
              this.finding = false;
            });
        }
      }
    },
    getNeighborhood(id) {
      if (id !== 9999) {
        this.form.neighborhood = null;
      }
    },
    getOffice(id) {
      if (id) {
        this.office
          .areas(id)
          .then((response) => {
            this.dependencies = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    // Changes
    onChangeBirthdateCountry(id) {
      this.birthdate_states = [];
      this.birthdate_cities = [];
      this.form.birthdate_state_id = null;
      this.form.birthdate_city_id = null;
      if (id) {
        this.finding = true;
        this.country
          .states(id)
          .then((response) => {
            this.birthdate_states = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    onChangeBirthdateState(id) {
      this.birthdate_cities = [];
      this.form.birthdate_city_id = null;
      if (id) {
        this.finding = true;
        this.country
          .cities(this.form.birthdate_country_id, id)
          .then((response) => {
            this.birthdate_cities = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    onChangeResidenceCountry(id) {
      this.residence_states = [];
      this.residence_cities = [];
      this.locations = [];
      this.upz = [];
      this.neighborhoods = [];
      this.form.residence_state_id = null;
      this.form.residence_city_id = null;
      this.form.locality_id = null;
      this.form.upz_id = null;
      this.form.neighborhood_id = null;
      this.form.neighborhood = null;
      if (id) {
        this.finding = true;
        this.country
          .states(id)
          .then((response) => {
            if (this.form.birthdate_country_id === id) {
              this.birthdate_states = response.data;
            }
            this.residence_states = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    onChangeResidenceState(id) {
      this.residence_cities = [];
      this.locations = [];
      this.upz = [];
      this.neighborhoods = [];
      this.form.residence_city_id = null;
      this.form.locality_id = null;
      this.form.upz_id = null;
      this.form.neighborhood_id = null;
      this.form.neighborhood = null;
      if (id) {
        this.finding = true;
        this.country
          .cities(this.form.residence_country_id, id)
          .then((response) => {
            this.residence_cities = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    onChangeCity(id) {
      this.locations = [];
      this.upz = [];
      this.neighborhoods = [];
      this.form.locality_id = null;
      this.form.upz_id = null;
      this.form.neighborhood_id = null;
      this.form.neighborhood = null;
      if (id === 12688) {
        this.finding = true;
        this.location
          .index()
          .then((response) => {
            this.locations = response.data;
            this.locations.push({
              id: 9999,
              name: "OTRO"
            });
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      } else if (id) {
        this.locations.push({
          id: 9999,
          name: "OTRO"
        });
      }
    },
    onChangeLocation(id) {
      this.neighborhoods = [];
      this.upz = [];
      this.form.upz_id = null;
      this.form.neighborhood_id = null;
      this.form.neighborhood = null;
      if (id) {
        if (id === 9999) {
          this.upz.push({
            id: 9999,
            name: "OTRO"
          });
        } else {
          this.finding = true;
          this.location
            .upz(id)
            .then((response) => {
              this.upz = response.data;
              this.upz.push({
                id: 9999,
                name: "OTRO"
              });
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message });
            })
            .finally(() => {
              this.finding = false;
            });
        }
      }
    },
    onChangeUpz(id) {
      this.neighborhoods = [];
      this.form.neighborhood_id = null;
      this.form.neighborhood = null;
      if (id) {
        if (id === 9999) {
          this.neighborhoods.push({
            id: 9999,
            name: "OTRO"
          });
        } else {
          this.finding = true;
          this.location
            .neighborhood(this.form.locality_id, id)
            .then((response) => {
              this.neighborhoods = response.data;
              this.neighborhoods.push({
                id: 9999,
                name: "OTRO"
              });
            })
            .catch((errors) => {
              this.$snackbar({ message: errors.message });
            })
            .finally(() => {
              this.finding = false;
            });
        }
      }
    },
    onChangeNeighborhood(id) {
      if (id !== 9999) {
        this.form.neighborhood = null;
      }
    },
    onChangeOffice(id) {
      this.dependencies = [];
      if (id) {
        this.office
          .areas(id)
          .then((response) => {
            this.dependencies = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          })
          .finally(() => {
            this.finding = false;
          });
      }
    },
    onChangeLevel(id) {
      this.careers = [];
      if (id) {
        new Career(id)
          .index()
          .then((response) => {
            this.careers = response.data;
          })
          .catch((errors) => {
            this.$snackbar({ message: errors.message });
          });
      }
    },
    // Spread
    spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }
  }
};
</script>
