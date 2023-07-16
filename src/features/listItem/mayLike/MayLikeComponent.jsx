import './mayLikeStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getMayLikeProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'
import { useSelector } from 'react-redux'

const MayLikeComponent = () => {
  const user = useSelector((state) => state?.user?.user)
  const [mayLike, setMayLike] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetMayLike = async () => {
      try {
        const sessionId = ''
        const resp = await getMayLikeProduct({
          sessionId: user ? sessionId : localStorage?.getItem('sessionId'),
          isExplicit: localStorage?.getItem('token') ? true : false,
          size: 100,
        })
        const data = resp?.data?.data
        setMayLike(data)
      } catch (error) {
        return error
      }
    }
    handleGetMayLike()
  }, [])

  return (
    <div className="mayLike">
      <div className="productMayLike">
        <div className="title">YOU MAY LIKE</div>
        <List
          loading={!mayLike[0] && true}
          className="listMayLike"
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
          dataSource={mayLike}
          renderItem={(item) => (
            <div className="itemMayLike">
              <List.Item
                className="listItem"
                key={item.name}
                onClick={() => navigate({ pathname: '/product/' + item?.id })}
              >
                <Tooltip title={item?.name} color="#decdbb">
                  <div className="slideAvt">
                    <img className="imageMayLike" src={item?.avatar} alt="" />
                    {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                  </div>
                  <div className="textMayLike">
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

export default MayLikeComponent
