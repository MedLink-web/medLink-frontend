import React, { useState, useEffect } from 'react';
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

// استيراد شاشات استعادة كلمة المرور
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import ResetPassword from './components/ResetPassword';
import ResetSuccess from './components/ResetSuccess';

// استدعاء شاشة تسجيل العيادة 
import ClinicRegisterForm from './components/ClinicRegister';

// استيراد المكون الرئيسي للوحة تحكم المسؤول (Admin Dashboard)
import ClinicAdminDashboard from './components/ClinicAdminDashboard';

import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // شاشة المعاينة الافتراضية
    const [currentView, setCurrentView] = useState('home');

    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotStep, setForgotStep] = useState('forgot'); // 'forgot', 'verify', 'reset', 'success'

    // تأثير جانبي (Effect) لفحص الرابط السري للأدمن عند تحميل الصفحة
    useEffect(() => {
      const currentPath = window.location.pathname;
      
      // إذا قام الأدمن بكتابة الرابط السري المحتوي على اسم المشروع
      if (currentPath === '/MediLink-admin' || currentPath === '/medilink-admin') {
        setCurrentView('admin-dashboard');
      }
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleRegisterSelect = (type) => {
      closeModal();
      if (type === 'patient') {
        setCurrentView('patient-register');
      } else if (type === 'clinic') {
        setCurrentView('clinic-register');
      }
    };

    // دالة رندرة وتغيير الشاشات بناءً على الـ View الحالي
    const renderView = () => {
      switch (currentView) {
        case 'home':
          return (
            <>
              <Navbar onRegisterClick={openModal} onLoginClick={() => setCurrentView('login')} />
              <Hero onRegisterClick={openModal} />
              <Services />
              <Stats />
              <About />
              <HowItWorks />
              <Footer />
              <RegisterModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onSelectType={handleRegisterSelect} 
              />
            </>
          );

        case 'patient-register':
          return (
            <PatientRegisterForm 
              onNavigate={(target) => setCurrentView(target)} 
            />
          );

        case 'clinic-register':
          return (
            <ClinicRegisterForm 
              onNavigate={(target) => setCurrentView(target)} 
            />
          );

        case 'login':
          return (
            <PatientLogin 
              onNavigate={(target) => setCurrentView(target)} 
              onForgotPassword={() => setCurrentView('forgot-password')}
            />
          );

        case 'patient-dashboard':
          return (
            <PatientDashboard 
              onNavigate={(target) => setCurrentView(target)} 
            />
          );

        case 'patient-profile':
          return (
            <PatientProfile 
              onNavigate={(target) => setCurrentView(target)} 
            />
          );

        /* حالة لوحة تحكم الأدمن المضافة والمحمية بالرابط السري */
        case 'admin-dashboard':
          return (
            <ClinicAdminDashboard 
              onNavigate={(target) => setCurrentView(target)} 
            />
          );

        case 'forgot-password':
          if (forgotStep === 'forgot') {
            return (
              <ForgotPassword 
                onNavigate={(target) => {
                  setForgotStep('forgot');
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
          /* تم تصحيح وسم الفتح المفقود هنا بناءً على ملاحظتكِ الذكية */
          return <div style={{ textAlign: 'center', marginTop: '50px', direction: 'rtl' }}>الصفحة المطلوبة غير موجودة في منصة MediLink</div>;
      }
    };

    return (
      <div className="App">
        {renderView()}
      </div>
    );
}

export default App;