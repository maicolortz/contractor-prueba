import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Bank extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.BANKS(), data)
  }

  sync(options = {}) {
    return this.post(Api.END_POINTS.BANKSYNC(), options)
  }
}
