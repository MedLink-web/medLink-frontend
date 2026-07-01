import React, { useState } from "react";
import logo from "../assets/logo.png"; // استيراد الشعار الخاص بالمنصة
import "./PatientClinicsView.css";

const PatientClinicsView = ({ onNavigate, activeView, onLogout }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");

    // 🇵🇸 بيانات العيادات والمراكز الطبية الفلسطينية الواقعية
    const [clinicsList] = useState([
        {
        id: 1,
        name: "مركز النور التخصصي للأسنان",
        specialty: "طب الأسنان والتجميل",
        city: "غزة",
        address: "الرمال، شارع عمر المختار",
        rating: 4.9,
        reviewsCount: 142,
        image: "🦷",
        availableTime: "متاح اليوم - 04:00 م",
        },
        {
        id: 2,
        name: "مجمع الشفاء الطبي الاستشاري",
        specialty: "طب الأطفال والولادة",
        city: "رام الله",
        address: "حي الماصيون، بالقرب من المجلس التشريعي",
        rating: 4.7,
        reviewsCount: 96,
        image: "🏢",
        availableTime: "متاح غداً - 09:00 ص",
        },
        {
        id: 3,
        name: "مركز الرعاية المتقدمة لجلدية والليزر",
        specialty: "الجلدية والليزر",
        city: "نابلس",
        address: "شارع رفيديا الرئيسي",
        rating: 4.8,
        reviewsCount: 118,
        image: "🔬",
        availableTime: "متاح اليوم - 06:30 م",
        },
        {
        id: 4,
        name: "عيادات القدس التخصصية",
        specialty: "الطب العام والأسرة",
        city: "القدس",
        address: "حي بيت حنينا، الشارع العام",
        rating: 4.9,
        reviewsCount: 205,
        image: "🏥",
        availableTime: "متاح الأربعاء - 11:00 ص",
        },
        {
        id: 5,
        name: "مستوصف الحياة الطبي الاسري",
        specialty: "الطب العام والأسرة",
        city: "غزة",
        address: "تل الهوا، بالقرب من مستشفى القدس",
        rating: 4.5,
        reviewsCount: 64,
        image: "🩺",
        availableTime: "متاح اليوم - 08:00 م",
        },
    ]);

    // تصفية العيادات ديناميكياً
    const filteredClinics = clinicsList.filter((clinic) => {
        const matchesSearch =
        clinic.name.includes(searchTerm) || clinic.address.includes(searchTerm);
        const matchesSpecialty =
        selectedSpecialty === "all" || clinic.specialty === selectedSpecialty;
        const matchesCity = selectedCity === "all" || clinic.city === selectedCity;
        return matchesSearch && matchesSpecialty && matchesCity;
    });

    return (
        <div className="dashboard-wrapper" dir="rtl">
        {/* 1️⃣ شريط التنقل العلوي الاحترافي المدمج (Navbar) */}
        <nav className="dashboard-nav">
            <div className="nav-right">
            <div className="brand-identity">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
                <span className="nav-logo-text">Medlink</span>
            </div>
            <div className="nav-links">
                <a
                href="#home"
                className={activeView === "home" ? "active" : ""}
                onClick={() => onNavigate && onNavigate("home")}
                >
                الرئيسية
                </a>
                <a href="#!" className="active" onClick={(e) => e.preventDefault()}>
                العيادات
                </a>
                <a
                href="#appointments"
                className={activeView === "appointments" ? "active" : ""}
                onClick={() => onNavigate && onNavigate("appointments")}
                >
                مواعيدي
                </a>
                <a
                href="#pharmacies"
                className={activeView === "pharmacies" ? "active" : ""}
                onClick={() => onNavigate && onNavigate("pharmacies")}
                >
                الصيدليات
                </a>
                <a
                href="#prescriptions"
                className={activeView === "prescriptions" ? "active" : ""}
                onClick={() => onNavigate && onNavigate("prescriptions")}
                >
                الوصفات الطبية
                </a>
            </div>
            </div>
            <div className="nav-left">
            <button
                className="btn-nav-logout"
                onClick={() => onNavigate && onNavigate("patient-profile")}
            >
                🚪 خروج
            </button>
            </div>
        </nav>

        {/* 2️⃣ البانر العلوي الممدد والمحتضن للإحصائيات */}
        <header className="clinics-search-hero-header">
            <div className="hero-header-text-content">
            <h1>البحث عن العيادات والمراكز الطبية</h1>
            <p>
                استكشفي العيادات المتاحة في شبكة Medlink وقومي بحجز موعدكِ بضغطة زر
            </p>
            </div>

            {/* 📊 كروت الأرقام الإحصائية داخل الهيدر الأزرق */}
            <div className="beauty-stats-counter-row">
            <div className="stat-counter-box-card">
                <div className="stat-card-icon-round green-bg">🏥</div>
                <div className="stat-card-info-text">
                <h3>{clinicsList.length}</h3>
                <p>إجمالي العيادات المسجلة</p>
                </div>
            </div>
            <div className="stat-counter-box-card">
                <div className="stat-card-icon-round blue-bg">👨‍⚕️</div>
                <div className="stat-card-info-text">
                <h3>+24</h3>
                <p>أطباء استشاريين</p>
                </div>
            </div>
            <div className="stat-counter-box-card">
                <div className="stat-card-icon-round orange-bg">📅</div>
                <div className="stat-card-info-text">
                <h3>متاح الآن</h3>
                <p>حجز مواعيد فورية</p>
                </div>
            </div>
            </div>
        </header>

        {/* 3️⃣ قسم المحتوى الأساسي للبحث والكروت */}
        <main className="clinics-grid-results-main">
            {/* 🔍 لوحة التحكم بالبحث والفلاتر العائمة فوق الحد الفاصل */}
            <div className="search-filter-dashboard-panel">
            {/* شريط البحث الممتد */}
            <div className="search-input-wrapper-box">
                <span className="search-input-icon">🔍</span>
                <input
                type="text"
                placeholder="ابحثي باسم العيادة، التخصص، الطبيب أو المنطقة التي ترغبين بزيارتها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="dropdown-filter-select-group">
                <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="patient-custom-select"
                >
                <option value="all">كل التخصصات</option>
                <option value="طب الأسنان والتجميل">طب الأسنان والتجميل</option>
                <option value="طب الأطفال والولادة">طب الأطفال والولادة</option>
                <option value="الجلدية والليزر">الجلدية والليزر</option>
                <option value="الطب العام والأسرة">الطب العام والأسرة</option>
                </select>

                <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="patient-custom-select"
                >
                <option value="all">كل المدن</option>
                <option value="غزة">غزة</option>
                <option value="رام الله">رام الله</option>
                <option value="نابلس">نابلس</option>
                <option value="القدس">القدس</option>
                </select>
            </div>
            </div>

            <div className="results-count-summary-text">
            تم العثور على <span>{filteredClinics.length}</span> عيادة وموقع طبي
            متطابق
            </div>

            {/* كروت نتائج العيادات */}
            {filteredClinics.length > 0 ? (
            <div className="clinics-cards-grid-layout">
                {filteredClinics.map((clinic) => (
                <div key={clinic.id} className="clinic-showcase-item-card">
                    <div className="clinic-card-header-icon-row">
                    <div className="clinic-icon-emoticon-avatar">
                        {clinic.image}
                    </div>
                    <span className="clinic-card-specialty-badge">
                        {clinic.specialty}
                    </span>
                    </div>

                    <div className="clinic-card-details-body">
                    <h3 className="clinic-card-title-heading">{clinic.name}</h3>
                    <p className="clinic-card-location-text">
                        📍 {clinic.city}، {clinic.address}
                    </p>
                    <div className="clinic-card-rating-stars-row">
                        <span className="star-rating-score-txt">
                        ⭐ {clinic.rating}
                        </span>
                        <span className="reviews-count-gray-txt">
                        ({clinic.reviewsCount} تقييم)
                        </span>
                    </div>
                    <div className="clinic-card-appointment-availability">
                        🕒 {clinic.availableTime}
                    </div>
                    </div>

                    <div className="clinic-card-actions-footer-row">
                        {/* زر عرض التفاصيل الجديد */}
                        <button 
                            className="btn-patient-view-details"
                            onClick={() => {
                                if (clinic.id === 1) {
                                    // إذا كانت عيادة النور التخصصية، ينقلنا لشاشة تفاصيل العيادة
                                    if (onNavigate) onNavigate('clinic-details');
                                } else {
                                    alert(`تفاصيل ${clinic.name} ستتوفر قريباً!`);
                                }
                            }}
                        >
                            عرض التفاصيل
                        </button>

                        {/* زر احجز موعد الآن الحالي */}
                        <button 
                            className="btn-patient-book-now-action"
                            onClick={() => alert(`توجيه لحجز موعد سريع في: ${clinic.name}`)}
                        >
                            احجز الآن 📅
                        </button>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="no-clinics-matched-empty-state">
                <div className="empty-state-icon-placeholder">🔍</div>
                <h3>لا توجد نتائج مطابقة لبحثك</h3>
                <p>
                تأكد من كتابة الكلمات بشكل صحيح أو حاول تغيير فلاتر التخصص
                والمدينة.
                </p>
            </div>
            )}
        </main>

        {/* 4️⃣ الفوتر السفلي العريض والأنيق لـ Medlink */}
        <footer className="dashboard-main-footer">
            <p>جميع الحقوق محفوظة © Medlink 2026</p>
            <div className="footer-bottom-links">
            <a href="#privacy">سياسة الخصوصية</a>
            <a href="#terms">الشروط والأحكام</a>
            <a href="#contact">تواصل معنا</a>
            <a href="#blog">المدونة</a>
            </div>
            <p className="footer-brand-sub">
            منصتكم الرقمية المتكاملة للرعاية الطبية
            </p>
        </footer>
        </div>
    );
};

export default PatientClinicsView;
