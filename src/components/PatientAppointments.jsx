import React, { useState } from "react";
import "./PatientAppointments.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png"; // استيراد صورة الشخص الافتراضية
const PatientAppointments = ({ onNavigate }) => {
  // إدارة التصفية (Filter): "all" | "upcoming" | "past"
  const [activeFilter, setActiveFilter] = useState("all");

  // إدارة النوافذ المنبثقة والإشعارات
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // بيانات المواعيد التجريبية المستوحاة من Figma
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clinicName: "عيادة النور الطبية للأسنان",
      doctorName: "د. محمد أحمد",
      date: "3/6/2026",
      time: "9:00 صباحاً",
      location: "غزة الرمال شارع الوحدة",
      status: "مؤكدة",
      type: "upcoming",
    },
    {
      id: 2,
      clinicName: "عيادة النور الطبية للأسنان",
      doctorName: "د. محمد أحمد",
      date: "3/6/2026",
      time: "9:00 صباحاً",
      location: "غزة الرمال شارع الوحدة",
      status: "سابق",
      type: "past",
    },
    {
      id: 3,
      clinicName: "عيادة النور الطبية للأسنان",
      doctorName: "د. محمد أحمد",
      date: "3/6/2026",
      time: "9:00 صباحاً",
      location: "غزة الرمال شارع الوحدة",
      status: "مؤكدة",
      type: "upcoming",
    },
    {
      id: 4,
      clinicName: "عيادة النور الطبية للأسنان",
      doctorName: "د. محمد أحمد",
      date: "3/6/2026",
      time: "9:00 صباحاً",
      location: "غزة الرمال شارع الوحدة",
      status: "مؤكدة",
      type: "upcoming",
    },
  ]);

  // تصفية المواعيد بناءً على الزر المختار والبحث
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = activeFilter === "all" || app.type === activeFilter;
    const matchesSearch =
      app.doctorName.includes(searchQuery) ||
      app.clinicName.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const triggerCancelModal = (id) => {
    setSelectedAppointmentId(id);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = () => {
    // حذف الموعد من القائمة
    setAppointments(
      appointments.filter((app) => app.id !== selectedAppointmentId),
    );
    setShowCancelModal(false);
    // إظهار بانر النجاح العلوي
    setShowSuccessBanner(true);
    // إخفاء البانر تلقائياً بعد 4 ثوانٍ
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  return (
    <div className="patient-appointments-page" dir="rtl">
      {/* 🌐 البانر الأخضر العلوي لنجاح الحذف (image_bc2dc9.png) */}
      {showSuccessBanner && (
        <div className="figma-success-banner-top">
          <span>تم تأكيد حذف موعدك بنجاح</span>
          <div className="banner-avatar-placeholder"></div>
        </div>
      )}

      {/* 🌐 نافبار داشبورد المريض الموحد والثابت */}
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
              className="Medlink-nav-item active-nav-tab"
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
        <div className="nav-left-side">
          <button
            className="btn-Medlink-logout"
            onClick={() => onNavigate("login")}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* 🔍 منطقة البحث العلوية والترحيب */}
      <div className="appointments-upper-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="ابحث عن موعدك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon-inside">🔍</span>
        </div>
        <div className="user-welcome-badge">
          <span>أهلاً بك</span>
          <img src={person} alt="Profile" className="user-avatar-placeholder" />
        </div>
      </div>

      {/* 🎛️ أزرار التصفية (Filters) */}
      <div className="appointments-filter-row">
        <span className="filter-label-text">تصفية :</span>
        <button
          className={`btn-filter-tab ${activeFilter === "all" ? "active-filter-tab" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          كل المواعيد
        </button>
        <button
          className={`btn-filter-tab ${activeFilter === "upcoming" ? "active-filter-tab" : ""}`}
          onClick={() => setActiveFilter("upcoming")}
        >
          المواعيد القادمة
        </button>
        <button
          className={`btn-filter-tab ${activeFilter === "past" ? "active-filter-tab" : ""}`}
          onClick={() => setActiveFilter("past")}
        >
          المواعيد السابقة
        </button>
      </div>

      {/* 🗂️ شبكة كروت المواعيد */}
      <div className="appointments-cards-grid">
        {filteredAppointments.map((app) => (
          <div key={app.id} className="appointment-data-card">
            <div className="card-info-row">
              <span className="info-label">اسم العيادة :</span>
              <span className="info-value">{app.clinicName}</span>
            </div>
            <div className="card-info-row">
              <span className="info-label">اسم الدكتور :</span>
              <span className="info-value">{app.doctorName}</span>
            </div>
            <div className="card-info-row">
              <span className="info-label">تاريخ الموعد :</span>
              <span className="info-value">{app.date}</span>
            </div>
            <div className="card-info-row">
              <span className="info-label">وقت الموعد :</span>
              <span className="info-value">{app.time}</span>
            </div>
            <div className="card-info-row">
              <span className="info-label">المكان العيادة :</span>
              <span className="info-value">{app.location}</span>
            </div>

            <div className="card-bottom-actions">
              <div className="status-badge-wrapper">
                <span className="info-label">حالة الطلب :</span>
                <span
                  className={`status-badge-tag ${app.status === "مؤكدة" ? "tag-green" : "tag-yellow"}`}
                >
                  {app.status}
                </span>
              </div>

              {app.type === "upcoming" && (
                <button
                  className="btn-trigger-cancel"
                  onClick={() => triggerCancelModal(app.id)}
                >
                  إلغاء الموعد
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <p className="no-appointments-text">
            لا يوجد مواعيد تطابق خيارات التصفية الحالية.
          </p>
        )}
      </div>

      {/* 🟥 النافذة المنبثقة لتأكيد الحذف/الإلغاء (image_bc2b22.png) */}
      {showCancelModal && (
        <div className="figma-modal-backdrop">
          <div className="figma-cancel-dialog-card">
            <h4 className="cancel-modal-title">
              هل أنت متأكد من الغاء الموعد؟
            </h4>
            <p className="cancel-modal-subtitle">
              اذا قمت بحذف موعدك سيتم حذف نهائياً
            </p>

            <div className="cancel-modal-buttons">
              <button
                className="btn-modal-action-delete"
                onClick={confirmCancelAppointment}
              >
                الغاء الموعد
              </button>
              <button
                className="btn-modal-action-keep"
                onClick={() => setShowCancelModal(false)}
              >
                الغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
