export default function ({ $auth, route, redirect, app }) {
  // If the user is not authenticated and needs reset password
  const loggedIn = app.store.state.auth
  if (!loggedIn && route.query.email && route.query.token) {
    return redirect(app.localePath('/password/reset'), route.query)
  }
  if (route.query.payload) {
    return redirect(app.localePath('/contracts'), route.query)
  }
  if (route.query.validate) {
    return redirect(app.localePath({ name: 'validate-document' }), route.query)
  }
}
