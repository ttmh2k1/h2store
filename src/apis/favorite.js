import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getFavoriteProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/favourite-product${queries}`)
}

export function addFavoriteProduct(id) {
  return api.POST(`${SERVICE}/api/buyer/favourite-product/${id}`)
}

export function deleteFavoriteProduct(id) {
  return api.DELETE(`${SERVICE}/api/buyer/favourite-product/${id}`)
}
