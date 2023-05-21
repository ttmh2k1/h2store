import axios from 'axios'
import config from '../config/api.json'

const login = (username, password) => {
  const data = {
    loginKey: username,
    password: password,
  }

  return axios.post(config.baseURL + 'api/buyer/login', data).then(
    (response) => {
      const temp = response.data
      if (temp) {
        return temp
      } else {
        return null
      }
    },
    (error) => {
      alert(error.response.data.message)
    },
  )
}

export const LoginService = {
  login,
}
