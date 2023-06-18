import './navbarStyle.scss'
import React, { useState } from 'react'
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

const Navbar = () => {
  const [nav, setNav] = useState(false)
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
            <a href="/cart">
              <AiOutlineShoppingCart size={25} style={{ marginTop: '6px' }} />
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
