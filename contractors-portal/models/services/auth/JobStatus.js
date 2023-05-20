import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

export class JobStatus extends Model {
  constructor() {
    super(Api.END_POINTS.JOB_STATUS(), {})
  }
}
