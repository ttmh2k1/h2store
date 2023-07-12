import './rankingStyle.scss'
import { useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { Divider, Image, List } from 'antd'
import { AiOutlineEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../../utils/functionHelper'
import { useState } from 'react'

const RankingComponent = () => {
  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(true)

  const navigate = useNavigate()

  return (
    <div className="rankingPage">
      <div className="rankingMenu">
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
                style={{ fontWeight: 'bold' }}
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
                    pathname: '/ranking',
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
      <div className="rankingContent">
        <div className="title">Ranking</div>
        <Divider />
        <div className="content">
          <div className="item">
            <div className="itemTitle">Ranking name:</div>
            <div className="value">{user?.rank?.name}</div>
          </div>
          <div className="item">
            <div className="itemTitle">Threshold:</div>
            <div className="value">{formatMoney(user?.rank?.threshold)}</div>
          </div>
          <div className="item">
            <div className="itemTitle">Total spent:</div>
            <div className="value">{formatMoney(user?.totalSpent)}</div>
          </div>
          <div className="item">
            <div className="itemTitle">Customer discount:</div>
            <div className="value">{user?.rank?.discountRate * 100}%</div>
          </div>
          {user?.rank?.nextRank && (
            <div className="item">
              <div className="itemTitle">Spent to next rank:</div>
              <div className="value">{formatMoney(user?.rank?.threshold - user?.totalSpent)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RankingComponent
