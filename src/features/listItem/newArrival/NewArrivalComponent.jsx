import './newArrivalStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getLastedProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const NewArrivalComponent = () => {
  const [newArrival, setNewArrival] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetNewArrival = async () => {
      try {
        const resp = await getLastedProduct({ size: 100 })
        const data = resp?.data?.data
        setNewArrival(data)
      } catch (error) {
        return error
      }
    }
    handleGetNewArrival()
  }, [])

  return (
    <div className="newArrival">
      <div className="productNewArrival">
        <div className="title">NEW ARRIVAL</div>
        <List
          loading={!newArrival[0] && true}
          className="listNewArrival"
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
          dataSource={newArrival}
          renderItem={(item) => (
            <div className="itemNewArrival">
              <List.Item
                className="listItem"
                key={item.name}
                onClick={() => navigate({ pathname: '/product/' + item?.id })}
              >
                <Tooltip title={item?.name} color="#decdbb">
                  <div className="slideAvt">
                    <img className="imageNewArrival" src={item?.avatar} alt="" />
                    {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                  </div>
                  <div className="textNewArrival">
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

export default NewArrivalComponent
