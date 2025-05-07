
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-sol-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.05)_0%,rgba(10,10,10,0)_70%)] pointer-events-none"></div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Index;
