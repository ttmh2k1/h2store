import './voucherStyle.scss'
import { Divider, Image, List } from 'antd'
import { useEffect, useState } from 'react'
import { formatMoney } from '../../../utils/functionHelper'
import { useNavigate } from 'react-router-dom'
import { getListVoucher } from '../../../apis/voucherApi'
import { useSelector } from 'react-redux'
import { AiOutlineEdit } from 'react-icons/ai'
import Avatar from 'react-avatar'
import moment from 'moment/moment'

const VoucherComponent = () => {
  const user = useSelector((state) => state?.user?.user)
  const [voucher, setVoucher] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const [state, setState] = useState(false)
  const navigate = useNavigate()

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

  return (
    <div className="voucherPage">
      <div className="voucherMenu">
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
                onClick={() =>
                  navigate({
                    pathname: '/rank',
                  })
                }
              >
                Rank
              </List.Item>
              <List.Item
                className="item"
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
            className="voucher"
            style={{ fontWeight: 'bold' }}
            onClick={() =>
              navigate({
                pathname: '/voucher',
              })
            }
          >
            Voucher
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
          <div
            className="viewedProduct"
            onClick={() =>
              navigate({
                pathname: '/viewedProduct',
              })
            }
          >
            Viewed product
          </div>
        </div>
      </div>
      <div className="voucherContent">
        <div className="title">VOUCHERS</div>
        <List
          loading={!voucher[0] && true}
          className="listVoucher"
          grid={12}
          itemLayout="vertical"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['8', '20', '50', '100'],
            defaultPageSize: 8,
          }}
          dataSource={voucher}
          renderItem={(item) => (
            <div className="itemVoucher">
              <List.Item className="listItem" style={{ marginBlockEnd: '0', margin: '0 2vw' }}>
                <div className="code">{item?.code}</div>
                <Divider type="vertical" style={{ height: '12vw' }} />
                <div className="info">
                  <div className="description">{item?.description}</div>
                  <div className="minOrderAmount">
                    Minimum value: {formatMoney(item?.minOrderAmount)}
                  </div>
                  <div className="discount">
                    Discount:&nbsp;
                    {item?.discountType === 'AMOUNT' ? (
                      <div className="discountAmount">{formatMoney(item?.discountAmount)}</div>
                    ) : (
                      <div className="discountAmount">{item?.discountAmount}%</div>
                    )}
                  </div>
                  {item?.discountType === 'PERCENT' && (
                    <div className="maxDiscount">
                      Max discount: {formatMoney(item?.maxDiscount)}
                    </div>
                  )}
                  <div className="startDate">
                    Start date: {moment(item?.validFrom).format('DD/MM/YY hh:mm')}
                  </div>
                  <div className="endDate">
                    End date: {moment(item?.validTo).format('DD/MM/YY hh:mm')}
                  </div>
                </div>
              </List.Item>
            </div>
          )}
        ></List>
      </div>
    </div>
  )
}

export default VoucherComponent
