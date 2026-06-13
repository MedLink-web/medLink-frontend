import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer'; // 👈 استيراد الـ Footer هنا
import './App.css';

function App() {
    return (
      <div className="app-container" dir="rtl">
        <Navbar />
        <Hero />
        <Services />
        <Stats />
        <About />
        <HowItWorks />
        <Footer /> {/* 👈 عرض الـ Footer كآخر عنصر بالصفحة هنا */}
      </div>
    );
}

export default App;
