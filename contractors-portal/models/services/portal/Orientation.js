import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Orientation extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.ORIENTATION(), data)
  }
}
