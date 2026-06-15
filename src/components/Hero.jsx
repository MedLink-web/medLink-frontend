import React from 'react';
import heroImage from '../assets/hero.png'; // تأكدي من وضع صورة الـ Hero كاملة في مجلد assets لاحقاً
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero-container">
        
        {/* 1. الجانب الأيمن: المحتوى النصي والأزرار والميزات */}
        <div className="hero-text-side">
            <h1 className="hero-title">
            رعاية صحية <br />
            <span className="blue-highlight">أسهل وأقرب إليك</span>
            </h1>
            
            <p className="hero-desc">
            منصة متكاملة تربط المرضى بالأطباء والمراكز الصحية لحجز المواعيد، 
            الاستشارات، والوصول إلى خدمات صحية موثوقة بكل سهولة.
            </p>
            
            {/* أزرار التفاعل الثنائية */}
            <div className="hero-buttons">
            <button  className="btn-hero-solid">
                <span className="icon">👤</span>
                إنشاء حساب
            </button>
            <a href="#services" className="btn-hero-outline">استكشف الخدمات</a>
            </div>

            {/* شريط الميزات السفلي الصغير */}
            <div className="hero-features">
            <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>أطباء معتمدون</span>
            </div>
            <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>خدمات آمنة</span>
            </div>
            <div className="feature-item">
                <span className="feature-icon">🎧</span>
                <span>دعم على مدار الساعة</span>
            </div>
            </div>
        </div>

        {/* 2. الجانب الأيسر: الصورة التوضيحية الكبيرة */}
        <div className="hero-image-side">
            {/* قمنا بوضع الصورة كاملة داخل حاوية لكي نتحكم بأبعادها بسلاسة */}
            <img src={heroImage} alt="Healthcare Illustration" className="hero-illustration" />
        </div>

        </section>
    );
};

export default Hero;