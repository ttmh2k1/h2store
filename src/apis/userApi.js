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

export const changePassword = async (newPassword, oldPassword, otp) => {
  try {
    let res = await api.PUT(
      `${SERVICE}/api/buyer/profile/password`,
      {
        newPassword: newPassword,
        oldPassword: oldPassword,
        otp: otp,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      },
    )

    return res.success
  } catch (e) {
    return false
  }
}

export const confirmPhone = async (otp) => {
  try {
    let res = await api.POST(
      `${SERVICE}/api/buyer/profile/phone-confirm`,
      {
        otp: otp,
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),

          'Content-Type': 'application/json',
        },
      },
    )
    return res.data
  } catch (e) {
    return false
  }
}

export const confirmEmail = async (otp) => {
  try {
    let res = await api.POST(
      `${SERVICE}/api/buyer/profile/email-confirm`,
      {
        otp: otp,
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),

          'Content-Type': 'application/json',
        },
      },
    )
    return res.data
  } catch (e) {
    return false
  }
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
export function currentEmailOTP(email) {
  return api.POST(
    `${SERVICE}/api/otp/email`,
    { email: email },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    },
  )
}

export function currentPhoneOTP(phone) {
  return api.POST(
    `${SERVICE}/api/otp/phone`,
    { phoneNumber: phone },
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
