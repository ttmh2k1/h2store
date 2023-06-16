import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getListProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/product${queries}`)
}

export function getProduct(id) {
  return api.GET(`${SERVICE}/api/product/${id}`)
}

export function getTopView() {
  return api.GET(`${SERVICE}/api/product/most-viewed`)
}

export function getTopSale() {
  return api.GET(`${SERVICE}/api/product/sale`)
}

export function getTopSold() {
  return api.GET(`${SERVICE}/api/product/most-sold`)
}

export function getTopRating() {
  return api.GET(`${SERVICE}/api/product/high-rating`)
}

export function getLastedProduct() {
  return api.GET(`${SERVICE}/api/product/lasted`)
}
