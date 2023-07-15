import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function importCart(params) {
  return await api.POST(`${SERVICE}/api/buyer/cart-item`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export async function getCart() {
  return await api.GET(`${SERVICE}/api/buyer/cart-item`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export async function getListCart(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/buyer/cart-item${queries}`)
}

export async function updateQuantity(id, quantity) {
  return await api.PUT(`${SERVICE}/api/buyer/cart-item/${id}`, quantity, {
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

export async function countCart() {
  return await api.GET(`${SERVICE}/api/buyer/cart-item/quantity`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}
