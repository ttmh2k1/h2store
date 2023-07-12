import './viewedProductStyle.scss'
import { Image, List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineEdit } from 'react-icons/ai'
import Avatar from 'react-avatar'
import { formatMoney } from '../../../../utils/functionHelper'
import { getViewedProduct } from '../../../../apis/productControllerApi'

const ViewedProductComponent = () => {
  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(false)
  const [viewedProduct, setViewedProduct] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getViewedProduct({
        sessionId: localStorage?.getItem('sessionId'),
      })
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetViewedProduct = async () => {
      const resp = await getViewedProduct({
        sessionId: localStorage?.getItem('sessionId'),
        size: pageSize,
      })
      const data = resp?.data?.data
      setViewedProduct(data)
    }
    handleGetViewedProduct()
  }, [])

  return (
    <div className="viewed">
      <div className="viewedMenu">
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
            style={{ fontWeight: 'bold' }}
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
      <div className="viewedContent">
        <div className="title">VIEWED PRODUCTS</div>
        <List
          className="listViewed"
          grid={{
            gutter: 12,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 3,
          }}
          size="large"
          itemLayout="vertical"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['8', '20', '50', '100'],
            defaultPageSize: 8,
          }}
          dataSource={viewedProduct}
          renderItem={(item) => (
            <div className="itemViewed">
              <List.Item className="listItem" key={item?.name}>
                <Tooltip title={item?.name} color="#decdbb">
                  <img
                    className="imageViewed"
                    src={item?.avatar}
                    alt=""
                    onClick={() => navigate({ pathname: '/product/' + item?.id })}
                  />
                  <div
                    className="textViewed"
                    onClick={() => navigate({ pathname: '/product/' + item?.id })}
                  >
                    <div className="name">{item?.name}</div>
                    <div className="price">Price: {formatMoney(item?.minPrice)}</div>
                  </div>
                </Tooltip>
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}

export default ViewedProductComponent
