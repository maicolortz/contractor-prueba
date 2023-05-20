const vuexPersistEmitter = () => {
  return (store) => {
    store.subscribe((mutation) => {
      if (mutation.type === 'RESTORE_MUTATION') {
        store._vm.$root.$emit('storageReady')
      }
    })
  }
}
export const plugins = [vuexPersistEmitter()]
