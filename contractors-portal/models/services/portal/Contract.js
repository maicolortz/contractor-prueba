import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Contract extends Model {
  constructor(
    userId,
    data = {
      contract: null,
      contract_year: null,
      transport: false,
      position: null,
      start_date: null,
      final_date: null,
      start_suspension_date: null,
      final_suspension_date: null,
      total: null,
      duration: null,
      day: [],
      risk: null,
      subdirectorate_id: null,
      dependency_id: null,
      other_dependency_subdirectorate: null,
      supervisor_email: null,
      contract_type_id: null,
      selected_secop: null,
      contract_selector: null
    }
  ) {
    super(Api.END_POINTS.CONTRACTS(userId), data)
  }
}
