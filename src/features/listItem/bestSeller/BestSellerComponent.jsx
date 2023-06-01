import './bestSellerStyle.scss'
import { List } from 'antd'
import { useEffect, useState } from 'react'
import { getTopSold } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'

const BestSellerComponent = () => {
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const handleGetBestSeller = async () => {
      const resp = await getTopSold()
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
          pagination={{ pageSize: 8 }}
          dataSource={bestSeller}
          renderItem={(item) => (
            <div className="itemBestSeller">
              <List.Item className="listItem" key={item.name}>
                <img className="imageBestSeller" src={item?.avatar} />
                <div className="textBestSeller">
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

export default BestSellerComponent
