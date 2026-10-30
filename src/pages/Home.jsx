import React from 'react';
import NavBar from "../components/home/NavBar";
import Hero from '../components/home/Hero';
import NearByPlaces from '../components/home/NearByPlaces';
import Reviews from '../components/home/Reviews';
import HowItWork from '../components/home/HowItWork';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';
import PropertyDetailModal from '../components/home/PropertyDetailModal';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { selectedProperty, setSelectedProperty } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <NearByPlaces />
        <Reviews />
        <HowItWork />
        <CTA />
      </main>
      <Footer />

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default Home;