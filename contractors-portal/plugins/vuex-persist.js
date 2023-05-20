import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'

localForage.config({
  name: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
  version: 1.0,
  storeName: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
  description: 'Store attributes in the browser for offline use.',
})

export default ({ store }) => {
  new VuexPersistence({
    strictMode: false,
    asyncStorage: true,
    key: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
    storage: localForage,
    modules: ['route'],
  }).plugin(store)

  new VuexPersistence({
    strictMode: false,
    asyncStorage: false,
    key: process.env.VUE_APP_INDEX_DB_NAME || 'vuetify_app',
    storage: window.localStorage,
    modules: ['app'],
  }).plugin(store)
}
