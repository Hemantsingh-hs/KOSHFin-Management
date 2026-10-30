import { useState } from 'react'
import './App.css'
import {Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
import SideBar from './pages/SideBar'
import OwnerLayout from './layouts/OwersLayout'
function App() {
  


  return (
    <>
    <Routes>
         <Route path="/" element={<Home/>}></Route>
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Registration/>}/>
         <Route path="/sidebar" element={<SideBar/>}/>
         <Route path="/dashboard" element={<OwnerLayout />}/>
         <Route path="*" element={<Navigate to="/" replace />}/>
         



  

      
 


    </Routes>
    </>
  )
}

export default App
