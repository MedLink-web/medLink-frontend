import React from 'react';
import logo from '../assets/logo.png'; // تأكدي أن الصورة الجديدة موجودة في المجلد
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
        
        {/* 1. قسم الشعار الجديد على اليمين */}
        <div className="navbar-logo">
            <span className="logo-text">midlink</span>
            <img src={logo} alt="Midlink Logo" className="logo-image" />
        </div>
        
        {/* 2. روابط التنقل المنتصف */}
        <ul className="navbar-links">
            <li><a href="#home" className="active">الرئيسية</a></li>
            <li><a href="#about">عن المنصة</a></li>
            <li><a href="#services">الخدمات</a></li>
            <li><a href="#support">الدعم الفني</a></li>
            <li><a href="#login-link">تسجيل الدخول</a></li>
        </ul>

        {/* 3. الأزرار المزدوجة على اليسار */}
        <div className="navbar-actions">
            {/* الزر الأبيض المحفوف */}
            <button className="btn-outline">
            <span className="btn-icon">↩</span> {/* يمكنك استبدالها بأيقونة حقيقية لاحقاً */}
            تسجيل الدخول
            </button>
            
            {/* الزر الأزرق الكامل */}
            <button className="btn-solid">
            <span className="btn-icon">👤</span>
            إنشاء حساب
            </button>
        </div>

        </nav>
    );
};

export default Navbar;