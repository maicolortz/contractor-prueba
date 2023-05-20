import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Location extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.LOCATION(), data)
  }

  upz(id, options = {}) {
    return this.get(Api.END_POINTS.UPZ(id), options)
  }

  neighborhood(locationId, upzId, options = {}) {
    return this.get(Api.END_POINTS.NEIGHBORHOOD(locationId, upzId), options)
  }
}
