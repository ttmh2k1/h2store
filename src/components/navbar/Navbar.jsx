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

const Navbar = () => {
  //   return <div>Navbar</div>;
  const [nav, setNav] = useState(false)
  return (
    <header className="navbar">
      <img src={logo} width={200} alt="/" />
      <nav>
        <ul className={nav ? 'menu active' : 'menu'}>
          <input size={25} type="text" placeholder="Search" />
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
