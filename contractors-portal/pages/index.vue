<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col class="my-n8" cols="12" md="12" sm="12" lg="12">
        <info-content
          info-horizontal
          icon="mdi-clipboard-check"
          icon-color="primary"
          :subtitle="`CONTRATOS EN TRÁMITE `+ new Date().getFullYear()"
          class="text-center"
        ></info-content>
      </v-col>

      <template>
        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="warning"
            icon="mdi-calendar"
            title="EN SECOP"
            sub-title="Contratos registrados en SECOP"
            :value="counters_secop.secop"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-alert"
            sub-text="Actualizado hace 24 horas"
            sub-icon-color="warning"
          >
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCountersSecop"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Contratos en SECOP
                </v-card-title>
                <v-card-text class="caption">
                  Contratos que se encuentran registrados en la plataforma SECOP que estan vigentes y aprobados.
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="info"
            icon="mdi-file-cloud-outline"
            title="EN PORTAL"
            sub-title="Contratos registrados en Portal Contratista"
            :value="counters_secop.portal"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-home"
            sub-icon-color="success"
            :sub-text="counters_secop.portal"
          >
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCountersSecop"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Portal Contratista
                </v-card-title>
                <v-card-text class="caption">
                  Contratos registrados en el portal contratista que estan vigentes.
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            :color="getColor"
            icon="mdi-printer"
            title="SIN ARL"
            sub-title="Contratos que se encuentran sin ARL"
            :value="counters_secop.not_arl"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-alert"
            sub-icon-color="error"
            :sub-text="counters_secop.not_arl"
          >
            <v-tooltip v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl'])" top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-if="counters_secop.not_arl > 0"
                  v-bind="attrs"
                  class="mx-1"
                  color="error"
                  light
                  x-small
                  :to="localePath({
                    name: 'contractors',
                    query: {
                      doesnt_have_arl: 'true',
                    },
                  })"
                  v-on="on"
                >
                  {{ `SIN ARL: ${certified.data.certified.not_arl}` }}
                </v-btn>
                <v-btn
                  v-else
                  v-bind="attrs"
                  class="mx-1"
                  color="success"
                  light
                  x-small
                  v-on="on"
                >
                  {{ `Todo al dia` }}
                </v-btn>
              </template>
              <span>{{ $t('buttons.View') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  ARL
                </v-card-title>
                <v-card-text class="caption">
                  Contratos vigentes que no cuentan con ARL.
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="success"
            icon="mdi-clipboard-check"
            title="SIN DATOS"
            sub-title="Contratistas sin actualizar datos personales"
            :value="counters_secop.not_data"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-account-remove"
            sub-icon-color="error"
            :sub-text="counters_secop.not_data"
          >
            <v-tooltip v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl', 'contractors-portal-observer'])" top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  x-small
                  :to="localePath({
                    name: 'contractors',
                    query: {
                      doesnt_have_data: 'true',
                      last_year: 'true'
                    },
                  })"
                  v-on="on"
                >
                  {{ `SIN DATOS: ${counters_secop.not_data}` }}
                </v-btn>
              </template>
              <span>{{ $t('buttons.View') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Contratistas
                </v-card-title>
                <v-card-text class="caption">
                  Usuarios que tienen contratos vigentes, pero no han actualizado información.
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="6" md="6">
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="warning">mdi-file-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Pendientes por registrar en el portal</v-list-item-title>
                <v-list-item-title v-text="counters_secop.not_portal" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col class="my-4" cols="6" md="6">
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="success">mdi-file-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Contratos con proceso finalizado</v-list-item-title>
                <v-list-item-title v-text="getSuccessProcess" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" sm="12" md="6" lg="7" class="my-4">
          <base-material-card hover-reveal color="#edf2fb">
            <template #heading>
              <v-apexchart
                ref="dashMonth"
                type="line"
                class="black--text font-weight-light"
                :options="dashMonth.chartOptions"
                :series="dashMonth.series"
              />
            </template>
            <template #reveal-actions>
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    :loading="finding"
                    :disabled="finding"
                    class="mx-1"
                    color="info"
                    light
                    icon
                    @click="getByType"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('buttons.Refresh') }}</span>
              </v-tooltip>
            </template>
            <v-card-text>
              <h1 class="card-title font-weight-bold">TIPOS DE TRÁMITES 2023</h1>
              <v-row class="my-4" dense>
                <v-col
                  v-for="(type, i) in dashMonth.data.types"
                  :key="i"
                  cols="12"
                  md="6"
                >
                <span class="caption font-weight-bold">
                  {{ `${type.name}: ${type.contracts_count_year}` }}
                </span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="dashMonth.data.requested_at"
              />
              <v-spacer />
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    class="mx-1"
                    color="primary"
                    light
                    x-small
                    :to="localePath({
                    name: 'contractors',
                    query: {
                      last_year: 'true',
                    },
                  })"
                    v-on="on"
                  >
                    {{ new Date().getFullYear() }}
                  </v-btn>
                </template>
                <span>{{ $t('buttons.View') }}</span>
              </v-tooltip>
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Tipos de trámites mensuales
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global de los tipos de trámites, se tienen en cuenta
                    todos los contratos generados vigentes.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>

        <v-col cols="12" sm="12" md="6" lg="5" class="my-4">
          <base-material-card hover-reveal color="#edf2fb">
            <template #heading>
              <v-apexchart
                ref="subdirectories"
                type="bar"
                class="black--text font-weight-light"
                :options="subdirectories.chartOptions"
                :series="subdirectories.series"
              />
            </template>
            <template #reveal-actions>
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    :loading="finding"
                    :disabled="finding"
                    class="mx-1"
                    color="info"
                    light
                    icon
                    @click="getByType"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('buttons.Refresh') }}</span>
              </v-tooltip>
            </template>
            <v-card-text>
              <h1 class="card-title font-weight-bold">CONTRATOS POR SUBDIRECCIÓN {{new Date().getFullYear()}}</h1>
              <v-row class="my-4" dense>
                <v-col
                  v-for="(subdirectory, i) in subdirectories.data.subdirectories"
                  :key="i"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                <span class="caption font-weight-bold">
                  {{ `${subdirectory.name}: ${subdirectory.count}` }}
                </span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="subdirectories.data.requested_at"
              />
              <v-spacer />
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    class="mx-1"
                    color="primary"
                    light
                    x-small
                    :to="localePath({
                    name: 'contractors',
                    query: {
                      recreation: 'true',
                    },
                  })"
                    v-on="on"
                  >
                    {{ `Recreación` }}
                  </v-btn>
                </template>
                <span>{{ $t('buttons.View') }}</span>
              </v-tooltip>
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Contratos por subdirección
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global de la cantidad de contratos por subdirección,
                    se tienen en cuenta todos los contratos vigentes.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>

      </template>
      <v-col cols="12" md="12" sm="12" lg="12">
        <info-content
          info-horizontal
          icon="mdi-clipboard-clock"
          icon-color="primary"
          subtitle="HISTÓRICO"
          class="text-center"
        ></info-content>
      </v-col>
      <template>
        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="danger"
            icon="mdi-calendar"
            title="Sin Datos"
            :value="counters.users"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-ticket-confirmation"
            :sub-text="counters.users"
          >
            <v-tooltip v-if="userIsA(['contractors-portal-hiring', 'contractors-portal-arl'])" top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  :to="
                  localePath({
                    name: 'contractors',
                    query: {
                      doesnt_have_data: 'true',
                    },
                  })
                "
                  v-on="on"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.View') }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCounters"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Sin Datos
                </v-card-title>
                <v-card-text class="caption">
                  Contratistas pendientes de actualizar sus datos personales.
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="info"
            icon="mdi-file-cloud-outline"
            title="Secop"
            :value="counters.secop"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-ticket-confirmation"
            :sub-text="counters.secop"
          >
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCounters"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Secop
                </v-card-title>
                <v-card-text class="caption">
                  Usuarios que cuentan con pantallazo de SECOP
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="warning"
            icon="mdi-printer"
            title="ARL"
            :value="counters.arl"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-ticket-confirmation"
            :sub-text="counters.arl"
          >
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCounters"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  ARL
                </v-card-title>
                <v-card-text class="caption">
                  Usuarios que cuentan con ARL
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col class="my-4" cols="12" sm="6" lg="3">
          <base-material-stats-card
            color="success"
            icon="mdi-clipboard-check"
            title="Contratistas"
            :value="counters.total"
            animated-number
            :with-formatter="false"
            :progress="finding"
            sub-icon="mdi-ticket-confirmation"
            :sub-text="counters.total"
          >
            <v-tooltip top>
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  class="mx-1"
                  color="primary"
                  light
                  icon
                  x-small
                  @click="getCounters"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buttons.Refresh') }}</span>
            </v-tooltip>
            <v-menu>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip top>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-bind="attrs"
                      class="mx-1"
                      color="primary"
                      light
                      icon
                      x-small
                      v-on="{ ...menu, ...tooltip }"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('buttons.Help') }}</span>
                </v-tooltip>
              </template>
              <v-card max-width="250">
                <v-card-title class="title">
                  <v-icon left>mdi-help-circle-outline</v-icon>
                  Contratistas
                </v-card-title>
                <v-card-text class="caption">
                  Contratistas Registrados en el sistema
                </v-card-text>
              </v-card>
            </v-menu>
          </base-material-stats-card>
        </v-col>

        <v-col cols="12" sm="12" md="6" lg="8" class="my-4">
          <base-material-card hover-reveal color="#edf2fb">
            <template #heading>
              <v-apexchart
                ref="dash"
                type="line"
                class="black--text font-weight-light"
                :options="dash.chartOptions"
                :series="dash.series"
              />
            </template>
            <template #reveal-actions>
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    :loading="finding"
                    :disabled="finding"
                    class="mx-1"
                    color="info"
                    light
                    icon
                    @click="getByType"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('buttons.Refresh') }}</span>
              </v-tooltip>
            </template>
            <v-card-text>
              <h1 class="card-title font-weight-bold">TIPOS DE TRÁMITES</h1>
              <v-row class="my-4" dense>
                <v-col
                  v-for="(type, i) in dash.data.types"
                  :key="i"
                  cols="12"
                  md="6"
                >
                <span class="caption font-weight-bold">
                  {{ `${type.name}: ${type.contracts_count}` }}
                </span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="dash.data.requested_at"
              />
              <v-spacer />
              <v-tooltip top>
                <template #activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    class="mx-1"
                    color="primary"
                    light
                    x-small
                    :to="localePath({
                    name: 'contractors',
                    query: {
                      last_year: 'true',
                    },
                  })"
                    v-on="on"
                  >
                    {{ new Date().getFullYear() }}
                  </v-btn>
                </template>
                <span>{{ $t('buttons.View') }}</span>
              </v-tooltip>
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Tipos de trámites
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global de los tipos de trámites, se tienen en cuenta
                    todos los contratos generados sin importar su vigencia.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="4" class="my-4">
          <base-material-card
            color="primary"
            title="TOTAL TIPOS DE TRÁMITE"
          >
            <template>
              <v-apexchart
                type="radialBar"
                :options="types.chartOptions"
                :series="types.series"
              >
              </v-apexchart>
            </template>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="types.data.requested_at"
              />
              <v-spacer />
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Tipos de trámites
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global de los tipos de trámites, se tienen en cuenta
                    todos los contratos generados sin importar su vigencia.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="4" class="my-4">
          <base-material-card
            color="info"
            title="ESTADO DE LOS CONTRATOS"
          >
            <template>
              <v-apexchart
                type="donut"
                :options="state.chartOptions"
                :series="state.series"
              >
              </v-apexchart>
            </template>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="state.data.requested_at"
              />
              <v-spacer />
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Estado de los contratos
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global del estado de los contratos, se tienen en cuenta
                    todos los contratos generados en trámite o finalizados.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>

        <v-col cols="12" sm="6" md="6" lg="4" class="my-4">
          <base-material-card
            :color="getColor"
            title="CERTIFICADOS ARL"
          >
            <template #after-heading>
              <v-apexchart
                type="donut"
                :options="certified.chartOptions"
                :series="certified.series"
              >
              </v-apexchart>
            </template>
            <v-divider></v-divider>
            <v-card-actions>
              <v-time-ago
                :loading="finding"
                :prefix="$t('buttons.Updated')"
                classes="caption grey--text font-weight-light hidden-sm-and-down"
                :date-time="certified.data.requested_at"
              />
              <v-spacer />
              <v-menu>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip top>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        class="mx-1"
                        color="primary"
                        light
                        icon
                        x-small
                        v-on="{ ...menu, ...tooltip }"
                      >
                        <v-icon>mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('buttons.Help') }}</span>
                  </v-tooltip>
                </template>
                <v-card max-width="250">
                  <v-card-title class="title">
                    <v-icon left>mdi-help-circle-outline</v-icon>
                    Certificados ARL
                  </v-card-title>
                  <v-card-text class="caption">
                    Sumatoria global de los tipos de trámites, se tienen en cuenta todos los contratos generados sin importar su vigencia y que cuentan o no con certificado ARL.
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-actions>
          </base-material-card>
        </v-col>
      </template>

    </v-row>
  </v-container>
</template>

<script>
import { Contractor } from '~/models/services/portal/Contractor'
import { Permission } from "~/models/services/portal/Permission";

export default {
  name: 'Dashboard',
  auth: 'auth',
  components: {
    InfoContent: () => import("~/components/base/InfoContent"),
    BaseMaterialStatsCard: () => import('@/components/base/MaterialStatsCard'),
    BaseMaterialCard: () => import('@/components/base/MaterialCard'),
    VTimeAgo: () => import('@/components/base/TimeAgo'),
  },
  data: (vm) => ({
    form: new Contractor(),
    finding: false,
    perm: new Permission(),
    permissions: [],
    user: new Contractor(),
    data: [],
    counters: {
      total: 0,
      secop: 0,
      arl: 0,
      users: 0,
      active: 0,
      inactive: 0,
      certified: {
        arl: 0,
        not_arl: 0
      }
    },
    counters_secop: {
      secop: 0,
      portal: 0,
      not_portal: 0,
      not_arl: 0,
      not_data: 0
    },
    dashMonth: {
      data: {
        data: {},
      },
      series: [
        {
          name: 'Nuevos',
          data: []
        },
        {
          name: 'Adición',
          data: []
        },
        {
          name: 'Suspensión',
          data: []
        },
        {
          name: 'Prórroga',
          data: []
        },
        {
          name: 'Cesión',
          data: []
        },
      ],
      chartOptions: {
        chart: {
          type: 'line',
          zoom: {
            autoScaleYaxis: true,
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
            export: {
              svg: {
                filename: 'Tipos de trámites',
              },
              png: {
                filename: 'Tipos de trámites',
              },
              csv: {
                filename: 'Tipos de trámites',
                columnDelimiter: ',',
                headerCategory: 'NOMBRE',
                headerValue: 'TOTAL',
              },
            },
            autoSelected: 'zoom',
          },
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          width: [5, 5, 5, 5, 5],
          curve: 'straight',
          dashArray: [0, 0, 8, 0, 8]
        },
        title: {
          text: "TIPOS DE TRÁMITES MENSUALES",
          align: "center"
        },
        legend: {
          show: true,
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          },
          labels: {
            useSeriesColors: true,
            position: 'top',
            floating: true,
          },
        },
        xaxis: {
          categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        },
        tooltip: {
          enabled: true,
          shared: true,
          theme: 'light'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        }
      },
    },
    dash: {
      data: {
        data: {},
      },
      series: [
        {
          name: 'Nuevos',
          data: []
        },
        {
          name: 'Adición',
          data: []
        },
        {
          name: 'Suspensión',
          data: []
        },
        {
          name: 'Prórroga',
          data: []
        },
        {
          name: 'Cesión',
          data: []
        },
      ],
      chartOptions: {
        chart: {
          type: 'line',
          zoom: {
            enabled: false
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: true,
            export: {
              svg: {
                filename: 'Tipos de trámites',
              },
              png: {
                filename: 'Tipos de trámites',
              },
              csv: {
                filename: 'Tipos de trámites',
                columnDelimiter: ',',
                headerCategory: 'NOMBRE',
                headerValue: 'TOTAL',
              },
            },
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          width: [5, 5, 5, 5, 5],
          curve: 'straight',
          dashArray: [0, 0, 8, 0, 8]
        },
        title: {
          text: "TIPOS DE TRÁMITES ANUALES",
          align: "center"
        },
        legend: {
          show: true,
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          },
          labels: {
            useSeriesColors: true,
            position: 'top',
            floating: true,
          },
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: [],
        },
        tooltip: {
          enabled: true,
          shared: true,
          theme: 'light'
        },
        grid: {
          borderColor: '#d0cccc',
        }
      },
    },
    subdirectories: {
      data: {
        data: {},
      },
      series: [{
          name: 'Cantidad',
          data: []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          zoom: {
            enabled: false
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: true,
            export: {
              svg: {
                filename: 'Total contratos por subdirección',
              },
              png: {
                filename: 'Total contratos por subdirección',
              },
              csv: {
                filename: 'Total contratos por subdirección',
                columnDelimiter: ',',
                headerCategory: 'NOMBRE',
                headerValue: 'TOTAL',
              },
            },
          }
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            distributed: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: [],
          tickPlacement: 'on',
          labels: {
            show: false,
          },
        },
        grid: {
          borderColor: '#d0cccc',
        },
      },
    },
    types: {
      data: {
        data: {},
      },
      series: [],
      chartOptions: {
        chart: {
          type: 'radialBar',
        },
        stroke: {
          lineCap: 'round'
        },
        labels: ['Nuevo', 'Adición', 'Suspensión', 'Prórroga', 'Cesión'],
        plotOptions: {
          radialBar: {
            offsetY: 5,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '20%',
              background: 'transparent',
              position: 'front',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            },
          }
        },
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 2,
          containerMargin: {
            left: 50,
            right: 60
          },
          labels: {
            colors: [], // necessary for change text color in dark mode
            useSeriesColors: false,
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
          },
          itemMargin: {
            vertical: 0
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    },
    state: {
      data: {
        data: {},
      },
      series: [],
      chartOptions: {
        chart: {
          type: 'donut',
        },
        colors: ['#008FFB', '#39539E'],
        labels: ['EN TRÁMITE', 'FINALIZADO'],
        legend: {
          labels: {
            colors: [], // necessary for change text color in dark mode
            useSeriesColors: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  color: [],
                  fontSize: '22px',
                  fontFamily: 'Rubik',
                  offsetY: -10
                },
                value: {
                  show: true,
                  color: ['#008FFB', '#39539E'],
                  fontSize: '16px',
                  fontWeight: 700,
                  offsetY: 1,
                },
                total: {
                  show: true,
                  color: ['#008FFB', '#39539E'],
                  label: 'TOTAL',
                  fontSize: '13px',
                  fontWeight: 600,
                }
              }
            }
          }
        },
      },
    },
    certified: {
      data: {
        certified: {},
      },
      series: [{
        name: 'TOTAL',
        data: [],
      }],
      chartOptions: {
        chart: {
          type: 'donut',
        },
        colors: ['#5bb05e', '#fd5252'],
        labels: ['CON ARL', 'SIN ARL'],
        legend: {
          labels: {
            colors: [], // necessary for change text color in dark mode
            useSeriesColors: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              expandOnClick: false,
              labels: {
                show: true,
                name: {
                  show: true,
                  color: [],
                  fontSize: '22px',
                  fontFamily: 'Rubik',
                  offsetY: -10
                },
                value: {
                  show: true,
                  color: ['#008FFB', '#39539E'],
                  fontSize: '16px',
                  fontWeight: 700,
                  offsetY: 1,
                },
                total: {
                  show: true,
                  color: ['#008FFB', '#39539E'],
                  label: 'TOTAL',
                  fontSize: '13px',
                  fontWeight: 600,
                }
              }
            }
          }
        },
      },
    },
  }),
  fetch() {
    this.getCountersSecop()
    this.getCounters()
    this.getByType()
    this.getByTypeSecop()
    this.getPermissions()
  },
  head: () => ({
    title: 'Dashboard',
  }),
  computed: {
    getColor() {
      if (this.certified.data.certified.not_arl > 0 || this.counters_secop.not_arl > 0) {return 'error'}
      return 'success'
    },
    getSuccessProcess(){
      return this.counters_secop.portal - (this.counters_secop.not_data + this.counters_secop.not_arl)
    }
  },
  methods: {
    getCounters() {
      this.start()
      this.form
        .count()
        .then((response) => {
          this.counters = response.data
          this.state.series = [
            response.data.active,
            response.data.inactive
          ]
          const certified = response.data.certified
          this.certified.data = response.data
          this.certified.series = [
            certified.arl,
            certified.not_arl
          ]
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    getCountersSecop() {
      this.start()
      this.form
        .countSecop()
        .then((response) => {
          this.counters_secop = response.data
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    getByType() {
      this.start()
      this.form
        .types()
        .then((response) => {
          this.types.data = response.data
          this.types.series = [
            ...response.data.types.map((s) => parseFloat(s.contracts_count || 0))
          ]
          this.dash.data = response.data
          this.dash.series = [
            { data: response.data.dash.series.news || 0, },
            { data: response.data.dash.series.additions || 0, },
            { data: response.data.dash.series.suspensions || 0, },
            { data: response.data.dash.series.extensions || 0, },
            { data: response.data.dash.series.assignments || 0, },
          ]
          if (this.$refs.dash) {
            this.$refs.dash.updateOptions({
              xaxis: {
                ...this.dash.chartOptions.xaxis,
                categories: response.data.dash.categories
              }
            })
          } else {
            this.dash.chartOptions = {
              ...this.dash.chartOptions,
              xaxis: {
                ...this.dash.chartOptions.xaxis,
                categories: response.data.dash.categories,
              },
            }
          }
          this.subdirectories.data = response.data
          this.subdirectories.series = [
            {
              data: response.data.subdirectories.map((s) => s.count || 0),
            }
          ]
          if (this.$refs.subdirectories) {
            this.$refs.subdirectories.updateOptions({
              xaxis: {
                ...this.subdirectories.chartOptions.xaxis,
                categories: response.data.subdirectories.map((s) => s.name)
              }
            })
          } else {
            this.subdirectories.chartOptions = {
              ...this.subdirectories.chartOptions,
              xaxis: {
                ...this.subdirectories.chartOptions.xaxis,
                categories: response.data.subdirectories.map((s) => s.name)
              }
            }
          }
        })
        .catch((errors) => {
          this.$snackbar({ message: errors.message })
        })
        .finally(() => this.stop())
    },
    getByTypeSecop() {
      this.start()
      this.form
        .dashMonth()
        .then((response) => {
          this.dashMonth.data = response.data
          const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

          const contractsNews = response.data.types.find((t) => t.id === 1).contracts;
          const contractsAdditions = response.data.types.find((t) => t.id === 2).contracts;
          const contractsSuspensions = response.data.types.find((t) => t.id === 3).contracts;
          const contractsExtensions = response.data.types.find((t) => t.id === 4).contracts;
          const contractsAssignments = response.data.types.find((t) => t.id === 5).contracts;

          const resultNews = [];
          months.forEach(month => {
            const item = contractsNews.find(item => item.month === month);
            if (item) {
              resultNews.push(item);
            } else {
              resultNews.push({ month: month, count: 0 });
            }
          })
          const resultAdditions = [];
          months.forEach(month => {
            const item = contractsAdditions.find(item => item.month === month);
            if (item) {
              resultAdditions.push(item);
            } else {
              resultAdditions.push({ month: month, count: 0 });
            }
          })
          const resultSuspensions = [];
          months.forEach(month => {
            const item = contractsSuspensions.find(item => item.month === month);
            if (item) {
              resultSuspensions.push(item);
            } else {
              resultSuspensions.push({ month: month, count: 0 });
            }
          })
          const resultExtensions = [];
          months.forEach(month => {
            const item = contractsExtensions.find(item => item.month === month);
            if (item) {
              resultExtensions.push(item);
            } else {
              resultExtensions.push({ month: month, count: 0 });
            }
          })
          const resultAssignments = [];
          months.forEach(month => {
            const item = contractsAssignments.find(item => item.month === month);
            if (item) {
              resultAssignments.push(item);
            } else {
              resultAssignments.push({ month: month, count: 0 });
            }
          })

          this.dashMonth.series = [
            { data: resultNews.map((s) => s.count) || 0 },
            { data: resultAdditions.map((s) => s.count) || 0},
            { data: resultSuspensions.map((s) => s.count) || 0},
            { data: resultExtensions.map((s) => s.count) || 0},
            { data: resultAssignments.map((s) => s.count) || 0},
          ]

        })
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
      if (permission && Array.isArray(permission)) {
        permission.push('contractors-portal-super-admin')
        const flag = this.permissions.map((perm) => {
          return permission.includes(perm.name) && perm.can
        })
        return flag.includes(true)
      }
      return false
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

<style lang="scss">
#file-type {
  .ct-label.ct-vertical {
    font-size: 12px;
  }
}
#simple-bar {
  .ct-series-a .ct-bar {
    fill: #00cae3 !important;
    stroke: #00cae3 !important;
  }
}
.v-apexchart-card {
  .apexcharts-menu-item {
    color: black;
  }
  .apexcharts-toolbar {
    color: white;
  }
  .apexcharts-tooltip {
    color: black;
  }
  .apexcharts-menu-icon svg,
  .apexcharts-pan-icon svg,
  .apexcharts-zoom-icon svg,
  .apexcharts-zoomin-icon svg,
  .apexcharts-zoomout-icon svg,
  .apexcharts-reset-icon svg {
    fill: white !important;
  }
  .apexcharts-menu-icon.apexcharts-selected svg,
  .apexcharts-pan-icon.apexcharts-selected svg,
  .apexcharts-zoom-icon.apexcharts-selected svg,
  .apexcharts-zoomin-icon.apexcharts-selected svg,
  .apexcharts-zoomout-icon.apexcharts-selected svg,
  .apexcharts-reset-icon.apexcharts-selected svg {
    fill: #fff !important;
  }
  .apexcharts-tooltip-marker {
    fill: #00b0ff;
  }
}
</style>
