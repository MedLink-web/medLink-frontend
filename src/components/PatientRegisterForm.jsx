import React, { useState } from "react";
import "./PatientRegisterForm.css";

const [isLoading, setIsLoading] = useState(false);

const PatientRegisterForm = ({ onBackToHome }) => {
  // تجميع بيانات الحقول للتحقق منها
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const response = await fetch("http://127.0.0.1:8000/api/register", {
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
      });

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

  // ◄ أولاً: عرض شاشة النجاح المنفصلة عند اكتمال التسجيل
  if (isSuccess) {
    return (
      <div className="register-page-container" dir="rtl">
        <div className="success-card">
          <div className="success-logo-wrapper">
            <span className="logo-icon">🩺</span>
            <span className="logo-text">MedLink</span>
          </div>

          <div className="success-icon-circle">
            <span className="checkmark">✓</span>
          </div>

          <h1 className="success-title">تم إنشاء الحساب بنجاح</h1>
          <p className="success-subtitle">
            مرحباً بك في <span className="brand-name">MedLink</span>، يمكنك الآن
            حجز المواعيد والبحث عن الأدوية بكل سهولة.
          </p>

          <button className="btn-start-now" onClick={onBackToHome}>
            ابدأ الآن
          </button>

          <div className="success-footer">
            <a
              href="#login"
              onClick={onBackToHome}
              className="back-to-login-link"
            >
              العودة لتسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ◄ ثانياً: شاشة الفورم الأساسية المنفصلة (التي تظهر أولاً)
  return (
    <div className="register-page-container" dir="rtl">
      <div className="register-card">
        <div className="register-card-logo">
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

          {/* عرض رسالة الخطأ إن وجدت */}
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

          <div
            className="password-validation-rules"
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              marginTop: "10px",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#48bb78" }}>✓ 8 أحرف على الأقل</span>
            <span style={{ color: "#e53e3e" }}>✕ حرف كبير وصغير</span>
            <span style={{ color: "#e53e3e" }}>✕ رقم واحد على الأقل</span>
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
              href="#login"
              onClick={onBackToHome}
              style={{
                color: "#2b6cb0",
                textDecoration: "none",
                fontWeight: "bold",
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
