import api, { SERVICE } from './api'

// User API
export async function currentUser() {
  const res = await api.GET(`${SERVICE}/api/buyer/profile`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  return res
}

export async function registerAccount(fullname, username, password, email, gender) {
  return await api.POST(`${SERVICE}/api/buyer/signup`, {
    fullname: fullname,
    username: username,
    password: password,
    email: email,
    gender: gender,
  })
}

export const changePassword = async (newPassword, oldPassword, otp) => {
  try {
    let res = await await api.PUT(
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
    let res = await await api.POST(
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
    let res = await await api.POST(
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
export async function getAddress() {
  return await api.GET(`${SERVICE}/api/buyer/delivery-address`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export async function getAddressById(id) {
  return await api.GET(`${SERVICE}/api/buyer/delivery-address/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export async function addAddressInfo(params) {
  return await api.POST(`${SERVICE}/api/buyer/delivery-address`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export async function updateAddressInfo(id, params) {
  return await api.PUT(`${SERVICE}/api/buyer/delivery-address/${id}`, params, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
}

export async function deleteAddressInfo(id) {
  return await api.DELETE(`${SERVICE}/api/buyer/delivery-address/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      accept: '*/*',
    },
  })
}

export async function getAllCity() {
  return await api.GET(`${SERVICE}/api/address`)
}

export async function getDistrictOfCity(id) {
  return await api.GET(`${SERVICE}/api/address/province-city/${id}`)
}

export async function getWardOfDistrict(id) {
  return await api.GET(`${SERVICE}/api/address/district/${id}`)
}

export async function getFeeShip(id) {
  return await api.GET(`http://be.h2store.xyz/api/delivery-fee/${id}`)
}

// Profile API
export async function currentEmailOTP(email) {
  return await api.POST(
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

export async function currentPhoneOTP(phone) {
  return await api.POST(
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

export async function updateProfileInfo(data) {
  const res = await api.PUT(`${SERVICE}/api/buyer/profile`, data, {
    'Content-Type': 'multipart/form-data',
  })

  return res?.data?.data
}
