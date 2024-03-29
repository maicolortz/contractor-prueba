import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class AccountType extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.ACCOUNT_TYPES(), data)
  }
}
