import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
        <div className="footer-container">
            
            {/* العمود الأول (يمين): الشعار وأيقونات التواصل الاجتماعي الرسمية بدقة SVG عالية */}
            <div className="footer-brand-column">
            <div className="footer-logo">
                <span className="logo-icon">🩺</span>
                <span className="logo-text">midlink</span>
            </div>
            
            <div className="social-links">
                {/* فيسبوك */}
                <a href="#facebook" className="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
                </a>

                {/* تويتر / X */}
                <a href="#twitter" className="social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                </a>

                {/* إنستغرام */}
                <a href="#instagram" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                </a>

                {/* لينكد إن */}
                <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                </a>
            </div>
            </div>

            {/* العمود الثاني: روابط سريعة */}
            <div className="footer-links-column">
            <h4 className="column-title">روابط سريعة</h4>
            <ul>
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#about">عن المنصة</a></li>
                <li><a href="#services">الخدمات</a></li>
                <li><a href="#support">الدعم الفني</a></li>
            </ul>
            </div>

            {/* العمود الثالث: الخدمات */}
            <div className="footer-links-column">
            <h4 className="column-title">الخدمات</h4>
            <ul>
                <li><a href="#appointments">حجز المواعيد</a></li>
                <li><a href="#consultations">استشارات عبر الإنترنت</a></li>
                <li><a href="#search-doctor">ابحث عن طبيب</a></li>
                <li><a href="#medical-files">الملفات الطبية</a></li>
            </ul>
            </div>

            {/* العمود الرابع: الدعم الفني */}
            <div className="footer-links-column">
            <h4 className="column-title">الدعم الفني</h4>
            <ul>
                <li><a href="#faq">الأسئلة الشائعة</a></li>
                <li><a href="#privacy">سياسة الخصوصية</a></li>
                <li><a href="#terms">الشروط والأحكام</a></li>
                <li><a href="#contact">تواصل معنا</a></li>
            </ul>
            </div>

            

        </div>

        {/* شريط الحقوق السفلي الممتد في المنتصف */}
        <div className="footer-bottom-bar">
            <p>جميع الحقوق محفوظة © midlink 2026</p>
        </div>
        </footer>
    );
};

export default Footer;