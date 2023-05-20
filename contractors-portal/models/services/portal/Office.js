import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Office extends Model {
  constructor(
    data = {
      name: null,
    }
  ) {
    super(Api.END_POINTS.OFFICES(), data)
  }

  areas(id, options = {}) {
    return this.get(Api.END_POINTS.AREAS(id), options)
  }
}
