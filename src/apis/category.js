import api, { SERVICE } from './api'

export function getListCategory() {
  return api.GET(`${SERVICE}/api/product-category`)
}
