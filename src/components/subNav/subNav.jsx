import './subNavStyle.scss'
import { useNavigate } from 'react-router-dom'

function SubNavbar({ state }) {
  const navigate = useNavigate()
  return (
    <div className="subNav">
      <ul className={state.isShow ? 'subNavActive' : 'subNavHidden'}>
        {state.list?.map((category, index) => {
          return (
            <ul className="category" key={index}>
              <a className="categoryName" href={state.href + '/' + category.id}>
                {category.name}
              </a>
              {category?.listCategory?.map((item, index) => {
                return (
                  <li className="categoryItem" key={index}>
                    <a className="categoryName" href={state.href + '/' + item.id}>
                      {item.name}
                    </a>
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
