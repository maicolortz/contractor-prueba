import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Gender extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.GENDER(), data)
  }
}
