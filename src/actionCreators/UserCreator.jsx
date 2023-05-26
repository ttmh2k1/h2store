export function login(payload) {
  return {
    type: 'USER_LOGIN',
    payload: payload,
  }
}
export function update(payload) {
  return {
    type: 'UPDATE_USER',
    payload: payload,
  }
}
export function logout(payload = null) {
  return {
    type: 'USER_LOGOUT',
    payload: payload,
  }
}
export function resetPassword(email, phone) {
  return {
    type: 'RESET_PASSWORD',
    email: email,
    phone: phone,
  }
}
export function verify(otp) {
  return {
    type: 'VERIFY',
    otp: otp,
  }
}

export function updateAddress(address) {
  return {
    type: 'UPDATE_ADDRESS',
    address: address,
  }
}

export function updateOrder(listOrder) {
  return {
    type: 'UPDATE_ORDER',
    listOrder: listOrder,
  }
}
