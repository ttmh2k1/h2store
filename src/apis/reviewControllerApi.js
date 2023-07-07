import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getReviewProduct(id, req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/${id}/review${queries}`)
}

export function commentReviewProduct(data) {
  return api.POST(`${SERVICE}/api/buyer/product-review`, data, {
    'Content-Type': 'multipart/form-data',
  })
}
