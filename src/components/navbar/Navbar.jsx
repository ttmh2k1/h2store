import './navbarStyle.scss'
import React, { useEffect, useState } from 'react'
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineBell,
} from 'react-icons/ai'
import logo from '../../commons/assets/brand.png'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { countCart } from '../../apis/cartApi'
import { updateCount } from '../../actionCreators/CartCreator'

const Navbar = () => {
  const dispatch = useDispatch()
  const count = useSelector((state) => state?.cart?.count)
  const [nav, setNav] = useState(false)

  const getCountCart = async () => {
    if (localStorage.getItem('token')) {
      const result = await countCart()
      if (result) {
        dispatch(updateCount(result?.data?.data))
      }
    }
  }
  useEffect(() => {
    getCountCart()
  }, [])

  return (
    <header className="header">
      <Link className="image" to="/">
        <img src={logo} width="200vw" alt="H2Store" />
      </Link>
      <nav>
        <ul className={nav ? 'headerMenu active' : 'headerMenu'}>
          <input size={25} className="inputSearch" type="text" placeholder="Search" />
          <li>
            <AiOutlineSearch size={25} style={{ marginTop: '6px' }} />
          </li>
          <li>
            <a href="/cart" className="cart">
              <AiOutlineShoppingCart size={25} style={{ marginTop: '6px' }} />
              {count > 0 && <span className="count"> {count}</span>}
            </a>
          </li>
          <li>
            <a href="/notification">
              <AiOutlineBell size={25} style={{ marginTop: '6px' }} />
            </a>
          </li>
          {/* <li>
            <AiOutlineUser size={25} style={{ marginTop: '6px' }} />
          </li> */}
          <li>
            <a href="/login">Log in</a>
          </li>
          <li>
            <a href="/register">Sign up</a>
          </li>
        </ul>
      </nav>
      <div onClick={() => setNav(!nav)} className="mobile_btn">
        {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
      </div>
    </header>
  )
}
export default Navbar
