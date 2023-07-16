import './productStyle.scss'
import React from 'react'
import { useEffect, useState } from 'react'
import { importCart, countCart, getCart } from '../../apis/cartApi'
import { getProduct, getRecommendProduct, getViewedProduct } from '../../apis/productControllerApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper'
import { Button, Col, Divider, Image, InputNumber, List, Radio, Row, Tabs, Tooltip } from 'antd'
import { formatMoney, formatNumber } from '../../utils/functionHelper'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateCart, updateCount } from '../../actionCreators/CartCreator'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { addFavoriteProduct, deleteFavoriteProduct, getFavoriteProduct } from '../../apis/favorite'
import TabPane from 'antd/es/tabs/TabPane'
import moment from 'moment'
import { getReviewProduct } from '../../apis/reviewControllerApi'
import Avatar from 'react-avatar'
import { Rating } from 'react-simple-star-rating'

const ProductComponent = (props) => {
  const user = useSelector((state) => state?.user?.user)
  const cart = useSelector((state) => state?.cart?.cart)
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
  const navigate = useNavigate()
  const [product, setProduct] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [variations, setVariations] = useState([])
  const [choose, setChoose] = useState('')
  const [value, setValue] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [recommendProduct, setRecommendProduct] = useState([])
  const [viewedProduct, setViewedProduct] = useState([])
  const [review, setReview] = useState([])
  const [pageSize, setPageSize] = useState(1)
  const [state, setState] = useState({
    key: -1,
    id: -1,
  })
  const dispatch = useDispatch()

  const onChange = (value) => {
    setQuantity(value)
  }

  useEffect(() => {
    const handleGetProduct = async () => {
      if (props?.id) {
        const resp = await getProduct(props?.id)
        const data = resp?.data?.data
        setProduct(data)
      }
    }
    handleGetProduct()
  }, [props?.id])

  useEffect(() => {
    const handleGetVariations = async () => {
      if (props?.id) {
        const resp = await getProduct(props?.id)
        const data = resp?.data?.data
        setVariations(data.variations)
      }
    }
    handleGetVariations()
  }, [props?.id])

  useEffect(() => {
    const handleGetInfos = async () => {
      if (props?.id) {
        const resp = await getProduct(props?.id)
        const data = resp?.data?.data
        setChoose(data?.variations[state?.key])
      }
    }
    handleGetInfos()
  }, [props?.id, state])

  useEffect(() => {
    const handleGetRecommendProduct = async () => {
      try {
        const sessionId = ''
        const resp = await getRecommendProduct({
          sessionId: user ? sessionId : localStorage?.getItem('sessionId'),
          isExplicit: localStorage?.getItem('token') ? true : false,
        })
        const data = resp?.data?.data
        setRecommendProduct(data)
      } catch (error) {
        return error
      }
    }
    handleGetRecommendProduct()
  }, [props?.id])

  useEffect(() => {
    const handleGetViewedProduct = async () => {
      const resp = await getViewedProduct({
        sessionId: localStorage?.getItem('sessionId'),
      })
      const data = resp?.data?.data
      setViewedProduct(data)
    }
    handleGetViewedProduct()
  }, [props?.id])

  useEffect(() => {
    const handleGetFavorite = async () => {
      const resp = await getFavoriteProduct({ size: 100 })
      const data = resp?.data?.data
      const tmp = data?.filter((item) => item?.product?.id === Number(props?.id))
      if (tmp?.length > 0) {
        setIsFavorite(true)
      } else setIsFavorite(false)
    }
    if (user) {
      handleGetFavorite()
    }
  }, [props?.id])

  useEffect(() => {
    const handleGetPage = async () => {
      if (props?.id) {
        const resp = await getReviewProduct(props?.id)
        const data = resp?.data
        setPageSize(data?.totalElement)
      }
    }
    handleGetPage()
  }, [props.id])

  useEffect(() => {
    const handleGetReview = async () => {
      if (props?.id) {
        const resp = await getReviewProduct(props?.id, { size: pageSize, sortByOldest: false })
        const data = resp?.data?.data
        setReview(data)
      }
    }
    handleGetReview()
  }, [props?.id, pageSize])

  const getCountCart = async () => {
    if (user) {
      const result = await countCart()
      if (result) {
        dispatch(updateCount(result?.data?.data))
      }
    }
  }

  const getCartInfo = async () => {
    if (user) {
      const result = await getCart()
      if (result) {
        dispatch(updateCart(result?.data?.data))
      }
    }
  }

  useEffect(() => {
    getCountCart()
    getCartInfo()
  }, [])

  const handleImport = async () => {
    let tmp = Number(quantity)
    if (cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity) {
      tmp =
        Number(quantity) +
        Number(cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity)
    }
    try {
      const result = await importCart({
        idProductVariation: choose?.id,
        quantity: +tmp,
      })

      dispatch(
        updateCart(
          cart?.map((item) =>
            item?.productVariation?.id === choose?.id
              ? {
                  ...item,
                  quantity:
                    Number(quantity) +
                    Number(
                      cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]
                        ?.quantity,
                    ),
                }
              : item,
          ),
        ),
      )
      if (result) {
        toast.success('Product was added to cart!', style)
        getCountCart()
        getCartInfo()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  const handleBuyNow = async () => {
    let tmp = Number(quantity)
    if (cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity) {
      tmp =
        Number(quantity) +
        Number(cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity)
    }

    try {
      const result = await importCart({
        idProductVariation: choose?.id,
        quantity: +tmp,
      })

      dispatch(
        updateCart(
          cart?.map((item) =>
            item?.productVariation?.id === choose?.id
              ? {
                  ...item,
                  quantity:
                    Number(quantity) +
                    Number(
                      cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]
                        ?.quantity,
                    ),
                }
              : item,
          ),
        ),
      )
      if (result) {
        toast.success('Product was added to cart!', style)
        getCountCart()
        getCartInfo()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
    setTimeout(() => {
      navigate({
        pathname: '/cart',
      })
    }, 1000)
  }

  const handleAddFavorite = async () => {
    setIsFavorite(!isFavorite)
    await addFavoriteProduct(props?.id)
    toast.success('Product was added to favorite products!', style)
  }

  const handleRemoveFavorite = async () => {
    setIsFavorite(!isFavorite)
    await deleteFavoriteProduct(props?.id)
    toast.success('Product removed from favorite products', style)
  }

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="productPage">
      <div className="productDetail">
        <div className="productImage">
          <div className="avatar">
            <img className="productAvatar" src={product?.avatar} alt="" />
            {product?.totalStock === 0 && <p className="outOfStock">Out of stock</p>}
          </div>
          <Swiper
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={4}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            className="swiper"
          >
            {product?.images?.map((item) => (
              <SwiperSlide>
                <div className="slideContent">
                  <Image className="slideImage" src={item?.url} alt="" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="productInfo">
          <div className="name">{product?.name}</div>
          <div className="productRating">
            <div className="averageRating">
              {parseFloat(product?.averageRating).toFixed(1)}
              <i data-star={parseFloat(product?.averageRating).toFixed(1)}></i>
            </div>
            <hr className="line" width="1" size="30" />
            <div className="reviews">{product?.totalRatingTimes} reviews</div>
            <hr className="line" width="1" size="30" />
            <div className="sold">{product?.nsold} sold</div>
            <hr className="line" width="1" size="30" />
            <div className="favoriteTag">
              {isFavorite === true ? (
                <AiFillHeart
                  onClick={() => handleRemoveFavorite()}
                  style={{ color: 'red', marginRight: '0.2vw' }}
                />
              ) : (
                <AiOutlineHeart
                  onClick={() => handleAddFavorite()}
                  style={{ color: 'red', marginRight: '0.2vw' }}
                />
              )}
              Favorite
            </div>
          </div>
          <div className="productPrice">
            <div className="oldPrice">
              {!choose
                ? product?.minOrgPrice === product?.maxOrgPrice
                  ? formatMoney(product?.minOrgPrice)
                  : formatMoney(product?.minOrgPrice) + ' - ' + formatMoney(product?.maxOrgPrice)
                : formatMoney(choose?.price)}
            </div>
            <div className="price">
              {!choose
                ? product?.minPrice === product?.maxPrice
                  ? formatMoney(product?.minPrice)
                  : formatMoney(product?.minPrice) + ' - ' + formatMoney(product?.maxPrice)
                : formatMoney(choose?.priceAfterDiscount)}
            </div>
            {product?.maxDiscount > 0 ? (
              <div className="onSale">
                <div className="discount">
                  {choose?.discount > 0
                    ? 'Discount - ' + choose?.discount + '%'
                    : 'Discount - ' + product?.maxDiscount + '%'}
                </div>
              </div>
            ) : null}
          </div>
          <div className="variation">
            <>
              <div className="title">Variations</div>
              <Row
                style={{ padding: '0' }}
                gutter={{
                  xs: 4,
                  sm: 8,
                  md: 16,
                  lg: 24,
                }}
              >
                {variations?.map((item, index) => (
                  <Col className="gutter-row" xs={6} xl={4}>
                    <Radio.Group value={value} onChange={() => setValue(item?.id)}>
                      <Tooltip title={item?.name} color="#decdbb">
                        <Radio.Button
                          className="variationOption"
                          value={item?.id}
                          disabled={item?.availableQuantity === 0}
                          onClick={() =>
                            setState(
                              state.key === index
                                ? {
                                    key: -1,
                                    id: -1,
                                  }
                                : { key: index, id: item.id },
                            )
                          }
                        >
                          <div className="name"> {item?.name}</div>
                        </Radio.Button>
                      </Tooltip>
                    </Radio.Group>
                  </Col>
                ))}
              </Row>
            </>
          </div>
          <div className="quantity">
            Number
            <div className="number">
              <InputNumber
                className="inputNumber"
                defaultValue="1"
                min="1"
                max={choose?.availableQuantity}
                step="1"
                onChange={onChange}
                stringMode
              />
              {choose ? 'Available quantity: ' + formatNumber(choose?.availableQuantity) : null}
            </div>
          </div>
          <div className="button">
            <Button
              className="addToCart"
              onClick={() => handleImport()}
              disabled={choose ? false : true}
            >
              Add to cart
            </Button>
            <Button
              className="buyNow"
              onClick={() => handleBuyNow()}
              disabled={choose ? false : true}
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>

      <div className="productDescription">
        <div className="title">Description</div>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: product?.description?.replace(/\r?\n/g, '<br/>') }}
        />
      </div>

      <div className="productReviews">
        <div className="title">Review product</div>
        <div className="productReviewsContent">
          <Tabs
            className="tab"
            defaultActiveKey="ALL"
            style={{
              display: 'flex',
              width: '94%',
              justifyContent: 'space-between',
              margin: '0 2vw',
            }}
          >
            <TabPane className="reviewTab" tab="All" key="ALL" onTabScroll="right">
              <List
                loading={!review[0] && true}
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="reviewTab" tab="5 stars" key="5stars" onTabScroll="right">
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.point === 5)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="reviewTab" tab="4 stars" key="4stars" onTabScroll="right">
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.point === 4)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="reviewTab" tab="3 stars" key="3stars" onTabScroll="right">
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.point === 3)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="reviewTab" tab="2 stars" key="2stars" onTabScroll="right">
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.point === 2)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="reviewTab" tab="1 star" key="1star" onTabScroll="right">
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.point === 1)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane
              className="reviewTab"
              tab="Comment with images"
              key="cmtImg"
              onTabScroll="right"
            >
              <List
                className="review"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  defaultPageSize: 5,
                }}
                dataSource={review?.filter((item) => item?.images?.length > 0)}
                renderItem={(item) => (
                  <>
                    <List.Item
                      style={{
                        padding: '0.4vw 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                    >
                      <div className="userInfo">
                        {item?.buyerAvatar ? (
                          <img className="avatar" src={item?.buyerAvatar} alt="" />
                        ) : (
                          <Avatar className="avatar" name={item?.buyerUsername} alt="" />
                        )}
                        <div className="info">
                          <div className="name">{item?.buyerUsername}</div>
                          <div className="rating">
                            {item?.point}&#160; <i data-star={item?.point}></i>
                          </div>
                          <div className="time">
                            {moment(item?.time).format('LLL')}
                            <Divider type="vertical" style={{ height: '1.2vw' }} />
                            Variation:
                            <div className="variation">{item?.productVariation?.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="content">{item?.content}</div>
                      <div className="listImage">
                        {item?.images?.length > 0 &&
                          item?.images.map((img) => {
                            return (
                              <div key={img} className="image">
                                <Image src={img?.url} className="img" alt="" />
                              </div>
                            )
                          })}
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>

      <div className="relativeProduct">
        <div className="title">
          Relative products <Link to={'/category/' + product?.category?.id}>See more</Link>
        </div>
        <div className="listProduct">
          <Swiper
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            breakpoints={{
              '@0.00': {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              '@0.75': {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              '@1.00': {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              '@1.50': {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            className="swiper"
          >
            {product?.relatedProducts?.map((item) => (
              <SwiperSlide>
                <div
                  className="slideContent"
                  onClick={() => {
                    navigate({ pathname: '/product/' + item?.id })
                    goToTop()
                  }}
                >
                  <div className="imageGroup">
                    <img className="slideImage" src={item?.avatar} alt="" />
                    {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                  </div>
                  <div className="slideText">
                    <div className="name">{item?.name}</div>
                    <div className="priceGroup">
                      {item?.minOrgPrice !== item?.minPrice && (
                        <div className="oldPrice">{formatMoney(item?.minOrgPrice)}</div>
                      )}
                      <div className="price">{formatMoney(item?.minPrice)}</div>
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {recommendProduct.length > 0 && (
        <div className="recommendProduct">
          <div className="title">
            Recommend products <Link to={'/recommend'}>See more</Link>
          </div>
          <div className="listProduct">
            <Swiper
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              breakpoints={{
                '@0.00': {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                '@0.75': {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                '@1.00': {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                '@1.50': {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
              className="swiper"
            >
              {recommendProduct?.map((item) => (
                <SwiperSlide>
                  <div
                    className="slideContent"
                    onClick={() => {
                      navigate({ pathname: '/product/' + item?.id })
                      goToTop()
                    }}
                  >
                    <Tooltip title={item?.name} color="#decdbb">
                      <div className="imageGroup">
                        <img className="slideImage" src={item?.avatar} alt="" />
                        {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                      </div>
                      <div className="slideText">
                        <div className="name">{item?.name}</div>
                        <div className="priceGroup">
                          {item?.minOrgPrice !== item?.minPrice && (
                            <div className="oldPrice">{formatMoney(item?.minOrgPrice)}</div>
                          )}
                          <div className="price">{formatMoney(item?.minPrice)}</div>
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
                    </Tooltip>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      {viewedProduct?.length > 0 && (
        <div className="viewedProduct">
          <div className="title">
            Viewed products <Link to={'/viewed'}>See more</Link>
          </div>
          <div className="listProduct">
            <Swiper
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              breakpoints={{
                '@0.00': {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                '@0.75': {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                '@1.00': {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                '@1.50': {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
              className="swiper"
            >
              {viewedProduct?.map((item) => (
                <SwiperSlide>
                  <div
                    className="slideContent"
                    onClick={() => {
                      navigate({ pathname: '/product/' + item?.id })
                      goToTop()
                    }}
                  >
                    <Tooltip title={item?.name} color="#decdbb">
                      <div className="imageGroup">
                        <img className="slideImage" src={item?.avatar} alt="" />
                        {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                      </div>
                      <div className="slideText">
                        <div className="name">{item?.name}</div>
                        <div className="priceGroup">
                          {item?.minOrgPrice !== item?.minPrice && (
                            <div className="oldPrice">{formatMoney(item?.minOrgPrice)}</div>
                          )}
                          <div className="price">{formatMoney(item?.minPrice)}</div>
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
                    </Tooltip>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductComponent
