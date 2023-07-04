import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getListProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product${queries}`)
}

export function getProduct(id) {
  const sessionId = localStorage.getItem('sessionId')
  if (sessionId) {
    return api.GET(`${SERVICE}/api/product/${id}?sessionId=${sessionId}`)
  } else return api.GET(`${SERVICE}/api/product/${id}`)
}

export function getTopView(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/most-viewed${queries}`)
}

export function getTopSale(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/top-sale${queries}`)
}

export function getTopSold(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/most-sold${queries}`)
}

export function getTopRating(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/high-rating${queries}`)
}

export function getLastedProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/lasted${queries}`)
}

export function getRecommendProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product/recommend${queries}`)
}

export function getViewedProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  if (queries) {
    return api.GET(`${SERVICE}/api/view-history${queries}`)
  }
  return api.GET(`${SERVICE}/api/view-history`)
}
