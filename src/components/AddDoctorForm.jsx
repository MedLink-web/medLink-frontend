import React, { useState } from "react";
import "./AddDoctorForm.css";

const AddDoctor = ({ onNavigate, onSave }) => {
    const [formData, setFormData] = useState({
        name:      "",
        email:     "",
        specialty: "تخصص الأطفال",
        phone:     "",
        password:  "",
    });
    const [errors,    setErrors]    = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getToken = () => localStorage.getItem("auth_token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch("http://127.0.0.1:8000/api/clinic/doctors", {
                method: "POST",
                headers: {
                    Authorization:  `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                    Accept:         "application/json",
                },
                body: JSON.stringify({
                    full_name: formData.name,
                    email:     formData.email,
                    specialty: formData.specialty,
                    phone:     formData.phone,
                    password:  formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // نمرر البيانات للـ parent عشان يحدث القائمة
                if (onSave) onSave(data.data);
                onNavigate && onNavigate("doctors-management");
            } else if (response.status === 422) {
                const backendErrors = {};
                Object.entries(data.errors).forEach(([field, messages]) => {
                    const fieldMap = {
                        full_name: "name",
                        email:     "email",
                        specialty: "specialty",
                        password:  "password",
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
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-layout-root" dir="rtl">

        {/* ── Sidebar ──────────────────────────────── */}
        <aside className="global-app-sidebar">
            <div className="sidebar-header-profile">
                <div className="avatar-box">🏥</div>
                <div>
                    <h4>عيادة النور الطبية</h4>
                    <p>لوحة التحكم</p>
                </div>
            </div>
            <nav className="sidebar-navigation-links">
                <p className="section-label">القائمة الرئيسية</p>
                <button className="nav-link-btn">📊 لوحة التحكم</button>
                <button className="nav-link-btn">👥 إدارة المرضى</button>
                <button className="nav-link-btn">📅 المواعيد</button>
                <button className="nav-link-btn">📁 السجلات الطبية</button>
                <button className="nav-link-btn active-link" onClick={() => onNavigate("doctors-management")}>
                    👩‍⚕️ ملف الأطباء
                </button>
                <button className="nav-link-btn" onClick={() => onNavigate("clinic-profile")}>
                    🏢 ملف العيادة
                </button>
            </nav>
            <button
                className="sidebar-footer-logout"
                onClick={() => onNavigate("doctors-management")}
            >
                🚪 إلغاء والعودة
            </button>
        </aside>

        {/* ── Main Content ─────────────────────────── */}
        <main className="dashboard-main-body">
            <div className="top-view-header">
                <div className="breadcrumb-trail">
                    <span>لوحة التحكم</span> &gt; <span>إدارة الأطباء</span> &gt;
                    <span className="current-path">إضافة طبيب</span>
                </div>
            </div>

            <div className="form-card-container">
                <div className="form-instruction-banner">
                    إنشاء حساب جديد للطبيب وإضافته تلقائياً إلى قائمة أطباء العيادة.
                </div>

                {/* رسالة خطأ عامة */}
                {errors.general && (
                    <div style={{
                        background:"#fff5f5", border:"1px solid #fed7d7",
                        color:"#c53030", padding:"12px", borderRadius:"8px",
                        marginBottom:"16px"
                    }}>
                        ⚠️ {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="doctor-creation-form">

                    {/* الاسم */}
                    <div className="form-input-group">
                        <label>الاسم الكامل للطبيب<span className="required-star">*</span></label>
                        <input
                            type="text" name="name"
                            placeholder="أدخل الاسم الرباعي للطبيب"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ borderColor: errors.name ? "#e53e3e" : "" }}
                        />
                        {errors.name && <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>{errors.name}</p>}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div className="form-input-group">
                        <label>البريد الإلكتروني<span className="required-star">*</span></label>
                        <input
                            type="email" name="email"
                            placeholder="khaled.omari@alnour.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ borderColor: errors.email ? "#e53e3e" : "" }}
                        />
                        {errors.email && <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>{errors.email}</p>}
                    </div>

                    {/* التخصص */}
                    <div className="form-input-group">
                        <label>التخصص الطبي<span className="required-star">*</span></label>
                        <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="styled-form-select"
                            style={{ borderColor: errors.specialty ? "#e53e3e" : "" }}
                        >
                            <option value="">اختار التخصص</option>
                            <option value="تخصص الأطفال">تخصص الأطفال</option>
                            <option value="تخصص القلب">تخصص القلب</option>
                            <option value="طب أسنان">طب أسنان</option>
                            <option value="طب عام">طب عام</option>
                            <option value="جلدية">جلدية</option>
                            <option value="عظام">عظام</option>
                            <option value="نساء وتوليد">نساء وتوليد</option>
                            <option value="عيون">عيون</option>
                            <option value="أنف وأذن وحنجرة">أنف وأذن وحنجرة</option>
                        </select>
                        {errors.specialty && <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>{errors.specialty}</p>}
                    </div>

                    {/* رقم الهاتف */}
                    <div className="form-input-group">
                        <label>رقم الهاتف<span className="required-star">*</span></label>
                        <input
                            type="text" name="phone"
                            placeholder="+966 50 000 0000"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* كلمة المرور */}
                    <div className="form-input-group">
                        <label>كلمة المرور<span className="required-star">*</span></label>
                        <input
                            type="password" name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ borderColor: errors.password ? "#e53e3e" : "" }}
                        />
                        {errors.password && <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>{errors.password}</p>}
                    </div>

                    {/* أزرار */}
                    <div className="form-action-buttons-row">
                        <button
                            type="submit"
                            className="form-submit-blue-btn"
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                        >
                            <span className="plus-icon-symbol">➕</span>
                            {isLoading ? "جاري الإضافة..." : "إضافة طبيب"}
                        </button>
                        <button
                            type="button"
                            className="form-cancel-gray-btn"
                            onClick={() => onNavigate("doctors-management")}
                        >
                            إلغاء
                        </button>
                    </div>

                </form>
            </div>
        </main>
        </div>
    );
};

export default AddDoctor;
