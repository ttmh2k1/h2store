import './viewedStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getViewedProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const ViewedComponent = () => {
  const [viewed, setViewed] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getViewedProduct({
        sessionId: localStorage?.getItem('sessionId'),
      })
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetViewed = async () => {
      const resp = await getViewedProduct({
        sessionId: localStorage?.getItem('sessionId'),
        size: pageSize,
      })
      const data = resp?.data?.data
      setViewed(data)
    }
    handleGetViewed()
  }, [])

  return (
    <div className="viewedPage">
      <div className="viewedProductList">
        <div className="title">VIEWED PRODUCTS</div>
        <List
          loading={!viewed[0] && true}
          className="listViewed"
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
          dataSource={viewed}
          renderItem={(item) => (
            <div className="itemViewed">
              <List.Item
                className="listItem"
                key={item.name}
                onClick={() => navigate({ pathname: '/product/' + item?.id })}
              >
                <Tooltip title={item?.name} color="#decdbb">
                  <div className="slideAvt">
                    <img className="imageViewed" src={item?.avatar} alt="" />
                    {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                  </div>
                  <div className="textViewed">
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

export default ViewedComponent
