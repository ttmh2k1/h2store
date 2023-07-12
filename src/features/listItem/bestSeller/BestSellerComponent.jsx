import './bestSellerStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getTopSold } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const BestSellerComponent = () => {
  const [bestSeller, setBestSeller] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetBestSeller = async () => {
      const resp = await getTopSold({ size: 100 })
      const data = resp?.data?.data
      setBestSeller(data)
    }
    handleGetBestSeller()
  }, [])

  return (
    <div className="bestSeller">
      <div className="productBestSeller">
        <div className="title">BEST SELLER</div>
        <List
          className="listBestSeller"
          grid={{
            gutter: 12,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 3,
          }}
          size="large"
          itemLayout="vertical"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['8', '20', '50', '100'],
            defaultPageSize: 8,
          }}
          dataSource={bestSeller}
          renderItem={(item) => (
            <div className="itemBestSeller">
              <List.Item
                className="listItem"
                key={item.name}
                onClick={() => navigate({ pathname: '/product/' + item?.id })}
              >
                <Tooltip title={item?.name} color="#decdbb">
                  <img className="imageBestSeller" src={item?.avatar} alt="" />
                  <div className="textBestSeller">
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
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}

export default BestSellerComponent
