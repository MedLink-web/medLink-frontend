import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./PatientClinicsView.css";

const PatientClinicsView = ({ onNavigate, onSelectClinic, activeView }) => {
    const [clinicsList,        setClinics]        = useState([]);
    const [isLoading,          setIsLoading]       = useState(true);
    const [error,              setError]           = useState("");
    const [searchTerm,         setSearchTerm]      = useState("");
    const [selectedSpecialty,  setSelectedSpecialty] = useState("all");

    // ─── جلب العيادات من API ──────────────────────
    useEffect(() => {
        fetchClinics();
    }, [selectedSpecialty]);

    const fetchClinics = async () => {
        setIsLoading(true);
        try {
            const url = selectedSpecialty === "all"
                ? "http://127.0.0.1:8000/api/clinics"
                : `http://127.0.0.1:8000/api/clinics?specialty=${encodeURIComponent(selectedSpecialty)}`;

            const response = await fetch(url, {
                headers: { Accept: "application/json" },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setClinics(data.data);
            } else {
                setError("فشل تحميل العيادات");
            }
        } catch {
            setError("تعذر الاتصال بالسيرفر");
        } finally {
            setIsLoading(false);
        }
    };

    // ─── تصفية محلية بالبحث ───────────────────────
    const filteredClinics = clinicsList.filter((clinic) => {
        const matchesSearch =
            clinic.clinic_name.includes(searchTerm) ||
            clinic.clinic_address?.includes(searchTerm) ||
            clinic.specialty?.includes(searchTerm);
        return matchesSearch;
    });

    // ─── قائمة التخصصات الفريدة ───────────────────
    const specialties = [...new Set(clinicsList.map(c => c.specialty).filter(Boolean))];

    return (
        <div className="dashboard-wrapper" dir="rtl">

        {/* ── Navbar ───────────────────────────────── */}
        <nav className="dashboard-nav">
            <div className="nav-right">
                <div className="brand-identity">
                    <img src={logo} alt="Medlink Logo" className="logo-image" />
                    <span className="nav-logo-text">Medlink</span>
                </div>
                <div className="nav-links">
                    <a href="#!" onClick={() => onNavigate && onNavigate("dashboard")}>الرئيسية</a>
                    <a href="#!" className="active">العيادات</a>
                    <a href="#!" onClick={() => onNavigate && onNavigate("appointments")}>مواعيدي</a>
                    <a href="#!" onClick={() => onNavigate && onNavigate("pharmacies")}>الصيدليات</a>
                    <a href="#!" onClick={() => onNavigate && onNavigate("prescriptions")}>الوصفات الطبية</a>
                </div>
            </div>
            <div className="nav-left">
                <button className="btn-nav-logout" onClick={() => onNavigate && onNavigate("patient-profile")}>
                    👤 ملفي
                </button>
            </div>
        </nav>

        {/* ── Header ───────────────────────────────── */}
        <header className="clinics-search-hero-header">
            <div className="hero-header-text-content">
                <h1>البحث عن العيادات والمراكز الطبية</h1>
                <p>استكشفي العيادات المتاحة في شبكة Medlink وقومي بحجز موعدكِ بضغطة زر</p>
            </div>
            <div className="beauty-stats-counter-row">
                <div className="stat-counter-box-card">
                    <div className="stat-card-icon-round green-bg">🏥</div>
                    <div className="stat-card-info-text">
                        <h3>{clinicsList.length}</h3>
                        <p>إجمالي العيادات المسجلة</p>
                    </div>
                </div>
                <div className="stat-counter-box-card">
                    <div className="stat-card-icon-round blue-bg">👨‍⚕️</div>
                    <div className="stat-card-info-text">
                        <h3>{clinicsList.reduce((sum, c) => sum + (c.doctors?.length || 0), 0)}</h3>
                        <p>أطباء مسجلون</p>
                    </div>
                </div>
                <div className="stat-counter-box-card">
                    <div className="stat-card-icon-round orange-bg">📅</div>
                    <div className="stat-card-info-text">
                        <h3>متاح الآن</h3>
                        <p>حجز مواعيد فورية</p>
                    </div>
                </div>
            </div>
        </header>

        {/* ── Main Content ─────────────────────────── */}
        <main className="clinics-grid-results-main">

            {/* فلاتر البحث */}
            <div className="search-filter-dashboard-panel">
                <div className="search-input-wrapper-box">
                    <span className="search-input-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="ابحثي باسم العيادة أو التخصص أو العنوان..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="dropdown-filter-select-group">
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="patient-custom-select"
                    >
                        <option value="all">كل التخصصات</option>
                        {specialties.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div style={{ textAlign:"center", padding:"60px", fontSize:"18px", color:"#718096" }}>
                    جاري تحميل العيادات...
                </div>
            ) : error ? (
                <div style={{ textAlign:"center", padding:"40px", color:"#e53e3e" }}>
                    ⚠️ {error}
                </div>
            ) : (
                <>
                    <div className="results-count-summary-text">
                        تم العثور على <span>{filteredClinics.length}</span> عيادة
                    </div>

                    {filteredClinics.length === 0 ? (
                        <div className="no-clinics-matched-empty-state">
                            <div className="empty-state-icon-placeholder">🔍</div>
                            <h3>لا توجد عيادات متاحة حالياً</h3>
                            <p>جرّبي تغيير فلتر التخصص أو كلمة البحث.</p>
                        </div>
                    ) : (
                        <div className="clinics-cards-grid-layout">
                            {filteredClinics.map((clinic) => (
                                <div key={clinic.id} className="clinic-showcase-item-card">
                                    <div className="clinic-card-header-icon-row">
                                        <div className="clinic-icon-emoticon-avatar">🏥</div>
                                        <span className="clinic-card-specialty-badge">
                                            {clinic.specialty}
                                        </span>
                                    </div>

                                    <div className="clinic-card-details-body">
                                        <h3 className="clinic-card-title-heading">{clinic.clinic_name}</h3>
                                        <p className="clinic-card-location-text">
                                            📍 {clinic.clinic_address}
                                        </p>
                                        <div className="clinic-card-rating-stars-row">
                                            <span className="star-rating-score-txt">⭐ 4.9</span>
                                        </div>
                                        {/* عدد الأطباء */}
                                        {clinic.doctors?.length > 0 && (
                                            <p style={{ fontSize:"13px", color:"#4a5568", marginTop:"6px" }}>
                                                👨‍⚕️ {clinic.doctors.length} طبيب
                                            </p>
                                        )}
                                    </div>

                                    <div className="clinic-card-actions-footer-row">
                                        <button
                                            className="btn-patient-view-details"
                                            onClick={() => {
                                                if (onSelectClinic) onSelectClinic(clinic.id);
                                                onNavigate && onNavigate("clinic-details");
                                            }}
                                        >
                                            عرض التفاصيل
                                        </button>
                                        <button
                                            className="btn-patient-book-now-action"
                                            onClick={() => {
                                                if (onSelectClinic) onSelectClinic(clinic.id);
                                                onNavigate && onNavigate("clinic-details");
                                            }}
                                        >
                                            احجز الآن 📅
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>

        {/* ── Footer ───────────────────────────────── */}
        <footer className="dashboard-main-footer">
            <p>جميع الحقوق محفوظة © Medlink 2026</p>
            <div className="footer-bottom-links">
                <a href="#privacy">سياسة الخصوصية</a>
                <a href="#terms">الشروط والأحكام</a>
                <a href="#contact">تواصل معنا</a>
            </div>
        </footer>
        </div>
    );
};

export default PatientClinicsView;
