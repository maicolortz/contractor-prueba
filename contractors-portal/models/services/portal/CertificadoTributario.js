import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const form = {
  document: null,
  birthdate: null,
  year: null,
  code: null,
  type: null,
  month: null,
  mesini: null,
  mesfin: null,
}

export class CertificadoTributario extends Model {
  constructor(data = form) {
    super(Api.END_POINTS.CERTIFICADO_TRIBUTARIO(), data)
  }

  token(options = {}) {
    return this.post(Api.END_POINTS.CERTIFICADO_TRIBUTARIO_TOKEN(), options)
  }
}
