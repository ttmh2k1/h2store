import { combineQueriesUrl } from '../utils/functionHelper'
import api, { SERVICE } from './api'

export async function getListProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product${queries}`)
}

export async function getListProductImg(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/image-search${queries}`)
}

export async function getProduct(id) {
  const sessionId = localStorage.getItem('sessionId')
  if (sessionId) {
    return await api.GET(`${SERVICE}/api/product/${id}?sessionId=${sessionId}`)
  } else return await api.GET(`${SERVICE}/api/product/${id}`)
}

export async function getTopView(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/most-viewed${queries}`)
}

export async function getTopSale(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/top-sale${queries}`)
}

export async function getTopSold(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/most-sold${queries}`)
}

export async function getTopRating(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/high-rating${queries}`)
}

export async function getLastedProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/lasted${queries}`)
}

export async function getRecommendProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  return await api.GET(`${SERVICE}/api/product/recommend${queries}`)
}

export async function getViewedProduct(req) {
  const queries = combineQueriesUrl({ ...req })
  if (queries) {
    return await api.GET(`${SERVICE}/api/view-history${queries}`)
  }
  return await api.GET(`${SERVICE}/api/view-history`)
}

export async function putImg(data) {
  const img = await api.POST(`${SERVICE}/api/product/image-search`, data, {
    'Content-Type': 'multipart/form-data',
  })
  return img
}
