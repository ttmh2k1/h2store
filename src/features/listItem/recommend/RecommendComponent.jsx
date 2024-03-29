import './recommendStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getRecommendProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const RecommendComponent = () => {
  const [recommend, setRecommend] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetRecommend = async () => {
      try {
        const resp = await getRecommendProduct({
          size: 100,
        })
        const data = resp?.data?.data
        setRecommend(data)
      } catch (error) {
        return error
      }
    }
    handleGetRecommend()
  }, [])

  return (
    <div className="recommend">
      <div className="productRecommend">
        <div className="title">RECOMMEND PRODUCTS</div>
        <List
          loading={!recommend[0] && true}
          className="listRecommend"
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
          dataSource={recommend}
          renderItem={(item) => (
            <div className="itemRecommend">
              <List.Item
                className="listItem"
                key={item.name}
                onClick={() => navigate({ pathname: '/product/' + item?.id })}
              >
                <Tooltip title={item?.name} color="#decdbb">
                  <div className="slideAvt">
                    <img className="imageRecommend" src={item?.avatar} alt="" />
                    {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                  </div>
                  <div className="textRecommend">
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
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}

export default RecommendComponent
