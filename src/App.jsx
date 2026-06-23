import React from 'react';
// 👈 1. استيراد شاشة تسجيل العيادة الجديدة من مجلد المكونات
import ClinicRegister from './components/ClinicRegister';
import './App.css';

function App() {
  // 👈 2. جعل هذه الشاشة هي العرض المباشر والوحيد للتطبيق حالياً
    return (
      <div className="app-container" dir="rtl">
        <ClinicRegister />
      </div>
    );
}

export default App;