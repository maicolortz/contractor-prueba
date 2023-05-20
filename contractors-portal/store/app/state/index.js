const state = () => ({
  locales: ['en', 'es'],
  locale: 'es',
  darker: false,
  darkType: 'auto',
  activeColor: 'primary',
  barImage: require('@/static/sidebar/sidebar-1.jpg'),
  barColor: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
  drawer: null,
  rightDrawer: null,
  clipped: false,
  miniVariant: false,
  showSnack: false,
  rtl: false,
  snackBar: [],
  menu: [
    {
      icon: 'mdi-view-dashboard',
      title: 'Dashboard',
      to: { name: 'orfeo' },
      exact: true,
    },
    {
      icon: 'mdi-calendar',
      title: 'Calendario',
      to: { name: 'calendar' },
      exact: true,
    },
    {
      icon: 'mdi-domain',
      title: 'Radicados',
      to: { name: 'filed' },
      exact: true,
    },
  ],
  permissions: [],
})

export default state
