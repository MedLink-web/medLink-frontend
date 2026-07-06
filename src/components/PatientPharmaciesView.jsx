import React from "react";
import "./PatientPharmaciesView.css";
import logo from "../assets/logo.png";

// تأكدي من استيراد صورة افتراضية للصيدلية أو استخدام نفس مسار صوركِ في assets
import pharmacyDefaultImg from "../assets/pharamacy-icon.png";

const PatientPharmaciesView = ({ onNavigate }) => {
  // بيانات حقيقية ومجهزة للصيدليات القريبة المتاحة
    const pharmaciesData = [
        {
        id: 1,
        name: "صيدلية عادل",
        phone: "0569876543",
        branch: "الساحة مقابل بلدية غزة",
        status: "متوفرة على مدار 24/7",
        rating: "4.9",
        // يمكنكِ وضع رابط صورة حقيقية هنا لاحقاً
        image:
            "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=400&auto=format&fit=crop",
        },
        {
        id: 2,
        name: "صيدلية الشفاء التخصصية",
        phone: "0592112233",
        branch: "الرمال - شارع عمر المختار",
        status: "متوفرة على مدار 24/7",
        rating: "4.8",
        image:
            "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=400&auto=format&fit=crop",
        },
        {
        id: 3,
        name: "صيدلية القدس",
        phone: "0567445566",
        branch: "النصر - بالقرب من مستشفى العيون",
        status: "مغلق حالياً - تفتح 8 صباحاً",
        rating: "4.7",
        image:
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop",
        },
    ];

    return (
        <div className="patient-pharmacies-root" dir="rtl">
        <header className="Medlink-custom-navbar">
            <div className="nav-right-side">
            <div className="Medlink-nav-logo">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            <nav className="Medlink-nav-links">
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("patient-dashboard")}
                >
                الرئيسية
                </span>
                <span
                className="Medlink-nav-item"
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
                className="Medlink-nav-item active-nav-tab"
                onClick={() => onNavigate("patient-pharmacies")}
                >
                الصيدليات
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("prescriptions")}
                >
                الوصفات الطبية
                </span>
                <span className="Medlink-nav-item">الملف الشخصي</span>
            </nav>
            </div>
            <div className="nav-left-side">
            <button
                className="btn-Medlink-logout"
                onClick={() => onNavigate("login")}
            >
                تسجيل الخروج
            </button>
            </div>
        </header>

        {/* العناوين الرئيسية بناءً على Figma */}
        <div className="pharmacies-page-header">
            <h1 className="pharmacies-main-title">عرض الصيدليات</h1>
            <p className="pharmacies-sub-title">
            الصيدليات المتاحة والقريبة منك حالياً في قطاع غزة
            </p>
        </div>

        {/* شبكة عرض الكروت الفاخرة */}
        <div className="pharmacies-cards-grid">
            {pharmaciesData.map((pharmacy) => (
            <div key={pharmacy.id} className="pharmacy-display-card">
                <div className="pharmacy-img-wrapper">
                <img
                    src={pharmacy.image}
                    alt={pharmacy.name}
                    className="pharmacy-card-image"
                    onError={(e) => {
                    e.target.src = pharmacyDefaultImg;
                    }} // حماية في حال فشل تحميل الصورة
                />
                </div>

                <div className="pharmacy-card-details">
                <div className="detail-item">
                    <span className="detail-label">اسم الصيدلية : </span>
                    <span className="detail-value font-bold">{pharmacy.name}</span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">رقم الهاتف : </span>
                    <span className="detail-value">{pharmacy.phone}</span>
                </div>

                <div className="detail-item">
                    <span className="detail-label">الفرع : </span>
                    <span className="detail-value">{pharmacy.branch}</span>
                </div>

                <div className="detail-item status-highlight">
                    <span className="detail-value">{pharmacy.status}</span>
                </div>

                <div className="detail-item rating-section">
                    <span className="detail-label">التقييم : </span>
                    <span className="rating-stars">⭐ {pharmacy.rating}</span>
                </div>
                </div>

                <div className="pharmacy-card-actions">
                <button className="btn-contact-pharmacy">تواصل الآن</button>
                </div>
            </div>
            ))}
        </div>
        <footer className="simple-figma-footer">
            <div className="footer-logo">Medlink </div>
            <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
        </footer>
        </div>
    );
};

export default PatientPharmaciesView;
