import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getNotification(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/notification${queries}`)
}

export function markAsRead() {
  return api.PUT(`${SERVICE}/api/buyer/notification/mark-all-as-seen`)
}
