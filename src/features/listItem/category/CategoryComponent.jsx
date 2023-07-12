import './categoryStyle.scss'
import { List, Slider, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getListProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { getCategory } from '../../../apis/categoryController'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const CategoryComponent = (props) => {
  const [category, setCategory] = useState([])
  const [listProduct, setListProduct] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const [rating, setRating] = useState(0)
  const [price, setPrice] = useState({ minPrice: '', maxPrice: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetCategory = async () => {
      const resp = await getCategory(props.id)
      const data = resp?.data?.data
      setCategory(data)
    }
    handleGetCategory()
  }, [props.id])

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getListProduct({ idCategory: props.id })
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [props.id])

  useEffect(() => {
    const handleGetListProduct = async () => {
      const resp = await getListProduct({
        idCategory: props.id,
        size: pageSize,
        minAverageRating: rating,
        minPrice: price?.minPrice,
        maxPrice: price?.maxPrice,
      })
      const data = resp?.data?.data
      setListProduct(data)
    }
    handleGetListProduct()
  }, [props.id, pageSize, rating, price])

  const sliderProps = {
    range: true,
    min: 0,
    max: 1000000,
    defaultValue: [0, 0],
    tipFormatter: (value) => {
      return formatMoney(value)
    },
    onChange: (values) => {
      setPrice({ minPrice: values[0], maxPrice: values[1] })
    },
  }

  return (
    <>
      <div className="categoryPage">
        <div className="productCategory">
          <div className="title">{category?.name}</div>
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
          <List
            className="listCategory"
            grid={{
              gutter: 16,
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
            dataSource={listProduct}
            renderItem={(item) => (
              <div className="itemCategory">
                <List.Item
                  className="listItem"
                  key={item.name}
                  onClick={() => navigate({ pathname: '/product/' + item?.id })}
                >
                  <Tooltip title={item?.name} color="#decdbb">
                    <img className="imageCategory" src={item?.avatar} alt="" />
                    <div className="textCategory">
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
                      />
                    </div>
                  </Tooltip>
                </List.Item>
              </div>
            )}
          ></List>
        </div>
      </div>
    </>
  )
}

export default CategoryComponent
