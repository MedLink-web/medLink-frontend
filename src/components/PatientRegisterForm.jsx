import React, { useState } from "react";
import "./PatientRegisterForm.css";
import logo from "../assets/logo.png";

const PatientRegisterForm = ({
  onNavigate,
  onBackToHome,
  onRegisterSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. حالة لتخزين وضع القيود الثلاثة (هل هي صالحة أم لا؟)
  const [passwordRules, setPasswordRules] = useState({
    hasMinLength: false,
    hasUpperLower: false,
    hasNumber: false,
  });

  // دالة ذكية لفحص القيود حياً أثناء الكتابة
  const checkPasswordRules = (password) => {
    setPasswordRules({
      // القيد الأول: 8 أحرف على الأقل
      hasMinLength: password.length >= 8,

      // القيد الثاني: حرف كبير واحد وحرف صغير واحد على الأقل
      hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),

      // القيد الثالث: رقم واحد على الأقل
      hasNumber: /[0-9]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // إذا كان الحقل الحالي هو كلمة المرور، قم بفحص القيود فوراً
    if (name === "password") {
      checkPasswordRules(value);
    }

    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي من تطابق كلمات المرور (نفس اللي عندك)
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("عذراً، كلمة المرور وتأكيدها غير متطابقين!");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            password_confirmation: formData.confirmPassword, // مهم: نفس اسم Laravel بالضبط
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // نجح التسجيل
        setIsSuccess(true);
      } else {
        // فشل: Laravel رجع errors بشكل { field: [messages] }
        if (data.errors) {
          const firstField = Object.keys(data.errors)[0];
          setErrorMessage(data.errors[firstField][0]);
        } else {
          setErrorMessage(data.message || "حدث خطأ، حاول مرة أخرى");
        }
      }
    } catch (error) {
      // مشكلة بالاتصال (السيرفر مطفي، مشكلة شبكة...)
      setErrorMessage("تعذر الاتصال بالسيرفر، تأكد من تشغيله وحاول مجدداً");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="register-page-container" dir="rtl">
        <div className="success-card">
          <div className="success-logo-wrapper">
            <img src={logo} alt="Medlink Logo" className="brand-logo-img" />
            <span className="logo-text">Medlink</span>
          </div>
          <div className="success-icon-circle">
            <span className="checkmark">✓</span>
          </div>
          <h1 className="success-title">تم إنشاء الحساب بنجاح</h1>
          <p className="success-subtitle">
            مرحباً بك في <span className="brand-name">MedLink</span>، يمكنك الآن
            مرحباً بك في <span className="brand-name">Medlink</span>، يمكنك الآن
            حجز المواعيد والبحث عن الأدوية بكل سهولة.
          </p>
          <button
            className="btn-start-now" // 👈 الحفاظ على كلاس التنسيق الأصلي الخاص بكِ ليظهر الزر بشكل صحيح
            onClick={() => {
              if (onRegisterSuccess) {
                onRegisterSuccess(); // 👈 التوجيه البرمجي المباشر للـ Dashboard عند الضغط
              }
            }}
            style={{ cursor: "pointer" }}
          >
            ابدأ الآن
          </button>
          <div className="success-footer">
            <a
              href="#login"
              onClick={onRegisterSuccess}
              className="back-to-login-link"
            >
              العودة لتسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page-container" dir="rtl">
      <div className="register-card">
        <div className="register-card-logo">
          <img src={logo} alt="Medlink Logo" className="brand-logo-img" />
          <span
            className="logo-text"
            style={{
              color: "#2b6cb0",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            MedLink
          </span>
        </div>

        <h1
          className="register-card-title"
          style={{ textAlign: "center", fontSize: "32px", marginBottom: "5px" }}
        >
          إنشاء حساب جديد
        </h1>
        <p
          className="register-card-subtitle"
          style={{
            textAlign: "center",
            color: "#718096",
            marginBottom: "20px",
          }}
        >
          خطوة واحدة فقط لإنشاء حسابك
        </p>

        <form onSubmit={handleSubmit} className="register-form-fields">
          <div className="form-group">
            <label>
              الاسم الكامل{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                backgroundColor: "#e2e8f0",
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label>
              حساب الجميل{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل ايميلك الخاص"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                backgroundColor: "#e2e8f0",
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label>
              رقم الجوال{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="أدخل رقم الجوال"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                backgroundColor: "#e2e8f0",
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label>
              كلمة المرور{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                backgroundColor: "#e2e8f0",
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label>
              تأكيد كلمة المرور{" "}
              <span className="required" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="******"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errorMessage
                  ? "1px solid #e53e3e"
                  : "1px solid #cbd5e0",
                backgroundColor: "#e2e8f0",
              }}
            />
          </div>

          {/* عرض رسالة الأخطاء إن وجدت بالتحققات النهائية */}
          {errorMessage && (
            <div
              style={{
                color: "#e53e3e",
                backgroundColor: "#fff5f5",
                padding: "10px",
                borderRadius: "6px",
                marginTop: "12px",
                fontSize: "14px",
                textAlign: "center",
                fontWeight: "bold",
                border: "1px solid #fed7d7",
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 4. قسم شروط التحقق التفاعلية بالكامل تتبدل ألوانها حياً بناءً على الكتابة */}
          <div
            className="password-validation-rules"
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              marginTop: "15px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {/* شرط 8 أحرف */}
            <span
              style={{
                color: passwordRules.hasMinLength ? "#48bb78" : "#e53e3e",
                transition: "color 0.2s",
              }}
            >
              {passwordRules.hasMinLength ? "✓" : "✕"} 8 أحرف على الأقل
            </span>

            {/* شرط حرف كبير وصغير */}
            <span
              style={{
                color: passwordRules.hasUpperLower ? "#48bb78" : "#e53e3e",
                transition: "color 0.2s",
              }}
            >
              {passwordRules.hasUpperLower ? "✓" : "✕"} حرف كبير وصغير
            </span>

            {/* شرط رقم واحد */}
            <span
              style={{
                color: passwordRules.hasNumber ? "#48bb78" : "#e53e3e",
                transition: "color 0.2s",
              }}
            >
              {passwordRules.hasNumber ? "✓" : "✕"} رقم واحد على الأقل
            </span>
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: isLoading ? "#a0aec0" : "#2b6cb0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "20px",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {isLoading ? (
              <span>جاري إنشاء الحساب...</span>
            ) : (
              <>
                <span>➔</span>
                إنشاء الحساب
              </>
            )}
          </button>
        </form>

        <div
          className="register-card-footer"
          style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}
        >
          <p>
            لديك حساب بالفعل؟{" "}
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault(); // يمنع إرسال #login للرابط العلوي في المتصفح
                if (onNavigate) {
                  onNavigate("login"); // ينقلكِ فوراً لصفحة تسجيل الدخول البيضاء
                }
              }}
              style={{
                color: "#2b6cb0",
                textDecoration: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              تسجيل الدخول
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegisterForm;
