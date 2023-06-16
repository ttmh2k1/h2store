import React from 'react'
import { useEffect, useState } from 'react'
import './productStyle.scss'
import { importCart } from '../../apis/cartApi'
import { getProduct } from '../../apis/productControllerApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper'
import { Button, Col, Image, InputNumber, Radio, Row } from 'antd'
import { formatMoney } from '../../utils/functionHelper'
import { toast } from 'react-toastify'

const ProductComponent = (props) => {
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
  const [product, setProduct] = useState([])
  // const [options, setOptions] = useState([])
  const [variations, setVariations] = useState([])
  const [choose, setChoose] = useState('')
  const [value, setValue] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [state, setState] = useState({
    key: -1,
    id: -1,
  })

  const onChange = (value) => {
    setQuantity(value)
  }

  useEffect(() => {
    const handleGetProduct = async () => {
      const resp = await getProduct(props.id)
      const data = resp?.data?.data
      setProduct(data)
    }
    handleGetProduct()
  }, [props.id])

  // useEffect(() => {
  //   const handleGetOptions = async () => {
  //     const resp = await getProduct(props.id)
  //     const data = resp?.data?.data
  //     setOptions(data.options)
  //   }
  //   handleGetOptions()
  // }, [props.id])

  useEffect(() => {
    const handleGetVariations = async () => {
      const resp = await getProduct(props.id)
      const data = resp?.data?.data
      setVariations(data.variations)
    }
    handleGetVariations()
  }, [props.id])

  useEffect(() => {
    const handleGetInfos = async () => {
      const resp = await getProduct(props.id)
      const data = resp?.data?.data
      setChoose(data.variations[state.key])
    }
    handleGetInfos()
  }, [props.id, state])

  const handleImport = async () => {
    try {
      await importCart({ idProductVariation: choose?.id, quantity: +quantity })
      toast.success('Product was added to cart!', style)
    } catch (error) {
      toast.error("Can't add product to cart!", style)
    }
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
              {product?.averageRating} <i data-star={product?.averageRating}></i>
            </div>
            <hr className="line" width="1" size="30" />
            <div className="reviews">{product?.totalRatingTimes} reviews</div>
            <hr className="line" width="1" size="30" />
            <div className="sold">{product?.nsold} sold</div>
          </div>
          <div className="productPrice">
            <div className="oldPrice">
              {!choose
                ? product?.minPrice === product?.maxPrice
                  ? formatMoney(product?.minPrice)
                  : formatMoney(product?.minPrice) + ' - ' + formatMoney(product?.maxPrice)
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
                {choose?.discount > 0 ? (
                  <div className="discount">Discount - {choose?.discount}%</div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="variation">
            <>
              <div className="title">Variations:</div>
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
                        {item?.name}
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                ))}
              </Row>
            </>

            {/* <div className="optionName">{options[0]?.optionName}</div>
            <Radio.Group>
              {options[0]?.optionValues?.map((value) => (
                <Radio.Button value={value?.value}>{value?.value}</Radio.Button>
              ))}
            </Radio.Group>
            <div className="optionName">{options[1]?.optionName}</div>
            <Radio.Group>
              {options[1]?.optionValues?.map((value) => (
                <Radio.Button value={value?.value}>{value?.value}</Radio.Button>
              ))}
            </Radio.Group> */}
          </div>
          <div className="quantity">
            Number:
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
              Available quantity: {choose?.availableQuantity}
            </div>
          </div>
          <div className="button">
            <Button className="addToCart" onClick={() => handleImport()}>
              Add to cart
            </Button>
            <Button className="buyNow">Buy now</Button>
          </div>
        </div>
      </div>
      <div className="productDescription">
        <div className="title">Description:</div>
        <div className="description"> {product?.description}</div>
      </div>
    </div>
  )
}

export default ProductComponent
