import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getOrderByCart(params) {
  const result = api.POST(`${SERVICE}/api/buyer/order/cart`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
  return result
}

export function getOrderHistory(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/order${queries}`)
}

export function getOrderDetail(id) {
  return api.GET(`${SERVICE}/api/buyer/order/${id}`)
}
