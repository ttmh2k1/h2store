import { Button, Carousel } from 'antd'
import './slideStyle.scss'
import React, { useEffect, useState } from 'react'
import { getTopSale } from '../../apis/productControllerApi'

const Slide = () => {
  const [slide, setSlide] = useState([])

  useEffect(() => {
    const handleGetTopSale = async () => {
      const resp = await getTopSale()
      const data = resp?.data?.data
      setSlide(data)
    }
    handleGetTopSale()
  }, [])

  return (
    <div className="slide">
      <div className="slideBackground">
        <Carousel autoplay effect="fade" autoplaySpeed={1000}>
          {slide?.map((item) => (
            <div className="slideContent">
              <img className="slideImage" src={item?.avatar} />
              <div className="slideText">
                <div className="topSale">ON SALE</div>
                <div className="name">{item?.name}</div>
                <div className="description">{item?.description}</div>
              </div>
              <div className="slideButton">
                <Button className="detailButton" href={'/product/' + item?.id}>
                  Detail
                </Button>
                <Button className="buyButton">Buy now</Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default Slide
