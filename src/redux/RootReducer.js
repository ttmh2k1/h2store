import { combineReducers } from 'redux'
import userReducer from './UserReducer'
import cartReducer from './CartReducer'
// import DisplayReducer from './DisplayReducer';

const mainReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  // display: DisplayReducer,
})

export default mainReducer
