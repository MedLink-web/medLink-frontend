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
        `https://medlink-s.apps.taqat.academy /api/clinics/${clinicId}`,
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
        `https://medlink-s.apps.taqat.academy /api/clinics/${clinicId}/slots`,
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
                    minWidth: "250px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#2d3748",
                      fontSize: "20px",
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
                      fontSize: "20px",
                      marginBottom: "4px",
                    }}
                  >
                    {slot.start_time} - {slot.end_time}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      color: slot.is_fully_booked ? "#c53030" : "#276749",
                    }}
                  >
                    {slot.is_fully_booked
                      ? " ممتلئ"
                      : ` متبقي ${slot.remaining_capacity} مكان`}
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
            <div className="info-item-row">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.9912 9.65332C18.9055 7.92303 18.181 6.28061 16.9502 5.0498C15.7194 3.819 14.077 3.09452 12.3467 3.00879L12 3C10.1435 3 8.36256 3.73705 7.0498 5.0498C5.73705 6.36256 5 8.14348 5 10C5 12.1593 6.21679 14.4871 7.79785 16.5645C9.32566 18.5717 11.0795 20.1963 12 20.9951C12.9205 20.1963 14.6743 18.5717 16.2021 16.5645C17.7832 14.4871 19 12.1593 19 10L18.9912 9.65332ZM21 10C21 12.8337 19.4474 15.603 17.7939 17.7754C16.327 19.7028 14.6832 21.2859 13.6553 22.2041L13.2549 22.5557C13.2379 22.5704 13.2201 22.5851 13.2021 22.5986C12.899 22.8266 12.538 22.9626 12.1621 22.9932L12 23C11.6207 23 11.2504 22.8919 10.9316 22.6904L10.7979 22.5986L10.7451 22.5557C9.78983 21.7308 7.88248 19.978 6.20605 17.7754C4.55262 15.603 3 12.8337 3 10C3 7.61305 3.94791 5.32357 5.63574 3.63574C7.32357 1.94791 9.61305 1 12 1C14.3869 1 16.6764 1.94791 18.3643 3.63574C20.0521 5.32357 21 7.61305 21 10Z"
                  fill="black"
                />
                <path
                  d="M14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10ZM16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10Z"
                  fill="black"
                />
              </svg>
              {clinic.clinic_address}
            </div>
            <div className="info-item-row">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4C8 3.73478 7.89457 3.48051 7.70703 3.29297C7.54289 3.12883 7.32763 3.02757 7.09863 3.00488L7 3H4C3.73478 3 3.4805 3.10543 3.29297 3.29297C3.10543 3.4805 3 3.73478 3 4L3.00488 4.42188C3.11289 8.77767 4.89094 12.932 7.97949 16.0205C11.1676 19.2086 15.4913 21 20 21C20.2652 21 20.5195 20.8946 20.707 20.707C20.8946 20.5195 21 20.2652 21 20V17C21 16.7348 20.8946 16.4805 20.707 16.293C20.5195 16.1054 20.2652 16 20 16H17C16.8448 16 16.6916 16.036 16.5527 16.1055C16.4139 16.1749 16.2933 16.2762 16.2002 16.4004L16.1953 16.4072L15.8398 16.8701L15.8408 16.8711C15.5656 17.2326 15.1752 17.4894 14.7344 17.5996C14.3486 17.696 13.944 17.6748 13.5723 17.541L13.415 17.4766L13.3916 17.4658C10.4157 16.0053 8.00728 13.6 6.54297 10.626L6.54102 10.6221C6.33868 10.2069 6.28622 9.73455 6.39258 9.28516C6.49903 8.83567 6.75789 8.4366 7.125 8.15625L7.13184 8.15137L7.59961 7.7998L7.68848 7.72559C7.77262 7.64574 7.84239 7.55154 7.89453 7.44727C7.96396 7.30841 8 7.15525 8 7V4ZM10 7C10 7.46573 9.89188 7.92523 9.68359 8.3418C9.5014 8.70619 9.24674 9.0288 8.93652 9.29102L8.7998 9.40039L8.33789 9.74512C9.60317 12.3136 11.6816 14.3917 14.249 15.6582L14.5996 15.2002L14.709 15.0635C14.9712 14.7533 15.2938 14.4986 15.6582 14.3164C16.0748 14.1081 16.5343 14 17 14H20C20.7957 14 21.5585 14.3163 22.1211 14.8789C22.6837 15.4415 23 16.2043 23 17V20C23 20.7957 22.6837 21.5585 22.1211 22.1211C21.5585 22.6837 20.7957 23 20 23C14.9609 23 10.1286 20.9978 6.56543 17.4346C3.11356 13.9827 1.12662 9.33986 1.00586 4.47168L1 4C1 3.20435 1.3163 2.44152 1.87891 1.87891C2.44152 1.3163 3.20435 1 4 1H7L7.29688 1.01465C7.98351 1.08291 8.6289 1.38671 9.12109 1.87891C9.6837 2.44151 10 3.20435 10 4V7Z"
                  fill="black"
                />
              </svg>
              {clinic.clinic_phone}
            </div>
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
