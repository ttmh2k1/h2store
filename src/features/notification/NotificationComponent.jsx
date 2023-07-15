import './notificationStyle.scss'
import { Button, List, Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { useEffect, useState } from 'react'
import { getNotification, markAsRead } from '../../apis/notification'
import moment from 'moment/moment'

const NotificationComponent = () => {
  const [pageSize, setPageSize] = useState(100)
  const [seenSize, setSeenSize] = useState(100)
  const [notSeenSize, setNotSeenSize] = useState(100)
  const [notify, setNotify] = useState([])
  const [seen, setSeen] = useState([])
  const [unread, setUnread] = useState([])

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getNotification()
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [])

  useEffect(() => {
    const handleGetSeenPage = async () => {
      const resp = await getNotification({ isSeen: true })
      const data = resp?.data
      setSeenSize(data?.totalElement)
    }
    handleGetSeenPage()
  }, [])

  useEffect(() => {
    const handleGetNotSeenPage = async () => {
      const resp = await getNotification({ isSeen: false })
      const data = resp?.data
      setNotSeenSize(data?.totalElement)
    }
    handleGetNotSeenPage()
  }, [])

  useEffect(() => {
    const handleGetNotification = async () => {
      const resp = await getNotification({
        size: pageSize > 0 ? pageSize : 10,
        sortByOldest: false,
      })
      const data = resp?.data?.data
      setNotify(data)
    }
    handleGetNotification()
  }, [pageSize])

  useEffect(() => {
    const handleSeenNotification = async () => {
      const resp = await getNotification({
        isSeen: true,
        size: seenSize > 0 ? seenSize : 10,
        sortByOldest: false,
      })
      const data = resp?.data?.data
      setSeen(data)
    }
    handleSeenNotification()
  }, [seenSize])

  useEffect(() => {
    const handleNotSeenNotification = async () => {
      const resp = await getNotification({
        isSeen: false,
        size: notSeenSize > 0 ? notSeenSize : 10,
        sortByOldest: false,
      })
      const data = resp?.data?.data
      setUnread(data)
    }
    handleNotSeenNotification()
  }, [notSeenSize])

  const handleMarkAsRead = async () => {
    await markAsRead()
    window.location.reload()
  }

  return (
    <div className="notificaionPage">
      <div className="notificationContent">
        <div className="notificationTitle">NOTIFICATIONS</div>
        <div className="notificationList">
          <Tabs
            className="tab"
            defaultActiveKey="ALL"
            tabBarExtraContent={
              <Button
                style={{ background: '#decdbb', color: '#2a2728', border: '1px solid #2a2728' }}
                onClick={() => handleMarkAsRead()}
              >
                Mark as read
              </Button>
            }
            style={{
              display: 'flex',
              width: '94%',
              justifyContent: 'space-between',
              margin: '0 2vw',
            }}
          >
            <TabPane className="notificaionTab" tab="All" key="ALL" onTabScroll="right">
              <List
                loading={!notify[0] && true}
                className="notification"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['8', '20', '50', '100'],
                  defaultPageSize: 8,
                }}
                dataSource={notify}
                renderItem={(item) => (
                  <>
                    <List.Item style={{ padding: '0.4vw 0' }}>
                      <div className="item">
                        <div className="title">{item?.title}</div>
                        <div className="content">{item?.content}</div>
                        <div className="time">{moment(item?.time).format('LLL')}</div>
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="notificaionTab" tab="Unread" key="UNREAD" onTabScroll="right">
              <List
                loading={!unread[0] && true}
                className="notification"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['8', '20', '50', '100'],
                  defaultPageSize: 8,
                }}
                dataSource={unread}
                renderItem={(item) => (
                  <>
                    <List.Item style={{ padding: '0.4vw 0' }}>
                      <div className="item">
                        <div className="title">{item?.title}</div>
                        <div className="content">{item?.content}</div>
                        <div className="time">{moment(item?.time).format('LLL')}</div>
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
            <TabPane className="notificaionTab" tab="Read" key="READ" onTabScroll="right">
              <List
                loading={!seen[0] && true}
                className="notification"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['8', '20', '50', '100'],
                  defaultPageSize: 8,
                }}
                dataSource={seen}
                renderItem={(item) => (
                  <>
                    <List.Item style={{ padding: '0.4vw 0' }}>
                      <div className="item">
                        <div className="title">{item?.title}</div>
                        <div className="content">{item?.content}</div>
                        <div className="time">{moment(item?.time).format('LLL')}</div>
                      </div>
                    </List.Item>
                  </>
                )}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
export default NotificationComponent
