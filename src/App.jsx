import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal'; 
import PatientRegisterForm from './components/PatientRegisterForm'; 
import PatientDashboard from './components/PatientDashboard'; 
import PatientProfile from './components/PatientProfile';
import PatientLogin from './components/PatientLogin';

// 👈 استيراد الشاشات الأربعة المنفصلة المحدثة
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import ResetPassword from './components/ResetPassword';
import ResetSuccess from './components/ResetSuccess';

import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  // 👈 حالات تتبع الخطوات الداخلية لرحلة استعادة كلمة المرور البريدية
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('forgot'); // forgot -> verify -> reset -> success

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Navbar onRegisterClick={openModal} />
            <Hero onRegisterClick={openModal} />
            <Services />
            <Stats />
            <About />
            <HowItWorks />
            <Footer />

            <RegisterModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              onSelectPatient={() => {
                closeModal();
                setCurrentView('register-patient')} }
              onLoginClick={() => {
                closeModal();          
                setCurrentView('login'); 
              }}
            />
          </>
        );

      case 'register-patient':
        return (
          <PatientRegisterForm 
            onNavigate={(targetView) => setCurrentView(targetView)}
            onBackToHome={() => setCurrentView('home')} 
            onRegisterSuccess={() => setCurrentView('dashboard')} 
          />
        );

      case 'dashboard':
        return (
          <PatientDashboard 
            onLogout={() => setCurrentView('home')}
            onNavigate={(targetView) => setCurrentView(targetView)} 
          />
        );

      case 'profile':
        return (
          <PatientProfile onNavigate={(targetView) => setCurrentView(targetView)} />
        );

      case 'login':
        return (
          <PatientLogin 
            onNavigate={(targetView) => {
              if (targetView === 'forgot-password') {
                setForgotStep('forgot'); // 👈 تهيئة الخطوة الأولى برمجياً فور الضغط على الزر
              }
              setCurrentView(targetView);
            }} 
            onLoginSuccess={() => setCurrentView('dashboard')} 
          />
        );

      /* قومي باستبدال كيس forgot-password القديم بهذا الكود المحدث داخل App.jsx */
      case 'forgot-password':
        if (forgotStep === 'forgot') {
          return (
            <ForgotPassword 
              onNavigate={(target) => {
                setForgotStep('forgot'); // تصفير دائم عند الخروج أو العودة
                setCurrentView(target);
              }} 
              onNextStep={(next, email) => { 
                setForgotEmail(email); 
                setForgotStep(next); 
              }} 
            />
          );
        }
        if (forgotStep === 'verify') {
          return (
            <VerifyCode 
              email={forgotEmail} 
              onNextStep={(next) => setForgotStep(next)} 
            />
          );
        }
        if (forgotStep === 'reset') {
          return (
            <ResetPassword 
              onNextStep={(next) => setForgotStep(next)} 
            />
          );
        }
        if (forgotStep === 'success') {
          return (
            <ResetSuccess 
              onNavigate={(view) => { 
                // نضمن تصفير الخطوة أولاً ثم نقوم بتحويل الشاشة بالكامل
                setForgotStep('forgot'); 
                setTimeout(() => {
                  setCurrentView(view); 
                }, 0);
              }} 
            />
          );
        }
        break;
      default:
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>الصفحة غير موجودة</div>;
    }
  };

  return (
    <div className="app-container" dir="rtl">
      {renderView()}
    </div>
  );
}

export default App;