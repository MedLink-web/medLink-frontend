import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal'; 
import PatientRegisterForm from './components/PatientRegisterForm'; // 👈 استيراد الصفحة المنفصلة
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // الحالة المسؤولة عن عرض الموقع بالكامل 'home' أو الانتقال لصفحة المريض المنفصلة 'register-patient'
  const [currentView, setCurrentView] = useState('home');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container" dir="rtl">
      {currentView === 'home' ? (
        <>
          {/* الموقع الرئيسي الأصلي بكامل أقسامه */}
          <Navbar onRegisterClick={openModal} />
          <Hero onRegisterClick={openModal} />
          <Services />
          <Stats />
          <About />
          <HowItWorks />
          <Footer />

          {/* النافذة المنبثقة نمرر لها دالة الانتقال لصفحة المريض المخصصة */}
          <RegisterModal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            onSelectPatient={() => setCurrentView('register-patient')} 
          />
        </>
      ) : (
        /* صفحة المريض المنفصلة تماماً عند تفعيلها، مع دالة العودة للرئيسية */
        <PatientRegisterForm onBackToHome={() => setCurrentView('home')} />
      )}
    </div>
  );
}

export default App;