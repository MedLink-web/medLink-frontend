import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./PatientProfile.css";

const PatientProfile = ({ onNavigate }) => {
    const menuItems = [
      { id: "home",          text: "الصفحة الرئيسية",    icon: "📺" },
      { id: "patient-clinics",       text: "العيادات",             icon: "🏥" },
      { id: "pharmacies",    text: "بحث عن الصيدلية",     icon: "🔍" },
      { id: "prescriptions", text: "الوصفات الطبية",       icon: "📋" },
      { id: "appointments",  text: "مواعيدي",              icon: "📅" },
      { id: "profile",       text: "الملف الشخصي",         icon: "👤", active: true },
    ];

    // ─── States ───────────────────────────────────────────
    const [isLoading,   setIsLoading]   = useState(true);
    const [isSaving,    setIsSaving]    = useState(false);
    const [successMsg,  setSuccessMsg]  = useState("");
    const [errors,      setErrors]      = useState({});

    const [profileData, setProfileData] = useState({
      firstName: "",
      lastName:  "",
      email:     "",
      phone:     "",
      address:   "",   // حقل مظهر فقط - مش موجود بالـ DB حالياً
    });

    // ─── Token ────────────────────────────────────────────
    const getToken = () => localStorage.getItem("auth_token");

    // ─── جلب البيانات عند فتح الصفحة ─────────────────────
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/profile", {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: "application/json",
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const d = data.data;
            // نقسم الاسم الكامل على firstName و lastName
            const nameParts = (d.full_name || d.name || "").split(" ");
            setProfileData({
              firstName: nameParts[0] || "",
              lastName:  nameParts.slice(1).join(" ") || "",
              email:     d.email || "",
              phone:     d.phone || "",
              address:   "",
            });
          } else if (response.status === 401) {
            // التوكن منتهي - نرجع لتسجيل الدخول
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

    // ─── Handle Input Change ──────────────────────────────
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProfileData({ ...profileData, [name]: value });
      // نمسح خطأ الحقل فور ما المستخدم يكتب
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    // ─── Client Validation ────────────────────────────────
    const validate = () => {
      const newErrors = {};
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

      if (!profileData.firstName.trim()) {
        newErrors.firstName = "الاسم الأول مطلوب";
      }
      if (!profileData.lastName.trim()) {
        newErrors.lastName = "اسم العائلة مطلوب";
      }
      if (fullName.length < 3) {
        newErrors.firstName = "الاسم الكامل يجب أن يكون 3 أحرف على الأقل";
      }
      if (!profileData.phone.trim()) {
        newErrors.phone = "رقم الجوال مطلوب";
      } else if (!/^[0-9]{10,15}$/.test(profileData.phone.trim())) {
        newErrors.phone = "رقم الجوال يجب أن يكون بين 10 و 15 رقماً";
      }

      return newErrors;
    };

    // ─── حفظ التغييرات ────────────────────────────────────
    const handleSave = async (e) => {
      e.preventDefault();

      // 1. Validate على الفرونت أولاً
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSaving(true);
      setErrors({});
      setSuccessMsg("");

      // نجمع الاسم الكامل من firstName + lastName
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile", {
          method: "PUT",
          headers: {
            Authorization:  `Bearer ${getToken()}`,
            "Content-Type": "application/json",
            Accept:         "application/json",
          },
          body: JSON.stringify({
            name:  fullName,
            phone: profileData.phone,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // 2. حدّث localStorage فوراً
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({
            ...storedUser,
            name:  data.data.name,
            phone: data.data.phone,
          }));

          setSuccessMsg("✅ تم حفظ التغييرات بنجاح!");
          setTimeout(() => setSuccessMsg(""), 3000);

        } else if (response.status === 422) {
          // 3. أخطاء الـ backend
          const backendErrors = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            backendErrors[field] = messages[0];
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

    // ─── Loading ──────────────────────────────────────────
    if (isLoading) {
      return (
        <div className="profile-page-wrapper" dir="rtl"
            style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <p style={{ fontSize:"18px" }}>جاري تحميل البيانات...</p>
        </div>
      );
    }

    // ─── Render ───────────────────────────────────────────
    return (
      <div className="profile-page-wrapper" dir="rtl">

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="profile-sidebar">
          <div className="sidebar-brand">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            <span className="brand-logo-text">Medlink</span>
          </div>
          <ul className="sidebar-menu-list">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item-link ${item.id === "profile" ? "active-link" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate(item.id === "home" ? "dashboard" : item.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span className="menu-item-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main className="profile-content-area">
          <form onSubmit={handleSave} className="profile-form-container">

            {/* رسالة نجاح */}
            {successMsg && (
              <div style={{
                background:"#f0fff4", border:"1px solid #9ae6b4",
                color:"#276749", padding:"12px 16px", borderRadius:"8px",
                marginBottom:"20px", fontWeight:"bold"
              }}>
                {successMsg}
              </div>
            )}

            {/* رسالة خطأ عامة */}
            {errors.general && (
              <div style={{
                background:"#fff5f5", border:"1px solid #fed7d7",
                color:"#c53030", padding:"12px 16px", borderRadius:"8px",
                marginBottom:"20px"
              }}>
                ⚠️ {errors.general}
              </div>
            )}

            {/* صورة شخصية */}
            <div className="profile-avatar-section">
              <div className="avatar-circle-icon">👤</div>
              <button type="button" className="btn-change-photo">
                تغيير الصورة
              </button>
            </div>

            {/* حقول الفورم */}
            <div className="profile-fields-grid">

              {/* الاسم الأول */}
              <div className="form-input-group">
                <label className="field-label-text">الاسم الأول :</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  placeholder="الاسم الأول"
                  className="profile-custom-input"
                  style={{ borderColor: errors.firstName ? "#e53e3e" : "" }}
                />
                {errors.firstName && (
                  <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* اسم العائلة */}
              <div className="form-input-group">
                <label className="field-label-text">اسم العائلة :</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  placeholder="الاسم الأخير"
                  className="profile-custom-input"
                  style={{ borderColor: errors.lastName ? "#e53e3e" : "" }}
                />
                {errors.lastName && (
                  <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني - قراءة فقط */}
              <div className="form-input-group full-width-field">
                <label className="field-label-text">
                  البريد الإلكتروني:
                  <span style={{
                    fontSize:"12px", marginRight:"8px",
                    background:"#edf2f7", padding:"2px 8px",
                    borderRadius:"4px", color:"#718096"
                  }}>
                    لا يمكن تعديله
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  className="profile-custom-input text-left"
                  style={{ background:"#f7fafc", cursor:"not-allowed", color:"#718096" }}
                />
              </div>

              {/* مكان السكن - محلي فقط */}
              <div className="form-input-group full-width-field">
                <label className="field-label-text">مكان السكن :</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  placeholder="غزة - مفترق السرايا"
                  className="profile-custom-input"
                />
              </div>

              {/* رقم الجوال */}
              <div className="form-input-group full-width-field">
                <label className="field-label-text">رقم الجوال :</label>
                <div className="phone-input-combined">
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    placeholder="0595987654"
                    className="profile-custom-input phone-main-input text-left"
                    style={{ borderColor: errors.phone ? "#e53e3e" : "" }}
                  />
                  <div className="phone-code-badge">+970</div>
                </div>
                {errors.phone && (
                  <p style={{ color:"#e53e3e", fontSize:"13px", marginTop:"4px" }}>
                    {errors.phone}
                  </p>
                )}
              </div>

            </div>

            {/* زر الحفظ */}
            <div className="profile-form-footer">
              <button
                type="submit"
                className="btn-save-profile-changes"
                disabled={isSaving}
                style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}
              >
                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>

          </form>
        </main>
      </div>
    );
};

export default PatientProfile;