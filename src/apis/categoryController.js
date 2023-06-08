import api, { SERVICE } from './api'

export function getCategory(id) {
  return api.GET(`${SERVICE}/api/product-category/${id}`)
}
