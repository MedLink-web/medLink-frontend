import React, { useState, useEffect } from "react";
// ☝️ تغيير 1: أضفنا useEffect
import "./PatientAppointments.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png";

const PatientAppointments = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ تغيير 2: بدل البيانات الثابتة — حالات جديدة
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ✅ تغيير 3 (US-12): جلب مواعيد المريض من الـ API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/appointments/my",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          // ✅ تغيير 4: تحويل بيانات الـ API لشكل الكرت الموجود
          const mapped = data.data.map((item) => {
            const slotDate = item.slot?.date || "";
            const today = new Date().toISOString().split("T")[0];
            const isPast = slotDate < today || item.status === "cancelled";
            return {
              id: item.id,
              clinicName: item.clinic?.name || "",
              doctorName: "", // الـ API ما بترجع اسم الدكتور حالياً
              date: slotDate,
              time:
                (item.slot?.start_time || "") +
                " - " +
                (item.slot?.end_time || ""),
              location: item.clinic?.address || "",
              status: item.status_label,
              type: isPast ? "past" : "upcoming",
            };
          });
          setAppointments(mapped);
        } else {
          setError("حدث خطأ في جلب المواعيد");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // تصفية المواعيد
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = activeFilter === "all" || app.type === activeFilter;
    const matchesSearch =
      app.clinicName.includes(searchQuery) ||
      app.doctorName.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const triggerCancelModal = (id) => {
    setSelectedAppointmentId(id);
    setShowCancelModal(true);
  };

  // ✅ تغيير 5 (US-11): دالة الإلغاء تستدعي POST /api/appointments/{id}/cancel
  const confirmCancelAppointment = async () => {
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${selectedAppointmentId}/cancel`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        // تحديث حالة الموعد محلياً
        setAppointments(
          appointments.map((app) =>
            app.id === selectedAppointmentId
              ? { ...app, status: "ملغي", type: "past" }
              : app,
          ),
        );
        setShowCancelModal(false);
        setShowSuccessBanner(true);
        setTimeout(() => setShowSuccessBanner(false), 4000);
      } else {
        alert(data.message || "فشل إلغاء الموعد");
        setShowCancelModal(false);
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم");
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="patient-appointments-page" dir="rtl">
      {showSuccessBanner && (
        <div className="figma-success-banner-top">
          <span>تم تأكيد حذف موعدك بنجاح</span>
          <div className="banner-avatar-placeholder"></div>
        </div>
      )}

      <header className="patient-nav-header">
        <div className="patient-header-brand">
          <img src={logo} alt="Medlink Logo" className="logo-image" />
          <span className="Medlink-text-title">Medlink</span>
        </div>
        <nav className="patient-header-menu">
          <span
            className="nav-link-active"
            onClick={() => onNavigate("patient-dashboard")}
          >
            الرئيسية
          </span>
          <span
            onClick={() => onNavigate("clinics-list")}
            style={{ cursor: "pointer" }}
          >
            العيادات
          </span>
          <span
            onClick={() => onNavigate("appointments")}
            style={{ cursor: "pointer" }}
          >
            المواعيد
          </span>
          <span
            onClick={() => onNavigate("prescriptions")}
            style={{ cursor: "pointer" }}
          >
            الوصفات الطبية
          </span>
          <span
            onClick={() => onNavigate("patient-pharmacies")}
            style={{ cursor: "pointer" }}
          >
            الصيدليات
          </span>
          <span
            onClick={() => onNavigate("profile")}
            style={{ cursor: "pointer" }}
          >
            الملف الشخصي
          </span>
        </nav>
        <button
          className="btn-logout-patient"
          onClick={() => onNavigate("landing")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.293 6.29297C15.6591 5.92685 16.2381 5.90426 16.6309 6.22461L16.707 6.29297L21.707 11.293C22.0976 11.6835 22.0976 12.3165 21.707 12.707L16.707 17.707C16.3165 18.0976 15.6835 18.0976 15.293 17.707C14.9024 17.3165 14.9024 16.6835 15.293 16.293L19.5859 12L15.293 7.70703L15.2246 7.63086C14.9043 7.23809 14.9269 6.65908 15.293 6.29297Z"
              fill="black"
            />
            <path
              d="M21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H21Z"
              fill="black"
            />
            <path
              d="M2 19V5C2 4.20435 2.3163 3.44152 2.87891 2.87891C3.44152 2.3163 4.20435 2 5 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H5C4.73478 4 4.4805 4.10543 4.29297 4.29297C4.10543 4.4805 4 4.73478 4 5V19C4 19.2652 4.10543 19.5195 4.29297 19.707C4.48051 19.8946 4.73478 20 5 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H5C4.20435 22 3.44151 21.6837 2.87891 21.1211C2.3163 20.5585 2 19.7957 2 19Z"
              fill="black"
            />
          </svg>
        </button>
      </header>

      <div className="appointments-upper-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="ابحث عن موعدك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon-inside"></span>
        </div>
        <div className="user-welcome-badge">
          <span>أهلاً بك</span>
          <img src={person} alt="Profile" className="user-avatar-placeholder" />
        </div>
      </div>

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

      {/* ⏳ حالة التحميل */}
      {loading && (
        <p className="no-appointments-text">جاري تحميل المواعيد...</p>
      )}

      {/* ❌ حالة الخطأ */}
      {error && (
        <p className="no-appointments-text" style={{ color: "#c0392b" }}>
          {error}
        </p>
      )}

      {/* 🗂️ شبكة كروت المواعيد */}
      {!loading && !error && (
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
                    className={`status-badge-tag ${app.status === "مؤكد" ? "tag-green" : "tag-yellow"}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* ✅ تغيير 6: زر الإلغاء بس للمواعيد القادمة الغير ملغية */}
                {app.type === "upcoming" && app.status !== "ملغي" && (
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
      )}

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
              {/* ✅ تغيير 7: الزر يستدعي الـ API + يعرض حالة التحميل */}
              <button
                className="btn-modal-action-delete"
                onClick={confirmCancelAppointment}
                disabled={cancelLoading}
              >
                {cancelLoading ? "جاري الإلغاء..." : "الغاء الموعد"}
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
