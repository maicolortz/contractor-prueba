import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

/**
 * La clase ContractFile adiciona y relaciona archivos como SECOP y ARL
 * a un contrato establecido al usuario.
 *
 * @property {File} file
 * @property {Number} file_type_id
 * @property {null|String|Date} coverage_start_date
 * @property {null|String|Date} coverage_final_date
 */
export class ContractFile extends Model {
  constructor(
    contractId,
    data = {
      files: null,
      file_type_id: null,
      coverage_start_date: null,
      coverage_final_date: null,
    }
  ) {
    super(Api.END_POINTS.CONTRACTS_FILES(contractId), data)
  }
}
