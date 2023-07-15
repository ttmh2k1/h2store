import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getListVoucher(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/buyer/coupon-code${queries}`)
}
