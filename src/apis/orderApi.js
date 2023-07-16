import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getOrderByCart(params) {
  const result = await api.POST(`${SERVICE}/api/buyer/order/cart`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
  return result
}

export async function getOrderHistory(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/buyer/order${queries}`)
}

export async function getOrderDetail(id) {
  return await api.GET(`${SERVICE}/api/buyer/order/${id}`)
}

export async function cancelOrder(id) {
  return await api.PUT(`${SERVICE}/api/buyer/order/${id}/cancel`)
}

export async function paymentOrder(id) {
  return await api.GET(`${SERVICE}/api/buyer/order/${id}/create-payment`)
}
