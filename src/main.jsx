import React  from 'react'
import  ReactDOM  from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

//This is the "Entry point",
//it finds the <div id=root"> in your HtML and puts your App inside
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
 </React.StrictMode>
)
