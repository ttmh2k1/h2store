import './searchResultStyle.scss'
import { useEffect, useState } from 'react'
import { getListProductImg } from '../../../apis/productControllerApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Empty, List, Tooltip } from 'antd'
import { formatMoney } from '../../../utils/functionHelper'
import { Rating } from 'react-simple-star-rating'

const SearchImageResultComponent = (props) => {
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

  const [listSearch, setListSearch] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const navigate = useNavigate()

  const searchProduct = async () => {
    const imgResult = await getListProductImg({
      imageId: props?.file,
      size: pageSize,
    })
    setListSearch(imgResult?.data?.data)
  }

  useEffect(() => {
    if (props) {
      searchProduct()
    } else {
      toast.warning('NO IMAGE WAS SUBMITTED', style)
    }
  }, [props?.file, pageSize])

  return (
    <div className="searchResult">
      <div className="productSearchResult">
        <div className="title">SEARCH RESULT</div>
        {listSearch?.length > 0 ? (
          <List
            className="listSearchResult"
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
            dataSource={listSearch}
            renderItem={(item) => (
              <div className="itemSearchResult">
                <List.Item
                  className="listItem"
                  key={item.name}
                  onClick={() => navigate({ pathname: '/product/' + item?.id })}
                >
                  <Tooltip title={item?.name} color="#decdbb">
                    <img className="imageSearchResult" src={item?.avatar} alt="" />
                    <div className="textSearchResult">
                      <div className="name">{item?.name}</div>
                      <div className="price">Price: {formatMoney(item?.minPrice)}</div>
                      <Rating
                        className="ratingPoint"
                        size={16}
                        initialValue={parseFloat(item?.averageRating).toFixed(0)}
                        label
                        transition
                        readonly
                        fillColor="orange"
                        emptyColor="gray"
                      />{' '}
                    </div>
                  </Tooltip>
                </List.Item>
              </div>
            )}
          ></List>
        ) : (
          <div className="noResult">
            <Empty style={{ height: '20vw' }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchImageResultComponent
