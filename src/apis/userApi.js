import axios from 'axios'
import config from '../config/api.json'

export const currentUser = async () => {
  const res = await axios.get(config.baseURL + 'api/buyer/profile', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  return res?.data?.data
}

export const registerAccount = async (fullname, username, password, email, gender) => {
  return await axios.post(config.baseURL + 'api/buyer/signup', {
    fullname: fullname,
    username: username,
    password: password,
    email: email,
    gender: gender,
  })
}
