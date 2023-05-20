import global from '@/models/routes/global'
import portal from '@/models/routes/portal'
const api = process.env.VUE_APP_API_URL_BASE
export const Api = {
  END_POINTS: {
    NOTIFICATIONS: () => `${api}/api/notifications`,
    EXPORTS_FILES: (file) => `${api}/api/exports/${file}`,
    JOB_STATUS: () => `${api}/api/job-status`,
    FORGOT_PASSWORD: () => `${api}/password/forgot`,
    RESET_PASSWORD: () => `${api}/password/reset`,
    LOCATION: () => `${api}/api/localities`,
    UPZ: (id) => `${api}/api/localities/${id}/upz`,
    NEIGHBORHOOD: (locationId, upzId) =>
      `${api}/api/localities/${locationId}/upz/${upzId}/neighborhoods`,
    COUNTRY: () => `${api}/api/countries`,
    STATE: (id) => `${api}/api/countries/${id}/states`,
    CITY: (countryId, stateId) =>
      `${api}/api/countries/${countryId}/states/${stateId}/cities`,
    SEX: () => `${api}/api/sex`,
    GENDER: () => `${api}/api/gender-identities`,
    ORIENTATION: () => `${api}/api/sexual-orientation`,
    POPULATION: () => `${api}/api/population-groups`,
    ETHNIC: () => `${api}/api/ethnic-groups`,
    DISABILITY: () => `${api}/api/disabilities`,
    ARL: () => `${api}/api/arl`,
    EPS: () => `${api}/api/eps`,
    AFP: () => `${api}/api/afp`,
    CCF: () => `${api}/api/ccf`,
    PARAFISCAL: () => `${api}/api/parafiscal`,
    OFFICES: () => `${api}/api/offices`,
    AREAS: (id) => `${api}/api/offices/${id}/areas`,
    // Global
    ...global,
    // Portal
    ...portal,
  },
}
