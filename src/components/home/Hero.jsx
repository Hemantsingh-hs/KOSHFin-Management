import React from 'react'
import styles from "./Hero.module.css";
const Hero = () => {
  return (
    <div>
       <div className='w-full md:w-1/2'>

        <h2 className='flex font-bold text-2xl sm:text-3xl md:text-5xl pt-7'>Manage Your Money. </h2>
        <h2 className='flex font-bold text-2xl sm:text-3xl md:text-5xl text-indigo-600 pb-5'>Find Your Place</h2>
        <p className={`${styles.heroSubText} flex md:w-[65%] text-slate-500`}> KOSHFin is the only app where you discover verified PGs,rooms and mess and hostels nearby - and manage your finanace,rent and budget - all in one place.</p>
       </div>
    </div>
  )
}

export default Hero