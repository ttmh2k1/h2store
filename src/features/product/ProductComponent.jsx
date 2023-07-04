import './productStyle.scss'
import React from 'react'
import { useEffect, useState } from 'react'
import { importCart, countCart, getCart } from '../../apis/cartApi'
import { getProduct, getRecommendProduct, getViewedProduct } from '../../apis/productControllerApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper'
import { Button, Col, Image, InputNumber, Radio, Row, Tooltip } from 'antd'
import { formatMoney, formatNumber } from '../../utils/functionHelper'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateCart, updateCount } from '../../actionCreators/CartCreator'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { addFavoriteProduct, deleteFavoriteProduct, getFavoriteProduct } from '../../apis/favorite'

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
    theme: 'light',
  }
  const navigate = useNavigate()
  const [product, setProduct] = useState([])
  const [isFavorite, setIsFavorite] = useState()
  const [variations, setVariations] = useState([])
  const [choose, setChoose] = useState('')
  const [value, setValue] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [recommendProduct, setRecommendProduct] = useState([])
  const [viewedProduct, setViewedProduct] = useState([])
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
      const resp = await getProduct(props?.id)
      const data = resp?.data?.data
      setProduct(data)
    }
    handleGetProduct()
  }, [props?.id])

  useEffect(() => {
    const handleGetVariations = async () => {
      const resp = await getProduct(props?.id)
      const data = resp?.data?.data
      setVariations(data.variations)
    }
    handleGetVariations()
  }, [props?.id])

  useEffect(() => {
    const handleGetInfos = async () => {
      const resp = await getProduct(props?.id)
      const data = resp?.data?.data
      setChoose(data.variations[state.key])
    }
    handleGetInfos()
  }, [props?.id, state])

  useEffect(() => {
    const handleGetRecommendProduct = async () => {
      const resp = await getRecommendProduct({
        sessionId: localStorage?.getItem('sessionId'),
        isExplicit: localStorage?.getItem('token') ? true : false,
      })
      const data = resp?.data?.data
      setRecommendProduct(data)
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
      if (tmp.length > 0) {
        setIsFavorite(true)
      } else setIsFavorite(false)
    }
    if (user) {
      handleGetFavorite()
    }
  }, [props?.id])

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
                    cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity,
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
    } else {
      toast.error("Can't add product to cart!", style)
    }
  }

  const handleBuyNow = async () => {
    let tmp = Number(quantity)
    if (cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity) {
      tmp =
        Number(quantity) +
        Number(cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity)
    }
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
                    cart?.filter((item) => item?.productVariation?.id === choose?.id)[0]?.quantity,
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
    } else {
      toast.error("Can't add product to cart!", style)
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

  return (
    <div className="productPage">
      <div className="productDetail">
        <div className="productImage">
          <img className="productAvatar" src={product?.avatar} alt="" />
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
        <div className="description"> {product?.description}</div>
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
                  onClick={() => navigate({ pathname: '/product/' + item?.id })}
                >
                  <img className="slideImage" src={item?.avatar} alt="" />
                  <div className="slideText">
                    <div className="name">{item?.name}</div>
                    <div className="price">Price: {formatMoney(item?.minPrice)}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="recommendProduct">
        <div className="title">
          Recommend products <Link to={'/recommend'}>See more</Link>
        </div>
        <div className="listProduct">
          <Swiper
            autoplay={{
              delay: 2000,
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
                  onClick={() => navigate({ pathname: '/product/' + item?.id })}
                >
                  <Tooltip title={item?.name} color="#decdbb">
                    <img className="slideImage" src={item?.avatar} alt="" />
                    <div className="slideText">
                      <div className="name">{item?.name}</div>
                      <div className="price">Price: {formatMoney(item?.minPrice)}</div>
                    </div>
                  </Tooltip>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {viewedProduct?.length > 0 && (
        <div className="viewedProduct">
          <div className="title">
            Viewed products <Link to={'/viewed'}>See more</Link>
          </div>
          <div className="listProduct">
            <Swiper
              autoplay={{
                delay: 2000,
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
                    onClick={() => navigate({ pathname: '/product/' + item?.id })}
                  >
                    <Tooltip title={item?.name} color="#decdbb">
                      <img className="slideImage" src={item?.avatar} alt="" />
                      <div className="slideText">
                        <div className="name">{item?.name}</div>
                        <div className="price">Price: {formatMoney(item?.minPrice)}</div>
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
