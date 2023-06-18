import './menuNavStyle.scss'
import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { getListCategory } from '../../apis/category'
import { Link } from 'react-router-dom'
import SubNavbar from '../subNav/subNav'

const MenuNav = () => {
  const menuBar = useRef()
  const [category, setCategory] = useState([])
  const [categoryItem, setCategoryItem] = useState([])
  const [showMenu, setShowMenu] = useState(true)
  const [state, setState] = useState({
    subnav1: false,
    subnav2: false,
    subnavOther: false,
  })

  useEffect(() => {
    const handleGetCategory = async () => {
      const resp = await getListCategory()
      const data = resp?.data?.data
      setCategory(data)
    }
    handleGetCategory()
  }, [])

  useEffect(() => {
    const handleGetListCategory = async () => {
      const resp = await getListCategory()
      const data = resp?.data?.data
      setCategoryItem(() => {
        const list = data.map((item) => {
          return item.children.map((category) => {
            return {
              id: category.id,
              name: category.name,
              listCategory: category.children,
            }
          })
        })
        return list
      })
    }
    handleGetListCategory()
  }, [])

  const handleHover = (index) => {
    if (index === 1) {
      return setState({
        ...state,
        subnav1: true,
      })
    } else if (index === 2) {
      return setState({
        ...state,
        subnav2: true,
      })
    }
    if (index === 3) {
      return setState({
        ...state,
        subnavOther: true,
      })
    }
    return setState({
      subnav1: false,
      subnav2: false,
      subnavOther: false,
    })
  }

  const handleUnHover = (index) => {
    if (index === 1 || index === 2 || index === 3) {
      return setState({
        subnav1: false,
        subnav2: false,
        subnavOther: false,
      })
    }
    return () => {}
  }

  const listItems = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: category[0]?.name,
      href: '/category/1',
    },
    {
      name: category[1]?.name,
      href: '/category/2',
    },
    {
      name: 'On sale',
      href: '/onSale',
    },
    {
      name: 'New arrival',
      href: '/newArrival',
    },
    {
      name: 'Best seller',
      href: '/bestSeller',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
  ]

  return (
    <div onMouseOut={() => handleUnHover(1)} className="menuNav">
      <div className="menu">
        <Button
          className="menuIcon"
          onClick={() => {
            if (showMenu) {
              menuBar.current.style.display = 'flex'
              setTimeout(() => {
                menuBar.current.style.transform = 'translateX(0)'
                menuBar.current.style.opacity = '1'
                menuBar.current.style.zIndex = '1'
              }, 100)
            } else {
              menuBar.current.style.transform = 'translateX(2%)'
              menuBar.current.style.opacity = '0'
              menuBar.current.style.zIndex = '-1'
              setTimeout(() => {
                menuBar.current.style.display = 'none'
              }, 300)
            }
            setShowMenu(!showMenu)
          }}
        />
      </div>
      <div className="menuBar" ref={menuBar}>
        {listItems.map((item, index) => {
          return (
            <div className="menuItem" key={index}>
              <Link to={item.href}>{item.name}</Link>
            </div>
          )
        })}
      </div>
      <nav className="navBar">
        <ul className="navBarItem">
          {listItems.map((item, index) => {
            return (
              <div key={index} className="items" onMouseOver={() => handleHover(index)}>
                <li key={index} className="item">
                  <Link to={item.href}>{item.name}</Link>
                  <div className="subnav">
                    {categoryItem && index === 1 && (
                      <SubNavbar
                        state={{
                          isShow: state.subnav1,
                          list: categoryItem[0],
                          href: '/category',
                        }}
                      ></SubNavbar>
                    )}
                  </div>
                  <div className="subnav">
                    {categoryItem && index === 2 && (
                      <SubNavbar
                        state={{
                          isShow: state.subnav2,
                          list: categoryItem[1],
                          href: '/category',
                        }}
                      ></SubNavbar>
                    )}
                  </div>
                </li>
              </div>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
export default MenuNav
