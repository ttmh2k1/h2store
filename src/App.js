import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Slide from './components/slide/Slide'

function App() {
  return (
    // <div className="App">
    //   <BrowserRouter>
    //     <Routes></Routes></BrowserRouter>
    // </div>
    <div>
      <Navbar />
      <Slide />
    </div>
  )
}

export default App
