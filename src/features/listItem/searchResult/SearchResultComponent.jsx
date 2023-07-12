import './searchResultStyle.scss'
import { useEffect, useState } from 'react'
import { getListProduct } from '../../../apis/productControllerApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Empty, List, Slider, Tooltip } from 'antd'
import { formatMoney } from '../../../utils/functionHelper'
import { Rating } from 'react-simple-star-rating'

const SearchResultComponent = (props) => {
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
  const [rating, setRating] = useState(0)
  const [price, setPrice] = useState({ minPrice: '', maxPrice: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getListProduct()
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [props.id])

  const searchProduct = async () => {
    const result = await getListProduct({
      searchName: props?.text,
      searchDescription: props?.text,
      size: pageSize,
      minAverageRating: rating,
      minPrice: price?.minPrice,
      maxPrice: price?.maxPrice,
    })
    setListSearch(result?.data?.data)
  }
  // console.log(props)

  useEffect(() => {
    if (props?.text) {
      searchProduct()
    } else {
      toast.warning('NO TEXT WAS SUBMITTED', style)
    }
  }, [props, pageSize, rating, price])

  const sliderProps = {
    range: true,
    min: 0,
    max: 10000000,
    defaultValue: [0, 0],
    tipFormatter: (value) => {
      return formatMoney(value)
    },
    onChange: (values) => {
      setPrice({ minPrice: values[0], maxPrice: values[1] })
    },
  }

  return (
    <div className="searchResult">
      <div className="productSearchResult">
        <div className="title">SEARCH RESULT</div>
        <div className="search">
          <div className="searchGroup">
            <div className="priceSearch">
              Price: <Slider {...sliderProps} />
            </div>
            <div className="ratingSearch">
              Rating:{' '}
              <Rating
                className="ratingPoint"
                onClick={(e) => setRating(e)}
                size={16}
                label
                transition
                fillColor="orange"
                emptyColor="gray"
              />
            </div>
          </div>
        </div>
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

export default SearchResultComponent
