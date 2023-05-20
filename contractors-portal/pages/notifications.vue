<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <base-material-card class="mt-6" icon="mdi-bell">
          <template #toolbar>
            <v-toolbar dense flat color="transparent">
              <v-toolbar-title class="card-title font-weight-light">
                Notificaciones
              </v-toolbar-title>
              <v-spacer />
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
                  <v-list-item @click="$fetch">
                    <v-list-item-icon>
                      <v-icon>mdi-refresh</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t('buttons.Refresh') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="markAllAsRead">
                    <v-list-item-icon>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      Marcar todo como leido
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </template>
          <v-card-text>
            <v-data-iterator
              :loading="loading"
              :items="items"
              :options.sync="pagination"
              :items-per-page.sync="itemsPerPage"
              :server-items-length="total"
              item-key="name"
            >
              <template v-slot:default="{ items }">
                <v-list>
                  <v-list-item v-for="item in items" :key="item.id" ripple>
                    <v-list-item-icon>
                      <v-icon :color="item.read_at ? '' : 'success'">
                        mdi-bell
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content @click="onClickNotification(item)">
                      <template v-if="item.data">
                        <v-list-item-title v-text="item.data.title" />
                        <v-list-item-subtitle
                          class="caption"
                          v-text="item.data.subject"
                        />
                        <v-list-item-subtitle
                          class="caption"
                          v-text="item.data.user"
                        />
                        <v-list-item-subtitle
                          class="caption"
                          v-text="item.data.created_at"
                        />
                      </template>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            icon
                            small
                            color="success"
                            v-bind="attrs"
                            v-on="on"
                            @click="markAsRead(item)"
                          >
                            <v-icon small>mdi-check-all</v-icon>
                          </v-btn>
                        </template>
                        <span>Marcar como leido</span>
                      </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            icon
                            small
                            color="error"
                            v-bind="attrs"
                            v-on="on"
                            @click="onDelete(item)"
                          >
                            <v-icon small>mdi-close</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('buttons.Delete') }}</span>
                      </v-tooltip>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </template>
              <template #no-data>
                <empty-state
                  v-if="items.length === 0"
                  icon="mdi-bell-off"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  description="No tienes notificaciones"
                >
                  <v-btn color="primary" @click="$fetch">
                    <v-icon left>mdi-refresh</v-icon>
                    Recargar
                  </v-btn>
                </empty-state>
              </template>
              <template #no-results>
                <empty-state
                  v-if="items.length === 0"
                  icon="mdi-bell-off"
                  :rounded="$vuetify.breakpoint.mdAndUp"
                  description="No tienes notificaciones"
                >
                  <v-btn color="primary" @click="$fetch">
                    <v-icon left>mdi-refresh</v-icon>
                    Recargar
                  </v-btn>
                </empty-state>
              </template>
            </v-data-iterator>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { has } from 'lodash'
import FileSaver from 'file-saver'
import Base64ToBlob from '~/utils/Base64ToBlob'
import { Arrow } from '~/plugins/Arrow'
import { Notification } from '~/models/services/auth/Notification'

export default {
  name: 'Notifications',
  auth: 'auth',
  components: {
    BaseMaterialCard: () => import('~/components/base/MaterialCard'),
    EmptyState: () => import('~/components/base/EmptyState'),
  },
  data: () => ({
    arrow: new Arrow(window, window.document, 'primary'),
    loading: false,
    form: new Notification(),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  }),
  fetch() {
    this.loading = true
    const params = {
      page: this.pagination.page,
      per_page: this.itemsPerPage,
    }
    this.form.index({ params }).then((response) => {
      if (has(response, 'data.data')) {
        this.items = response.data.data
        this.total = response.data.total
      }
      this.loading = false
    })
  },
  watch: {
    'pagination.page'() {
      return this.$fetch()
    },
    itemsPerPage() {
      return this.$fetch()
    },
  },
  methods: {
    onClickNotification(item) {
      this.form
        .show(item.id)
        .then(() => this.$fetch)
        .finally(() => {
          if (item.data.url) {
            this.$router.push(this.localePath(item.data.url))
          }
          if (item.data.file) {
            FileSaver.saveAs(
              new Base64ToBlob(item.data.file.file).blob(),
              item.data.file.name
            )
            this.arrow.show(6000)
          }
        })
    },
    markAllAsRead() {
      this.form.store().finally(() => this.$fetch)
    },
    markAsRead(item) {
      this.form.show(item.id).finally(() => this.$fetch)
    },
    onDelete(item) {
      this.form.destroy(item.id).finally(() => this.$fetch)
    },
  },
}
</script>
