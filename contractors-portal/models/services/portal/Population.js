import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Population extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.POPULATION(), data)
  }
}
