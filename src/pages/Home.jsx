import React from 'react'
import NavBar from "../components/home/NavBar";
import Hero from '../components/home/Hero';
import PropertiesSearch from '../components/home/PropertiesSearch';
import Space from '../components/common/Space';
const Home = () => {
  return (
    <>
      <NavBar />
      <div className='px-10'>
        <Hero />
        <Space />
        <PropertiesSearch />
      </div>
    </>
  )
}

export default Home