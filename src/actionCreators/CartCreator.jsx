export function updateCart(payload) {
  return {
    type: 'UPDATE_CART',
    payload: payload,
  }
}

export function updateCount(payload) {
  return {
    type: 'UPDATE_COUNT',
    payload: payload,
  }
}
