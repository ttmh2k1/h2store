//import cookies from 'react-cookies';
const initState = {
  user: localStorage.getItem('user'),
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  phone: localStorage.getItem('phone'),
  otp: localStorage.getItem('otp'),
  address: [],
  listOrder: [],
}

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      }
    case 'USER_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      }
    case 'RESET_PASSWORD':
      return {
        ...state,
        email: action.email,
        phone: action.phone,
      }
    case 'VERIFY':
      return {
        ...state,
        otp: action.otp,
      }
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'UPDATE_ORDER':
      return {
        ...state,
        listOrder: action.listOrder,
      }
    default:
      return state
  }
}

export default userReducer
