import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class Admin extends Model {
  constructor(
    data = {
      roles: [],
    }
  ) {
    super(Api.END_POINTS.USERS(), data)
  }

  rolesData(options = {}) {
    return this.get(Api.END_POINTS.ROLES(), options)
  }

  findUser(options = {}) {
    return this.get(Api.END_POINTS.FIND_USERS(), options)
  }

  assignRole(userId, options = {}) {
    return this.post(Api.END_POINTS.ROLES_USER(userId), options)
  }

  retractRole(userId, options = {}) {
    return this.delete(Api.END_POINTS.ROLES_USER(userId), options)
  }
}
