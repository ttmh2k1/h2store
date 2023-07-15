import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getReviewProduct(id, req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/${id}/review${queries}`)
}

export async function commentReviewProduct(data) {
  return await api.POST(`${SERVICE}/api/buyer/product-review`, data, {
    'Content-Type': 'multipart/form-data',
  })
}
