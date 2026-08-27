import React, { useState, useEffect } from "react";
// ☝️ أضفنا useEffect
import "./PatientPharmaciesView.css";
import logo from "../assets/logo.png";
import pharmacyDefaultImg from "../assets/pharamacy-icon.png";

const PatientPharmaciesView = ({ onNavigate }) => {
  // ✅ بدل البيانات الثابتة — حالات جديدة لجلب الصيدليات من الـ API
  const [pharmaciesData, setPharmaciesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // US-14: حالات البحث عن دواء
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ جلب الصيدليات من الـ API أول ما الصفحة تفتح
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://medlink-s.apps.taqat.academy /api/pharmacies",
          {
            headers: { Accept: "application/json" },
          },
        );
        const data = await response.json();
        if (data.success) {
          setPharmaciesData(data.data);
        } else {
          setError("حدث خطأ في جلب الصيدليات");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, []);

  // US-14: دالة البحث عن دواء
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;
    try {
      setSearchLoading(true);
      setSearchError(null);
      setSearchResults([]);
      const response = await fetch(
        `https://medlink-s.apps.taqat.academy /api/medications/search?name=${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: { Accept: "application/json" },
        },
      );
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      } else {
        setSearchError("حدث خطأ في البحث");
      }
    } catch (err) {
      setSearchError("تعذر الاتصال بالخادم");
    } finally {
      setSearchLoading(false);
      setHasSearched(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSearchError(null);
  };

  return (
    <div className="patient-pharmacies-root" dir="rtl">
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

      <div className="pharmacies-page-header">
        <h1 className="pharmacies-main-title">عرض الصيدليات</h1>
        <p className="pharmacies-sub-title">
          الصيدليات المتاحة والقريبة منك حالياً في قطاع غزة
        </p>
      </div>

      {/* US-14: شريط البحث عن دواء */}
      <div
        style={{ maxWidth: "700px", margin: "0 auto 30px", padding: "0 20px" }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{ marginBottom: "8px", fontSize: "16px", color: "#1f2d3d" }}
          >
            {" "}
            البحث عن دواء معين
          </h3>
          <p
            style={{ marginBottom: "14px", fontSize: "13px", color: "#6b7785" }}
          >
            ابحث باسم الدواء لمعرفة الصيدليات يلي عندها إياه
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="اكتب اسم الدواء..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") clearSearch();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                direction: "rtl",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2e8b57",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {searchLoading ? "جاري البحث..." : "بحث"}
            </button>
            {hasSearched && (
              <button
                onClick={clearSearch}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </div>

      {/* US-14: نتائج البحث */}
      {searchError && (
        <p style={{ textAlign: "center", padding: "20px", color: "#c0392b" }}>
          {searchError}
        </p>
      )}

      {hasSearched && !searchLoading && !searchError && (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto 30px",
            padding: "0 20px",
          }}
        >
          {searchResults.length > 0 ? (
            <div>
              <h3
                style={{
                  marginBottom: "14px",
                  fontSize: "16px",
                  color: "#1f2d3d",
                }}
              >
                نتائج البحث عن "{searchQuery}" — {searchResults.length} نتيجة
              </h3>
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid #eef1f4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px", color: "#1f2d3d" }}>
                      {item.pharmacy?.name || ""}
                    </strong>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: item.is_available
                          ? "#dff5e6"
                          : "#fde8e8",
                        color: item.is_available ? "#2e8b57" : "#c0392b",
                      }}
                    >
                      {item.is_available ? "متوفر" : "غير متوفر"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7785",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span> الدواء: {item.medication_name}</span>
                    <span>
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
                      العنوان: {item.pharmacy?.address || ""}
                    </span>
                    <span>
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
                      الهاتف: {item.pharmacy?.phone || ""}
                    </span>
                  </div>
                  <div style={{ marginTop: "10px", textAlign: "left" }}>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#2e8b57",
                      }}
                    >
                      {item.price} شيكل
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                background: "#fff",
                borderRadius: "14px",
              }}
            >
              <h3 style={{ color: "#1f2d3d", marginBottom: "8px" }}>
                لم يتم العثور على الدواء
              </h3>
              <p style={{ color: "#6b7785" }}>
                لا تتوفر أي صيدلية بهذا الدواء حالياً
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ كروت الصيدليات — من الـ API بدل البيانات الثابتة */}
      {loading && (
        <p style={{ textAlign: "center", padding: "40px", color: "#6b7785" }}>
          جاري تحميل الصيدليات...
        </p>
      )}
      {error && (
        <p style={{ textAlign: "center", padding: "40px", color: "#c0392b" }}>
          {error}
        </p>
      )}
      {!loading && !error && pharmaciesData.length === 0 && (
        <p style={{ textAlign: "center", padding: "40px", color: "#6b7785" }}>
          لا توجد صيدليات مسجلة حالياً.
        </p>
      )}

      {!loading && !error && pharmaciesData.length > 0 && (
        <div className="pharmacies-cards-grid">
          {pharmaciesData.map((pharmacy) => (
            <div key={pharmacy.id} className="pharmacy-display-card">
              <div className="pharmacy-img-wrapper">
                <img
                  src={pharmacyDefaultImg}
                  alt={pharmacy.name}
                  className="pharmacy-card-image"
                />
              </div>
              <div className="pharmacy-card-details">
                <div className="detail-item">
                  <span className="detail-label">اسم الصيدلية : </span>
                  <span className="detail-value font-bold">
                    {pharmacy.name}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">رقم الهاتف : </span>
                  <span className="detail-value">{pharmacy.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">العنوان : </span>
                  <span className="detail-value">{pharmacy.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">البريد الإلكتروني : </span>
                  <span className="detail-value">{pharmacy.email}</span>
                </div>
              </div>
              <div className="pharmacy-card-actions">
                <button className="btn-contact-pharmacy">تواصل الآن</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="simple-figma-footer">
        <div className="footer-logo">Medlink </div>
        <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
      </footer>
    </div>
  );
};

export default PatientPharmaciesView;
