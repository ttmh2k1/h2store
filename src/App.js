import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Slide from './components/slide/Slide'
import MenuNav from './components/menuNav/MenuNav'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import Home from './pages/home'
import BestSellerPage from './pages/BestSellerPage'
import NewArrivalPage from './pages/NewArrivalPage'
import OnSalePage from './pages/OnSalePage'
// import SearchResultPage from './pages/SearchResultPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          <Slide />
          <MenuNav />
        </div>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="bestSeller" element={<BestSellerPage />} />
            <Route path="newArrival" element={<NewArrivalPage />} />
            <Route path="onSale" element={<OnSalePage />} />
            {/* <Route path="searchResult" element={<SearchResultPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
