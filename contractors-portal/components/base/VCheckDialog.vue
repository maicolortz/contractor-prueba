<template>
  <v-dialog
    v-model="model"
    v-bind="$attrs"
    max-width="300"
    @click:outside="onCancel"
  >
    <v-card>
      <v-toolbar dark :color="toolbarColor">
        <v-toolbar-title v-text="header" />
        <v-spacer />
        <v-btn icon dark @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-3">
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="error" @click="onCancel">
          {{ cancelBtn }}
        </v-btn>
        <v-btn text color="success" @click="onOk">
          {{ okBtn }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VCheckDialog',
  props: {
    toolbarColor: {
      type: String,
      default: 'error',
    },
    useTrans: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'buttons.Delete',
    },
    okBtnText: {
      type: String,
      default: 'buttons.Accept',
    },
    cancelBtnText: {
      type: String,
      default: 'buttons.Cancel',
    },
  },
  data: () => ({
    model: false,
    resolve: null,
    reject: null,
  }),
  computed: {
    header() {
      return this.useTrans ? this.$t(this.title) : this.title
    },
    okBtn() {
      return this.useTrans ? this.$t(this.okBtnText) : this.okBtnText
    },
    cancelBtn() {
      return this.useTrans ? this.$t(this.cancelBtnText) : this.cancelBtnText
    },
  },
  methods: {
    open() {
      this.model = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onClose() {
      this.reject(false)
      this.model = false
    },
    onCancel() {
      this.reject(false)
      this.model = false
    },
    onOk() {
      this.resolve(true)
      this.model = false
    },
  },
}
</script>
