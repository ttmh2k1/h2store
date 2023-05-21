import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Slide from './components/slide/Slide'
import MenuNav from './components/menuNav/MenuNav'
import LoginPage from './pages/login/LoginPage'
function App() {
  return (
    // <div className="App">
    //   <BrowserRouter>
    //     <Routes></Routes></BrowserRouter>
    // </div>
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          <Slide />
          <MenuNav />
        </div>
        <Routes>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
