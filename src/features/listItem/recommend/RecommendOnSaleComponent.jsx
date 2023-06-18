import './recommendStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getRecommendProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'

const RecommendComponent = () => {
  const [recommend, setRecommend] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetRecommend = async () => {
      const resp = await getRecommendProduct({
        sessionId: localStorage?.getItem('sessionId'),
        isExplicit: localStorage?.getItem('token') ? true : false,
        size: 100,
      })
      const data = resp?.data?.data
      setRecommend(data)
    }
    handleGetRecommend()
  }, [])

  return (
    <div className="recommend">
      <div className="productRecommend">
        <div className="title">RECOMMEND PRODUCT</div>
        <List
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
                  <img className="imageRecommend" src={item?.avatar} alt="" />
                  <div className="textRecommend">
                    <div className="name">{item?.name}</div>
                    <div className="price">Price: {formatMoney(item?.minPrice)}</div>
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