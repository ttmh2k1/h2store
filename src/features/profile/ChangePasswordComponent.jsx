import './changePasswordStyle.scss'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { Button, Divider, Image, Input, List, Radio } from 'antd'
import { AiOutlineEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Phone from '../../commons/assets/phone.png'
import Mail from '../../commons/assets/mail.png'
import { toast } from 'react-toastify'
import { changePassword, currentEmailOTP, currentPhoneOTP } from '../../apis/userApi'
import { logout } from '../../actionCreators/UserCreator'

const ChangePasswordComponent = () => {
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
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [select, setSelect] = useState(0)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const options = [
    {
      id: 1,
      name: phone ? 'OTP to phone number ' + phone : '',
      image: Phone,
    },
    {
      id: 2,
      name: email ? 'OTP to email ' + email : '',
      image: Mail,
    },
  ]

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

  const handlChangePassword = async () => {
    const result = await changePassword(newPassword, oldPassword, otp)
    return result
  }

  const handleSave = (e) => {
    if ((user?.password && oldPassword === user?.password) || !user?.password) {
      if (confirm === newPassword && newPassword.length > 7) {
        try {
          if (handlChangePassword()) {
            toast.success('Change password successful!', style)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            dispatch(logout())
            setTimeout(() => {
              window.location.reload()
            }, 50)
          }
        } catch (error) {
          toast.error(error?.response?.data?.message, style)
        }
      } else {
        toast.error('Password is not match!', style)
      }
    } else {
      toast.error('Old password is incorrect!', style)
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
                style={{ fontWeight: 'bold' }}
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
        <div className="title">Change password</div>
        <Divider />
        <div className="content">
          <div className="item">
            <div className="itemLabel">Old password</div>
            <div className="itemValue">
              {user?.emptyPassword === false ? (
                <Input.Password
                  type="password"
                  className="input"
                  placeholder="Old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e?.target?.value)}
                />
              ) : (
                <span>You don't have a password</span>
              )}
            </div>
          </div>
          <div className="item">
            <div className="itemLabel">New password</div>
            <div className="itemValue">
              <Input.Password
                type="password"
                className="input"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e?.target?.value)}
              />
            </div>
          </div>
          <div className="item">
            <div className="itemLabel">Confirm password</div>
            <div className="itemValue">
              <Input.Password
                type="password"
                className="input"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e?.target?.value)}
              />
            </div>
          </div>
          <div className="optionOTP">
            {options?.map((item, index) => {
              return (
                <div className="option" key={index}>
                  {item?.name !== '' && (
                    <>
                      <Radio
                        obj={item}
                        checked={select === index}
                        onChange={() => setSelect(index)}
                        className="radio"
                      />

                      {item?.image && <img src={item?.image} width={20} height={20} alt="" />}
                      <span key={item?.id}>{item?.name}</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
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
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordComponent
