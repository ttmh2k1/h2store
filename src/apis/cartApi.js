import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function importCart(params) {
  return api.POST(`${SERVICE}/api/buyer/cart-item`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export function getCart() {
  return api.GET(`${SERVICE}/api/buyer/cart-item`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export function getListCart(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/cart-item${queries}`)
}

export function updateQuantity(id, quantity) {
  return api.PUT(`${SERVICE}/api/buyer/cart-item/${id}`, quantity, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export function deleteCart(id) {
  return api.DELETE(`${SERVICE}/api/buyer/cart-item/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export function countCart() {
  return api.GET(`${SERVICE}/api/buyer/cart-item/quantity`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}
