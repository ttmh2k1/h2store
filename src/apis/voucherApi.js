import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getListVoucher(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/coupon-code${queries}`)
}
