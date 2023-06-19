import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function importCart(params) {
  return api.POST(`${SERVICE}/api/buyer/cart-item`, params)
}

export function getListCart(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/cart-item${queries}`)
}
