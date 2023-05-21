import './subNavStyle.scss'
import { Link } from 'react-router-dom'

function SubNavbar({ state }) {
  return (
    <div className="subNav">
      <ul className={state.isShow ? 'subNavActive' : 'subNavHidden'}>
        {state.list?.map((category, index) => {
          return (
            <ul className="category" key={index}>
              <Link className="categoryName" to={state.href + category.id}>
                {category.name}
              </Link>{' '}
              {category?.listCategory?.map((item, index) => {
                return (
                  <li className="categoryItem" key={index}>
                    <Link className="categoryName" to={state.href + item.id}>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )
        })}
      </ul>
    </div>
  )
}
export default SubNavbar
