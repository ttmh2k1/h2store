import './productStyle.scss'
import React from 'react'
import { useEffect, useState } from 'react'
import { importCart } from '../../apis/cartApi'
import { getProduct, getRecommendProduct } from '../../apis/productControllerApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper'
import { Button, Col, Image, InputNumber, Radio, Row, Tooltip } from 'antd'
import { formatMoney, formatNumber } from '../../utils/functionHelper'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [product, setProduct] = useState([])
  const [chosenVariation, setChosenVariation] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [recommendProduct, setRecommendProduct] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({}) // {productOptionId: productOptionValueId}, currently selected options
  const [productOptions, setProductOptions] = useState({}) // {productOptionId: {productOptionValueId: disabled}}, 'disabled' indicates whether the option value is disabled or not when other options are selected

  /**
   * Compare content of two arrays
   * @param {*} a the first array to compare
   * @param {*} b the second array to compare
   * @returns true if two arrays contain same elements, false otherwise
   */
  const arraysContainSame = (a, b) => {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every(el => b.includes(el));
  }

  const updateSelectedOptions = (selectedOptionId, newOptionValue) => {
    let updatedSelectedOptions = {...selectedOptions, [selectedOptionId] : newOptionValue};
    let selectedProductOptionIds = Object.keys(updatedSelectedOptions);
    
    if (selectedProductOptionIds.length == 0) { // no option are selected => enable all option values
      let tmp = productOptions;
      for (const k1 of Object.keys(productOptions)) {
        for (const k2 of Object.keys(productOptions[k1])) {
          tmp[k1][k2] = false; // enable all option values
        }
      }
      setProductOptions(tmp);
    }
    else {
      let productOptionIds = Object.keys(productOptions)
      let selectedOptionValueIds = Object.values(updatedSelectedOptions)

      if (selectedProductOptionIds.length == productOptionIds.length) { // all options are selected
        let found = false;
        for (let i = 0; i < product.variations.length; i++) {
          if (arraysContainSame(product.variations[i].optionValues, selectedOptionValueIds) && product.variations[i].availableQuantity > 0) {
            setChosenVariation(product.variations[i]);
            found = true;
            break;
          }
        };

        if (!found) { // variation is out of stock or variation is not found (deleted)
          updatedSelectedOptions = {[selectedOptionId] : newOptionValue}; // discard other selection
          selectedProductOptionIds = Object.keys(updatedSelectedOptions);
          selectedOptionValueIds = Object.values(updatedSelectedOptions);
          setChosenVariation(null);
        }
      }

      if (selectedProductOptionIds.length < productOptionIds.length) { // partial options are selected
        let remainProductOptionIds = productOptionIds.filter(k => !selectedProductOptionIds.includes(k));
        let tmp = productOptions;

        remainProductOptionIds.forEach(productOptionId => {
          for (const productOptionValueId of Object.keys(productOptions[productOptionId])) {
            let found = false;
            for (let i = 0; i < product.variations.length; i++) {
              if (selectedOptionValueIds.every(el => product.variations[i].optionValues.includes(el))) {
                if (product.variations[i].optionValues.includes(parseInt(productOptionValueId)) && product.variations[i].availableQuantity > 0) {
                  tmp = {...tmp, [productOptionId]: {...tmp[productOptionId], [productOptionValueId]: false}};
                  found = true;
                  break;
                }
              }
            };

            if (!found) {
              tmp = {...tmp, [productOptionId]: {...tmp[productOptionId], [productOptionValueId]: true}};
            }
          }
        });
        setProductOptions(tmp);
      }
    }

    setSelectedOptions(updatedSelectedOptions);
  }

  const onChange = (value) => {
    setQuantity(value)
  }

  useEffect(() => {
    const handleGetProduct = async () => {
      const resp = await getProduct(props?.id)
      const data = resp?.data?.data
      setProduct(data)

      let tmp = {}
      data?.options.forEach(productOption => {
        let po = {}
        productOption.optionValues.forEach(productOptionValue => {
          po = {...po, [productOptionValue.id]: false} // enable all
        });
        tmp = {...tmp, [productOption.id]: po}
      });
      setProductOptions(tmp)
    }
    handleGetProduct()
  }, [props?.id])

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

  const handleImport = async () => {
    try {
      await importCart({ idProductVariation: chosenVariation?.id, quantity: +quantity })
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
              {parseFloat(product?.averageRating).toFixed(1)}
              <i data-star={parseFloat(product?.averageRating).toFixed(1)}></i>
            </div>
            <hr className="line" width="1" size="30" />
            <div className="reviews">{product?.totalRatingTimes} reviews</div>
            <hr className="line" width="1" size="30" />
            <div className="sold">{product?.nsold} sold</div>
          </div>
          <div className="productPrice">
            <div className="oldPrice">
              {!chosenVariation
                ? product?.minOrgPrice === product?.maxOrgPrice
                  ? formatMoney(product?.minOrgPrice)
                  : formatMoney(product?.minOrgPrice) + ' - ' + formatMoney(product?.maxOrgPrice)
                : formatMoney(chosenVariation?.price)}
            </div>
            <div className="price">
              {!chosenVariation
                ? product?.minPrice === product?.maxPrice
                  ? formatMoney(product?.minPrice)
                  : formatMoney(product?.minPrice) + ' - ' + formatMoney(product?.maxPrice)
                : formatMoney(chosenVariation?.priceAfterDiscount)}
            </div>
            {product?.maxDiscount > 0 ? (
              <div className="onSale">
                <div className="discount">
                  {chosenVariation?.discount > 0
                    ? 'Discount - ' + chosenVariation?.discount + '%'
                    : 'Discount - ' + product?.maxDiscount + '%'}
                </div>
              </div>
            ) : null}
          </div>
          <div className="variation">

            {product?.options?.map((productOption, index) => (
              <div>
                <div className="title">{productOption.optionName}</div>
                <Row
                  style={{ padding: '0' }}
                  gutter={{
                    xs: 4,
                    sm: 8,
                    md: 16,
                    lg: 24,
                  }}
                >
                  <Radio.Group onChange={(event) => updateSelectedOptions(productOption.id, event.target.value)} value={selectedOptions[productOption.id]}>
                    {productOption.optionValues.map((productOptionValue, index) => (
                      <Col className="gutter-row" xs={6} xl={4}>
                          <Tooltip title={productOptionValue.value} color="#decdbb">
                            <Radio.Button 
                              className="variationOption" 
                              value={productOptionValue?.id}
                              disabled={productOptions[productOption.id][productOptionValue.id]}
                            >
                              <div className="name">{productOptionValue?.value}</div>
                            </Radio.Button>
                          </Tooltip>
                      </Col>
                    ))}
                  </Radio.Group>
                </Row>
              </div>
            ))}
          </div>
          <div className="quantity">
            Number
            <div className="number">
              <InputNumber
                className="inputNumber"
                defaultValue="1"
                min="1"
                max={chosenVariation?.availableQuantity}
                step="1"
                onChange={onChange}
                stringMode
              />
              {chosenVariation ? 'Available quantity: ' + formatNumber(chosenVariation?.availableQuantity) : null}
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
                  onClick={() =>
                    navigate({
                      pathname: '/product/' + `${item?.id}`,
                    })
                  }
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
    </div>
  )
}

export default ProductComponent
