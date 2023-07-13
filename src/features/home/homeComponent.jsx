import './homeStyle.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper'
import { useEffect, useState } from 'react'
import {
  getLastedProduct,
  getRecommendProduct,
  getTopSold,
  getTopView,
} from '../../apis/productControllerApi'
import { formatMoney } from '../../utils/functionHelper'
import Slide from '../../components/slide/Slide'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'
import { Rating } from 'react-simple-star-rating'

const HomeComponent = () => {
  const [newArrival, setNewArrival] = useState([])
  const [topView, setTopView] = useState([])
  const [topSold, setTopSold] = useState([])
  const [recommend, setRecommend] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetLastedProduct = async () => {
      const resp = await getLastedProduct()
      const data = resp?.data?.data
      setNewArrival(data)
    }
    handleGetLastedProduct()
  }, [])

  useEffect(() => {
    const handleGetTopSold = async () => {
      const resp = await getTopSold()
      const data = resp?.data?.data
      setTopSold(data)
    }
    handleGetTopSold()
  }, [])

  useEffect(() => {
    const handleGetTopView = async () => {
      const resp = await getTopView()
      const data = resp?.data?.data
      setTopView(data)
    }
    handleGetTopView()
  }, [])

  useEffect(() => {
    const handleGetRecommend = async () => {
      try {
        const sessionId = localStorage?.getItem('sessionId')
        if (sessionId !== null) {
          const resp = await getRecommendProduct({
            sessionId: localStorage?.getItem('sessionId'),
            isExplicit: localStorage?.getItem('token') ? true : false,
          })
          const data = resp?.data?.data
          setRecommend(data)
        }
      } catch (error) {
        return error
      }
    }
    handleGetRecommend()
  }, [])

  return (
    <>
      <Slide />
      <div className="homePage">
        <div className="newArrival">
          <div className="title">NEW ARRIVAL</div>
          <Link className="seeAll" to="/newArrival">
            See more
          </Link>
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
            {newArrival?.map((item) => (
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
        <div className="topSold">
          <div className="title">BEST SELLER</div>
          <Link className="seeAll" to="/newArrival">
            See more
          </Link>
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
            {topSold?.map((item) => (
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
        <div className="topView">
          <div className="title">TOP VIEW</div>
          <Link className="seeAll" to="/newArrival">
            See more
          </Link>
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
            {topView?.map((item) => (
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
                      <Rating
                        className="ratingPoint"
                        size={16}
                        initialValue={parseFloat(item?.averageRating).toFixed(0)}
                        label
                        transition
                        readonly
                        fillColor="orange"
                        emptyColor="gray"
                      />{' '}
                    </div>
                  </Tooltip>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="recommend">
          <div className="title">RECOMMEND</div>
          <Link className="seeAll" to="/recommend">
            See more
          </Link>
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
            {recommend?.map((item) => (
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
    </>
  )
}

export default HomeComponent
