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
          "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacies",
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
        `https://medlink-backend-production-e2f2.up.railway.app/api/medications/search?name=${encodeURIComponent(searchQuery.trim())}`,
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
                    <span>📍 العنوان: {item.pharmacy?.address || ""}</span>
                    <span>📞 الهاتف: {item.pharmacy?.phone || ""}</span>
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
