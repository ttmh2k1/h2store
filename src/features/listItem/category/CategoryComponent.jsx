import './categoryStyle.scss'
import { Input, List, Select, Slider, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getListProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { getCategory } from '../../../apis/categoryController'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

const CategoryComponent = (props) => {
  const [category, setCategory] = useState()
  const [listProduct, setListProduct] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const [rating, setRating] = useState(0)
  const [searchName, setSearchName] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortDescending, setSortDescending] = useState(true)
  const [price, setPrice] = useState({ minPrice: '', maxPrice: '' })
  const navigate = useNavigate()

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

  useEffect(() => {
    const handleGetCategory = async () => {
      const resp = await getCategory(props?.id)
      const data = resp?.data?.data
      setCategory(data)
    }
    handleGetCategory()
  }, [props?.id])

  useEffect(() => {
    const handleGetPage = async () => {
      const resp = await getListProduct({ idCategory: props?.id })
      const data = resp?.data
      setPageSize(data?.totalElement)
    }
    handleGetPage()
  }, [props?.id])

  useEffect(() => {
    const handleGetListProduct = async () => {
      const resp = await getListProduct({
        idCategory: props?.id,
        searchName: searchName,
        searchDescription: searchName,
        size: pageSize,
        minAverageRating: rating,
        minPrice: price?.minPrice,
        maxPrice: price?.maxPrice,
        sortBy: sortBy,
        sortDescending: sortDescending,
      })
      const data = resp?.data?.data
      setListProduct(data)
    }
    handleGetListProduct()
  }, [props?.id, pageSize, searchName, rating, price, sortBy, sortDescending])

  return (
    <>
      <div className="categoryPage">
        <div className="productCategory">
          <div className="title">{category?.name}</div>
          <div className="search">
            <div className="searchGroup">
              <div className="textSearch">
                <Input className="text" onChange={(e) => setSearchName(e?.target?.value)} />
              </div>
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
              <div className="sortBy">
                Sort by:
                <Select
                  className="input"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    setSortBy(e)
                  }}
                  options={[
                    { value: '1', label: 'Price' },
                    { value: '2', label: 'View' },
                    { value: '4', label: 'Sold' },
                    { value: '24', label: 'Date' },
                    { value: '32', label: 'Discount' },
                  ]}
                />
                <Select
                  className="input"
                  style={{ width: 120 }}
                  defaultValue={sortBy !== '' ? sortDescending : ''}
                  value={sortBy !== '' ? sortDescending : ''}
                  onChange={(e) => {
                    setSortDescending(e)
                  }}
                  options={[
                    { value: true, label: 'Descending' },
                    { value: false, label: 'Ascending' },
                  ]}
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
                    <div className="slideAvt">
                      <img className="imageCategory" src={item?.avatar} alt="" />
                      {item?.outOfStock === true && <p className="outOfStock">Out of stock</p>}
                    </div>
                    <div className="textCategory">
                      <div className="name">{item?.name}</div>
                      <div className="priceGroup">
                        {item?.minOrgPrice !== item?.minPrice && (
                          <div className="oldPrice">{formatMoney(item?.minOrgPrice)}</div>
                        )}
                        <div className="price">{formatMoney(item?.minPrice)}</div>
                      </div>
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
