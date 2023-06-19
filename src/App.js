import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Slide from './components/slide/Slide'
import MenuNav from './components/menuNav/MenuNav'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import Home from './pages/home'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/product/ProductPage'
import BestSellerPage from './pages/BestSellerPage'
import NewArrivalPage from './pages/NewArrivalPage'
import OnSalePage from './pages/OnSalePage'
import RecommendProductPage from './pages/RecommendProductPage'
import CartPage from './pages/cart/CartPage'
import ScrollToTop from './components/topToButton/topToButton'
// import SearchResultPage from './pages/SearchResultPage'
import { v4 as uuidv4 } from 'uuid'

const token = localStorage.getItem('token')
if (!token) {
  localStorage.setItem('sessionId', uuidv4())
}

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          {/* <Slide /> */}
          <MenuNav />
          <ScrollToTop />
        </div>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="category">
              <Route path=":categoryId" element={<CategoryPage />} />
            </Route>
            <Route path="product">
              <Route path=":productId" element={<ProductPage />} />
            </Route>
            <Route path="bestSeller" element={<BestSellerPage />} />
            <Route path="newArrival" element={<NewArrivalPage />} />
            <Route path="onSale" element={<OnSalePage />} />
            <Route path="recommend" element={<RecommendProductPage />} />
            <Route path="cart" element={<CartPage />} />
            {/* <Route path="searchResult" element={<SearchResultPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
