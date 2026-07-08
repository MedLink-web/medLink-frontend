import React, { useState, useEffect } from "react";
import noorClinic from "../assets/noorClinic.png";
import "./ClinicDetailsView.css";

const ClinicDetailsView = ({ onBack, onNavigate, clinicId }) => {
  const [clinic, setClinic] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── جلب بيانات العيادة ───────────────────────
  useEffect(() => {
    if (!clinicId) return;
    fetchClinicDetails();
    fetchSlots();
  }, [clinicId]);

  const fetchClinicDetails = async () => {
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/clinics/${clinicId}`,
        { headers: { Accept: "application/json" } },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setClinic(data.data);
      } else {
        setError("فشل تحميل بيانات العيادة");
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/clinics/${clinicId}/slots`,
        { headers: { Accept: "application/json" } },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setSlots(data.data);
      }
    } catch {
      console.error("فشل تحميل المواعيد");
    }
  };

  // ─── Loading ──────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="clinic-details-page"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل بيانات العيادة...</p>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div
        className="clinic-details-page"
        dir="rtl"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ color: "#e53e3e", fontSize: "16px" }}>
          ⚠️ {error || "العيادة غير موجودة"}
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← العودة
        </button>
      </div>
    );
  }

  return (
    <div className="clinic-details-page" dir="rtl">
      {/* البانر العلوي */}
      <div
        className="clinic-hero-banner"
        style={{ backgroundImage: `url(${noorClinic})` }}
      >
        <button className="btn-back-to-list" onClick={onBack}>
          ← رجوع للقائمة
        </button>
      </div>

      <div className="clinic-details-content-container">
        {/* ── معلومات العيادة ────────────────── */}
        <section className="clinic-main-info-card">
          <div className="clinic-header-title-row">
            <div className="clinic-title-badge-group">
              <h2>{clinic.clinic_name}</h2>
              <span className="clinic-type-tag">{clinic.specialty}</span>
            </div>
            <span className="clinic-verified-badge">✓ معتمدة</span>
          </div>

          <div className="clinic-rating-stars">⭐ 4.9</div>

          <div className="clinic-about-section">
            <h3>نبذة عنا:</h3>
            <p>
              عيادة متخصصة في {clinic.specialty}، تقدم خدمات رعاية صحية شاملة
              وفقاً لأعلى المعايير الطبية.
            </p>
          </div>
        </section>

        {/* ── قسم الأطباء ────────────────────── */}
        <section className="clinic-doctors-section">
          <h3 className="section-title">
            أطباؤنا ({clinic.doctors?.length || 0})
          </h3>
          <div className="doctors-list-layout">
            {clinic.doctors?.length === 0 ? (
              <p
                style={{
                  color: "#718096",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                لا يوجد أطباء مسجّلون حالياً
              </p>
            ) : (
              clinic.doctors?.map((doc) => (
                <div key={doc.id} className="doctor-item-strip-card">
                  <div className="doctor-avatar-info-block">
                    <div className="doctor-avatar-placeholder">👨‍⚕️</div>
                    <div className="doctor-meta-text">
                      <h4>{doc.full_name}</h4>
                      <p className="doc-spec">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="doctor-action-rating-block">
                    <span className="doc-rating">⭐ 5.0</span>
                    <button
                      className="btn-book-doctor-spec"
                      onClick={() => onNavigate && onNavigate("clinic-booking")}
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── المواعيد المتاحة ────────────────── */}
        <section className="clinic-doctors-section">
          <h3 className="section-title">المواعيد المتاحة</h3>
          {slots.length === 0 ? (
            <p
              style={{ color: "#718096", textAlign: "center", padding: "20px" }}
            >
              لا توجد مواعيد متاحة حالياً
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                padding: "16px 0",
              }}
            >
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    border: `2px solid ${slot.is_fully_booked ? "#fed7d7" : "#9ae6b4"}`,
                    borderRadius: "10px",
                    padding: "12px 16px",
                    background: slot.is_fully_booked ? "#fff5f5" : "#f0fff4",
                    minWidth: "180px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#2d3748",
                      marginBottom: "4px",
                    }}
                  >
                    <svg
                      width="20"
                      height="22"
                      viewBox="0 0 20 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 5V1C5 0.447715 5.44772 0 6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5Z"
                        fill="black"
                      />
                      <path
                        d="M13 5V1C13 0.447715 13.4477 0 14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5Z"
                        fill="black"
                      />
                      <path
                        d="M18 5C18 4.44772 17.5523 4 17 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5ZM20 19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19Z"
                        fill="black"
                      />
                      <path
                        d="M19 8C19.5523 8 20 8.44771 20 9C20 9.55229 19.5523 10 19 10H1C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8H19Z"
                        fill="black"
                      />
                    </svg>
                    {slot.date}
                  </p>
                  <p
                    style={{
                      color: "#4a5568",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    🕐 {slot.start_time} - {slot.end_time}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: slot.is_fully_booked ? "#c53030" : "#276749",
                    }}
                  >
                    {slot.is_fully_booked
                      ? "❌ ممتلئ"
                      : `✅ متبقي ${slot.remaining_capacity} مكان`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── التواصل وساعات العمل ───────────── */}
        <section className="clinic-contact-hours-card">
          <h3>التواصل وساعات العمل:</h3>
          <div className="info-links-grid">
            <div className="info-item-row">📍 {clinic.clinic_address}</div>
            <div className="info-item-row">📞 {clinic.clinic_phone}</div>
            <div className="info-item-row"> {clinic.clinic_email}</div>
          </div>
        </section>

        {/* ── زر الحجز ──────────────────────── */}
        <div className="bottom-booking-sticky-action-bar">
          <div className="action-bar-text">
            <h4>هل أنتِ مستعدة لحجز موعد؟</h4>
            <p>اختر فترة زمنية مناسبة وأكّد حجزك.</p>
          </div>
          <button
            className="btn-main-trigger-booking"
            onClick={() =>
              onNavigate && onNavigate("clinic-booking", { clinicId: clinicId })
            }
          >
            حجز موعد{" "}
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5V1C5 0.447715 5.44772 0 6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5Z"
                fill="black"
              />
              <path
                d="M13 5V1C13 0.447715 13.4477 0 14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5Z"
                fill="black"
              />
              <path
                d="M18 5C18 4.44772 17.5523 4 17 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5ZM20 19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19Z"
                fill="black"
              />
              <path
                d="M19 8C19.5523 8 20 8.44771 20 9C20 9.55229 19.5523 10 19 10H1C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8H19Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsView;
