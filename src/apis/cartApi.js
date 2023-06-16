import api, { SERVICE } from './api'

export function importCart(params) {
  return api.POST(`${SERVICE}/api/buyer/cart-item`, params)
}
