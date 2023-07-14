import './profileStyle.scss'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { Button, Divider, Image, Input, List } from 'antd'
import { AiOutlineEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { currentEmailOTP, currentPhoneOTP, updateProfileInfo } from '../../apis/userApi'
import { update as upadateUser, logout as logoutUser } from '../../actionCreators/UserCreator'

const ProfileComponent = () => {
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

  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [avatar, setAvatar] = useState()
  const [avatarFile, setAvatarFile] = useState()
  const [username, setUsername] = useState(user?.user)
  const [fullname, setFullname] = useState(user?.fullname)
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()
  const [gender, setGender] = useState(user?.gender)
  const [birthday, setBirthday] = useState(user?.dob)
  const [editUsername, setEditUsername] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)
  const [otp, setOtp] = useState('')

  const uploadAvatar = (e) => {
    const file = e?.target?.files[0]
    file.preview = URL.createObjectURL(file)
    setAvatar(file)
    setAvatarFile(URL.createObjectURL(file))
  }

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview)
    }
  }, [avatar])

  useEffect(() => {
    setUsername(user?.username)
    setFullname(user?.fullname)
    setPhone(user?.phone)
    setEmail(user?.email)
    setGender(user?.gender)
    setBirthday(user?.dob)
    // setAvatar(user?.avatar)
  }, [user])

  const sendOTP = async (e) => {
    e.preventDefault()
    const emailOTP = async () => {
      try {
        await currentEmailOTP(user?.email)
        toast.success('OTP was sended! Let submit OTP code!', style)
      } catch (error) {
        toast.error(error?.response?.data?.message, style)
      }
    }

    const phoneOTP = async () => {
      try {
        await currentPhoneOTP(user?.phone)
        toast.success('OTP was sended!', 'Let submit OTP code!', style)
      } catch (error) {
        toast.error(error?.response?.data?.message, style)
      }
    }

    if (editEmail && email !== user?.email) {
      phoneOTP()
    } else if (editPhone && phone !== user?.phone) {
      emailOTP()
    } else {
      toast.info(
        "Can't send OTP when you don't update email or phone. You can change profile without OTP!",
        style,
      )
    }
  }

  function handleSave() {
    const update = async () => {
      var transform = new FormData()
      const obj = {
        fullname: fullname,
        username: username,
        email: email !== user?.email ? email : null,
        phone: phone !== user?.phone ? phone : null,
        gender: gender,
        dob: birthday,
        otp: otp,
      }
      const json = JSON.stringify(obj)
      const blob = new Blob([json], {
        type: 'application/json',
      })
      transform?.append('info', blob)
      const avatar = document.getElementById('avatar').files
      if (avatarFile) {
        transform?.append('avatar', avatar[0])
      }
      // transform?.append('avatar', avatar) // file avatar nếu có k thì k có dòng này
      try {
        const result = await updateProfileInfo(transform)

        if (result) {
          if (user?.username === username) {
            localStorage.removeItem('user')
            const userRs = { ...result }
            localStorage.setItem('user', userRs)
            dispatch(upadateUser(userRs))
            toast.success('Change profile successful!', style)
            setEditUsername(false)
            setEditPhone(false)
            setEditEmail(false)
          } else {
            dispatch(logoutUser())
            toast.success('Change profile successful!', style)
            localStorage.clear()
            navigate('/login')
          }
        } else {
          toast.error('Failed!', style)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, style)
      }
    }

    update()
  }

  // const handleSave = async () => {
  //   var transform = new FormData()
  //   var transform1 = new FormData()
  //   const obj = {
  //     fullname: fullname,
  //     username: username,
  //     email: email !== user?.email ? email : '',
  //     phone: phone !== user?.phone ? phone : '',
  //     gender: gender,
  //     dob: birthday,
  //     otp: otp,
  //   }
  //   const obj1 = {
  //     fullname: fullname,
  //     username: username,
  //     email: email !== user?.email ? email : user?.email,
  //     phone: phone !== user?.phone ? phone : user?.phone,
  //     gender: gender,
  //     dob: birthday,
  //     otp: otp,
  //   }
  //   const blob = new Blob([JSON?.stringify(obj)], {
  //     type: 'application/json',
  //   })
  //   const blob1 = new Blob([JSON?.stringify(obj1)], {
  //     type: 'application/json',
  //   })
  //   transform?.append('info', blob)
  //   transform1?.append('info', blob1)
  //   const avatar = document.getElementById('avatar').files

  //   if (avatar.length > 0) {
  //     transform?.append('avatar', avatar[0])
  //   }
  //   if (avatar.length > 0) {
  //     transform1?.append('avatar', avatar[0])
  //   }

  //   await updateProfileInfo(editEmail === true || editPhone === true ? transform : transform1)
  //   // await updateProfileInfo(transform)

  //   if (user?.username === username) {
  //     localStorage?.removeItem('user')
  //     const userRs = { ...updateProfileInfo(transform) }
  //     localStorage?.setItem('user', userRs)
  //     dispatch(upadateUser(userRs))
  //     setEditUsername(false)
  //     setEditPhone(false)
  //     setEditEmail(false)
  //     toast.success('Change profile successful!', style)
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 50)
  //   } else {
  //     dispatch(logoutUser())
  //     toast.success(
  //       'Change profile successful! Your username is changed, please login again!',
  //       style,
  //     )
  //     localStorage?.clear()
  //     navigate('/login')
  //   }
  // }

  return (
    <div className="profilePage">
      <div className="profileMenu">
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
                style={{ fontWeight: 'bold' }}
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
      <div className="profileContent">
        <div className="title">
          My profile
          <div className="description">Manage profile information for account security</div>
        </div>
        <Divider />
        <div className="content">
          <div className="contentLeft">
            <div className="contentItem">
              <div className="label">Username</div>
              <div className="text">{username}</div>
            </div>
            <div className="contentItem">
              <div className="label">Full name</div>
              <Input
                className="value"
                value={fullname ? fullname : user?.fullname}
                onChange={(e) => setFullname(e?.target?.value)}
                maxLength={50}
              />
            </div>
            <div className="contentItem">
              <div className="label">Email</div>
              {editEmail ? (
                <Input
                  className="value"
                  type="email"
                  value={user?.email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  maxLength={50}
                />
              ) : (
                <div className="text">{user?.email}</div>
              )}
              {!editEmail && (
                <AiOutlineEdit
                  size={'0.8vw'}
                  style={{ margin: '0 0.2vw' }}
                  onClick={() =>
                    setEditEmail(() => {
                      if (!user?.phone) {
                        toast.warning("Can't chang email! Please add phone number!", style)
                        return false
                      } else if (editPhone) {
                        toast.warning(
                          "Can't chang email! Only change email or phone number!",
                          style,
                        )
                        return false
                      }
                      return true
                    })
                  }
                />
              )}
            </div>
            <div className="contentItem">
              <div className="label">Phone</div>
              {editPhone ? (
                <Input
                  className="value"
                  value={phone ? phone : user?.phone}
                  onChange={(e) => setPhone(e?.target?.value)}
                  maxLength={10}
                  minLength={10}
                />
              ) : (
                <div className="text">{user?.phone}</div>
              )}
              {!editPhone && (
                <AiOutlineEdit
                  size={'0.8vw'}
                  style={{ marginRight: '0.2vw' }}
                  onClick={() =>
                    setEditPhone(() => {
                      if (editEmail === true) {
                        toast.warning(
                          "Can't change phone! Only change email or phone number!",
                          style,
                        )
                        return false
                      }
                      return true
                    })
                  }
                />
              )}
            </div>
            <div className="contentItem">
              <div className="label">Gender</div>
              <div className="genderRadio">
                <input
                  className="input"
                  name="gender"
                  type="radio"
                  value={'MALE'}
                  checked={gender === 'MALE' ? true : false}
                  onChange={(e) => setGender(e?.target?.value)}
                />
                Male
              </div>
              <div className="genderRadio">
                <input
                  className="input"
                  name="gender"
                  type="radio"
                  value={'FEMALE'}
                  checked={gender === 'FEMALE' ? true : false}
                  onChange={(e) => setGender(e?.target?.value)}
                />
                Female
              </div>
            </div>
            <div className="contentItem">
              <div className="label">Birthday</div>
              <Input
                className="value"
                type="date"
                value={birthday ? birthday : user?.dob}
                onChange={(e) => setBirthday(e?.target?.value)}
              />
            </div>
            <div className="contentItem">
              {(editPhone || editEmail) && (
                <>
                  <div className="label">OTP </div>
                  <Input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e?.target?.value)}
                    className="value"
                    maxLength={6}
                    minLength={6}
                    required
                  />

                  <Button
                    className="button"
                    onClick={(e) => sendOTP(e)}
                    primary
                    children="Send OTP"
                  />
                </>
              )}
            </div>
            <Button className="saveButton" onClick={() => handleSave()}>
              Save
            </Button>
          </div>
          <Divider type="vertical" style={{ height: '40vh' }} />
          <div className="contentRight">
            {user?.avatar !== null ? (
              <Image
                className="avatarImg"
                src={avatarFile ? avatarFile : avatar ? avatar : user?.avatar}
                alt=""
              />
            ) : (
              <Avatar alt="" className="avatarImg" name={user?.fullname} />
            )}
            <input
              type="file"
              id="avatar"
              className="uploadAvt"
              accept="image/*"
              onChange={uploadAvatar}
            />
            <div className="note">
              Maximum file size 1MB <br />
              Format: .JPEG, .PNG
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileComponent
