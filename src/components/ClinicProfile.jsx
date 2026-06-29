import React, { useState, useEffect } from "react";
import "./ClinicProfile.css";

const ClinicProfile = ({ onNavigate }) => {
    const [mode,        setMode]        = useState("view");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading,   setIsLoading]   = useState(true);
    const [isSaving,    setIsSaving]    = useState(false);
    const [errors,      setErrors]      = useState({});

    const [clinicData, setClinicData] = useState({
        name:      "",
        specialty: "",
        license:   "",
        phone:     "",
        email:     "",
        address:   "",
        days:      "",
        hours:     "",
        about:     "",
    });

    const [tempData, setTempData] = useState({ ...clinicData });

    const getToken = () => localStorage.getItem("auth_token");

    // ─── جلب بيانات العيادة ───────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/clinic/profile", {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    const d = data.data;
                    const mapped = {
                        name:      d.clinic_name    || "",
                        specialty: d.specialty      || "",
                        license:   d.license_number || "",
                        phone:     d.clinic_phone   || "",
                        email:     d.clinic_email   || "",
                        address:   d.clinic_address || "",
                        days:      "",
                        hours:     "",
                        about:     "",
                    };
                    setClinicData(mapped);
                    setTempData(mapped);
                } else if (response.status === 401) {
                    onNavigate && onNavigate("login");
                }
            } catch {
                console.error("فشل الاتصال بالسيرفر");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    // ─── حفظ التغييرات ────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});

        try {
            const response = await fetch("http://127.0.0.1:8000/api/clinic/profile", {
                method: "PUT",
                headers: {
                    Authorization:  `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                    Accept:         "application/json",
                },
                body: JSON.stringify({
                    clinic_name:    tempData.name,
                    clinic_phone:   tempData.phone,
                    clinic_address: tempData.address,
                    specialty:      tempData.specialty,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setClinicData({ ...tempData });
                setMode("view");
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 4000);
            } else if (response.status === 422) {
                const backendErrors = {};
                Object.entries(data.errors).forEach(([field, messages]) => {
                    // تحويل أسماء الحقول من backend إلى أسماء الـ state
                    const fieldMap = {
                        clinic_name:    "name",
                        clinic_phone:   "phone",
                        clinic_address: "address",
                        specialty:      "specialty",
                    };
                    backendErrors[fieldMap[field] || field] = messages[0];
                });
                setErrors(backendErrors);
            } else {
                setErrors({ general: data.message || "حدث خطأ، حاول مرة أخرى" });
            }
        } catch {
            setErrors({ general: "تعذر الاتصال بالسيرفر" });
        } finally {
            setIsSaving(false);
        }
    };

    // ─── Loading ──────────────────────────────────
    if (isLoading) {
        return (
            <div className="clinic-dashboard-layout" dir="rtl"
                 style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                <p style={{ fontSize:"18px" }}>جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="clinic-dashboard-layout" dir="rtl">

        {/* ── Sidebar ──────────────────────────────── */}
        <aside className="clinic-sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo-icon">🩺</div>
                <div className="brand-text-wrapper">
                    <h3>{clinicData.name}</h3>
                    <p>لوحة التحكم</p>
                </div>
            </div>

            <nav className="sidebar-menu-items">
                <p className="menu-section-title">القائمة الرئيسية</p>
                <button className="menu-item-btn" onClick={() => onNavigate("clinic-dashboard")}>
                    <span className="menu-icon">📊</span> لوحة التحكم
                </button>
                <button className="menu-item-btn" onClick={() => onNavigate("doctors-management")}>
                    <span className="menu-icon">👩‍⚕️</span> إدارة الأطباء
                </button>
                <button className="menu-item-btn">
                    <span className="menu-icon">📅</span> المواعيد
                </button>
                <button className="menu-item-btn">
                    <span className="menu-icon">📁</span> السجلات الطبية
                </button>
                <button className="menu-item-btn active-tab-item">
                    <span className="menu-icon">🏢</span> ملف العيادة
                </button>
            </nav>

            <button
                className="sidebar-logout-btn"
                onClick={() => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    onNavigate && onNavigate("home");
                }}
            >
                <span className="logout-icon">🚪</span> تسجيل الخروج
            </button>
        </aside>

        {/* ── Main Content ─────────────────────────── */}
        <main className="clinic-main-content">

            {/* بانر النجاح */}
            {showSuccess && (
                <div className="success-toast-banner-top">
                    <span className="toast-text-message">تم حفظ التغييرات بنجاح</span>
                    <div className="toast-check-circle">✓</div>
                </div>
            )}

            {/* رسالة خطأ عامة */}
            {errors.general && (
                <div style={{
                    background:"#fff5f5", border:"1px solid #fed7d7",
                    color:"#c53030", padding:"12px", borderRadius:"8px",
                    margin:"16px 0"
                }}>
                    ⚠️ {errors.general}
                </div>
            )}

            {/* شريط المسار */}
            <div className="content-top-navigation-bar">
                <div className="breadcrumb-links">
                    <span>لوحة التحكم</span> &gt; <span>ملف العيادة</span>
                    {mode === "edit" && <span className="active-path"> &gt; تعديل بيانات العيادة</span>}
                </div>

                {mode === "view" ? (
                    <button
                        className="edit-profile-action-btn"
                        onClick={() => { setTempData({...clinicData}); setMode("edit"); }}
                    >
                        📝 تعديل البيانات
                    </button>
                ) : (
                    <div className="form-edit-actions">
                        <button
                            className="save-changes-blue-btn"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                        <button
                            className="cancel-edit-gray-btn"
                            onClick={() => { setMode("view"); setErrors({}); }}
                        >
                            إلغاء
                        </button>
                    </div>
                )}
            </div>

            {/* ── وضع العرض ────────────────────────── */}
            {mode === "view" ? (
                <div className="profile-details-view-card">
                    <div className="clinic-main-intro-row">
                        <div className="clinic-avatar-placeholder">🏥</div>
                        <div className="clinic-intro-meta">
                            <h2>{clinicData.name}</h2>
                            <p className="specialty-badge-text">{clinicData.specialty}</p>
                            <span className="license-number-tag">
                                {clinicData.license}
                                <span className="verified-status-badge">✓ معتمدة</span>
                            </span>
                        </div>
                    </div>

                    <div className="info-sections-grid-wrapper">
                        <h3 className="section-grid-title">معلومات التواصل والعنوان</h3>
                        <div className="info-detail-row">
                            <span className="info-row-label">📞 رقم الهاتف:</span>
                            <span className="info-row-value">{clinicData.phone}</span>
                        </div>
                        <div className="info-detail-row">
                            <span className="info-row-label">✉️ البريد الإلكتروني:</span>
                            <span className="info-row-value">{clinicData.email}</span>
                        </div>
                        <div className="info-detail-row">
                            <span className="info-row-label">📍 عنوان العيادة:</span>
                            <span className="info-row-value">{clinicData.address}</span>
                        </div>
                        <div className="info-detail-row">
                            <span className="info-row-label">📅 أيام الدوام:</span>
                            <span className="info-row-value">{clinicData.days || "—"}</span>
                        </div>
                        <div className="info-detail-row">
                            <span className="info-row-label">🕒 ساعات العمل:</span>
                            <span className="info-row-value">{clinicData.hours || "—"}</span>
                        </div>
                    </div>

                    <div className="about-section-block-box">
                        <h3>📝 نبذة عن العيادة</h3>
                        <p>{clinicData.about || "—"}</p>
                    </div>
                </div>

            ) : (
            /* ── وضع التعديل ─────────────────────── */
                <form className="profile-edit-form-container" onSubmit={handleSave}>

                    <div className="edit-image-upload-section">
                        <div className="current-logo-preview">🏥</div>
                        <button type="button" className="change-photo-trigger-btn">تعديل الصورة</button>
                    </div>

                    <fieldset className="form-fields-group-wrapper">
                        <legend>المعلومات الأساسية</legend>

                        <div className="input-field-block">
                            <label>اسم العيادة</label>
                            <input type="text" name="name"
                                value={tempData.name} onChange={handleInputChange}
                                style={{ borderColor: errors.name ? "#e53e3e" : "" }}
                            />
                            {errors.name && <p style={{ color:"#e53e3e", fontSize:"13px" }}>{errors.name}</p>}
                        </div>

                        <div className="input-field-block">
                            <label>التخصص</label>
                            <input type="text" name="specialty"
                                value={tempData.specialty} onChange={handleInputChange}
                                style={{ borderColor: errors.specialty ? "#e53e3e" : "" }}
                            />
                            {errors.specialty && <p style={{ color:"#e53e3e", fontSize:"13px" }}>{errors.specialty}</p>}
                        </div>

                        <div className="input-field-block">
                            <label>رقم الترخيص الطبي</label>
                            <input type="text" name="license"
                                value={tempData.license} onChange={handleInputChange}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="form-fields-group-wrapper">
                        <legend>معلومات التواصل والعنوان</legend>

                        <div className="input-field-block">
                            <label>رقم الهاتف</label>
                            <input type="text" name="phone"
                                value={tempData.phone} onChange={handleInputChange}
                                style={{ borderColor: errors.phone ? "#e53e3e" : "" }}
                            />
                            {errors.phone && <p style={{ color:"#e53e3e", fontSize:"13px" }}>{errors.phone}</p>}
                        </div>

                        <div className="input-field-block">
                            <label>البريد الإلكتروني</label>
                            <input type="email" name="email"
                                value={tempData.email} onChange={handleInputChange}
                                readOnly
                                style={{ background:"#f7fafc", cursor:"not-allowed", color:"#718096" }}
                            />
                        </div>

                        <div className="input-field-block">
                            <label>عنوان العيادة</label>
                            <input type="text" name="address"
                                value={tempData.address} onChange={handleInputChange}
                                style={{ borderColor: errors.address ? "#e53e3e" : "" }}
                            />
                            {errors.address && <p style={{ color:"#e53e3e", fontSize:"13px" }}>{errors.address}</p>}
                        </div>

                        <div className="input-field-block">
                            <label>أيام الدوام</label>
                            <input type="text" name="days"
                                value={tempData.days} onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-field-block">
                            <label>ساعات العمل</label>
                            <input type="text" name="hours"
                                value={tempData.hours} onChange={handleInputChange}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="form-fields-group-wrapper">
                        <legend>نبذة عن العيادة</legend>
                        <div className="input-field-block">
                            <textarea name="about" rows="4"
                                value={tempData.about} onChange={handleInputChange}>
                            </textarea>
                        </div>
                    </fieldset>

                </form>
            )}
        </main>
        </div>
    );
};

export default ClinicProfile;
