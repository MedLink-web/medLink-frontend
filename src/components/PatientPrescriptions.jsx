import React, { useState, useEffect } from "react";
import "./PatientPrescriptions.css";
import logo from "../assets/logo.png";

const PatientPrescriptions = ({ onNavigate, selectedPrescriptionId }) => {
  const [openPrescriptionId, setOpenPrescriptionId] = useState(null);

  const [currentView, setCurrentView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ تغيير 1 (US-13): بيانات الوصفات — فاضية بالبداية
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ تغيير 2 (US-14): بيانات نتائج البحث — من الـ API بدل mockPharmacies
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // ✅ تغيير 3 (US-13): جلب وصفات المريض من الـ API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/patient/prescriptions",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          const mapped = data.data.map((item) => ({
            id: item.id,
            doctorName: item.doctor?.name || "",
            date: item.date,
            medsCount: (item.items?.length || 0) + " دواء",
            medications: (item.items || []).map((med) => ({
              name: med.medication_name,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration,
            })),
          }));
          setPrescriptionsData(mapped);
          if (mapped.length > 0) {
            setOpenPrescriptionId(mapped[0].id);
          }
        } else {
          setError("حدث خطأ في جلب الوصفات");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (selectedPrescriptionId) {
      setOpenPrescriptionId(selectedPrescriptionId);
    }
  }, [selectedPrescriptionId]);

  const displayedPrescriptions = selectedPrescriptionId
    ? prescriptionsData.filter((pres) => pres.id === selectedPrescriptionId)
    : prescriptionsData;

  const toggleAccordion = (id) => {
    setOpenPrescriptionId(openPrescriptionId === id ? null : id);
  };

  // ✅ تغيير 4 (US-14): دالة البحث — تستدعي GET /api/medications/search
  const performSearch = async (query) => {
    if (!query || query.trim() === "") return;
    try {
      setSearchLoading(true);
      setSearchError(null);
      setSearchResults([]);
      const response = await fetch(
        `http://127.0.0.1:8000/api/medications/search?name=${encodeURIComponent(query.trim())}`,
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

  // ✅ تغيير 5 (US-15): البحث من الوصفة — يمرر الاسم تلقائياً
  const handleQuickSearch = (medName) => {
    setSearchQuery(medName);
    setCurrentView("search");
    performSearch(medName); // بيبحث تلقائياً بدون ما المريض يضغط "بحث"
  };

  // ✅ تغيير 6 (US-14): البحث اليدوي
  const triggerSearchAction = () => {
    if (searchQuery.trim() !== "") {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="patient-prescriptions-page" dir="rtl">
      {!selectedPrescriptionId && (
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
      )}

      <main className="prescriptions-main-container">
        {currentView === "list" ? (
          <>
            <div
              className="page-header-zone"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className="page-main-title">وصفاتي الطبية</h2>

              {selectedPrescriptionId ? (
                <button
                  className="btn-top-general-search"
                  onClick={() => onNavigate("doctor-dashboard")}
                  style={{ backgroundColor: "#6b7280", color: "#fff" }}
                >
                  ← العودة لجدول المواعيد
                </button>
              ) : (
                <button
                  className="btn-top-general-search"
                  onClick={() => {
                    setSearchQuery("");
                    setHasSearched(false);
                    setSearchResults([]);
                    setCurrentView("search");
                  }}
                >
                  البحث عن وصفة
                </button>
              )}
            </div>

            {loading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل الوصفات الطبية...
              </p>
            )}
            {error && (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#c0392b",
                }}
              >
                {error}
              </p>
            )}
            {!loading && !error && prescriptionsData.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7785",
                }}
              >
                لا توجد وصفات طبية حتى الآن.
              </p>
            )}

            {!loading && !error && displayedPrescriptions.length > 0 && (
              <div className="prescriptions-accordion-list">
                {displayedPrescriptions.map((pres) => {
                  const isOpen = openPrescriptionId === pres.id;
                  return (
                    <div
                      key={pres.id}
                      className={`prescription-accordion-card ${isOpen ? "card-is-expanded" : ""}`}
                    >
                      <div
                        className="prescription-card-header"
                        onClick={() => toggleAccordion(pres.id)}
                      >
                        <div className="header-right-side">
                          <div className="doctor-avatar-badge">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8ZM18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8Z"
                                fill="black"
                              />
                              <path
                                d="M19 21C19 19.1435 18.2629 17.3626 16.9502 16.0498C15.7194 14.819 14.077 14.0945 12.3467 14.0088L12 14C10.1435 14 8.36256 14.7371 7.0498 16.0498C5.73705 17.3626 5 19.1435 5 21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21C3 18.6131 3.94791 16.3236 5.63574 14.6357C7.32357 12.9479 9.61305 12 12 12C14.3869 12 16.6764 12.9479 18.3643 14.6357C20.0521 16.3236 21 18.6131 21 21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21Z"
                                fill="black"
                              />
                            </svg>
                          </div>
                          <div className="doctor-meta-details">
                            <h3>{pres.doctorName}</h3>
                            <span className="meds-count-tag">
                              {pres.medsCount}
                            </span>
                          </div>
                        </div>
                        <div className="header-left-side">
                          <span className="prescription-date-text">
                            {pres.date}
                          </span>
                          <span
                            className={`accordion-chevron-icon ${isOpen ? "chevron-up" : ""}`}
                          >
                            ▼
                          </span>
                        </div>
                      </div>

                      <div
                        className={`prescription-card-body ${isOpen ? "body-visible" : "body-hidden"}`}
                      >
                        <div className="medications-table-responsive">
                          <table className="medications-custom-table">
                            <tbody>
                              {pres.medications.map((med, index) => (
                                <tr key={index}>
                                  <td className="med-name-cell">{med.name}</td>
                                  <td>{med.dosage}</td>
                                  <td>{med.frequency}</td>
                                  <td>{med.duration}</td>
                                  {!selectedPrescriptionId && (
                                    <td className="search-action-cell">
                                      <button
                                        className="btn-search-inside-table"
                                        onClick={() =>
                                          handleQuickSearch(med.name)
                                        }
                                      >
                                        البحث عن الدواء
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="search-view-wrapper">
            <button
              className="btn-back-to-prescriptions"
              onClick={() => setCurrentView("list")}
            >
              ← العودة للوصفات الطبية
            </button>

            <div className="search-header-box-figma">
              <h3>البحث عن الدواء</h3>
              <p className="search-sub-desc-figma">
                ابحث باسم الدواء لمعرفة الصيدليات المتوفر لديها
              </p>

              <div className="search-bar-layout-figma">
                <input
                  type="text"
                  placeholder="البحث عن اسم الدواء"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === "") {
                      setHasSearched(false);
                      setSearchResults([]);
                    }
                  }}
                />
                {/* ✅ تغيير 7: زر البحث يستدعي الـ API */}
                <button
                  className="btn-submit-search-figma"
                  onClick={triggerSearchAction}
                  disabled={searchLoading}
                >
                  {searchLoading ? "جاري البحث..." : "بحث"}
                </button>
              </div>
            </div>

            {/* ✅ تغيير 8: نتائج البحث من الـ API بدل mockPharmacies */}
            {searchLoading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6b7785",
                }}
              >
                جاري البحث...
              </p>
            )}
            {searchError && (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#c0392b",
                }}
              >
                {searchError}
              </p>
            )}

            {hasSearched && !searchLoading && !searchError && (
              <div className="search-results-container-figma">
                {searchResults.length > 0 ? (
                  <div className="pharmacies-cards-stack-figma">
                    {searchResults.map((item, index) => (
                      <div key={index} className="pharmacy-figma-card">
                        <div className="pharmacy-grid-info">
                          <div className="grid-line">
                            <span className="lbl">اسم الصيدلية:</span>{" "}
                            <span className="val">
                              {item.pharmacy?.name || ""}
                            </span>
                          </div>
                          <div className="grid-line">
                            <span className="lbl">حالة التوفر:</span>
                            <span
                              className={`val status-${item.is_available ? "available" : "limited"}`}
                            >
                              {item.is_available ? "متوفر" : "غير متوفر"}
                            </span>
                          </div>
                          <div className="grid-line">
                            <span className="lbl">رقم الهاتف:</span>{" "}
                            <span className="val">
                              {item.pharmacy?.phone || ""}
                            </span>
                          </div>
                          <div className="grid-line">
                            <span className="lbl">عنوان المكان:</span>{" "}
                            <span className="val">
                              {item.pharmacy?.address || ""}
                            </span>
                          </div>
                        </div>
                        <div className="pharmacy-price-block">
                          <span className="price-label">السعر:</span>
                          <span className="price-value">{item.price} شيكل</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="not-found-figma-container">
                    <h3 className="not-found-title-msg">
                      لم يتم العثور على الدواء
                    </h3>
                    <p className="not-found-sub-msg">
                      لا تتوفر أي صيدلية بهذا الدواء حالياً
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {!selectedPrescriptionId && (
        <footer className="simple-figma-footer">
          <div className="footer-logo">Medlink </div>
          <p>
            جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026
          </p>
        </footer>
      )}
    </div>
  );
};

export default PatientPrescriptions;
