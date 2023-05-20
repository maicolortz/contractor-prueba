import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Certification extends Model {
  constructor(
    data = {
      name: null,
      surname: null,
      document: null,
      contract: null,
      token: null,
      year: null,
      virtual_file: null,
    }
  ) {
    super(Api.END_POINTS.SYSTEMS_CERTIFICATION(), data)
  }

  validate(options = {}) {
    return this.post(`${Api.END_POINTS.GENERATE_CERTIFICATION()}`, options)
  }
}
