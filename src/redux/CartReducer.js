const initState = {
  cart: [],
  count: 0,
}

const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case 'UPDATE_CART':
      return {
        ...state,
        cart: action.payload,
      }
    case 'UPDATE_COUNT':
      return {
        ...state,
        count: action.payload,
      }

    default:
      return state
  }
}

export default cartReducer
