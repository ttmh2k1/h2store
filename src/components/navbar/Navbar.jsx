import './navbarStyle.scss'
import React, { useEffect, useState } from 'react'
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineBell,
  AiOutlineLogout,
  AiOutlineFileImage,
} from 'react-icons/ai'
import logo from '../../commons/assets/brand.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { countCart } from '../../apis/cartApi'
import { updateCount } from '../../actionCreators/CartCreator'
import { update } from '../../actionCreators/UserCreator'
import { currentUser } from '../../apis/userApi'
import { logout as logoutAction } from '../../actionCreators/UserCreator'
import Avatar from 'react-avatar'
import { putImg } from '../../apis/productControllerApi'
import { toast } from 'react-toastify'
import { Input } from 'antd'

const Navbar = () => {
  const dispatch = useDispatch()
  const count = useSelector((state) => state?.cart?.count)
  const account = useSelector((state) => state?.user?.user)
  const [nav, setNav] = useState(false)
  const [state, setState] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const uploadImg = async (e) => {
    var transform = new FormData()
    transform?.append('image', e?.target?.files[0])
    try {
      const resp = await putImg(transform)
      navigate(`/searchImageResult/${resp?.data?.imageId}`)
    } catch (error) {
      toast.error(error?.data?.data.message)
    }
  }

  const logout = (e) => {
    e.preventDefault()
    localStorage.clear()
    dispatch(logoutAction())
    navigate('/login')
  }

  const getCountCart = async () => {
    if (localStorage?.getItem('token')) {
      const result = await countCart()
      if (result) {
        dispatch(updateCount(result?.data?.data))
      }
    }
  }

  const getUserInfo = async () => {
    if (localStorage?.getItem('token')) {
      const user = await currentUser()
      if (user) {
        dispatch(update(user?.data?.data))
      }
    }
  }

  useEffect(() => {
    getCountCart()
    getUserInfo()
  }, [])

  return (
    <header className="header">
      <Link className="image" to="/">
        <img src={logo} width="200vw" alt="H2Store" />
      </Link>
      <nav>
        <ul className={nav ? 'headerMenu active' : 'headerMenu'}>
          <li>
            <label className="searchImg" width={'2vw'}>
              <input
                type="file"
                id="file"
                className="file"
                accept="image/*"
                style={{ width: '0', visibility: 'hidden' }}
                onChange={uploadImg}
              />
              <i className="fa fa-cloud-upload"></i>
              <AiOutlineFileImage size={25} style={{ marginTop: '6px' }} />
            </label>
          </li>
          <Input
            className="inputSearch"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
          />
          <li>
            {search ? (
              <a href={'/searchResult/' + search}>
                <AiOutlineSearch
                  size={25}
                  style={{ marginTop: '6px' }}
                  onClick={() => {
                    setSearch('')
                    // navigate({ pathname: `/searchResult/${search}` })
                  }}
                />
              </a>
            ) : null}
          </li>
          <li>
            <a href="/cart" className="cart">
              {account
                ? count > 0 && <span className="countUser"> {count}</span>
                : count > 0 && <span className="count"> {count}</span>}
              <AiOutlineShoppingCart size={25} style={{ marginTop: '6px' }} />
            </a>
          </li>
          <li>
            <a href="/notification">
              <AiOutlineBell size={25} style={{ marginTop: '6px' }} />
            </a>
          </li>
          {account ? (
            <>
              <div className="account">
                {account?.avatar ? (
                  <img
                    alt=""
                    className="avatar"
                    src={account?.avatar}
                    onClick={() => {
                      setState(!state)
                    }}
                  />
                ) : (
                  <Avatar
                    alt=""
                    className="avatar"
                    name={account?.fullname}
                    onClick={() => {
                      setState(!state)
                    }}
                  />
                )}
                <div className={state ? 'userMenu' : 'userMenu-hidden'}>
                  <div className="listMenu">
                    <ul className="menuItem">
                      <Link to="/profile" onClick={() => setState(!state)}>
                        <li className="button">
                          <AiOutlineUser size={25} />
                          <span className="text">Profile</span>
                        </li>
                      </Link>
                      <div
                        onClick={(e) => {
                          logout(e)
                        }}
                      >
                        <li className="button">
                          <AiOutlineLogout size={25} />
                          <span className="text">Log out</span>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Log in</a>
              </li>
              <li>
                <a href="/register">Sign up</a>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div onClick={() => setNav(!nav)} className="mobile_btn">
        {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
      </div>
    </header>
  )
}
export default Navbar
