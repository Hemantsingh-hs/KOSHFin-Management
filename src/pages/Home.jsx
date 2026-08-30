import React from 'react'
import NavBar from "../components/home/NavBar";
import Hero from '../components/home/Hero';
import PropertiesSearch from '../components/home/PropertiesSearch';
import Space from '../components/common/Space';
import VerifiedPg from '../components/home/VerifiedPg';
import NearByPlaces from '../components/home/NearByPlaces';
const Home = () => {
  return (
    <>
      <NavBar />
      <div className='px-10'>
        <VerifiedPg/>  
        <Hero />
        <Space />
        <PropertiesSearch />
        <NearByPlaces/>
      </div>
    </>
  )
}

export default Home