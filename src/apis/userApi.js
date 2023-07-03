import api, { SERVICE } from './api'

// User API
export function currentUser() {
  const res = api.GET(`${SERVICE}/api/buyer/profile`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  return res
}

export function registerAccount(fullname, username, password, email, gender) {
  return api.POST(`${SERVICE}/api/buyer/signup`, {
    fullname: fullname,
    username: username,
    password: password,
    email: email,
    gender: gender,
  })
}

// Address API
export function getAddress() {
  return api.GET(`${SERVICE}/api/buyer/delivery-address`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export function getAddressById(id) {
  return api.GET(`${SERVICE}/api/buyer/delivery-address/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export function addAddressInfo(params) {
  return api.POST(`${SERVICE}/api/buyer/delivery-address`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export function updateAddressInfo(id, params) {
  return api.PUT(`${SERVICE}/api/buyer/delivery-address/${id}`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export function deleteAddressInfo(id) {
  return api.DELETE(`${SERVICE}/api/buyer/delivery-address/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export function getAllCity() {
  return api.GET(`${SERVICE}/api/address`)
}

export function getDistrictOfCity(id) {
  return api.GET(`${SERVICE}/api/address/province-city/${id}`)
}

export function getWardOfDistrict(id) {
  return api.GET(`${SERVICE}/api/address/district/${id}`)
}

export function getFeeShip(id) {
  return api.GET(`${SERVICE}/api/delivery-fee/${id}`)
}

// Profile API
export function currentEmailOTP() {
  return api.POST(
    `${SERVICE}/api/otp/email`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    },
  )
}

export function currentPhoneOTP() {
  return api.POST(
    `${SERVICE}/api/otp/phone`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    },
  )
}

export function updateProfileInfo(data) {
  const res = api.PUT(`${SERVICE}/api/buyer/profile`, data, {
    'Content-Type': 'multipart/form-data',
  })
  return res?.data
}
