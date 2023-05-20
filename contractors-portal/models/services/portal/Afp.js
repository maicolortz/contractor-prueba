import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Afp extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.AFP(), data)
  }
}
