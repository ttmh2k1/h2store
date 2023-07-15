import api, { SERVICE } from './api'

export async function getCategory(id) {
  return await api.GET(`${SERVICE}/api/product-category/${id}`)
}
