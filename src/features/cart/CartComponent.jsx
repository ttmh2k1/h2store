import './cartStyle.scss'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { deleteCart, getCart, countCart, getListCart, updateQuantity } from '../../apis/cartApi'
import { Button, Image, InputNumber, Select } from 'antd'
import { formatMoney } from '../../utils/functionHelper'
import { AiOutlineDelete } from 'react-icons/ai'
import Table from '../../components/table/Table'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateCount, updateCart } from '../../actionCreators/CartCreator'

const CartComponent = () => {
  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'light',
  }

  const user = useSelector((state) => state.user.user)
  const cart = useSelector((state) => state.cart.cart)

  const [listCart, setListCart] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getCartInfo = async () => {
    const result = await getCart()
    if (result) {
      dispatch(updateCart(result?.data?.data))
    }
  }

  const getCountCart = async () => {
    const result = await countCart()
    if (result) {
      dispatch(updateCount(result?.data?.data))
    }
  }

  const onChangeQuantity = async (id, quantity) => {
    await updateQuantity(id, quantity)
    dispatch(updateCount(quantity))
    dispatch(
      updateCart(
        cart.map((item) =>
          item?.productVariation?.id === id ? { ...item, quantity: quantity } : item,
        ),
      ),
    )
    toast.success('Update cart success!', style)
  }

  useEffect(() => {
    const handleGetOnSale = async () => {
      const resp = await getListCart({ size: 100 })
      const data = resp?.data?.data
      setListCart(
        data?.map((item) => ({
          quantity: item?.quantity,
          variation: item?.productVariation,
          product: item?.productVariation?.product,
          avatar: item?.productVariation?.product?.avatar,
          availableQuantity: item?.productVariation?.availableQuantity,
          discount: item?.productVariation?.discount,
          variationName: item?.productVariation?.name,
          variationId: item?.productVariation?.id,
          variationQuantity: {
            idProductVariation: item?.productVariation?.id,
            quantity: item?.quantity,
            availableQuantity: item?.productVariation?.availableQuantity,
          },
          listVariation: item?.productVariation?.product?.variations,
          price: {
            price: item?.productVariation?.price,
            priceAfterDiscount: item?.productVariation?.priceAfterDiscount,
          },
          priceAfterDiscount: item?.productVariation?.priceAfterDiscount,
          totalPrice: item?.quantity * item?.productVariation?.priceAfterDiscount,
        })),
      )
    }
    handleGetOnSale()
  }, [cart])

  const handleDeleteItem = async (id) => {
    await deleteCart(id)
    dispatch(updateCart(cart?.filter((item, index) => item?.productVariation?.id !== id)))
    toast.success('Product removed from cart successfully', style)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  useEffect(() => {
    getCartInfo()
    getCountCart()
  })

  const columns = useMemo(() => [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      align: 'center',
      render: (product) => {
        return (
          <div className="product">
            <Image className="image" src={product?.avatar} alt={product?.name} />
            <div
              className="productName"
              onClick={() => navigate({ pathname: `/product/${product?.id}` })}
            >
              {product?.name}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Variation',
      dataIndex: 'variation',
      key: 'variation',
      align: 'center',
      render: (variation) => {
        return (
          <div className="variation">
            <Select
              defaultValue={variation?.name}
              options={variation?.product?.variations?.map((item) => {
                return { value: item?.id, label: item?.name }
              })}
            />
          </div>
        )
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => {
        return (
          <div className="price">
            {price?.price !== price?.priceAfterDiscount ? (
              <div className="oldPrice"> {formatMoney(price.price)} </div>
            ) : null}
            <div className="priceAfterDiscount"> {formatMoney(price.priceAfterDiscount)} </div>
          </div>
        )
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'variationQuantity',
      key: 'variationQuantity',
      align: 'center',
      render: (variationQuantity) => (
        <div>
          <InputNumber
            className="inputNumber"
            defaultValue={variationQuantity?.quantity}
            min="1"
            max={variationQuantity?.availableQuantity}
            step="1"
            onChange={(e) =>
              onChangeQuantity(
                variationQuantity?.idProductVariation,
                e > variationQuantity?.availableQuantity ? variationQuantity?.availableQuantity : e,
              )
            }
            stringMode
          />
        </div>
      ),
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      render: (totalPrice) => {
        return {
          children: <div className="totalPrice">{formatMoney(totalPrice)}</div>,
        }
      },
    },
    {
      title: 'Action',
      key: 'variationId',
      dataIndex: 'variationId',
      align: 'center',
      render: (variationId) => {
        return (
          <div className="action flex justify-center">
            <Button
              onlyIcon
              onClick={() => handleDeleteItem(variationId)}
              classNameButton={'bg-transparent'}
              icon={
                <AiOutlineDelete
                  className="h-6 w-6"
                  width="60vw"
                  height="60vw"
                  color="red"
                ></AiOutlineDelete>
              }
            />
          </div>
        )
      },
    },
  ])

  return (
    <div className="cartPage">
      <div className="cartContent">
        <div className="title">CART</div>
        <div className="listCart">
          <Table
            dataSource={listCart}
            columns={columns}
            scroll={{ y: 560 }}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['8', '20', '50', '100'],
              defaultPageSize: 8,
            }}
          />
        </div>
        <div className="order">
          <Button
            className="orderButton"
            disabled={listCart.length < 1}
            onClick={() => navigate({ pathname: '/checkout' })}
          >
            ORDER
          </Button>
        </div>
      </div>
    </div>
  )
}
export default CartComponent
