export function formatNumber(num) {
  if (!num) return num
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatMoney(num) {
  if (!num) return num
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
