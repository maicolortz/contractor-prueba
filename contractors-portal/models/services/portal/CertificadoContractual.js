import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

const form = {
  documenttype: null,
  document: null,  
  year: null,
}

export class CertificadoContractual extends Model {
  constructor(data = form) {
    super(Api.END_POINTS.CERTIFICADO_CONTRACTUAL(), data)
  }

  consulta(options = {}) {
    return this.post("https://sim1.idrd.gov.co/SIM/CertificacionContratos/getContratoExp", options)
  }

  solicitud(options = {}) {
    return this.post("https://sim1.idrd.gov.co/SIM/CertificacionContratos/addSolicitud", options)
  }
}
