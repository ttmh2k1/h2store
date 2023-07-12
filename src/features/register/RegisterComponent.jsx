import { Button, Input } from 'antd'
import './registerStyle.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAccount } from '../../apis/userApi'
import { toast } from 'react-toastify'
import logo from '../../commons/assets/brand.png'

const RegisterComponent = () => {
  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'light',
  }

  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()

    const registerUser = async () => {
      const result = await registerAccount(fullname, username, password, email, gender)
      if (result) {
        toast.success('Register success!, Go to Login!', style)
        navigate('/login')
      } else {
        toast.error('Failed Register!, Try a again!', style)
      }
    }

    if (confirm === password) {
      registerUser()
    } else {
      toast.error('Confirm password fail!, Try a again!', style)
    }
  }

  return (
    <form className="registerPage">
      <img src={logo} width="200vw" alt="H2Store" onClick={() => navigate({ pathname: '/' })} />
      <div className="registerForm">
        <h2 className="title">REGISTER</h2>
        <div className="inputs">
          <div className="item">
            <label className="label" htmlFor="fullname">
              Fullname
            </label>
            <input
              type="text"
              className="input"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e?.target?.value)}
              required={true}
              maxLength={50}
            />
          </div>
          <div className="item">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              className="input"
              id="username"
              value={username}
              onChange={(e) => setUsername(e?.target?.value)}
              required={true}
              maxLength={30}
            />
          </div>
          <div className="genderItem">
            <label className="label" htmlFor="gender">
              Gender
            </label>
            <div className="genderRadio">
              <input
                className="input"
                name="gender"
                type="radio"
                value="MALE"
                checked={gender === 'MALE' && 'checked'}
                onChange={(e) => setGender(e?.target?.value)}
              />
              Male
            </div>
            <div className="genderRadio">
              <input
                className="input"
                name="gender"
                type="radio"
                value="FEMALE"
                checked={gender === 'FEMALE' && 'checked'}
                onChange={(e) => setGender(e?.target?.value)}
              />
              Female
            </div>
          </div>
          <div className="item">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              required={true}
              maxLength={50}
            />
          </div>
          <div className="item">
            <label className="label" htmlFor="password">
              Password
            </label>
            <Input.Password
              type="password"
              className="input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e?.target?.value)}
              required={true}
              maxLength={40}
            />
          </div>
          <div className="item">
            <label className="label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <Input.Password
              type="password"
              className="input"
              id="confirmPassword"
              value={confirm}
              onChange={(e) => setConfirm(e?.target?.value)}
              required={true}
              maxLength={40}
            />
          </div>
        </div>
        <div className="button">
          <Button className="buttonRegister" onClick={(e) => register(e)}>
            Register
          </Button>
          <p>OR</p>
          <Button className="buttonLogin" href="/login">
            Login
          </Button>
        </div>
      </div>
    </form>
  )
}
export default RegisterComponent
