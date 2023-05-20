import { Model } from '@/models/Model'
import { Api } from '@/models/Api'

/**
 * # Contractor
 *
 * Create and manage contractor data
 *
 * @property document_type_id
 * @property document
 * @property name
 * @property surname
 * @property birthdate
 * @property birthdate_country_id
 * @property birthdate_state_id
 * @property birthdate_city_id
 * @property sex_id
 * @property gender_id
 * @property orientation_id
 * @property population_id
 * @property ethnic_id
 * @property disability_id
 * @property bank_id
 * @property account_type_id
 * @property person_type
 * @property marital_status
 * @property dwelling
 * @property sons
 * @property head_family
 * @property duration
 * @property duration_days_text
 * @property email_confirmation
 * @property email
 * @property institutional_email
 * @property phone
 * @property eps_id
 * @property eps
 * @property afp_id
 * @property afp
 * @property residence_country_id
 * @property residence_state_id
 * @property residence_city_id
 * @property locality_id
 * @property upz_id
 * @property neighborhood_id
 * @property neighborhood
 * @property address
 * @property font_type_id
 * @property contract_id
 * @property contract
 * @property contract_year
 * @property transport
 * @property position
 * @property start_date
 * @property final_date
 * @property start_suspension_date
 * @property final_suspension_date
 * @property total
 * @property day
 * @property risk
 * @property subdirectorate_id
 * @property dependency_id
 * @property other_dependency_subdirectorate
 * @property supervisor_email
 * @property contract_type_id
 * @property academic_level_id
 * @property career_id
 * @property graduate
 * @property year_approved
 * @property rut
 * @property bank
 *
 * Additional properties for filters
 *
 * @property contract
 * @property doesnt_have_secop
 * @property doesnt_have_arl
 * @property doesnt_have_data
 * @property last_year
 * @property recreation
 *
 */
export class Contractor extends Model {
  constructor(
    data = {
      document_type_id: null,
      document: null,
      name: null,
      surname: null,
      birthdate: null,
      birthdate_country_id: null,
      birthdate_state_id: null,
      birthdate_city_id: null,
      sex_id: null,
      gender_id: null,
      orientation_id: null,
      population_id: null,
      ethnic_id: null,
      disability_id: null,
      bank_id: null,
      account_type_id: null,
      number: null,
      person_type: null,
      marital_status: null,
      duration: null,
      duration_days_text: null,
      email_confirmation: null,
      email: null,
      institutional_email: null,
      phone: null,
      eps_id: null,
      eps: null,
      afp_id: null,
      afp: null,
      residence_country_id: null,
      residence_state_id: null,
      residence_city_id: null,
      locality_id: null,
      upz_id: null,
      neighborhood_id: null,
      neighborhood: null,
      address: null,
      font_type_id: null,
      contract_id: null,
      contract: null,
      contract_year: null,
      transport: false,
      position: null,
      start_date: null,
      final_date: null,
      start_suspension_date: null,
      final_suspension_date: null,
      total: null,
      day: [],
      risk: null,
      subdirectorate_id: null,
      dependency_id: null,
      other_dependency_subdirectorate: null,
      supervisor_email: null,
      contract_type_id: null,
      academic_level_id: null,
      career_id: null,
      graduate: false,
      year_approved: null,
      rut: null,
      bank: null,
    }
  ) {
    super(Api.END_POINTS.CONTRACTORS(), data)
  }

  excel(options = {}) {
    return this.get(Api.END_POINTS.EXCEL(), options)
  }

  count(options = {}) {
    return this.get(Api.END_POINTS.CONTRACTORS_COUNTER(), options)
  }

  types(options = {}) {
    return this.get(Api.END_POINTS.CONTRACTORS_STATS(), options)
  }

  countSecop(options = {}) {
    return this.get(Api.END_POINTS.CONTRACTORS_SECOP_COUNTER(), options)
  }

  dashMonth(options = {}) {
    return this.get(Api.END_POINTS.CONTRACTORS_SECOP_STATS(), options)
  }

  findByDocument(options = {}) {
    return this.post(Api.END_POINTS.FIND_CONTRACTORS(), options)
  }

  findByDocumentSecop(options = {}) {
    return this.get(Api.END_POINTS.FIND_CONTRACTORS_SECOP(), options)
  }

  findContractByDocumentSecop(options = {}) {
    return this.get(Api.END_POINTS.FIND_CONTRACT_SECOP(), options)
  }

  user(payload, options = {}) {
    return this.get(Api.END_POINTS.USER_CONTRACT(payload), options)
  }

  resendNotification(id, options = {}) {
    return this.get(Api.END_POINTS.RESEND_NOTIFICATION(id), options)
  }

  hiringUpdate(id, options = {}) {
    return this.put(Api.END_POINTS.UPDATE_BASIC_USER(id), options)
  }

  thirdParty(id, options = {}) {
    return this.put(Api.END_POINTS.THIRD_PARTY(id), options)
  }
}
