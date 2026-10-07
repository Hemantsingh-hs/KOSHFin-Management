import { useState } from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
function App() {
  


  return (
    <>
    <Routes>
         <Route path="/" element={<Home/>}></Route>
         <Route path="/login" element={<Login />} />
         <Route path="Register" element={<Registration/>}/>
    </Routes>
    </>
  )
}

export default App
