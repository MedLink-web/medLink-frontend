import React from "react";
import "./ClinicsList.css";
import logo from "../assets/logo.png";

const ClinicDetailsView = ({ onNavigate }) => {
    return (
        <div className="clinic-details-page" dir="rtl">
        {/* الهيدر العلوي الموحد لضمان التناسق البصري */}
        <header className="Medlink-custom-navbar">
            <div className="nav-right-side">
            {/* الشعار الدائري الأزرق */}
            <div className="Medlink-nav-logo">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            {/* الروابط بالترتيب والمسميات الدقيقة */}
            <nav className="Medlink-nav-links">
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("patient-dashboard")}
                >
                الرئيسية
                </span>
                <span
                className="Medlink-nav-item active-nav-tab"
                onClick={() => onNavigate("clinics-list")}
                >
                العيادات
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("appointments")}
                >
                مواعيدي
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("pharmacies")}
                >
                الصيدليات
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("prescriptions")}
                >
                الوصفات الطبية
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("profile")}
                >
                الملف الشخصي
                </span>
            </nav>
            </div>

            {/* زر تسجيل الخروج المستطيل الأزرق على اليسار */}
            <div className="nav-left-side">
            <button
                className="btn-Medlink-logout"
                onClick={() => onNavigate("login")}
            >
                تسجيل الخروج
            </button>
            </div>
        </header>

        <div className="figma-layout-container">
            {/* شريط العودة الخلفي */}

            {/* صورة غلاف الممر */}
            <div className="clinic-cover-banner">
            <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                alt="Clinic Corridor"
                className="cover-img"
            />
            </div>

            {/* كرت العنوان المتداخل */}
            <div className="clinic-profile-main-card">
            <div className="right-meta">
                <h2>عيادة النور لطب الأسنان</h2>
                <p className="sub-spec">طب الأطفال</p>
                <div className="stars-row">
                ⭐ 4.8 <span className="verified-status">✓ معتمد</span>
                </div>
            </div>
            <div className="left-icon-box">🏥</div>
            </div>

            {/* نبذة عنا */}
            <div className="details-content-block">
            <h3>نبذة عنا :</h3>
            <p className="description-text">
                عيادة أطفال رائدة تقدم خدمات رعاية صحية شاملة للرضع، صغار السن
                والأطفال. نحن متخصصون في متابعة مراحل النمو والتطور البشري،
                التطعيمات الدورية، والرعاية الطبية الطارئة للأطفال وفقاً لأعلى
                المعايير الطبية.
            </p>
            </div>

            {/* قائمة الأطباء */}
            <div className="details-content-block">
            <h3>أطباؤنا (2)</h3>
            <div className="figma-doctor-row">
                <div className="doc-avatar-circle">م</div>
                <div className="doc-info-side">
                <h4>د. محمد أحمد</h4>
                <p className="spec-tag">طب الأطفال • خبرة 21 عاماً</p>
                <p className="time-tag">
                    المواعيد المتاحة: غداً الساعة 10:00 صباحاً
                </p>
                </div>
                <button
                className="btn-mini-action"
                onClick={() => onNavigate("clinic-booking")}
                >
                احجز الآن
                </button>
            </div>

            <div className="figma-doctor-row">
                <div className="doc-avatar-circle">م</div>
                <div className="doc-info-side">
                <h4>د. محمد أحمد</h4>
                <p className="spec-tag">طب الأطفال • خبرة 21 عاماً</p>
                <p className="time-tag">
                    المواعيد المتاحة: غداً الساعة 10:00 صباحاً
                </p>
                </div>
                <button
                className="btn-mini-action"
                onClick={() => onNavigate("clinic-booking")}
                >
                احجز الآن
                </button>
            </div>
            </div>

            {/* التنسيق الجديد لبيانات التواصل مقسمة لعمودين (تنسيق كروت منظم) */}
            <div className="details-content-block">
            <h3>التواصل وساعات العمل:</h3>
            <div className="contact-info-grid">
                <div className="contact-line">📍 غزة، الرمال، شارع الوحدة</div>
                <div className="contact-line">📞 +966 11 234 5678</div>
                <div className="contact-line">✉️ info@alnoor-dental.com</div>
                <div className="contact-line">
                🕒 من الأحد إلى الخميس | 7:00 ص - 9:00 م
                </div>
                <div className="contact-line full-width-line">
                ⏱️ متوسط وقت الانتظار المتوقع حوالي 15 دقيقة
                </div>
            </div>
            </div>
        </div>

        {/* البنر الكحلي السفلي الثابت في أسفل شاشة التفاصيل */}
        <section className="cta-booking-footer-banner">
            <div className="cta-text">
            <h4>هل أنت مستعد لحجز موعد؟</h4>
            <p>اختر طبيباً وحدد فترة زمنية مناسبة.</p>
            </div>
            <button
            className="btn-cta-primary-book"
            onClick={() => onNavigate("clinic-booking")}
            >
            📅 حجز موعد
            </button>
        </section>
        <footer className="simple-figma-footer">
            <div className="footer-logo">Medlink </div>
            <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
        </footer>
        </div>
    );
};

export default ClinicDetailsView;
