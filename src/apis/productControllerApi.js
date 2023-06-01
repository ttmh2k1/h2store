import api, { SERVICE } from './api'

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
