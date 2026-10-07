import React from 'react'
import NavBar from "../components/home/NavBar";
import Hero from '../components/home/Hero';
import PropertiesSearch from '../components/home/PropertiesSearch';
import Space from '../components/common/Space';
import VerifiedPg from '../components/home/VerifiedPg';
import NearByPlaces from '../components/home/NearByPlaces';
import Reviews from '../components/home/Reviews';
import HowItWork from '../components/home/HowItWork';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';
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
        <Reviews/>
        <HowItWork/>
        <CTA/>
      </div>
        <Footer/>
    </>
  )
}

export default Home