import './reviewProductStyle.scss'
import { Divider, Image, List, Modal } from 'antd'
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
import { Rating } from 'react-simple-star-rating'
import TextArea from 'antd/es/input/TextArea'
import { FaRegTimesCircle, FaUpload } from 'react-icons/fa'
import { commentReviewProduct } from '../../../apis/reviewControllerApi'
import { toast } from 'react-toastify'

const ReviewProductComponent = (props) => {
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

  const user = useSelector((state) => state?.user?.user)
  const [state, setState] = useState(false)
  const [detail, setDetail] = useState()
  const [address, setAddress] = useState()
  const [modal, setModal] = useState(false)
  const [rating, setRating] = useState()
  const [content, setContent] = useState()
  const [product, setProduct] = useState()
  const [images, setImages] = useState([])
  const [imageList, setImageList] = useState([])
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

  const handleRating = (rate) => {
    setRating(rate)
  }

  const onSelectImages = (event) => {
    const imageFile = event.target.files
    const selectedFile = Array.from(imageFile)
    const imageArray = selectedFile.map((file) => {
      return URL.createObjectURL(file)
    })
    setImages((previousImages) => previousImages.concat(imageArray))
    setImageList((old) => {
      return [...old, ...event.target.files]
    })
  }

  const handleComment = async () => {
    var transform = new FormData()
    const obj = {
      idOrder: props?.id,
      idProductVariation: product?.variation?.id,
      point: rating,
      content: content,
    }
    const json = JSON.stringify(obj)
    const blob = new Blob([json], {
      type: 'application/json',
    })
    transform.append('data', blob)
    for (let i = 0; i < imageList?.length; i++) {
      transform.append('images', imageList[i])
    }
    try {
      await commentReviewProduct(transform)
      toast.success('Review product successful!', style)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  return (
    <div className="orderReviewPage">
      <div className="orderReviewMenu">
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
      <div className="orderReviewContent">
        <div className="title">Review</div>
        <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
        <div className="content">
          <div className="reviewOrder">
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
              <>
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
                      <div
                        className="review"
                        onClick={() => {
                          setProduct(item)
                          setModal(true)
                        }}
                      >
                        {item?.reviewed ? 'Reviewed' : 'Review'}
                      </div>
                      {item?.reviewed && (
                        <Rating
                          className="ratingPoint"
                          onClick={handleRating}
                          size={16}
                          label
                          transition
                          initialValue={item?.productReview?.point}
                          readonly="true"
                          fillColor="orange"
                          emptyColor="gray"
                        />
                      )}
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
              </>
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
        <Modal
          className="modal"
          title="Review product"
          centered
          open={modal}
          onOk={() => {
            setModal(false)
            handleComment()
          }}
          onCancel={() => setModal(false)}
          width={'50vw'}
          destroyOnClose={true}
        >
          <Divider type="horizontal" style={{ margin: '0.2vw 0' }} />
          <div
            className="product"
            style={{ display: 'flex', flexDirection: 'row', margin: '0.4vw 0' }}
          >
            <img
              className="avatar"
              style={{ width: '6.4vw', height: '6.4vw', marginRight: '0.8vw' }}
              src={product?.variation?.product?.avatar}
              alt={product?.variation?.product?.name}
            />
            <div
              className="productInfo"
              style={{ display: 'flex', flexDirection: 'column', fontSize: '1vw' }}
            >
              <div className="productName" style={{ fontWeight: 'bold', color: '#2a2728' }}>
                {product?.variation?.product?.name}
              </div>
              <div className="productVariation" style={{ color: '#77675a' }}>
                {product?.variation?.name}
              </div>
              <div className="quantity" style={{ color: '#2a2728' }}>
                x{product?.quantity}
              </div>
            </div>
          </div>
          <div className="rating" style={{ display: 'flex', justifyContent: 'center' }}>
            <Rating
              className="ratingPoint"
              onClick={handleRating}
              ratingValue={rating}
              size={36}
              label
              transition
              initialValue={product?.productReview?.point}
              readonly={product?.reviewed ? true : false}
              fillColor="orange"
              emptyColor="gray"
            />
          </div>
          <div
            className="feedback"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '0.4vw 0',
            }}
          >
            {product?.reviewed ? (
              <div
                className="feedbackContent"
                style={{ minHeight: 'fit-content', borderRadius: '0.4vw', fontSize: '1vw' }}
              >
                {product?.productReview?.content}
              </div>
            ) : (
              <TextArea
                className="feedbackContent"
                style={{ minHeight: '4vw', borderRadius: '0.4vw', fontSize: '1vw' }}
                onChange={(e) => setContent(e?.target?.value)}
              />
            )}
            <div className="feedbackImageList" style={{ margin: '0.8vw 0' }}>
              {product?.reviewed ? (
                <div
                  className="images"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    fleWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {product?.productReview?.images &&
                    product?.productReview?.images?.map((img) => {
                      return (
                        <div
                          key={img}
                          className="image"
                          style={{ margin: '0.8vw 0', position: 'relative' }}
                        >
                          <img
                            src={img?.url}
                            className="img"
                            alt=""
                            style={{
                              height: '8vw',
                              width: '8vw',
                              margin: '0.2vw',
                              borderRadius: '0.4vw',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          />
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="imagesGroup">
                  <label
                    className="imageButton"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: ' 0.4vw',
                      width: '8vw',
                      height: '2vw',
                      color: '#fff',
                      background: '#ab9b92',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    <FaUpload style={{ marginRight: '0.2vw' }} />
                    Add images
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      name="images"
                      multiple
                      id="images"
                      onChange={onSelectImages}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                    />
                  </label>

                  <div
                    className="images"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      fleWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    {images &&
                      images.map((img) => {
                        return (
                          <div
                            key={img}
                            className="image"
                            style={{ margin: '0.8vw 0', position: 'relative' }}
                          >
                            <img
                              src={img}
                              className="img"
                              alt=""
                              style={{
                                height: '8vw',
                                width: '8vw',
                                margin: '0.2vw',
                                borderRadius: '0.4vw',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            />
                            <button
                              className="deleteButton"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.2rem',
                                borderRadius: '0.2rem',
                                border: '0.1rem solid #bb2525',
                                color: '#bb2525',
                                background: ' #fff',
                                marginTop: '0.4rem',
                                cursor: 'pointer',
                              }}
                              onClick={() => setImages(images?.filter((e) => e !== img))}
                            >
                              <FaRegTimesCircle />
                            </button>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
export default ReviewProductComponent
