import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Country extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.COUNTRY(), data)
  }

  states(id, options = {}) {
    return this.get(Api.END_POINTS.STATE(id), options)
  }

  cities(countryId, stateId, options = {}) {
    return this.get(Api.END_POINTS.CITY(countryId, stateId), options)
  }
}
