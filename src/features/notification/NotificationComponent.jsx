import './notificationStyle.scss'
import { List } from 'antd'
import { useEffect, useState } from 'react'
import { getNotification } from '../../apis/notification'

const NotificationComponent = () => {
  const [notify, setNotify] = useState([])
  const [pageSize, setPageSize] = useState([])
  const [read, setRead] = useState([])
  const [notSeen, setNotSeen] = useState([])

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getNotification()
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetNotification = async () => {
      const resp = await getNotification({ size: pageSize, sortByOldest: false })
      const data = resp?.data?.data
      setNotify(data)
      setRead(data?.filter((item) => item?.seen === 'true'))
    }
    handleGetNotification()
  }, [])

  return (
    <div className="notificaionPage">
      <div className="notificationContent">
        <div className="notificationTitle">NOTIFICATIONS</div>
        <div className="notificationList">
          <List
            className="notification"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['8', '20', '50', '100'],
              defaultPageSize: 8,
            }}
            dataSource={notify}
            renderItem={(item) => (
              <>
                <List.Item>
                  <div className="item">
                    <div className="title">{item?.title}</div>
                    <div className="content">{item?.content}</div>
                    <div className="time">{item?.time}</div>
                  </div>
                </List.Item>
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}
export default NotificationComponent
