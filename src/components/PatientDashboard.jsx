import React, { useState, useEffect } from "react";
import "./PatientDashboard.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png";

const PatientDashboard = ({ onNavigate }) => {
  // ✅ اسم المريض من localStorage (محفوظ من تسجيل الدخول)
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [patientInfo] = useState({
    name: savedUser.full_name || savedUser.name || "مستخدم",
    avatar: person,
  });

  const token = localStorage.getItem("token");
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ✅ حالات البيانات — كلها فاضية بالبداية
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [suggestedClinics, setSuggestedClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ جلب كل البيانات أول ما الصفحة تفتح
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. جلب المواعيد
        const apptRes = await fetch(
          "http://127.0.0.1:8000/api/appointments/my",
          { headers },
        );
        const apptData = await apptRes.json();
        if (apptData.success && apptData.data) {
          setAppointments(
            apptData.data.map((item) => ({
              id: item.id,
              doctor: "",
              specialty: item.clinic?.specialty || "",
              date: item.slot?.date || "",
              time: item.slot?.start_time || "",
              clinicName: item.clinic?.name || "",
            })),
          );
        }

        // 2. جلب الوصفات
        const rxRes = await fetch(
          "http://127.0.0.1:8000/api/patient/prescriptions",
          { headers },
        );
        const rxData = await rxRes.json();
        if (rxData.success && rxData.data) {
          setPrescriptions(
            rxData.data.map((item) => ({
              id: item.id,
              doctor: item.doctor?.name || "",
              specialty: "",
              date: item.date || "",
              status: item.diagnosis ? "نشطة" : "مكتملة",
              medsCount: item.items?.length || 0,
            })),
          );
        }

        // 3. جلب الصيدليات
        const phRes = await fetch("http://127.0.0.1:8000/api/pharmacies", {
          headers: { Accept: "application/json" },
        });
        const phData = await phRes.json();
        if (phData.success && phData.data) {
          setPharmacies(
            phData.data.slice(0, 2).map((item) => ({
              id: item.id,
              name: item.name || "",
              branch: item.address || "",
              timing: "متوفرة",
              phone: item.phone || "",
            })),
          );
        }

        // 4. جلب العيادات المقترحة
        const clRes = await fetch("http://127.0.0.1:8000/api/clinics", {
          headers: { Accept: "application/json" },
        });
        const clData = await clRes.json();
        if (clData.success && clData.data) {
          setSuggestedClinics(
            clData.data.map((item) => ({
              id: item.id,
              name: item.clinic_name || "",
              specialty: item.specialty || "",
            })),
          );
        }
      } catch (err) {
        console.error("فشل جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const [contactForm, setContactForm] = useState({ name: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      "شكراً لتواصلك معنا. تم إرسال استفسارك إلى الدعم الفني لـ Medlink بنجاح!",
    );
    setContactForm({ name: "", message: "" });
  };

  return (
    <div className="patient-dashboard-container" dir="rtl">
      {/* 1. شريط التنقل العلوي */}
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

      {/* 2. قطاع الترحيب */}
      <section className="patient-welcome-hero">
        <div className="hero-text-side">
          <h1>مرحباً، {patientInfo.name} 👋</h1>
          <p>
            أهلاً بك مجدداً في لوحة تحكمك الصحية. يمكنك استعراض مواعيدك ووصفاتك
            الطبية بسهولة.
          </p>
          <div className="hero-action-buttons">
            <button
              className="btn-hero-primary"
              onClick={() => onNavigate("clinics-list")}
            >
              {" "}
              البحث عن عيادة
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => onNavigate("patient-pharmacies")}
            >
              البحث عن صيدلية
            </button>
          </div>
        </div>
        <div className="hero-avatar-side">
          <img
            src={patientInfo.avatar}
            alt={patientInfo.name}
            className="patient-main-avatar-img"
          />
        </div>
      </section>

      {/* 3. كروت العدادات */}
      <section className="patient-stats-counters">
        <div className="stat-counter-card blue-glow">
          <span className="stat-card-icon">
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
          </span>
          <div className="stat-card-details">
            <h3>{appointments.length}</h3>
            <p>المواعيد تم حجزها</p>
          </div>
        </div>
        <div className="stat-counter-card cyan-glow">
          <span className="stat-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3V5H15V3H9ZM17 5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5Z"
                fill="black"
              />
              <path
                d="M3 20V6C3 5.20435 3.3163 4.44152 3.87891 3.87891C4.44152 3.3163 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6C5.73478 5 5.4805 5.10543 5.29297 5.29297C5.10543 5.4805 5 5.73478 5 6V20L5.00488 20.0986C5.02757 20.3276 5.12883 20.5429 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V6C19 5.73478 18.8946 5.48051 18.707 5.29297C18.5429 5.12883 18.3276 5.02757 18.0986 5.00488L18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18L18.2969 3.01465C18.9835 3.08291 19.6289 3.38671 20.1211 3.87891C20.6837 4.44151 21 5.20435 21 6V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44151 22.6837 3.87891 22.1211C3.38671 21.6289 3.08291 20.9835 3.01465 20.2969L3 20Z"
                fill="black"
              />
              <path
                d="M16 10C16.5523 10 17 10.4477 17 11C17 11.5523 16.5523 12 16 12H12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10H16Z"
                fill="black"
              />
              <path
                d="M16 15C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15H16Z"
                fill="black"
              />
              <path
                d="M8.00977 10L8.1123 10.0049C8.61655 10.0561 9.00977 10.4822 9.00977 11C9.00977 11.5178 8.61655 11.9439 8.1123 11.9951L8.00977 12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H8.00977Z"
                fill="black"
              />
              <path
                d="M8.00977 15L8.1123 15.0049C8.61655 15.0561 9.00977 15.4822 9.00977 16C9.00977 16.5178 8.61655 16.9439 8.1123 16.9951L8.00977 17H8C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15H8.00977Z"
                fill="black"
              />
            </svg>
          </span>
          <div className="stat-card-details">
            <h3>{prescriptions.length}</h3>
            <p>الوصفات الطبية المتوفرة</p>
          </div>
        </div>
      </section>

      {loading && (
        <p style={{ textAlign: "center", padding: "30px", color: "#6b7785" }}>
          جاري تحميل البيانات...
        </p>
      )}

      {/* 4. موجز المواعيد */}
      {!loading && (
        <section className="dashboard-section-block">
          <div className="section-title-with-hint">
            <h2 className="section-block-main-title">
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
              موجز المواعيد تم حجزها
            </h2>
            <span className="scroll-hint-badge"></span>
          </div>
          <div className="dashboard-scrollable-row">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div
                  className="patient-interactive-card scroll-card-width"
                  key={appt.id}
                >
                  <div className="card-inner-body">
                    <h4>{appt.clinicName}</h4>
                    <p className="card-sub-info"> التخصص: {appt.specialty}</p>
                    <p className="card-sub-info"> التاريخ: {appt.date}</p>
                    <p className="card-sub-info"> الوقت: {appt.time}</p>
                    <button
                      className="btn-card-action-details"
                      onClick={() => onNavigate("appointments")}
                    >
                      التفاصيل الكاملة
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7785", padding: "20px" }}>
                لا توجد مواعيد محجوزة حالياً.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 5. موجز الوصفات الطبية */}
      {!loading && (
        <section className="dashboard-section-block">
          <div className="section-title-with-hint">
            <h2 className="section-block-main-title">
              موجز الوصفات الطبية الرقمية
            </h2>
            <span className="scroll-hint-badge"></span>
          </div>
          <div className="dashboard-scrollable-row">
            {prescriptions.length > 0 ? (
              prescriptions.map((rx) => (
                <div
                  className="patient-interactive-card prescription-card-style scroll-card-width"
                  key={rx.id}
                >
                  <div className="prescription-card-header">
                    <span className="rx-badge-code">وصفة #{rx.id}</span>
                    <span
                      className={`rx-status-tag ${rx.status === "نشطة" ? "rx-active" : "rx-done"}`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <div className="card-inner-body">
                    <h4>{rx.doctor}</h4>
                    <p className="card-sub-info">عدد الأدوية: {rx.medsCount}</p>
                    <p className="card-sub-info">
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
                      تاريخ الإصدار: {rx.date}
                    </p>
                    <button
                      className="btn-card-action-details btn-rx-color"
                      onClick={() => onNavigate("prescriptions")}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7785", padding: "20px" }}>
                لا توجد وصفات طبية حالياً.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 6. موجز الصيدليات */}
      {!loading && (
        <section className="dashboard-section-block">
          <h2 className="section-block-main-title">
            🏪 موجز الصيدليات الشريكة
          </h2>
          <div className="pharmacies-fixed-grid">
            {pharmacies.length > 0 ? (
              pharmacies.map((ph) => (
                <div className="patient-interactive-card" key={ph.id}>
                  <div className="card-inner-body">
                    <h4>{ph.name}</h4>
                    <p className="card-sub-info">
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
                      الفرع: {ph.branch}
                    </p>
                    <p className="card-sub-timing">
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
                      {ph.phone}
                    </p>
                    <button
                      className="btn-pharmacy-nav-action"
                      onClick={() => onNavigate("patient-pharmacies")}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7785", padding: "20px" }}>
                لا توجد صيدليات مسجلة حالياً.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 7. عيادات مقترحة */}
      {!loading && (
        <section className="dashboard-section-block">
          <div className="section-title-with-hint">
            <h2 className="section-block-main-title">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 21V18C13 17.7348 12.8946 17.4805 12.707 17.293C12.5429 17.1289 12.3276 17.0276 12.0986 17.0049L12 17C11.7348 17 11.4805 17.1055 11.293 17.293C11.1054 17.4805 11 17.7348 11 18V21C11 21.5523 10.5523 22 10 22C9.44771 22 9 21.5523 9 21V18C9 17.2044 9.3163 16.4415 9.87891 15.8789C10.4415 15.3163 11.2043 15 12 15L12.2969 15.0147C12.9835 15.0829 13.6289 15.3867 14.1211 15.8789C14.6837 16.4415 15 17.2044 15 18V21C15 21.5523 14.5523 22 14 22C13.4477 22 13 21.5523 13 21Z"
                  fill="black"
                />
                <path
                  d="M18.0098 11L18.1123 11.0049C18.6165 11.0561 19.0098 11.4823 19.0098 12C19.0098 12.5178 18.6165 12.9439 18.1123 12.9951L18.0098 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H18.0098Z"
                  fill="black"
                />
                <path
                  d="M18.0098 15L18.1123 15.0049C18.6165 15.0561 19.0098 15.4823 19.0098 16C19.0098 16.5178 18.6165 16.9439 18.1123 16.9951L18.0098 17H18C17.4477 17 17 16.5523 17 16C17 15.4477 17.4477 15 18 15H18.0098Z"
                  fill="black"
                />
                <path
                  d="M19 6.99976C18.3869 6.99967 17.7882 6.81215 17.2852 6.46167L12.5713 3.18042C12.4037 3.06361 12.2043 3.00088 12 3.00073C11.7958 3.00064 11.5954 3.06192 11.4277 3.17847L11.4287 3.17944L6.71484 6.45874L6.71582 6.45972C6.21298 6.8107 5.6142 6.9992 5.00098 6.99976H3V18.9998C3 19.2649 3.10552 19.5193 3.29297 19.7068C3.48051 19.8943 3.73478 19.9998 4 19.9998H20C20.2652 19.9998 20.5195 19.8943 20.707 19.7068C20.8945 19.5193 21 19.2649 21 18.9998V6.99976H19ZM23 18.9998C23 19.7954 22.6837 20.5592 22.1211 21.1218C21.5585 21.6842 20.7955 21.9998 20 21.9998H4C3.20452 21.9998 2.44148 21.6842 1.87891 21.1218C1.3163 20.5592 1 19.7954 1 18.9998V6.99976C1.00007 6.46942 1.21093 5.9607 1.58594 5.58569C1.961 5.21071 2.46963 4.99976 3 4.99976H4.99902C5.20335 4.99958 5.40274 4.93697 5.57031 4.82007L5.57129 4.81909L10.2861 1.53784L10.4785 1.4148C10.9387 1.14418 11.4644 1.0005 12.001 1.00073C12.6134 1.00108 13.2103 1.18985 13.7129 1.5398L13.7139 1.53882L18.4287 4.82007L18.5596 4.89819C18.696 4.96513 18.8467 4.99971 19 4.99976H21C21.5304 4.99976 22.039 5.21071 22.4141 5.58569C22.7891 5.9607 22.9999 6.46942 23 6.99976V18.9998Z"
                  fill="black"
                />
                <path
                  d="M6.00977 11L6.1123 11.0049C6.61655 11.0561 7.00977 11.4823 7.00977 12C7.00977 12.5178 6.61655 12.9439 6.1123 12.9951L6.00977 13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H6.00977Z"
                  fill="black"
                />
                <path
                  d="M6.00977 15L6.1123 15.0049C6.61655 15.0561 7.00977 15.4823 7.00977 16C7.00977 16.5178 6.61655 16.9439 6.1123 16.9951L6.00977 17H6C5.44772 17 5 16.5523 5 16C5 15.4477 5.44772 15 6 15H6.00977Z"
                  fill="black"
                />
                <path
                  d="M13 10C13 9.44774 12.5523 9.00003 12 9.00003C11.4477 9.00003 11 9.44774 11 10C11 10.5523 11.4477 11 12 11C12.5523 11 13 10.5523 13 10ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34317 10.3431 7.00003 12 7.00003C13.6569 7.00003 15 8.34317 15 10Z"
                  fill="black"
                />
              </svg>
              عيادات ومراكز طبية مقترحة
            </h2>
            <span className="scroll-hint-badge"></span>
          </div>
          <div className="suggested-clinics-flex-row">
            {suggestedClinics.length > 0 ? (
              suggestedClinics.map((clinic) => (
                <div className="suggested-clinic-mini-card" key={clinic.id}>
                  <div className="clinic-mini-icon-box">
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
                  <h4>{clinic.name}</h4>
                  <p>{clinic.specialty}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7785", padding: "20px" }}>
                لا توجد عيادات مسجلة حالياً.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 8. نموذج تواصل معنا */}
      <section className="dashboard-contact-section-wrapper">
        <div className="contact-form-inner-card">
          <h3> تواصل معنا</h3>
          <p>
            هل تواجه أي مشكلة أو لديك استفسار؟ راسل فريق الدعم الفني لـ Medlink
          </p>
          <form onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="تفاصيل تواصلك مع الدعم الفني..."
              rows="4"
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              required
            ></textarea>
            <button type="submit" className="btn-submit-contact-form">
              إرسال الاستفسار
            </button>
          </form>
        </div>
      </section>

      {/* 9. الفوتر */}
      <footer className="Medlink-footer-broad-block">
        <div className="footer-top-columns-grid">
          <div className="footer-brand-column">
            <h4>Medlink</h4>
            <p>
              منصتك المتكاملة للربط الذكي الآمن بين العيادات الطبية، الصيدليات
              المعتمدة، والمرضى.
            </p>
          </div>
          <div className="footer-links-column">
            <h5>روابط سريعة</h5>
            <ul>
              <li>
                <span
                  onClick={() => onNavigate("landing")}
                  style={{ cursor: "pointer" }}
                >
                  الرئيسية
                </span>
              </li>
              <li>
                <span
                  onClick={() => onNavigate("clinics-list")}
                  style={{ cursor: "pointer" }}
                >
                  العيادات
                </span>
              </li>
              <li>
                <span
                  onClick={() => onNavigate("patient-pharmacies")}
                  style={{ cursor: "pointer" }}
                >
                  الصيدليات
                </span>
              </li>
            </ul>
          </div>
          <div className="footer-links-column">
            <h5>الخدمات</h5>
            <ul>
              <li>حجز موعد عيادة</li>
              <li>البحث عن دواء</li>
              <li>الوصفات الطبية الرقمية</li>
            </ul>
          </div>
        </div>
        <div className="footer-copyrights-bottom-bar">
          <p>© 2026 منصة Medlink للرعاية الطبية الذكية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
