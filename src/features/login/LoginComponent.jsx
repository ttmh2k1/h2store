import React, { useEffect } from 'react'
import { login as loginAction, update } from '../../actionCreators/UserCreator'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './loginStyle.scss'
import { LoginService } from '../../apis/loginApi'
import { Button, Input } from 'antd'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { currentUser } from '../../apis/userApi'
import logo from '../../commons/assets/brand.png'
import { SERVICE } from '../../apis/api'

const LoginComponent = () => {
  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'colored',
  }

  const dispatch = useDispatch()
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
        toast.success('Login success!', style)
        dispatch(update(resp?.userInfo))
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  const [searchParams, setSearchParams] = useSearchParams()

  const token = searchParams.get('token')

  const getUser = async () => {
    try {
      const result = await currentUser()
      if (result) {
        localStorage.setItem('user', JSON.stringify(result))
        dispatch(loginAction({ user: result, token: token }))
        dispatch(update(result?.data?.data))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      getUser()
      toast.success('Login success!', style)
      navigate('/')
    }
    return () => {}
  }, [])

  return (
    <div className="loginPage">
      <img src={logo} width="200vw" alt="H2Store" onClick={() => navigate({ pathname: '/' })} />
      <div className="loginForm">
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
            <Input.Password type="password" className="input" id="password" />
          </div>
        </div>
        {/* <div className="rememberPw">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" className="checkbox" id="checkbox" />
            <label for="checkbox">Remember me</label>
          </span>
          <span>
            <label style={{ textDecorationLine: 'underline' }}>Forget password?</label>
          </span>
        </div> */}
        <br />
        <div className="button">
          <Button className="buttonLogin" onClick={() => handleLogin()}>
            Login
          </Button>
          <Button className="buttonRegister" href="/register">
            Register
          </Button>
        </div>
        <p>OR</p>
        {/* <Button className="buttonGoogle" href="http://localhost:8080/oauth2/authorization/google"> */}
        <Button className="buttonGoogle" href={SERVICE + '/oauth2/authorization/google'}>
          <AiFillGoogleCircle size="2vw" />
          &nbsp; Login with Google
        </Button>
      </div>
    </div>
  )
}

export default LoginComponent
