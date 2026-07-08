import React, { useState, useEffect } from "react";
import "./ClinicBooking.css";
import logo from "../assets/logo.png";

const ClinicBooking = ({ onNavigate, clinicId }) => {
  const [bookingStep, setBookingStep] = useState(1);

  // ✅ بدل clinicInfo الثابت — من الـ API
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicLoading, setClinicLoading] = useState(true);

  // ✅ بدل doctors الثابت — من الـ API
  const [doctors, setDoctors] = useState([]);

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // ✅ جلب بيانات العيادة + الدكاترة من الـ API
  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        setClinicLoading(true);
        const response = await fetch(
          `https://medlink-backend-production-e2f2.up.railway.app/api/clinics/${clinicId}`,
          { headers: { Accept: "application/json" } },
        );
        const data = await response.json();
        if (data.success) {
          setClinicInfo({
            name: data.data.clinic_name || "",
            specialty: data.data.specialty || "",
            location: data.data.clinic_address || "",
            phone: data.data.clinic_phone || "",
          });
          // لو الـ API بترجع الدكاترة مع بيانات العيادة
          if (data.data.doctors && data.data.doctors.length > 0) {
            const mappedDocs = data.data.doctors.map((doc) => ({
              id: doc.id,
              name: doc.name || doc.full_name || "",
              sub: doc.specialty || "",
              initial: (doc.name || doc.full_name || "").charAt(0),
            }));
            setDoctors(mappedDocs);
            setSelectedDoctor(mappedDocs[0]);
          }
        }
      } catch (err) {
        console.error("فشل جلب بيانات العيادة:", err);
      } finally {
        setClinicLoading(false);
      }
    };
    fetchClinicInfo();
  }, [clinicId]);

  // جلب السلوتس من الـ API
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://medlink-backend-production-e2f2.up.railway.app/api/clinics/${clinicId}/slots`,
          { headers: { Accept: "application/json" } },
        );
        const data = await response.json();
        if (data.success) {
          setSlots(data.data);
          const dates = [...new Set(data.data.map((s) => s.date))];
          if (dates.length > 0) setSelectedDay(dates[0]);
        } else {
          setError("حدث خطأ في جلب المواعيد");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [clinicId]);

  const uniqueDays = [...new Set(slots.map((s) => s.date))];
  const filteredTimeSlots = slots.filter((s) => s.date === selectedDay);

  const getSlotStatus = (slot) => {
    if (slot.is_fully_booked)
      return { status: "محجوز بالكامل", className: "status-full" };
    if (slot.remaining_capacity <= 1)
      return { status: "شبه ممتلئ", className: "status-busy" };
    return { status: "متاح", className: "status-available" };
  };

  const getAvailableCount = (day) => {
    const count = slots.filter(
      (s) => s.date === day && !s.is_fully_booked,
    ).length;
    return `${count} مواعيد متاحة`;
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slot_id: selectedTime.id }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setBookingResult(data.data);
        setBookingStep(3);
      } else {
        setBookingError(data.message || "فشل الحجز");
      }
    } catch (err) {
      setBookingError("تعذر الاتصال بالخادم");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="clinic-booking-page" dir="rtl">
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
        <div className="nav-left-side">
          <button
            className="btn-Medlink-logout"
            onClick={() => onNavigate("login")}
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
        </div>
      </header>

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

      {bookingStep === 1 && (
        <div className="booking-flow-step-1">
          {/* ✅ بيانات العيادة من الـ API */}
          {clinicLoading && (
            <p
              style={{ textAlign: "center", padding: "20px", color: "#6b7785" }}
            >
              جاري تحميل بيانات العيادة...
            </p>
          )}

          {!clinicLoading && clinicInfo && (
            <div className="clinic-main-header-card">
              <div className="clinic-header-right">
                <div className="clinic-avatar-placeholder">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 10V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10Z"
                      fill="black"
                    />
                    <path
                      d="M14 13C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44771 15 9 14.5523 9 14C9 13.4477 9.44771 13 10 13H14Z"
                      fill="black"
                    />
                    <path
                      d="M14 17C14.5523 17 15 17.4477 15 18C15 18.5523 14.5523 19 14 19H10C9.44771 19 9 18.5523 9 18C9 17.4477 9.44771 17 10 17H14Z"
                      fill="black"
                    />
                    <path
                      d="M14 7C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H10C9.44771 9 9 8.55228 9 8C9 7.44772 9.44771 7 10 7H14Z"
                      fill="black"
                    />
                    <path
                      d="M1 20V11C1 10.2044 1.3163 9.44151 1.87891 8.87891C2.44151 8.3163 3.20435 8 4 8H6C6.55228 8 7 8.44772 7 9C7 9.55229 6.55228 10 6 10H4C3.73478 10 3.48051 10.1054 3.29297 10.293C3.10543 10.4805 3 10.7348 3 11V20C3 20.2652 3.10543 20.5195 3.29297 20.707C3.48051 20.8946 3.73478 21 4 21H20C20.2652 21 20.5195 20.8946 20.707 20.707C20.8946 20.5195 21 20.2652 21 20V14C21 13.7348 20.8946 13.4805 20.707 13.293C20.5195 13.1054 20.2652 13 20 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H20C20.7957 11 21.5585 11.3163 22.1211 11.8789C22.6837 12.4415 23 13.2043 23 14V20C23 20.7957 22.6837 21.5585 22.1211 22.1211C21.5585 22.6837 20.7957 23 20 23H4C3.20435 23 2.44151 22.6837 1.87891 22.1211C1.3163 21.5585 1 20.7957 1 20Z"
                      fill="black"
                    />
                    <path
                      d="M17 22V4C17 3.73478 16.8946 3.48051 16.707 3.29297C16.5195 3.10543 16.2652 3 16 3H8C7.73478 3 7.4805 3.10543 7.29297 3.29297C7.10543 3.4805 7 3.73478 7 4V22C7 22.5523 6.55228 23 6 23C5.44772 23 5 22.5523 5 22V4C5 3.20435 5.3163 2.44152 5.87891 1.87891C6.44152 1.3163 7.20435 1 8 1H16C16.7956 1 17.5585 1.3163 18.1211 1.87891C18.6837 2.44151 19 3.20435 19 4V22C19 22.5523 18.5523 23 18 23C17.4477 23 17 22.5523 17 22Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="clinic-title-details">
                  <h2>{clinicInfo.name}</h2>
                  <p className="clinic-spec-tag">{clinicInfo.specialty}</p>
                  <p className="clinic-loc-text">
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
                    {clinicInfo.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ الدكاترة من الـ API */}
          {doctors.length > 0 && (
            <div className="booking-section-wrapper">
              <h3 className="section-step-title"> اختر الطبيب :</h3>
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
          )}

          <div className="booking-section-wrapper">
            <h3 className="section-step-title"> اختر التاريخ:</h3>
            {loading && <p>جاري تحميل المواعيد...</p>}
            {error && <p style={{ color: "#c0392b" }}>{error}</p>}

            {!loading && !error && uniqueDays.length > 0 && (
              <div className="days-selection-column">
                {uniqueDays.map((day) => (
                  <div
                    key={day}
                    className={`day-selection-row ${selectedDay === day ? "active-day-row" : ""}`}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }}
                  >
                    <span className="day-main-text">{day}</span>
                    <span className="day-slots-count-badge">
                      {getAvailableCount(day)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {!loading && !error && uniqueDays.length === 0 && (
              <p>لا توجد مواعيد متاحة حالياً.</p>
            )}
          </div>

          <div className="booking-section-wrapper">
            <h3 className="section-step-title">⏱️ فترات المواعيد المتاحة :</h3>
            <p className="selected-day-sub-label">
              {selectedDay ? selectedDay : ""}
            </p>

            <div className="time-slots-grid">
              {filteredTimeSlots.map((slot) => {
                const { status, className } = getSlotStatus(slot);
                return (
                  <div
                    key={slot.id}
                    className={`time-slot-card ${className} ${selectedTime?.id === slot.id ? "active-time-slot" : ""}`}
                    onClick={() => {
                      if (!slot.is_fully_booked) setSelectedTime(slot);
                    }}
                  >
                    <div className="slot-card-top">
                      <span>
                        {slot.start_time} - {slot.end_time}
                      </span>
                      <span className="slot-indicator-dot"></span>
                    </div>
                    <div className="slot-progress-bar-container">
                      <div className="slot-progress-fill"></div>
                    </div>
                    <button className="btn-select-slot-action">
                      {slot.is_fully_booked
                        ? "غير متاح"
                        : `احجز موعد (${slot.remaining_capacity})`}
                    </button>
                  </div>
                );
              })}
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
                    {selectedDay} - {selectedTime.start_time} -{" "}
                    {selectedDoctor?.name || ""}
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

      {bookingStep === 2 && (
        <div className="figma-overlay-container">
          <div className="figma-centered-modal-card">
            <h3 className="figma-modal-title">بيانات تأكيد الحجز</h3>
            <div className="figma-blueprint-data-box">
              <div className="figma-blueprint-row">
                <span>{clinicInfo?.name || ""}</span>
              </div>
              <div className="figma-blueprint-row">
                <span>{selectedDoctor?.name || ""}</span>
              </div>
              <div className="figma-blueprint-row">
                <span>{selectedDay}</span>
              </div>
              <div className="figma-blueprint-row">
                <span>
                  {selectedTime.start_time} - {selectedTime.end_time}
                </span>
              </div>
              <div className="figma-blueprint-row">
                <span>{clinicInfo?.location || ""}</span>
              </div>
            </div>
            {bookingError && (
              <p
                style={{
                  color: "#c0392b",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {bookingError}
              </p>
            )}
            <div className="figma-modal-actions-row">
              <button
                className="btn-figma-action-confirm"
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "جاري الحجز..." : "تأكيد الحجز"}
              </button>
              <button
                className="btn-figma-action-cancel"
                onClick={() => {
                  setBookingStep(1);
                  setBookingError(null);
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingStep === 3 && (
        <div className="figma-overlay-container">
          <div className="figma-centered-modal-card">
            <h3 className="figma-modal-title">بيانات تأكيد الحجز</h3>
            <div className="figma-success-vector-zone">
              <div className="figma-green-circle">
                <span className="figma-check-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.293 5.29295C19.6835 4.90243 20.3165 4.90243 20.707 5.29295C21.0976 5.68348 21.0976 6.31649 20.707 6.70702L9.70704 17.707C9.31652 18.0975 8.6835 18.0975 8.29298 17.707L3.29298 12.707L3.22462 12.6308C2.90427 12.2381 2.92686 11.6591 3.29298 11.293C3.65909 10.9268 4.2381 10.9042 4.63087 11.2246L4.70704 11.293L9.00001 15.5859L19.293 5.29295Z"
                      fill="black"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="figma-success-messages">
              <h4>تم حجز موعدك بنجاح</h4>
              <p>وأرسلت رسالة تأكيد عبر البريد الإلكتروني.</p>
              {bookingResult && (
                <p>رقم الحجز: {bookingResult.appointment_id}</p>
              )}
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
