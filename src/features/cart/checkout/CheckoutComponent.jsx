import './checkoutStyle.scss'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { getCart, getListCart } from '../../../apis/cartApi'
import { Button, Checkbox, Divider, Image, Input, List, Modal, Radio, Select } from 'antd'
import { formatMoney } from '../../../utils/functionHelper'
import Table from '../../../components/table/Table'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Momo from '../../../commons/assets/momo.png'
import COD from '../../../commons/assets/cod.png'
import Paypal from '../../../commons/assets/paypal.png'
import { updateCart, updateCount } from '../../../actionCreators/CartCreator'
import {
  addAddressInfo,
  currentUser,
  getAddress,
  getAllCity,
  getDistrictOfCity,
  getFeeShip,
  getWardOfDistrict,
  updateAddressInfo,
} from '../../../apis/userApi'
import { getOrderByCart } from '../../../apis/orderApi'
import { AiFillEnvironment, AiOutlinePlus } from 'react-icons/ai'
import { IoTicketOutline } from 'react-icons/io5'
import { update, update as updateUser } from '../../../actionCreators/UserCreator'
import { updateAddress } from '../../../actionCreators/UserCreator'
import { getListVoucher } from '../../../apis/voucherApi'
import moment from 'moment'

const CheckoutComponent = () => {
  const style = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'colored',
  }

  const user = useSelector((state) => state?.user?.user)
  const listAddress = useSelector((state) => state?.user?.address)

  const [listCart, setListCart] = useState('')
  const [modalAddress, setModalAddress] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [modalNew, setModalNew] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState(false)
  const [chooseAddress, setChooseAddress] = useState(user?.defaultAddress?.id)
  const [address, setAddress] = useState(user?.defaultAddress)
  const [addressId, setAddressId] = useState(-1)
  const [addressEdit, setAddressEdit] = useState(false)
  const [optionAddress, setOptionAddress] = useState({
    City: [{ value: 0, label: 'City' }],
    District: [{ value: 0, label: 'District' }],
    Ward: [{ value: 0, label: 'Ward' }],
  })
  const [city, setCity] = useState(0)
  const [district, setDistrict] = useState(0)
  const [ward, setWard] = useState(0)
  const [addressDetail, setAddressDetail] = useState()
  const [fullname, setFullname] = useState()
  const [phone, setPhone] = useState()
  const [fee, setFee] = useState()
  const [payment, setPayment] = useState('OFFLINE_CASH_ON_DELIVERY')
  const [note, setNote] = useState('')
  const [coupon, setCoupon] = useState('')
  const [listTotalPrice, setListTotalPrice] = useState()
  const [totalPrice, setTotalPrice] = useState()
  const [voucher, setVoucher] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const [chooseVoucher, setChooseVoucher] = useState('')
  const [modalCoupon, setModalCoupon] = useState(false)

  const shipments = [
    {
      id: 'payment',

      name: 'COD',
      image: COD,
      key: 'OFFLINE_CASH_ON_DELIVERY',
    },
    {
      id: 'payment',

      name: 'MOMO',
      image: Momo,
      key: 'ONLINE_PAYMENT_MOMO',
    },
    {
      id: 'payment',

      name: 'PAYPAL',
      image: Paypal,
      key: 'ONLINE_PAYMENT_PAYPAL',
    },
  ]

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // const getCartInfo = async () => {
  //   const result = await getCart()
  //   if (result) {
  //     dispatch(updateCart(result?.data?.data))
  //   }
  // }

  const getListAddress = async () => {
    const result = await getAddress()
    if (result) {
      dispatch(updateAddress(result?.data?.data))
    }
  }

  const getListCity = async () => {
    const result = await getAllCity()
    if (result) {
      setOptionAddress({
        ...optionAddress,
        City: [
          { value: 0, label: 'City' },
          ...result?.data?.data?.map((city) => {
            return { value: city?.id, label: city?.name }
          }),
        ],
      })
    }
  }

  const getListDistrict = async (id) => {
    const result = await getDistrictOfCity(id)
    if (result) {
      setOptionAddress({
        ...optionAddress,
        District: [
          { value: 0, label: 'District' },
          ...result?.data?.data?.districts?.map((district) => {
            return { value: district?.id, label: district?.name }
          }),
        ],
      })
    }
  }

  const getListWard = async (id) => {
    const result = await getWardOfDistrict(id)
    if (result) {
      setOptionAddress({
        ...optionAddress,
        Ward: [
          { value: 0, label: 'Ward' },
          ...result?.data?.data?.wards?.map((ward) => {
            return { value: ward?.id, label: ward?.name }
          }),
        ],
      })
    }
  }

  const getCurrentUser = async () => {
    const result = await currentUser()
    if (result) {
      localStorage.removeItem('user')
      localStorage.setItem('user', result?.data?.data)
      dispatch(update(result?.data?.data))
    }
  }

  const newAddress = async () => {
    try {
      const result = await addAddressInfo({
        idAddressWard: ward,
        addressDetail: addressDetail,
        receiverName: fullname,
        receiverPhone: phone,
        setToDefault: defaultAddress,
      })

      if (result) {
        toast.success('Create new address successfully!', style)
        dispatch(updateAddress([...listAddress, result?.data?.data]))
        setPhone('')
        setFullname('')
        setAddressDetail('')
        setCity(0)
        setDistrict(0)
        setWard(0)
        getCurrentUser()
        setDefaultAddress(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  const editAddress = async (e) => {
    try {
      const result = await updateAddressInfo(e?.id, {
        idAddressWard: ward ? ward : e?.addressWard?.id,
        addressDetail: addressDetail ? addressDetail : e?.addressDetail,
        receiverName: fullname,
        receiverPhone: phone,
        setToDefault: e?.id === user?.defaultAddress?.id ? true : false,
      })

      if (result) {
        dispatch(
          updateAddress(
            listAddress?.map((item) => (item?.id === e?.id ? result?.data?.data : item)),
          ),
        )
        toast.success('Update address successfully!', style)
        setDefaultAddress(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  const changeAddress = (index) => {
    setChooseAddress(index)
    const tmp = listAddress?.filter((item) => item?.id === index)[0]
    if (tmp) {
      setAddress(tmp)
    }
  }

  const changeVoucher = (index) => {
    setChooseVoucher(index)
    const tmp = voucher?.filter((item) => item?.id === index)[0]
    if (tmp) {
      setCoupon(tmp)
    }
  }

  const handleOrder = async () => {
    const idProductVariation = listCart?.map((item) => item?.productVariation?.id)
    try {
      const result = await getOrderByCart({
        note: note,
        couponCode: coupon?.code,
        idDeliveryAddress: address?.id,
        paymentMethod: payment,
        idProductVariations: idProductVariation,
      })
      if (result?.data?.data?.payUrl) {
        window.location.href = result?.data?.data?.payUrl
      } else {
        toast.success('Get order successful!', style)
        navigate('/orderHistory')
        dispatch(updateCount(0))
        dispatch(updateCart([]))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, style)
    }
  }

  useEffect(() => {
    const getListTotalPrice = async () => {
      if (listCart?.length > 0) {
        const resp = await getListCart({ size: listCart?.length })
        const data = resp?.data?.data
        setListTotalPrice(
          data?.map((item) => ({
            total: item?.quantity * item?.productVariation?.priceAfterDiscount,
          })),
        )
      }
    }
    getListTotalPrice()
  }, [listCart])

  useEffect(() => {
    const getTotalPrice = async () => {
      let sum = 0
      listTotalPrice?.map((item) => (sum += item?.total))
      setTotalPrice(sum)
    }
    getTotalPrice()
  }, [listTotalPrice])

  function handleUpdate(e) {
    editAddress(e)
  }

  function handleNew(e) {
    newAddress(e)
  }

  useEffect(() => {
    if (user?.defaultAddress) {
      changeAddress(user?.defaultAddress?.id)
    }
  }, [listAddress])

  useEffect(() => {
    getListAddress()
    getListCity()
    if (user?.defaultAddress) {
      setAddress(user?.defaultAddress?.id)
      setFullname(user?.defaultAddress?.receiverName)
      setPhone(user?.defaultAddress?.receiverPhone)
    }
  }, [user])

  useEffect(() => {
    if (optionAddress?.City?.length > 1) {
      getListDistrict(city)
    }
  }, [city])

  useEffect(() => {
    if (optionAddress?.District?.length > 1) {
      getListWard(district)
    }
  }, [district])

  useEffect(() => {
    const handleGetListCart = async () => {
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
    handleGetListCart()
  }, [user])

  // useEffect(() => {
  //   getCartInfo()
  // })

  useEffect(() => {
    const handleGetFeeShip = async () => {
      if (address?.id) {
        const resp = await getFeeShip(address?.id)
        const data = resp?.data
        setFee(data?.fee)
      }
    }
    handleGetFeeShip()
  }, [address])

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getListVoucher()
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetFavorite = async () => {
      const resp = await getListVoucher({ size: pageSize })
      const data = resp?.data?.data
      setVoucher(data)
    }
    handleGetFavorite()
  }, [pageSize])

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
      align: 'justify',
      render: (variation) => {
        return <div className="variation">{variation?.name}</div>
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => {
        return <div className="price">{formatMoney(price.priceAfterDiscount)}</div>
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => <div className="quantity">{quantity}</div>,
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
  ])

  return (
    <div className="checkoutPage">
      <div className="checkoutContent">
        <div className="title">CHECKOUT</div>

        <div className="shipingInfo">
          <div className="shipingTitle">
            <AiFillEnvironment style={{ marginRight: '0.4vw' }} />
            Shipping infomation
          </div>
          <div className="info">
            {address && (
              <div className="addressInfo">
                <div className="receiverName">
                  {address ? address?.receiverName : user?.defaultAddress?.receiverName}
                </div>
                <div className="receiverPhone">
                  {address ? address?.receiverPhone : user?.defaultAddress?.receiverPhone}
                </div>
                <div className="address">
                  {address
                    ? address?.addressDetail +
                      ', ' +
                      address?.addressWard?.name +
                      ', ' +
                      address?.addressWard?.district?.name +
                      ', ' +
                      address?.addressWard?.district?.provinceCity?.name
                    : user?.defaultAddress?.addressDetail +
                      ', ' +
                      user?.defaultAddress?.addressWard?.name +
                      ', ' +
                      user?.defaultAddress?.addressWard?.district?.name +
                      ', ' +
                      user?.defaultAddress?.addressWard?.district?.provinceCity?.name}
                  {chooseAddress === user?.defaultAddress?.id ? (
                    <div className="default">Default</div>
                  ) : null}
                </div>
              </div>
            )}
            <div
              className="changeAddress"
              onClick={() => {
                setAddressEdit(!addressEdit)
                setModalAddress(true)
              }}
            >
              Change address
            </div>
          </div>
        </div>

        <div className="listProduct">
          <Table
            columns={columns}
            dataSource={listCart}
            scroll={{ y: 480 }}
            pagination={{
              defaultPageSize: 100,
              showQuickJumper: false,
              responsive: true,
            }}
          />
        </div>

        <div className="shipInfo">
          <div className="note">
            <div className="noteTitle">Note:</div>
            <Input className="noteText" onChange={(e) => setNote(e?.target?.value)} />
          </div>
          <Divider type="vertical" style={{ height: '1.6vw' }} />
          <div className="ship">
            <div className="shipTitle">Shipping unit:</div>
            <div className="price">{formatMoney(fee)}</div>
          </div>
        </div>

        <div className="voucher">
          <div className="voucherTitle">
            <IoTicketOutline size="1.2vw" style={{ marginRight: '0.8vw' }} /> Voucher
          </div>
          <div className="voucherInfo">
            {coupon && <div className="voucherCode">{coupon?.code}</div>}
            <div className="voucherButton" onClick={() => setModalCoupon(true)}>
              Choose voucher
            </div>
          </div>
        </div>

        <div className="paymentMethod">
          <div className="paymentTitle">Payment method</div>
          <Radio.Group
            defaultValue="OFFLINE_CASH_ON_DELIVERY"
            onChange={(e) => setPayment(e?.target?.value)}
          >
            {shipments.map((item) => {
              return (
                <Radio
                  value={item?.key}
                  style={{
                    fontSize: '0.8vw',
                    display: 'flex',
                    marginLeft: '0.2vw',
                  }}
                >
                  <div className="method">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      height="28vw"
                      width="28vw"
                      style={{ marginRight: '0.2vw' }}
                    />
                    {item?.name}
                  </div>
                </Radio>
              )
            })}
          </Radio.Group>
        </div>

        <div className="bill">
          <div className="productPrice">
            <div className="productPriceTitle">Product price:</div>
            <div className="totalProductPrice">{formatMoney(totalPrice)}</div>
          </div>
          {user?.rank?.discountRate > 0 && (
            <div className="discountCustomer">
              <div className="discountCustomerTitle">Customer discount:</div>
              <div className="discountCustomerPrice">
                -{' '}
                {formatMoney(parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0))}
              </div>
            </div>
          )}

          <div className="shipPrice">
            <div className="shipPriceTitle">Shipping fee:</div>
            <div className="shipFee">{formatMoney(fee)}</div>
          </div>

          {coupon && (
            <div className="discountVoucher">
              <div className="discountVoucherTitle">Voucher discount:</div>
              <div className="discountVoucherPrice">
                -{' '}
                {coupon?.discountType === 'AMOUNT'
                  ? coupon?.discountAmount <= coupon?.maxDiscount
                    ? formatMoney(coupon?.discountAmount)
                    : formatMoney(coupon?.maxDiscount)
                  : (coupon?.discountAmount *
                      (totalPrice -
                        parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                        fee)) /
                      100 <=
                    coupon?.maxDiscount
                  ? formatMoney(
                      parseFloat(
                        (coupon?.discountAmount *
                          (totalPrice -
                            parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                            fee)) /
                          100,
                      ).toFixed(0),
                    )
                  : formatMoney(coupon?.maxDiscount)}
              </div>
            </div>
          )}

          <div className="totalPayment">
            <div className="totalPaymentTitle">Total payment:</div>
            <div className="totalPaymentPrice">
              {chooseVoucher
                ? coupon?.discountType === 'AMOUNT'
                  ? coupon?.discountAmount <= coupon?.maxDiscount
                    ? formatMoney(
                        totalPrice -
                          parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                          fee -
                          coupon?.discountAmount,
                      )
                    : formatMoney(
                        totalPrice -
                          parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                          fee -
                          coupon?.maxDiscount,
                      )
                  : (coupon?.discountAmount *
                      (totalPrice -
                        parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                        fee)) /
                      100 >
                    coupon?.maxDiscount
                  ? formatMoney(
                      totalPrice -
                        parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                        fee -
                        coupon?.discountAmount,
                    )
                  : formatMoney(
                      parseFloat(
                        totalPrice -
                          parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                          fee -
                          parseFloat(
                            (coupon?.discountAmount *
                              (totalPrice -
                                parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(
                                  0,
                                ) +
                                fee)) /
                              100,
                          ).toFixed(0),
                      ).toFixed(0),
                    )
                : formatMoney(
                    totalPrice -
                      parseFloat((totalPrice * user?.rank?.discountRate) / 100).toFixed(0) +
                      fee,
                  )}
            </div>
          </div>
        </div>

        <div className="order">
          <Button
            className="orderButton"
            disabled={listCart?.length < 1}
            onClick={() => handleOrder()}
          >
            ORDER
          </Button>
        </div>
      </div>

      <Modal
        className="modal"
        title="My address"
        centered
        open={modalAddress}
        onOk={() => {
          setModalAddress(false)
        }}
        onCancel={() => setModalAddress(false)}
        width={'36vw'}
        destroyOnClose={true}
      >
        <Radio.Group
          name="radiogroup"
          value={chooseAddress}
          defaultValue={user?.defaultAddress?.id}
          onChange={(e) => changeAddress(e?.target?.value)}
        >
          <List
            className="listAddress"
            dataSource={listAddress}
            renderItem={(item) => (
              <List.Item>
                <Radio
                  value={item?.id}
                  style={{
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <div
                    className="item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      margin: '0 0.2vw',
                    }}
                  >
                    <div
                      className="main"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '30vw',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <div
                        className="receiverInfo"
                        style={{ display: 'flex', alignItems: 'flex-end' }}
                      >
                        <div
                          className="receiverName"
                          style={{ fontSize: '1.2vw', color: '#77675a' }}
                        >
                          {item?.receiverName}
                        </div>
                        <Divider type="vertical" style={{ height: '1.6vw' }} />
                        <div className="receiverPhone" style={{ fontSize: '1vw' }}>
                          {item?.receiverPhone}
                        </div>
                      </div>
                      <div className="action" style={{ display: 'flex' }}>
                        <div
                          className="update"
                          style={{
                            fontSize: '1vw',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setAddressId(item?.id)
                            setAddressEdit(!addressEdit)
                            setModalUpdate(true)
                            setModalAddress(false)
                          }}
                        >
                          Update
                        </div>
                      </div>
                    </div>
                    <div
                      className="detail"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <div
                        className="address"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          fontSize: '1vw',
                        }}
                      >
                        {item?.addressDetail}
                        <br />
                        {item?.addressWard?.name +
                          ', ' +
                          item?.addressWard?.district?.name +
                          ', ' +
                          item?.addressWard?.district?.provinceCity?.name}
                      </div>
                    </div>
                    {item?.id === user?.defaultAddress?.id && (
                      <div
                        className="default"
                        style={{
                          fontSize: '0.8vw',
                          color: 'red',
                          border: '0.08vw solid red',
                          borderRadius: '0.4vw',
                          padding: '0 0.2vw',
                          width: 'fit-content',
                        }}
                      >
                        Default
                      </div>
                    )}
                  </div>
                </Radio>
              </List.Item>
            )}
          />
        </Radio.Group>
        <Button
          className="addAddress"
          style={{
            fontSize: '0.8vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '0.2vw',
            color: '#77675a',
            border: '0.12rem solid #77675a',
            background: '#decdbb',
          }}
          onClick={() => {
            setModalNew(true)
            setModalAddress(false)
          }}
        >
          <AiOutlinePlus size={'0.8vw'} style={{ marginRight: '0.2vw' }} />
          Add new address
        </Button>
      </Modal>
      <Modal
        className="modal"
        title="Update address"
        centered
        open={modalUpdate}
        onOk={() => {
          setModalUpdate(false)
          handleUpdate(listAddress?.filter((item) => item?.id === addressId)[0])
        }}
        onCancel={() => setModalUpdate(false)}
        width={'40vw'}
        destroyOnClose={true}
      >
        <div
          className="info"
          style={{
            display: 'flex',
            flexDirection: 'rows',
            justifyContent: 'space-between',
          }}
        >
          <div className="name" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">Name</div>
            <Input
              className="input"
              defaultValue={listAddress?.filter((item) => item?.id === addressId)[0]?.receiverName}
              value={fullname}
              onChange={(e) => setFullname(e?.target?.value)}
              style={{ width: '18vw' }}
            />
          </div>
          <div className="phone" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">Phone</div>
            <Input
              className="input"
              defaultValue={listAddress?.filter((item) => item?.id === addressId)[0]?.receiverPhone}
              value={phone}
              onChange={(e) => setPhone(e?.target?.value)}
              style={{ width: '18vw' }}
              minLength={10}
              maxLength={10}
            />
          </div>
        </div>
        <div className="address">
          <div
            className="addressGroup"
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: '0.8vw',
            }}
          >
            <div className="group">
              <div className="label">City</div>
              <Select
                className="select"
                defaultValue={
                  listAddress?.filter((item) => item?.id === addressId)[0]?.addressWard?.district
                    ?.provinceCity?.name
                }
                style={{
                  width: '12vw',
                }}
                select={city}
                onChange={(e) => setCity(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.City}
              />
            </div>
            <div className="group">
              <div className="label">District</div>
              <Select
                className="select"
                defaultValue={
                  listAddress?.filter((item) => item?.id === addressId)[0]?.addressWard?.district
                    ?.name
                }
                style={{
                  width: '12vw',
                }}
                select={district}
                onChange={(e) => setDistrict(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.District}
              />
            </div>
            <div className="group">
              <div className="label">Ward</div>
              <Select
                className="select"
                defaultValue={
                  listAddress?.filter((item) => item?.id === addressId)[0]?.addressWard?.name
                }
                style={{
                  width: '12vw',
                }}
                select={ward}
                onChange={(e) => setWard(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.Ward}
              />
            </div>
          </div>
          <div
            className="addressDetail"
            style={{
              marginTop: '0.8vw',
            }}
          >
            <div className="label">Detail address</div>
            <Input
              className="input"
              defaultValue={listAddress?.filter((item) => item?.id === addressId)[0]?.addressDetail}
              style={{
                width: '100%',
              }}
              value={addressDetail}
              onChange={(e) => setAddressDetail(e?.target?.value)}
              required={true}
            />
          </div>
        </div>
        <Checkbox
          className="defaultAddress"
          style={{ marginTop: '0.8vw' }}
          checked={
            true
              ? listAddress?.filter((item) => item?.id === addressId)[0]?.id ===
                user?.defaultAddress?.id
              : false
          }
          disabled={
            true
              ? listAddress?.filter((item) => item?.id === addressId)[0]?.id ===
                user?.defaultAddress?.id
              : false
          }
          onChange={(e) => setDefaultAddress(e?.target?.data)}
        >
          Set default address
        </Checkbox>
      </Modal>
      <Modal
        className="modalNew"
        title="New address"
        centered
        open={modalNew}
        onOk={() => {
          setModalNew(false)
          handleNew()
        }}
        onCancel={() => {
          setModalNew(false)
        }}
        width={'40vw'}
        destroyOnClose={true}
      >
        <div
          className="info"
          style={{ display: 'flex', flexDirection: 'rows', justifyContent: 'space-between' }}
        >
          <div className="name" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">Name</div>
            <Input
              className="input"
              onChange={(e) => setFullname(e?.target?.value)}
              style={{ width: '18vw' }}
            />
          </div>
          <div className="phone" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">Phone</div>
            <Input
              className="input"
              onChange={(e) => setPhone(e?.target?.value)}
              style={{ width: '18vw' }}
              minLength={10}
              maxLength={10}
            />
          </div>
        </div>
        <div className="address">
          <div
            className="addressGroup"
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: '0.8vw',
            }}
          >
            <div className="group">
              <div className="label">City</div>
              <Select
                className="select"
                style={{
                  width: '12vw',
                }}
                onChange={(e) => setCity(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.City}
              />
            </div>
            <div className="group">
              <div className="label">District</div>
              <Select
                className="select"
                style={{
                  width: '12vw',
                }}
                select={district}
                onChange={(e) => setDistrict(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.District}
              />
            </div>
            <div className="group">
              <div className="label">Ward</div>
              <Select
                className="select"
                style={{
                  width: '12vw',
                }}
                select={ward}
                onChange={(e) => setWard(e)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={optionAddress?.Ward}
              />
            </div>
          </div>
          <div
            className="addressDetail"
            style={{
              marginTop: '0.8vw',
            }}
          >
            <div className="label">Detail address</div>
            <Input
              className="input"
              style={{
                width: '100%',
              }}
              onChange={(e) => setAddressDetail(e?.target?.value)}
              required={true}
            />
          </div>
        </div>
        <Checkbox
          className="defaultAddress"
          style={{ marginTop: '0.8vw' }}
          onChange={() => setDefaultAddress(true)}
        >
          Set default address
        </Checkbox>
      </Modal>
      <Modal
        className="modal"
        title="Voucher"
        centered
        open={modalCoupon}
        onOk={() => {
          setModalCoupon(false)
        }}
        onCancel={() => setModalCoupon(false)}
        width={'36vw'}
        destroyOnClose={true}
      >
        <Radio.Group
          name="radiogroup"
          value={chooseVoucher}
          onChange={(e) => changeVoucher(e?.target?.value)}
        >
          <List
            className="listAddress"
            dataSource={voucher}
            renderItem={(item) => (
              <List.Item>
                <Radio
                  value={item?.id}
                  style={{
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <div
                    className="item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      margin: '0 0.2vw',
                    }}
                  >
                    <div
                      className="main"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '30vw',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        backgroundColor: '#decdbb1f',
                        borderRadius: '0.4vw',
                        margin: '1.2vw',
                      }}
                    >
                      <div
                        className="voucherInfo"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '0.2vw 0',
                        }}
                      >
                        <div
                          className="code"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '10vw',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1vw',
                            fontWeight: 'bold',
                          }}
                        >
                          {item?.code}
                        </div>
                        <Divider type="vertical" style={{ height: '10vw' }} />
                        <div
                          className="info"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            margin: '0.4vw 0',
                            fontSize: '0.6vw',
                          }}
                        >
                          <div
                            className="description"
                            style={{
                              color: '#77675a',
                              fontSize: '0.8vw',
                              fontWeight: 'bold',
                            }}
                          >
                            {item?.description}
                          </div>
                          <div className="minOrderAmount">
                            Minimum value: {formatMoney(item?.minOrderAmount)}
                          </div>
                          <div
                            className="discount"
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                            }}
                          >
                            Discount:&nbsp;
                            {item?.discountType === 'AMOUNT' ? (
                              <div className="discountAmount">
                                {formatMoney(item?.discountAmount)}
                              </div>
                            ) : (
                              <div className="discountAmount">{item?.discountAmount}%</div>
                            )}
                          </div>
                          <div className="maxDiscount">
                            Max discount: {formatMoney(item?.maxDiscount)}
                          </div>
                          <div className="startDate">
                            Start date: {moment(item?.validFrom).format('DD/MM/YY hh:mm')}
                          </div>
                          <div className="endDate">
                            End date: {moment(item?.validTo).format('DD/MM/YY hh:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Radio>
              </List.Item>
            )}
          />
        </Radio.Group>
      </Modal>
    </div>
  )
}

export default CheckoutComponent
