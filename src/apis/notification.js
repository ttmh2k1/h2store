import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export function getNotification(req) {
  const queries = combineQueriesUrl({ ...req })
  return api.GET(`${SERVICE}/api/buyer/notification${queries}`)
}
