import React from "react";
import noorClinic from "../assets/noorClinic.png"; // الصورة المحددة من قبلكِ
import "./ClinicDetailsView.css";

const ClinicDetailsView = ({ onBack, onNavigate }) => {
    // بيانات العيادة المعروضة في لقطة الشاشة
    const clinicInfo = {
        name: "عيادة النور لطب الأسنان",
        specialty: "طب الأطفال",
        rating: 4.9,
        status: "معتمدة",
        about: "عيادة أطفال رائدة تقدم خدمات رعاية صحية شاملة للرضع، صغار السن، والأطفال. نحن متخصصون في متابعة مراحل النمو والتطور السنوي، التطعيمات الدورية، والرعاية الطبية الطارئة للأطفال وفقاً لأعلى المعايير الطبية.",
        phone: "+966 11 234 5678",
        address: "غزة، الرمال، شارع الوحدة",
        email: "info@alnour-dental.com",
        hours: "من الأحد إلى الخميس | من 7:00 صباحاً حتى 4:00 مساءً",
        waitingTime: "متوسط وقت الانتظار حوالي 15 دقيقة"
    };

    const doctors = [
        { id: 1, name: "د. محمد أحمد", specialty: "طب الأطفال", experience: "خبرة 21 عاماً", availability: "غداً الساعة 10:00 صباحاً", rating: 4.8 },
        { id: 2, name: "د. محمد أحمد", specialty: "طب الأطفال", experience: "خبرة 21 عاماً", availability: "غداً الساعة 10:00 صباحاً", rating: 4.8 }
    ];

    return (
        <div className="clinic-details-page" dir="rtl">
            {/* البانر العلوي مع زر العودة */}
            <div className="clinic-hero-banner" style={{ backgroundImage: `url(${noorClinic})` }}>
                <button className="btn-back-to-list" onClick={onBack}>
                    ← رجوع للملف
                </button>
            </div>

            <div className="clinic-details-content-container">
                {/* كرت تفاصيل العيادة الرئيسي */}
                <section className="clinic-main-info-card">
                    <div className="clinic-header-title-row">
                        <div className="clinic-title-badge-group">
                            <h2>{clinicInfo.name}</h2>
                            <span className="clinic-type-tag">{clinicInfo.specialty}</span>
                        </div>
                        <span className="clinic-verified-badge">✓ {clinicInfo.status}</span>
                    </div>
                    
                    <div className="clinic-rating-stars">⭐ {clinicInfo.rating}</div>
                    
                    <div className="clinic-about-section">
                        <h3>نبذة عنا:</h3>
                        <p>{clinicInfo.about}</p>
                    </div>
                </section>

                {/* قسم الأطباء */}
                <section className="clinic-doctors-section">
                    <h3 className="section-title">أطباؤنا ({doctors.length})</h3>
                    <div className="doctors-list-layout">
                        {doctors.map((doc, index) => (
                            <div key={index} className="doctor-item-strip-card">
                                <div className="doctor-avatar-info-block">
                                    <div className="doctor-avatar-placeholder">👨‍⚕️</div>
                                    <div className="doctor-meta-text">
                                        <h4>{doc.name}</h4>
                                        <p className="doc-spec">{doc.specialty}</p>
                                        <p className="doc-exp">{doc.experience}</p>
                                        <p className="doc-time">المواعيد المتاحة: <span>{doc.availability}</span></p>
                                    </div>
                                </div>
                                <div className="doctor-action-rating-block">
                                    <span className="doc-rating">⭐ {doc.rating}</span>
                                    <button className="btn-book-doctor-spec">احجز الآن</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* قسم التواصل وساعات العمل */}
                <section className="clinic-contact-hours-card">
                    <h3>التواصل وساعات العمل:</h3>
                    <div className="info-links-grid">
                        <div className="info-item-row">📍 {clinicInfo.address}</div>
                        <div className="info-item-row">📞 {clinicInfo.phone}</div>
                        <div className="info-item-row">✉️ {clinicInfo.email}</div>
                        <div className="info-item-row">📅 {clinicInfo.hours}</div>
                        <div className="info-item-row">⏳ {clinicInfo.waitingTime}</div>
                    </div>
                </section>

                {/* البانر السفلي للحجز الفوري */}
                <div className="bottom-booking-sticky-action-bar">
                    <div className="action-bar-text">
                        <h4>هل أنتِ مستعدة لحجز موعد؟</h4>
                        <p>اختر طبيباً وحدد فترة زمنية مناسبة.</p>
                    </div>
                    <button className="btn-main-trigger-booking"
                    onClick={() => onNavigate && onNavigate('clinic-appointments')}>حجز موعد 📅</button>
                </div>
            </div>
        </div>
    );
};

export default ClinicDetailsView;