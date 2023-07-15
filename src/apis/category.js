import api, { SERVICE } from './api'

export async function getListCategory() {
  return await api.GET(`${SERVICE}/api/product-category`)
}
