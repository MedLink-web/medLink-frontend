import React, { useState, useEffect } from "react";
import "./PatientProfile.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png";
const PatientProfile = ({ onNavigate }) => {
  const menuItems = [
    { id: "home", text: "الصفحة الرئيسية", icon: "📺" },
    {
      id: "patient-clinics",
      text: "العيادات",
      icon: (
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
      ),
    },
    { id: "pharmacies", text: "بحث عن الصيدلية", icon: "" },
    { id: "prescriptions", text: "الوصفات الطبية", icon: "📋" },
    {
      id: "appointments",
      text: "مواعيدي",
      icon: (
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
      ),
    },
    { id: "profile", text: "الملف الشخصي", icon: "", active: true },
  ];

  // ─── States ───────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "", // حقل مظهر فقط - مش موجود بالـ DB حالياً
  });

  // ─── Token ────────────────────────────────────────────
  const getToken = () => localStorage.getItem("token");

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
            lastName: nameParts.slice(1).join(" ") || "",
            email: d.email || "",
            phone: d.phone || "",
            address: "",
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
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phone: profileData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. حدّث localStorage فوراً
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: data.data.name,
            phone: data.data.phone,
          }),
        );

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
      <div
        className="profile-page-wrapper"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل البيانات...</p>
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
        <nav className="patient-header-menu exception">
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
      </aside>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="profile-content-area">
        <form onSubmit={handleSave} className="profile-form-container">
          {/* رسالة نجاح */}
          {successMsg && (
            <div
              style={{
                background: "#f0fff4",
                border: "1px solid #9ae6b4",
                color: "#276749",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              {successMsg}
            </div>
          )}

          {/* رسالة خطأ عامة */}
          {errors.general && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                color: "#c53030",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ⚠️ {errors.general}
            </div>
          )}

          {/* صورة شخصية */}
          <div className="profile-avatar-section">
            <div className="avatar-circle-icon"></div>
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
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
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
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* البريد الإلكتروني - قراءة فقط */}
            <div className="form-input-group full-width-field">
              <label className="field-label-text">
                البريد الإلكتروني:
                <span
                  style={{
                    fontSize: "12px",
                    marginRight: "8px",
                    background: "#edf2f7",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: "#718096",
                  }}
                >
                  لا يمكن تعديله
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly
                className="profile-custom-input text-left"
                style={{
                  background: "#f7fafc",
                  cursor: "not-allowed",
                  color: "#718096",
                }}
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
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
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
              style={{
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
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
