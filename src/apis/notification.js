import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getNotification(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/buyer/notification${queries}`)
}

export async function markAsRead() {
  return await api.PUT(`${SERVICE}/api/buyer/notification/mark-all-as-seen`)
}
