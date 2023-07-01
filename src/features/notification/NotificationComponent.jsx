import './notificationStyle.scss'
import { List } from 'antd'
import { useEffect, useState } from 'react'
import { getNotification } from '../../apis/notification'

const NotificationComponent = () => {
  const [notify, setNotify] = useState([])

  useEffect(() => {
    const handleGetNotification = async () => {
      const resp = await getNotification({ size: 100 })
      const data = resp?.data?.data
      setNotify(data)
    }
    handleGetNotification()
  }, [notify])

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
