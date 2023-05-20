const api = process.env.VUE_APP_API_URL_BASE
const path = '/api/contractors-portal'
export default {
  MENU: () => `${api}${path}/menu`,
  USERS: () => `${api}${path}/users`,
  USER_CONTRACT: (payload) => `${api}${path}/user/contract/${payload}`,
  EXCEL: () => `${api}${path}/excel`,
  ROLES: () => `${api}${path}/roles`,
  ROLES_USER: (userId) => `${api}${path}/roles/${userId}/user`,
  FIND_USERS: () => `${api}${path}/find-users`,
  PERMISSIONS: () => `${api}${path}/permissions`,
  CONTRACTORS: () => `${api}${path}/contractors`,
  CONTRACTORS_COUNTER: () => `${api}${path}/counter`,
  CONTRACTORS_STATS: () => `${api}${path}/stats`,
  CONTRACTORS_SECOP_COUNTER: () => `${api}${path}/secop/counter`,
  CONTRACTORS_SECOP_STATS: () => `${api}${path}/secop/stats`,
  FIND_CONTRACTORS: () => `${api}${path}/find-contractor`,
  FIND_CONTRACTORS_SECOP: () => `${api}${path}/secop/user`,
  FIND_CONTRACT_SECOP: () => `${api}${path}/secop/contract`,
  CONTRACTS: (userId) => `${api}${path}/contractors/${userId}/contracts`,
  THIRD_PARTY: (userId) => `${api}${path}/contractors/third-party/${userId}`,
  RESEND_NOTIFICATION: (userId) =>
    `${api}${path}/resend-notification/${userId}`,
  UPDATE_BASIC_USER: (userId) => `${api}${path}/basic-data/${userId}`,
  CONTRACTS_FILES: (contractId) =>
    `${api}${path}/contracts/${contractId}/files`,
  CONTRACT_TYPES: () => `${api}${path}/contract-types`,
  FILE_TYPES: () => `${api}${path}/file-types`,
  SYSTEMS_CERTIFICATION: () => `${api}${path}/peace-and-save`,
  WAREHOUSE_CERTIFICATION: () => `${api}${path}/warehouse-peace-and-save`,
  WAREHOUSE_EXCEL: () => `${api}${path}/warehouse-peace-and-save/excel`,
  WAREHOUSE_NOTIFICATION: () =>
    `${api}${path}/warehouse-peace-and-save/notification`,
  WAREHOUSE_DATA: () => `${api}${path}/warehouse-peace-and-save/more-data`,
  WAREHOUSE_VALIDATE_CODE: (code) =>
    `${api}${path}/warehouse-peace-and-save/validate-code/${code}`,
  GENERATE_CERTIFICATION: () => `${api}${path}/generate-certificate`,
  CAREERS: (levelId) => `${api}${path}/academic-level/${levelId}/careers`,
  LEVELS: () => `${api}${path}/academic-level`,
  BANKS: () => `${api}${path}/banks`,
  ACCOUNT_TYPES: () => `${api}${path}/account-types`,
  BANKSYNC: () => `${api}${path}/banks-sync`,
  CERTIFICADO_CONTRACTUAL: () => `${api}${path}/certificado-contractual`,
  CERTIFICADO_CONTRACTUAL_TOKEN: () =>
    `${api}${path}/certificado-contractual/token`,
  CERTIFICADO_TRIBUTARIO: () => `${api}${path}/certificado-tributario`,
  CERTIFICADO_TRIBUTARIO_TOKEN: () =>
    `${api}${path}/certificado-tributario/token`,
}
