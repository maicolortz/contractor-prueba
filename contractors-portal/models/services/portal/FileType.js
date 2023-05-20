import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class FileType extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.FILE_TYPES(), data)
  }
}
