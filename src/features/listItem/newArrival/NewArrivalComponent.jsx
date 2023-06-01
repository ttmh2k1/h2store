import './newArrivalStyle.scss'
import { List } from 'antd'
import { useEffect, useState } from 'react'
import { getLastedProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'

const NewArrivalComponent = () => {
  const [newArrival, setNewArrival] = useState([])

  useEffect(() => {
    const handleGetNewArrival = async () => {
      const resp = await getLastedProduct()
      const data = resp?.data?.data
      setNewArrival(data)
    }
    handleGetNewArrival()
  }, [])

  return (
    <div className="newArrival">
      <div className="productNewArrival">
        <div className="title">NEW ARRIVAL</div>
        <List
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
          pagination={{ pageSize: 8 }}
          dataSource={newArrival}
          renderItem={(item) => (
            <div className="itemNewArrival">
              <List.Item className="listItem" key={item.name}>
                <img className="imageNewArrival" src={item?.avatar} />
                <div className="textNewArrival">
                  <div className="name">{item?.name}</div>
                  <div className="price">Price: {formatMoney(item?.minPrice)}</div>
                </div>
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}

export default NewArrivalComponent
