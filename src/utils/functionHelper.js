/* ------------------------------------ / ----------------------------------- */
/**
 * Combine object queries to string
 * @param {Object} queries
 * @returns {string}
 */
export function combineQueriesUrl(queries = {}) {
  const arrQueryKeys = Object.keys(queries)
  let result = arrQueryKeys.length > 0 ? '?' : ''
  for (const i in arrQueryKeys) {
    if (queries[arrQueryKeys[i]] !== null || queries[arrQueryKeys[i]] !== undefined) {
      if (Number.parseInt(i) !== 0) {
        result += '&'
      }
      result += `${arrQueryKeys[i]}=${encodeURIComponent(queries[arrQueryKeys[i]])}`
    }
  }
  return result
}

export function formatNumber(num) {
  if (!num) return num
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatMoney(num) {
  if (!num) return num
  return '₫' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '.')
}
