import './accountVerificationStyle.scss'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { Button, Divider, Image, Input, List, Radio, Space } from 'antd'
import { AiOutlineEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { confirmEmail, confirmPhone, currentEmailOTP, currentPhoneOTP } from '../../apis/userApi'
import { login } from '../../actionCreators/UserCreator'

const AccountVerificationComponent = () => {
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

  const user = useSelector((state) => state?.user?.user)
  const email = user?.email
  const phone = user?.phone
  const [state, setState] = useState(true)
  const [select, setSelect] = useState()
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const sendOTP = async (e) => {
    e.preventDefault()
    const emailOTP = async () => {
      const result = await currentEmailOTP(email)
      if (result) {
        toast.success('OTP was sent successfully!', style)
      } else {
        toast.error(result?.data?.message, style)
      }
    }

    const phoneOTP = async () => {
      const result = await currentPhoneOTP(phone)
      if (result) {
        toast.success('OTP was sent successfully!', style)
      } else {
        toast.error(result?.data?.message, style)
      }
    }

    if (select === 0) {
      phoneOTP()
    } else {
      emailOTP()
    }
  }

  const handleSave = (e) => {
    e.preventDefault()

    const handleConfirmEmail = async () => {
      try {
        const result = await confirmEmail(otp)
        if (result) {
          toast.success('Successful!!', style)
          localStorage.removeItem('user')
          localStorage.setItem('user', result)
          dispatch(login(result))
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, style)
      }
    }

    const handleConfirmPhone = async () => {
      try {
        const result = await confirmPhone(otp)
        if (result) {
          toast.success('Successful!!', style)
          localStorage.removeItem('user')
          localStorage.setItem('user', result)
          dispatch(login(result))
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, style)
      }
    }

    if (select === 0) {
      handleConfirmPhone()
    } else {
      handleConfirmEmail()
    }
  }

  return (
    <div className="changePasswordPage">
      <div className="changePasswordMenu">
        <div className="avatar">
          {user?.avatar !== null ? (
            <Image className="avatarImg" src={user?.avatar} alt="" />
          ) : (
            <Avatar alt="" className="avatarImg" name={user?.fullname} />
          )}
          <div className="text">
            <div className="userName">{user?.fullname}</div>
            <div
              className="editProfile"
              onClick={() =>
                navigate({
                  pathname: '/profile',
                })
              }
            >
              <AiOutlineEdit size={'0.8vw'} style={{ marginRight: '0.2vw' }} /> Edit profile
            </div>
          </div>
        </div>
        <div className="menu">
          <div className="profile">
            <div onClick={() => setState(!state)}> My profile</div>
            <List className={state ? 'profileItem' : 'hidden'}>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/profile',
                  })
                }
              >
                Profile
              </List.Item>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/rank',
                  })
                }
              >
                Rank
              </List.Item>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/address',
                  })
                }
              >
                Address
              </List.Item>
              <List.Item
                className="item"
                style={{ fontWeight: 'bold' }}
                onClick={() =>
                  navigate({
                    pathname: '/accountVerification',
                  })
                }
              >
                Account verification
              </List.Item>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/changePassword',
                  })
                }
              >
                Change password
              </List.Item>
            </List>
          </div>
          <div
            className="voucher"
            onClick={() =>
              navigate({
                pathname: '/voucher',
              })
            }
          >
            Voucher
          </div>
          <div
            className="order"
            onClick={() =>
              navigate({
                pathname: '/orderHistory',
              })
            }
          >
            Order history
          </div>
          <div
            className="favoriteProduct"
            onClick={() =>
              navigate({
                pathname: '/favoriteProduct',
              })
            }
          >
            Favorite product
          </div>
          <div
            className="viewedProduct"
            onClick={() =>
              navigate({
                pathname: '/viewedProduct',
              })
            }
          >
            Viewed product
          </div>
        </div>
      </div>
      <div className="changePasswordContent">
        <div className="title">Account verification</div>
        <Divider />
        <div className="content">
          <div className="item">
            <div className="itemLabel">Email</div>
            <div className="itemValue">
              {user?.email ? (
                <div disabled className="input" placeholder="Email">
                  {user?.email}
                </div>
              ) : (
                <span>You don't have an email</span>
              )}
            </div>
          </div>
          <div className="item">
            <div className="itemLabel">Phone number</div>
            <div className="itemValue">
              {user?.phone ? (
                <div disabled className="input" placeholder="Phone">
                  {user?.phone}
                </div>
              ) : (
                <span>You don't have phone number</span>
              )}
            </div>
          </div>

          <div className="optionOTP">
            <Radio.Group onChange={(e) => setSelect(e?.target?.value)}>
              <Space direction="vertical">
                {phone && user?.phoneConfirmed === false && (
                  <Radio className="radio" value={0}>
                    {'Confirm phone number ' + phone}
                  </Radio>
                )}
                {email && user?.emailConfirmed === true && (
                  <Radio className="radio" value={1}>
                    {'Confirm email ' + email}
                  </Radio>
                )}
              </Space>
            </Radio.Group>
          </div>
          {select && (
            <>
              <div className="itemOTP">
                <Input
                  type="text"
                  placeholder="OTP code"
                  className="input"
                  value={otp}
                  onChange={(e) => setOtp(e?.target?.value)}
                />
                <Button
                  primary
                  children={'SEND OTP'}
                  className="otpButton"
                  onClick={(e) => sendOTP(e)}
                />
              </div>

              <div className="button">
                <Button
                  primary
                  children={'SAVE'}
                  className="saveButton"
                  onClick={(e) => handleSave(e)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountVerificationComponent
