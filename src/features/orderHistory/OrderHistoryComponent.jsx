import './orderHistoryStyle.scss'
import { Button, Divider, Image, List, Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { AiOutlineEdit } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cancelOrder, getOrderHistory } from '../../apis/orderApi'
import moment from 'moment'
import { formatMoney } from '../../utils/functionHelper'
import { toast } from 'react-toastify'

const OrderHistoryComponent = () => {
  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(false)
  const [listOrder, setListOrder] = useState()
  const [pageSize, setPageSize] = useState(100)
  const navigate = useNavigate()

  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'light',
  }

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getOrderHistory()
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetCategory = async () => {
      const resp = await getOrderHistory({
        size: pageSize > 0 ? pageSize : 100,
        sortBy: 2,
        sortDescending: true,
      })
      const data = resp?.data?.data
      setListOrder(data)
    }
    handleGetCategory()
  }, [pageSize])

  const handleCancelOrder = async (id) => {
    const result = await cancelOrder(id)
    if (result) {
      toast.success('Your order was canceled!', style)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      toast.error("Can't cancel your order", style)
    }
  }

  return (
    <div className="orderHistoryPage">
      <div className="orderHistoryMenu">
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
      <div className="orderHistoryContent">
        <div className="title">Order history</div>
        <div className="content">
          <Tabs
            className="tab"
            defaultActiveKey="ALL"
            style={{ display: 'flex', width: '60vw', justifyContent: 'space-between' }}
          >
            <TabPane className="order" tab="All" key="ALL" onTabScroll="right">
              <List
                onTabScroll
                dataSource={listOrder}
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50', '100'],
                  defaultPageSize: 5,
                }}
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        {(item?.status === 'WAIT_FOR_PAYMENT' ||
                          item?.status === 'WAIT_FOR_CONFIRM' ||
                          item?.status === 'WAIT_FOR_SEND') && (
                          <Button
                            className="cancelButton"
                            onClick={() => handleCancelOrder(item?.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {item?.status === 'DELIVERED' && (
                          <Button
                            className="commentButton"
                            onClick={() => navigate({ pathname: '/order/review/' + item?.id })}
                          >
                            Comment
                          </Button>
                        )}
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Wait for payment" key="WAIT_FOR_PAYMENT">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'WAIT_FOR_PAYMENT')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'WAIT_FOR_PAYMENT')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        {item?.status === 'WAIT_FOR_PAYMENT' && (
                          <Button
                            className="cancelButton"
                            onClick={() => handleCancelOrder(item?.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Wait for confirm" key="WAIT_FOR_CONFIRM">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'WAIT_FOR_CONFIRM')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'WAIT_FOR_CONFIRM')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        {item?.status === 'WAIT_FOR_CONFIRM' && (
                          <Button
                            className="cancelButton"
                            onClick={() => handleCancelOrder(item?.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Wait for send" key="WAIT_FOR_SEND">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'WAIT_FOR_SEND')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'WAIT_FOR_SEND')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        {item?.status === 'WAIT_FOR_SEND' && (
                          <Button
                            className="cancelButton"
                            onClick={() => handleCancelOrder(item?.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Delivering" key="DELIVERING">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'DELIVERING')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'DELIVERING')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Delivered" key="DELIVERED">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'DELIVERED')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'DELIVERED')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        <Button
                          className="commentButton"
                          onClick={() => navigate({ pathname: '/order/review/' + item?.id })}
                        >
                          Comment
                        </Button>
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Completed" key="COMPLETED">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'COMPLETED')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'COMPLETED')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        <Button
                          className="commentButton"
                          onClick={() => navigate({ pathname: '/order/review/' + item?.id })}
                        >
                          Feedback
                        </Button>
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
            <TabPane className="order" tab="Canceled" key="CANCELED">
              <List
                onTabScroll
                dataSource={listOrder?.filter((item) => item?.status === 'CANCELED')}
                pagination={
                  listOrder?.filter((item) => item?.status === 'CANCELED')?.length > 0 && {
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100'],
                    defaultPageSize: 5,
                  }
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: '0' }}>
                    <div className="orderDetail">
                      <div className="header">
                        <div className="orderID">
                          Order ID: {item?.id} ({moment(item?.createTime).format('LLL')})
                        </div>
                        <div className="orderStatus">{item?.status.replace(/_/g, ' ')}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      {item?.orderDetails?.map((tmp) => (
                        <div className="listProduct">
                          <div className="product">
                            <img
                              className="avatar"
                              src={tmp?.variation?.product?.avatar}
                              alt={tmp?.variation?.product?.name}
                            />
                            <div className="productInfo">
                              <div className="productName">{tmp?.variation?.product?.name}</div>
                              <div className="productVariation">{tmp?.variation?.name}</div>
                              <div className="quantity">x{tmp?.quantity}</div>
                            </div>
                          </div>
                          <div className="price">
                            {tmp?.variation?.price !== tmp?.variation?.priceAfterDiscount && (
                              <div className="originalPrice">
                                {formatMoney(tmp?.variation?.price)}
                              </div>
                            )}
                            <div className="priceAfterDiscount">
                              {formatMoney(tmp?.variation?.priceAfterDiscount)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="total">
                        <div className="totalTitle">Total payment:</div>
                        <div className="totalPrice">{formatMoney(item?.totalPrice)}</div>
                      </div>
                      <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
                      <div className="action">
                        <Button
                          className="detailButton"
                          onClick={() => navigate({ pathname: '/order/' + item?.id })}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              ></List>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
export default OrderHistoryComponent
