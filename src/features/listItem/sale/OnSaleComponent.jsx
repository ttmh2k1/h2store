import './onSaleStyle.scss'
import { List } from 'antd'
import { useEffect, useState } from 'react'
import { getTopSale } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'

const OnSaleComponent = () => {
  const [onSale, setOnSale] = useState([])

  useEffect(() => {
    const handleGetOnSale = async () => {
      const resp = await getTopSale()
      const data = resp?.data?.data
      setOnSale(data)
    }
    handleGetOnSale()
  }, [])

  return (
    <div className="onSale">
      <div className="productOnSale">
        <div className="title">ON SALE</div>
        <List
          className="listOnSale"
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
          dataSource={onSale}
          renderItem={(item) => (
            <div className="itemOnSale">
              <List.Item className="listItem" key={item.name}>
                <img className="imageOnSale" src={item?.avatar} />
                <div className="textOnSale">
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

export default OnSaleComponent
