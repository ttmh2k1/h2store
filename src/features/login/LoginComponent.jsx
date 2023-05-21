import React from 'react'
import { useNavigate } from 'react-router-dom'
import './loginStyle.scss'
import { Button } from 'antd'
import { LoginService } from '../../apis/loginApi'

const LoginComponent = () => {
  const navigate = useNavigate()
  // Vô login, Kiểm token có chưa, có thì tự đăng nhập, null thì sẽ hiện ra login
  const handleLogin = async () => {
    const username = document?.getElementById('username')?.value
    const password = document?.getElementById('password')?.value
    try {
      const resp = await LoginService?.login(username, password)
      if (resp?.token) {
        localStorage.setItem('token', resp?.token)
        localStorage.setItem('role', resp?.userInfo?.role?.name)
        localStorage.setItem('fullname', resp?.userInfo?.fullname)
        navigate('/')
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return (
    <div className="loginPage">
      <div className="box-form">
        <h2 className="title">LOGIN</h2>
        <div className="inputs">
          <div className="item">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input type="text" className="input" id="username" />
          </div>
          <div className="item">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input type="password" className="input" id="password" />
          </div>
        </div>
        <div className="remember-me">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" className="checkbox" id="checkbox" />
            <label for="checkbox">Remember me</label>
          </span>
          <span>
            <label style={{ textDecorationLine: 'underline' }}>Forget password?</label>
          </span>
        </div>
        <br />
        <Button className="buttonLogin" onClick={() => handleLogin()}>
          Login
        </Button>
      </div>
    </div>
  )
}

export default LoginComponent
