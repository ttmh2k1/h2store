import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getFavoriteProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/buyer/favourite-product${queries}`)
}

export async function addFavoriteProduct(id) {
  return await api.POST(`${SERVICE}/api/buyer/favourite-product/${id}`)
}

export function deleteFavoriteProduct(id) {
  return api.DELETE(`${SERVICE}/api/buyer/favourite-product/${id}`)
}
