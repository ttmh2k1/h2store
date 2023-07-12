import './orderDetailStyle.scss'
import { Divider, Image, List } from 'antd'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { AiOutlineEdit } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { getOrderDetail } from '../../../apis/orderApi'
import { formatMoney } from '../../../utils/functionHelper'
import Momo from '../../../commons/assets/momo.png'
import COD from '../../../commons/assets/cod.png'
import Paypal from '../../../commons/assets/paypal.png'

const OrderDetailComponent = (props) => {
  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(false)
  const [detail, setDetail] = useState()
  const [address, setAddress] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetOrderDetail = async () => {
      const resp = await getOrderDetail(props?.id)
      const data = resp?.data?.data
      setDetail(data)
      setAddress(data?.deliveryAddress)
    }
    handleGetOrderDetail()
  }, [props?.id])

  return (
    <div className="orderDetailPage">
      <div className="orderDetailMenu">
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
            style={{ fontWeight: 'bold' }}
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
        </div>
      </div>
      <div className="orderDetailContent">
        <div className="title">Order detail</div>
        <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
        <div className="content">
          <div className="detailOrder">
            <div className="header">
              <div className="orderID">
                Order ID: {detail?.id} ({moment(detail?.createTime).format('LLL')})
              </div>
              <div className="orderStatus">{detail?.status.replace(/_/g, ' ')}</div>
            </div>
            <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
            <div className="address">
              <div className="addressInfo">
                <div className="receiverName">{address?.receiverName}</div>
                <div className="receiverPhone">{address?.receiverPhone}</div>
                <div className="addressDetail">
                  {address?.addressDetail +
                    ', ' +
                    address?.addressWard?.name +
                    ', ' +
                    address?.addressWard?.district?.name +
                    ', ' +
                    address?.addressWard?.district?.provinceCity?.name}
                </div>
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
            {detail?.orderDetails?.map((item) => (
              <div className="listProduct">
                <div className="product">
                  <img
                    className="avatar"
                    src={item?.variation?.product?.avatar}
                    alt={item?.variation?.product?.name}
                  />
                  <div className="productInfo">
                    <div className="productName">{item?.variation?.product?.name}</div>
                    <div className="productVariation">{item?.variation?.name}</div>
                    <div className="quantity">x{item?.quantity}</div>
                  </div>
                </div>
                <div className="price">
                  {item?.variation?.price !== item?.variation?.priceAfterDiscount && (
                    <div className="originalPrice">{formatMoney(item?.variation?.price)}</div>
                  )}
                  <div className="priceAfterDiscount">
                    {formatMoney(item?.variation?.priceAfterDiscount)}
                  </div>
                </div>
              </div>
            ))}
            <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />

            <div className="bill">
              <div className="productPrice">
                <div className="productPriceTitle">Product price:</div>
                <div className="totalProductPrice">{formatMoney(detail?.price)}</div>
              </div>
              {detail?.discount > 0 && (
                <div className="discountCustomer">
                  <div className="discountCustomerTitle">Customer discount:</div>
                  <div className="discountCustomerPrice">
                    - {formatMoney(parseFloat((detail?.price * detail?.discount) / 100).toFixed(0))}
                  </div>
                </div>
              )}
              {detail?.couponCode && (
                <div className="discountVoucher">
                  <div className="discountVoucherTitle">Voucher discount:</div>
                  <div className="discountVoucherPrice">{formatMoney(detail?.couponDiscount)}</div>
                </div>
              )}
              <div className="shipPrice">
                <div className="shipPriceTitle">Shipping fee:</div>
                <div className="shipFee">{formatMoney(detail?.shipPrice)}</div>
              </div>
              <div className="total">
                <div className="totalTitle">Total payment:</div>
                <div className="totalPrice">{formatMoney(detail?.totalPrice)}</div>
              </div>
            </div>
            <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
            <div className="paymentMethod">
              <div className="paymentMethodTitle">Payment method:</div>
              <div className="method">
                {detail?.paymentMethod === 'OFFLINE_CASH_ON_DELIVERY' ? (
                  <>
                    <img className="image" src={COD} alt="COD" /> COD
                  </>
                ) : detail?.paymentMethod === 'ONLINE_PAYMENT_MOMO' ? (
                  <>
                    <img className="image" src={Momo} alt="MOMO" /> MOMO
                  </>
                ) : (
                  <>
                    <img className="image" src={Paypal} alt="MOMO" /> PAYPAL
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OrderDetailComponent
