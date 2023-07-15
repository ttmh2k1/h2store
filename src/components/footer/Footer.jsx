import './footerStyle.scss'

const Footer = () => {
  return (
    <div className="footer">
      <div className="contentFooter">
        <div className="contactGroup">
          <div className="contactTile">Contact:</div>
          <div className="contactList">
            <div className="contact">
              <div className="type">Service:</div>
              <div className="name">Trần Thị Mỹ Huyền</div>
              <div className="phone">0706192450</div>
              <div className="email">19110371@student.hcmute.edu.vn</div>
            </div>
            <div className="contact">
              <div className="type">System:</div>
              <div className="name">Lê Trần Thanh Hân</div>
              <div className="phone">0706192450</div>
              <div className="email">19110360@student.hcmute.edu.vn</div>
            </div>
          </div>
        </div>
        <div className="addressGroup">
          <div className="addressTilte">Store address:</div>
          <div className="addressList">
            <div className="store">Store 1:</div>
            <div className="address">1 Vo Van Ngan St, Linh Chieu, Thu Duc, Ho Chi Minh</div>
          </div>
          <div className="addressList">
            <div className="store">Store 2:</div>
            <div className="address">484 Le Van Viet, Tang Nhon Phu A, Thu Duc, Ho Chi Minh</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer
