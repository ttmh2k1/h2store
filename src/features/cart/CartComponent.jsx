import './cartStyle.scss'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getListCart } from '../../apis/cartApi'
import { InputNumber, List, Select } from 'antd'
import { formatMoney } from '../../utils/functionHelper'

const CartComponent = () => {
  const [listCart, setListCart] = useState('')
  const navigate = useNavigate()
  console.log(listCart)

  useEffect(() => {
    const handleGetOnSale = async () => {
      const resp = await getListCart({ size: 100 })
      const data = resp?.data?.data
      setListCart(
        data?.map((item) => ({
          quantity: item?.quantity,
          variation: item?.productVariation,
          product: item?.productVariation?.product,
          name: item?.productVariation?.product?.name,
          avatar: item?.productVariation?.product?.avatar,
          availableQuantity: item?.productVariation?.availableQuantity,
          discount: item?.productVariation?.discount,
          variationName: item?.productVariation?.name,
          price: item?.productVariation?.price,
          priceAfterDiscount: item?.productVariation?.priceAfterDiscount,
          totalPrice: item?.quantity * item?.productVariation?.priceAfterDiscount,
        })),
      )
    }
    handleGetOnSale()
  }, [])

  return (
    <div className="cartPage">
      <div className="cartContent">
        <div className="title">CART</div>{' '}
        <List
          className="listCart"
          size="large"
          itemLayout="vertical"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          dataSource={listCart}
          renderItem={(item) => (
            <div className="itemCart">
              <List.Item className="listItem" key={item.name}>
                <img
                  className="image"
                  src={item?.avatar}
                  alt=""
                  onClick={() => navigate({ pathname: '/product/' + item?.product?.id })}
                />
                <div
                  className="name"
                  onClick={() => navigate({ pathname: '/product/' + item?.product?.id })}
                >
                  {item?.name}
                </div>
                <div className="variation">
                  <Select
                    defaultValue={item?.variationName}
                    style={{
                      width: 120,
                    }}
                    options={[item?.variation]}
                  />
                </div>
                <div className="oldPrice"> {formatMoney(item?.price)}</div>
                <div className="price"> {formatMoney(item?.priceAfterDiscount)}</div>
                <div className="quantity">
                  <InputNumber
                    className="inputNumber"
                    defaultValue="1"
                    min="1"
                    // max={availableQuantity}
                    step="1"
                    // onChange={onChange}
                    stringMode
                  />
                </div>
                <div className="totalPrice"> {formatMoney(item?.totalPrice)}</div>
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}
export default CartComponent
