import { setClient } from '@/models/client'
import { Permission } from '~/models/services/portal/Permission'
export default async function ({ error, app, route }) {
  await setClient(app)
  let permissions = await app.store.getters['app/getPermissions']
  const model = new Permission()

  try {
    const response = await model.index()
    app.store.dispatch('app/setPermissions', response.data)
    permissions = response.data
  } catch (errors) {
    app.$snackbar({ message: errors.message })
    permissions = []
    app.store.dispatch('app/setPermissions', [])
  }

  const auth = () => {
    return new Promise((resolve) => {
      const authorization = route.meta[0].can ? route.meta[0].can : []
      const flag = permissions.map((perm) => {
        return authorization.includes(perm.name) && perm.can
      })
      if (!flag.includes(true)) {
        error({
          statusCode: 403,
          message: 'No tienes permisos para ver esta página.',
        })
      }
      resolve()
    })
  }

  await auth()

  /*
  model
    .index()
    .then((response) => {
      app.store.dispatch('app/setPermissions', response.data)
      permissions = response.data
    })
    .catch((errors) => {
      app.$snackbar({ message: errors.message })
      permissions = []
    })
    .finally(() => {
      const authorization = route.meta[0].can ? route.meta[0].can : []
      const flag = permissions.map((perm) => {
        return authorization.includes(perm.name) && perm.can
      })
      if (!flag.includes(true)) {
        error({
          statusCode: 403,
          message: 'No tienes permisos para ver esta página.',
        })
      }
    })
   */
}
