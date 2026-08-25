import React from 'react'
import {Link} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const NavBar = () => {
  return (
   <nav className='w-full bg-white border-b-2 border-gray-100'>
     
     <div className='max-w 7xl mx-auto px-5 h-20 flex items-center item-center justify-between'>

     {/* logo */}

     <Link to="/" className="flex items-center gap-3">
       <div className='w-10 aspect-square rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md'>
        K

       </div>
       <span className='text-xl sm:text-2xl font-bold text-slate-900'>KOSHFin</span>

     </Link>

     {/* Navigation  */}

     <div className='hidden md:flex items-center gap-10'>

        <a href='#discover' className='text-slate-500 hover:text-indigo-600 transition'>Discover</a>

         <a href='#reviews' className='text-slate-500 hover:text-indigo-600 transition'>Reviews</a>

        <a href='#how-it-work' className='text-slate-500 hover:text-indigo-600 transition'>How it works</a>
     </div>

     {/* right button  Sign in */}

     <div className='flex items-center gap-5'>

        <Link to="/signin" className='text-slate-600 font-medium hover:text-indigo-600 transition hidden sm:block'> Sign in</Link>

        <Link to="/register"  className='bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md h-10 flex justify-center items-center gap-1'> <span>Get Started</span>  <ArrowRight className='w-4'/>
         </Link>
     </div>
     </div>

   </nav>


  )
}

export default NavBar