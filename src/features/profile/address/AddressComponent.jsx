import './addressStyle.scss'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { Button, Checkbox, Divider, Image, Input, List, Modal, Select } from 'antd'
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  addAddressInfo,
  currentUser,
  deleteAddressInfo,
  getAddress,
  getAllCity,
  getDistrictOfCity,
  getWardOfDistrict,
  updateAddressInfo,
} from '../../../apis/userApi'
import { update, update as updateUser } from '../../../actionCreators/UserCreator'
import { updateAddress } from '../../../actionCreators/UserCreator'
import { toast } from 'react-toastify'

const AddressComponent = () => {
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

  const user = useSelector((state) => state?.user?.user)
  const listAddress = useSelector((state) => state?.user?.address)
  const [state, setState] = useState(true)
  const [addressEdit, setAddressEdit] = useState(false)
  const [addressId, setAddressId] = useState(-1)
  const [modalNew, setModalNew] = useState(false)
  const [modal, setModal] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState(false)
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

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getListAddress = async () => {
    const result = await getAddress()
    if (result) {
      dispatch(updateAddress(result?.data?.data))
    }
  }

  const handleDefaultAddress = async (address) => {
    const result = await updateAddressInfo(address?.id, {
      idAddressWard: address?.addressWard.id,
      addressDetail: address?.addressDetail,
      receiverName: address?.receiverName,
      receiverPhone: address?.receiverPhone,
      isDefault: true,
    })
    if (result) {
      toast.success('Set default address successful!', style)
      dispatch(
        updateUser({
          ...user,
          defaultAddress: listAddress?.find((item) => item?.id === address?.id),
        }),
      )
    } else {
      toast.error('Set default address failed!', style)
    }
  }

  useEffect(() => {
    setAddressEdit(false)
    setAddressId()
  }, [listAddress])

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
        Ward: [{ value: 0, label: 'Ward' }],
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
    const result = await addAddressInfo({
      idAddressWard: ward,
      addressDetail: addressDetail,
      receiverName: fullname,
      receiverPhone: phone,
      setToDefault: defaultAddress,
    })

    if (result) {
      toast.success('Created new address successfully!', style)
      dispatch(updateAddress([...listAddress, result?.data?.data]))
      setPhone('')
      setFullname('')
      setAddressDetail('')
      setCity(0)
      setDistrict(0)
      setWard(0)
      getCurrentUser()
      setDefaultAddress(false)
    } else toast.error('Failed!', style)
  }

  const editAddress = async (e) => {
    const result = await updateAddressInfo(e?.id, {
      idAddressWard: ward ? ward : e?.addressWard?.id,
      addressDetail: addressDetail ? addressDetail : e?.addressDetail,
      receiverName: fullname,
      receiverPhone: phone,
      setToDefault: e?.id === user?.defaultAddress?.id ? true : false,
    })

    if (result) {
      dispatch(
        updateAddress(listAddress?.map((item) => (item?.id === e?.id ? result?.data?.data : item))),
      )
      toast.success('Update address successfully!', style)
      setDefaultAddress(false)
    } else toast.error('Update address failed!', style)
  }

  const deleteAddress = async (id) => {
    await deleteAddressInfo(id)
    dispatch(updateAddress(listAddress?.filter((item, index) => item?.id !== id)))
    toast.success('Product removed from cart successfully', style)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  function handleUpdate(e) {
    editAddress(e)
  }

  function handleNew(e) {
    newAddress(e)
  }

  useEffect(() => {
    getListAddress()
    getListCity()
  }, [])

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

  return (
    <div className="addressPage">
      <div className="addressMenu">
        <div className="avatar">
          {user?.avatar !== null ? (
            <Image className="avatarImg" src={user?.avatar} alt="" />
          ) : (
            <Avatar alt="" className="avatarImg" name={user?.fullname} />
          )}
          <div className="text">
            <div className="userName">{user?.fullname}</div>
            <div
              className="editProfile"
              onClick={() =>
                navigate({
                  pathname: '/profile',
                })
              }
            >
              <AiOutlineEdit size={'0.8vw'} style={{ marginRight: '0.2vw' }} /> Edit profile
            </div>
          </div>
        </div>
        <div className="menu">
          <div className="profile">
            <div onClick={() => setState(!state)}> My profile</div>
            <List className={state ? 'profileItem' : 'hidden'}>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/profile',
                  })
                }
              >
                Profile
              </List.Item>
              <List.Item
                className="item"
                style={{ fontWeight: 'bold' }}
                onClick={() =>
                  navigate({
                    pathname: '/address',
                  })
                }
              >
                Address
              </List.Item>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/accountVerification',
                  })
                }
              >
                Account verification
              </List.Item>
              <List.Item
                className="item"
                onClick={() =>
                  navigate({
                    pathname: '/changePassword',
                  })
                }
              >
                Change password
              </List.Item>
            </List>
          </div>
          <div
            className="order"
            onClick={() =>
              navigate({
                pathname: '/orderHistory',
              })
            }
          >
            Order history
          </div>
          <div
            className="favoriteProduct"
            onClick={() =>
              navigate({
                pathname: '/favoriteProduct',
              })
            }
          >
            Favorite product
          </div>
        </div>
      </div>
      <div className="addressContent">
        <div className="title">
          My address
          <Button className="addAddress" onClick={() => setModalNew(true)}>
            <AiOutlinePlus size={'0.8vw'} style={{ marginRight: '0.2vw' }} />
            Add new address
          </Button>
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
        </div>
        <Divider />
        <div className="content">
          <List
            className="listAddress"
            dataSource={listAddress}
            renderItem={(item) => (
              <>
                <List.Item>
                  <>
                    <div className="item">
                      <div className="main">
                        <div className="receiverInfo">
                          <div className="receiverName">{item?.receiverName}</div>
                          <Divider type="vertical" style={{ height: '1.6vw' }} />
                          <div className="receiverPhone">{item?.receiverPhone}</div>
                        </div>
                        <div className="action">
                          <div
                            className="update"
                            onClick={() => {
                              setAddressId(item?.id)
                              setAddressEdit(!addressEdit)
                              setModal(true)
                            }}
                          >
                            Update
                          </div>
                          <Modal
                            className="modal"
                            title="Update address"
                            centered
                            open={modal}
                            onOk={() => {
                              setModal(false)
                              handleUpdate(listAddress?.filter((item) => item?.id === addressId)[0])
                            }}
                            onCancel={() => setModal(false)}
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
                              <div
                                className="name"
                                style={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <div className="label">Name</div>
                                <Input
                                  className="input"
                                  defaultValue={
                                    listAddress?.filter((item) => item?.id === addressId)[0]
                                      ?.receiverName
                                  }
                                  value={fullname}
                                  onChange={(e) => setFullname(e?.target?.value)}
                                  style={{ width: '18vw' }}
                                />
                              </div>
                              <div
                                className="phone"
                                style={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <div className="label">Phone</div>
                                <Input
                                  className="input"
                                  defaultValue={
                                    listAddress?.filter((item) => item?.id === addressId)[0]
                                      ?.receiverPhone
                                  }
                                  value={phone}
                                  onChange={(e) => setPhone(e?.target?.value)}
                                  style={{ width: '18vw' }}
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
                                      listAddress?.filter((item) => item?.id === addressId)[0]
                                        ?.addressWard?.district?.provinceCity?.name
                                    }
                                    style={{
                                      width: '12vw',
                                    }}
                                    select={city}
                                    onChange={(e) => setCity(e)}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={optionAddress?.City}
                                  />
                                </div>
                                <div className="group">
                                  <div className="label">District</div>
                                  <Select
                                    className="select"
                                    defaultValue={
                                      listAddress?.filter((item) => item?.id === addressId)[0]
                                        ?.addressWard?.district?.name
                                    }
                                    style={{
                                      width: '12vw',
                                    }}
                                    select={district}
                                    onChange={(e) => setDistrict(e)}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={optionAddress?.District}
                                  />
                                </div>
                                <div className="group">
                                  <div className="label">Ward</div>
                                  <Select
                                    className="select"
                                    defaultValue={
                                      listAddress?.filter((item) => item?.id === addressId)[0]
                                        ?.addressWard?.name
                                    }
                                    style={{
                                      width: '12vw',
                                    }}
                                    select={ward}
                                    onChange={(e) => setWard(e)}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
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
                                  defaultValue={
                                    listAddress?.filter((item) => item?.id === addressId)[0]
                                      ?.addressDetail
                                  }
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
                          {item?.id === user?.defaultAddress?.id ? null : (
                            <div className="delete" onClick={() => deleteAddress(item?.id)}>
                              Delete
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="detail">
                        <div className="address">
                          {item?.addressDetail}
                          <br />
                          {item?.addressWard?.name +
                            ', ' +
                            item?.addressWard?.district?.name +
                            ', ' +
                            item?.addressWard?.district?.provinceCity?.name}
                        </div>
                        <Button
                          className="setDefault"
                          disabled={item?.id === user?.defaultAddress?.id}
                          onClick={() => handleDefaultAddress(item)}
                        >
                          Set default
                        </Button>
                      </div>
                      {item?.id === user?.defaultAddress?.id && (
                        <div className="default">Default</div>
                      )}
                    </div>
                  </>
                </List.Item>
              </>
            )}
          />
          {/* {listAddress?.map((item) => (
            <Modal
              className="modal"
              title="Update address"
              centered
              open={modal}
              onOk={() => {
                setModal(false)
                handleUpdate(item)
              }}
              onCancel={() => setModal(false)}
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
                    defaultValue={item?.receiverName}
                    value={fullname}
                    onChange={(e) => setFullname(e?.target?.value)}
                    style={{ width: '18vw' }}
                  />
                </div>
                <div className="phone" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="label">Phone</div>
                  <Input
                    className="input"
                    defaultValue={item?.receiverPhone}
                    value={phone}
                    onChange={(e) => setPhone(e?.target?.value)}
                    style={{ width: '18vw' }}
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
                      defaultValue={item?.addressWard?.district?.provinceCity?.name}
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
                      defaultValue={item?.addressWard?.district?.name}
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
                      defaultValue={item?.addressWard?.name}
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
                    defaultValue={item?.addressDetail}
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
                checked={true ? item?.id === user?.defaultAddress?.id : false}
                disabled={true ? item?.id === user?.defaultAddress?.id : false}
                onChange={(e) => setDefaultAddress(e?.target?.data)}
              >
                Set default address
              </Checkbox>
            </Modal>
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default AddressComponent
