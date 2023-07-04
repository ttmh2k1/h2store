import './categoryStyle.scss'
import { List, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getListProduct } from '../../../apis/productControllerApi'
import { formatMoney } from '../../../utils/functionHelper'
import { getCategory } from '../../../apis/categoryController'
import { useNavigate } from 'react-router-dom'

const CategoryComponent = (props) => {
  const [category, setCategory] = useState([])
  const [listProduct, setListProduct] = useState([])
  const [pageSize, setPageSize] = useState(100)
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
      const resp = await getListProduct({ idCategory: props.id, size: pageSize })
      const data = resp?.data?.data
      setListProduct(data)
    }
    handleGetListProduct()
  }, [props.id, pageSize])

  return (
    <>
      <div className="categoryPage">
        <div className="productCategory">
          <div className="title">{category?.name}</div>
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
