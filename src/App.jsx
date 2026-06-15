import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal'; // 👈 استيراد النافذة الجديدة
import './App.css';

function App() {
  // حالة للتحكم في ظهور أو إخفاء النافذة المنبثقة
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container" dir="rtl">
      {/* نمرر دالة الفتح للـ Navbar */}
      <Navbar onRegisterClick={openModal} />
      
      {/* نمرر دالة الفتح للـ Hero سيكشن */}
      <Hero onRegisterClick={openModal} />
      
      <Services />
      <Stats />
      <About />
      <HowItWorks />
      <Footer />

      {/* النافذة المنبثقة تظهر وتختفي ديناميكياً بناءً على الـ state */}
      <RegisterModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
