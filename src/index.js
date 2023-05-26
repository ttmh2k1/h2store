import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import 'react-toastify/dist/ReactToastify.css'
import reportWebVitals from './reportWebVitals'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import mainReducer from './redux/RootReducer'

const store = createStore(mainReducer)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </React.StrictMode>
  </Provider>,
)
reportWebVitals()
