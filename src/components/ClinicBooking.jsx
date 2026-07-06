import React, { useState } from "react";
import "./ClinicBooking.css";
import logo from "../assets/logo.png";

const ClinicBooking = ({ onNavigate }) => {
  // إدارة الخطوات: 1 = حجز الموعد، 2 = تأكيد البيانات، 3 = النجاح
    const [bookingStep, setBookingStep] = useState(1);

    // بيانات العيادة الثابتة كما هي
    const clinicInfo = {
        name: "عيادة النور لطب الأسنان",
        specialty: "طب الأطفال",
        location: "غزة - الرمال - شارع الوحدة",
        rating: 4.8,
    };

    const doctors = [
        {
        id: 1,
        name: "د. خالد العمري",
        sub: "طب أطفال خبرة 12 سنة",
        initial: "خ",
        },
        { id: 2, name: "د. محمد أحمد", sub: "طب أطفال خبرة 12 سنة", initial: "م" },
        { id: 3, name: "د. محمود محمد", sub: "طب أطفال خبرة 12 سنة", initial: "م" },
    ];

    const days = [
        { id: "day1", text: "الأحد، 12 يوليو", slots: "5 مواعيد متاحة" },
        { id: "day2", text: "الإثنين، 13 يوليو", slots: "5 مواعيد متاحة" },
        { id: "day3", text: "الثلاثاء، 14 يوليو", slots: "5 مواعيد متاحة" },
        { id: "day4", text: "الأربعاء، 15 يوليو", slots: "5 مواعيد متاحة" },
        { id: "day5", text: "الخميس، 16 يوليو", slots: "5 مواعيد متاحة" },
    ];

    const timeSlots = [
        {
        id: "slot1",
        time: "09:00 صباحاً",
        status: "متاح",
        className: "status-available",
        },
        {
        id: "slot2",
        time: "10:30 صباحاً",
        status: "متاح",
        className: "status-available",
        },
        {
        id: "slot3",
        time: "12:00 مساءً",
        status: "شبه ممتلئ",
        className: "status-busy",
        },
        {
        id: "slot4",
        time: "02:00 مساءً",
        status: "محجوز بالكامل",
        className: "status-full",
        },
    ];

    const [selectedDoctor, setSelectedDoctor] = useState(doctors[1]);
    const [selectedDay, setSelectedDay] = useState(days[3]);
    const [selectedTime, setSelectedTime] = useState(null);

    return (
        <div className="clinic-booking-page" dir="rtl">
        {/* 🌐 نافبار داشبورد المريض الثابت والمتطابق مع صورة Figma (image_4b6a9d.png) 🌐 */}
        <header className="Medlink-custom-navbar">
            <div className="nav-right-side">
            {/* الشعار الدائري الأزرق من التصميم */}
            <div className="Medlink-nav-logo">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            {/* الروابط بنفس الترتيب والمسميات الدقيقة في Figma */}
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
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("profile")}
                >
                الملف الشخصي
                </span>
            </nav>
            </div>

            {/* زر تسجيل الخروج المستطيل الأزرق على اليسار تماماً كالتصميم */}
            <div className="nav-left-side">
            <button
                className="btn-Medlink-logout"
                onClick={() => onNavigate("login")}
            >
                تسجيل الخروج
            </button>
            </div>
        </header>

        {/* زر الرجوع الداخلي */}
        <div className="booking-top-bar">
            <button
            className="btn-back-link"
            onClick={() => {
                if (bookingStep === 2) setBookingStep(1);
                else if (bookingStep === 3) setBookingStep(1);
                else onNavigate("clinic-details");
            }}
            >
            ⬅️ {bookingStep === 1 ? "رجوع للعيادات" : "العودة لتعديل الموعد"}
            </button>
        </div>

        {/* --- الخطوة 1: شاشة الحجز الأصلية --- */}
        {bookingStep === 1 && (
            <div className="booking-flow-step-1">
            <div className="clinic-main-header-card">
                <div className="clinic-header-right">
                <div className="clinic-avatar-placeholder">🏥</div>
                <div className="clinic-title-details">
                    <h2>{clinicInfo.name}</h2>
                    <p className="clinic-spec-tag">{clinicInfo.specialty}</p>
                    <p className="clinic-loc-text">📍 {clinicInfo.location}</p>
                </div>
                </div>
                <div className="clinic-header-left">
                <span className="clinic-badge-rating">
                    ⭐ {clinicInfo.rating}
                </span>
                </div>
            </div>

            <div className="booking-section-wrapper">
                <h3 className="section-step-title">🧑‍⚕️ اختر الطبيب :</h3>
                <div className="doctors-selection-list">
                {doctors.map((doc) => (
                    <div
                    key={doc.id}
                    className={`doctor-selection-row ${selectedDoctor?.id === doc.id ? "active-doctor-row" : ""}`}
                    onClick={() => setSelectedDoctor(doc)}
                    >
                    <div className="doc-avatar-circle">{doc.initial}</div>
                    <div className="doc-row-info">
                        <h4>{doc.name}</h4>
                        <p>{doc.sub}</p>
                    </div>
                    <div className="custom-radio-indicator">
                        <div className="radio-inner-dot"></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="booking-section-wrapper">
                <h3 className="section-step-title">🗓️ اختر التاريخ:</h3>
                <div className="days-selection-column">
                {days.map((day) => (
                    <div
                    key={day.id}
                    className={`day-selection-row ${selectedDay?.id === day.id ? "active-day-row" : ""}`}
                    onClick={() => setSelectedDay(day)}
                    >
                    <span className="day-main-text">{day.text}</span>
                    <span className="day-slots-count-badge">{day.slots}</span>
                    </div>
                ))}
                </div>
            </div>

            <div className="booking-section-wrapper">
                <h3 className="section-step-title">⏱️ فترات المواعيد المتاحة :</h3>
                <p className="selected-day-sub-label">
                {selectedDay ? selectedDay.text : ""}
                </p>

                <div className="time-slots-grid">
                {timeSlots.map((slot) => (
                    <div
                    key={slot.id}
                    className={`time-slot-card ${slot.className} ${selectedTime?.id === slot.id ? "active-time-slot" : ""}`}
                    onClick={() => {
                        if (slot.status !== "محجوز بالكامل") setSelectedTime(slot);
                    }}
                    >
                    <div className="slot-card-top">
                        <span>{slot.time}</span>
                        <span className="slot-indicator-dot"></span>
                    </div>
                    <div className="slot-progress-bar-container">
                        <div className="slot-progress-fill"></div>
                    </div>
                    <button className="btn-select-slot-action">
                        {slot.status === "محجوز بالكامل" ? "غير متاح" : "احجز موعد"}
                    </button>
                    </div>
                ))}
                </div>

                <div className="slots-color-guide-row">
                <span className="guide-item">
                    <span className="dot dot-full"></span> محجوز بالكامل
                </span>
                <span className="guide-item">
                    <span className="dot dot-available"></span> متاح
                </span>
                <span className="guide-item">
                    <span className="dot dot-busy"></span> شبه ممتلئ
                </span>
                </div>
            </div>

            {selectedTime && (
                <div className="floating-blue-booking-action-bar">
                <div className="action-bar-inner-content">
                    <div className="booking-summary-text-side">
                    <h5>اختيارك الحالي</h5>
                    <p>
                        {selectedDay.text} - {selectedTime.time} -{" "}
                        {selectedDoctor.name}
                    </p>
                    </div>
                    <button
                    className="btn-confirm-final-booking"
                    onClick={() => setBookingStep(2)}
                    >
                    التأكيد <span className="arrow-btn-icon">📥</span>
                    </button>
                </div>
                </div>
            )}
            </div>
        )}

        {/* --- الخطوة 2: شاشة تأكيد الحجز --- */}
        {bookingStep === 2 && (
            <div className="figma-overlay-container">
            <div className="figma-centered-modal-card">
                <h3 className="figma-modal-title">بيانات تأكيد الحجز</h3>
                <div className="figma-blueprint-data-box">
                <div className="figma-blueprint-row">
                    <span>عيادة النور لطب الأسنان</span>
                </div>
                <div className="figma-blueprint-row">
                    <span>{selectedDoctor.name}</span>
                </div>
                <div className="figma-blueprint-row">
                    <span>{selectedDay.text}</span>
                </div>
                <div className="figma-blueprint-row">
                    <span>{selectedTime.time}</span>
                </div>
                <div className="figma-blueprint-row">
                    <span>غزة الرمال شارع الوحدة</span>
                </div>
                <div className="figma-blueprint-row figma-highlight-id">
                    <span>رقم الحجز: 5</span>
                </div>
                </div>
                <div className="figma-modal-actions-row">
                <button
                    className="btn-figma-action-confirm"
                    onClick={() => setBookingStep(3)}
                >
                    تأكيد الحجز
                </button>
                <button
                    className="btn-figma-action-cancel"
                    onClick={() => setBookingStep(1)}
                >
                    إلغاء
                </button>
                </div>
            </div>
            </div>
        )}

        {/* --- الخطوة 3: شاشة النجاح --- */}
        {bookingStep === 3 && (
            <div className="figma-overlay-container">
            <div className="figma-centered-modal-card">
                <h3 className="figma-modal-title">بيانات تأكيد الحجز</h3>
                <div className="figma-success-vector-zone">
                <div className="figma-green-circle">
                    <span className="figma-check-icon">✓</span>
                </div>
                </div>
                <div className="figma-success-messages">
                <h4>تم حجز موعدك بنجاح</h4>
                <p>وأرسلت رسالة تأكيد عبر البريد الإلكتروني.</p>
                </div>
                <div className="figma-modal-actions-row">
                <button
                    className="btn-figma-action-confirm btn-disabled-look"
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                >
                    تأكيد الحجز
                </button>
                <button
                    className="btn-figma-action-cancel btn-disabled-look"
                    style={{ opacity: 0.9 }}
                    onClick={() => onNavigate("patient-dashboard")}
                >
                    العودة للرئيسية
                </button>
                </div>
            </div>
            </div>
        )}
        <footer className="simple-figma-footer">
            <div className="footer-logo">Medlink </div>
            <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
        </footer>
        </div>
    );
};

export default ClinicBooking;
