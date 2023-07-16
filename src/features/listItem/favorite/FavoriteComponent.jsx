import './favoriteStyle.scss'
import { Button, Image, Input, List, Select, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { deleteFavoriteProduct, getFavoriteProduct } from '../../../apis/favorite'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { AiOutlineEdit } from 'react-icons/ai'
import Avatar from 'react-avatar'
import { Rating } from 'react-simple-star-rating'

const FavoriteComponent = () => {
  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'colored',
  }
  const user = useSelector((state) => state?.user?.user)
  const [favorite, setFavorite] = useState([])
  const [searchProduct, setSearchProduct] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortDescending, setSortDescending] = useState(true)
  const [state, setState] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetFavorite = async () => {
      const resp = await getFavoriteProduct({
        searchProductName: searchProduct,
        searchProductDescription: searchProduct,
        sortBy: sortBy,
        sortDescending: sortDescending,
        size: 100,
      })
      const data = resp?.data?.data
      setFavorite(data)
    }
    handleGetFavorite()
  }, [searchProduct, sortBy, sortDescending])

  const handleDeleteFavorite = async (id) => {
    await deleteFavoriteProduct(id)
    toast.success('Product removed from favorite products', style)
  }

  return (
    <div className="favorite">
      <div className="favoriteMenu">
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
            style={{ fontWeight: 'bold' }}
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
      <div className="favoriteContent">
        <div className="title">FAVORITE PRODUCTS</div>
        <div className="favoriteSearch">
          <div className="favoriteInput">
            <Input
              className="input"
              onChange={(e) => {
                setSearchProduct(e?.target?.value)
              }}
            />
          </div>
          <div className="sortBy">
            Sort by:{' '}
            <Select
              className="input"
              style={{ width: 120 }}
              onChange={(e) => {
                setSortBy(e)
              }}
              options={[
                { value: '1', label: 'Name' },
                { value: '2', label: 'ID' },
                { value: '3', label: 'Time' },
              ]}
            />
            <Select
              className="input"
              style={{ width: 120 }}
              defaultValue={sortBy !== '' ? sortDescending : ''}
              value={sortBy !== '' ? sortDescending : ''}
              onChange={(e) => {
                setSortDescending(e)
              }}
              options={[
                { value: true, label: 'Descending' },
                { value: false, label: 'Ascending' },
              ]}
            />
          </div>
        </div>
        <List
          loading={!favorite[0] && true}
          className="listFavorite"
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
          dataSource={favorite}
          renderItem={(item) => (
            <div className="itemFavorite">
              <List.Item className="listItem" key={item.product?.name}>
                <Tooltip title={item?.product?.name} color="#decdbb">
                  <div className="slideAvt">
                    <img
                      className="imageFavorite"
                      src={item?.product?.avatar}
                      alt=""
                      onClick={() => navigate({ pathname: '/product/' + item?.product?.id })}
                    />
                    {item?.product?.outOfStock === false && (
                      <p className="outOfStock">Out of stock</p>
                    )}
                  </div>
                  <div
                    className="textFavorite"
                    onClick={() => navigate({ pathname: '/product/' + item?.product?.id })}
                  >
                    <div className="name">{item?.product?.name}</div>
                    <div className="priceGroup">
                      {item?.product?.minOrgPrice !== item?.product?.minPrice && (
                        <div className="oldPrice">{formatMoney(item?.product?.minOrgPrice)}</div>
                      )}
                      <div className="price">{formatMoney(item?.product?.minPrice)}</div>
                    </div>
                    <Rating
                      className="ratingPoint"
                      size={16}
                      initialValue={parseFloat(item?.averageRating).toFixed(0)}
                      label
                      transition
                      readonly
                      fillColor="orange"
                      emptyColor="gray"
                    />
                  </div>
                  <div className="button">
                    <Button
                      className="delete"
                      onClick={() => handleDeleteFavorite(item?.product?.id)}
                    >
                      Remove
                    </Button>
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

export default FavoriteComponent
