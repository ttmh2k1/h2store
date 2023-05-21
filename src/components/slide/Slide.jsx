import { Button, Carousel } from 'antd'
import './slideStyle.scss'
import React, { useEffect, useState } from 'react'
import { getTopSale } from '../../apis/productControllerApi'

const Slide = () => {
  const [slide, setslide] = useState([])
  console.log(slide)
  useEffect(() => {
    const handleGetTopSale = async () => {
      const resp = await getTopSale()
      const data = resp?.data?.data
      setslide(data)
    }
    handleGetTopSale()
  }, [])

  return (
    <div className="slide">
      <div className="slideBackgroud">
        <Carousel autoplay effect="fade">
          {slide?.map((item) => (
            <div className="slideContent">
              <img className="slideImage" src={item?.avatar} />
              <div className="slideText">
                <div className="topSale">TOP SALE</div>
                <div className="name">{item?.name}</div>
                <div className="description">{item?.description}</div>
              </div>
              <div className="slideButton">
                <Button className="detailButton">Detail</Button>
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
