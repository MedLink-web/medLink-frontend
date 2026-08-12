import React, { useState } from "react";
import "./UserLogin.css";
import logo from "../assets/logo.png";

const PatientLogin = ({ onNavigate, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginData.emailOrPhone,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ هاد الأهم - حفظ التوكن والمستخدم
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        setErrorMessage(data.message || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (error) {
      setErrorMessage("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container" dir="rtl">
      {/* الشعار العلوي جهة اليمين */}
      <div className="login-top-brand">
        <img src={logo} alt="Medlink Logo" className="brand-logo-img" />
        <span className="brand-logo-text">Medlink</span>
      </div>

      {/* بطاقة تسجيل الدخول المركزية */}
      <div className="login-card">
        <h1 className="login-card-title">تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} className="login-form-fields">
          {/* حقل البريد الإلكتروني أو رقم الجوال */}
          <div className="form-group">
            <label>
              البريد الإلكتروني / رقم الجوال{" "}
              <span className="required-star">*</span>
            </label>
            <div className="input-with-icon-wrapper">
              <input
                type="text"
                name="emailOrPhone"
                value={loginData.emailOrPhone}
                onChange={handleChange}
                placeholder="البريد الإلكتروني / رقم الجوال"
                required
                className="login-custom-input"
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div className="form-group" style={{ marginTop: "20px" }}>
            <label>
              كلمة المرور <span className="required-star">*</span>
            </label>
            <div className="input-with-icon-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                required
                className="login-custom-input"
              />

              <span
                className="password-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0004 4.00061C14.3273 4.0007 16.6019 4.69176 18.5356 5.98596C20.3484 7.1993 21.7854 8.89154 22.6889 10.8707L22.8627 11.2711L22.8754 11.3043C23.0212 11.6972 23.0396 12.1245 22.9301 12.526L22.8754 12.6959C22.8713 12.707 22.8672 12.7182 22.8627 12.7291C21.9755 14.8803 20.4694 16.72 18.5356 18.0143C16.7227 19.2276 14.6102 19.9101 12.436 19.9908L12.0004 19.9996C9.67343 19.9996 7.39814 19.3086 5.4643 18.0143C3.65127 16.8008 2.21453 15.108 1.31098 13.1285L1.13715 12.7291C1.13265 12.7182 1.12857 12.707 1.12446 12.6959C0.957836 12.247 0.957891 11.7533 1.12446 11.3043L1.13715 11.2711C2.02433 9.11997 3.53056 7.28025 5.4643 5.98596C7.39814 4.69167 9.67343 4.00061 12.0004 4.00061ZM12.0004 6.00061C10.0695 6.00061 8.18128 6.57408 6.5766 7.64807C4.98216 8.71529 3.73836 10.2291 3.00043 11.9996C3.73835 13.7704 4.98192 15.2848 6.5766 16.3522C8.18128 17.4262 10.0695 17.9996 12.0004 17.9996L12.3618 17.9928C14.1659 17.9258 15.919 17.359 17.4233 16.3522C19.0179 15.2849 20.2605 13.7703 20.9985 11.9996C20.2605 10.2293 19.0176 8.71522 17.4233 7.64807C15.8187 6.57417 13.9312 6.0007 12.0004 6.00061Z"
                      fill="black"
                    />
                    <path
                      d="M14 12C14 10.8954 13.1045 9.99999 12 9.99999C10.8954 9.99999 9.99996 10.8954 9.99996 12C9.99996 13.1046 10.8954 14 12 14C13.1045 14 14 13.1046 14 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79082 16 7.99996 14.2091 7.99996 12C7.99996 9.79085 9.79082 7.99999 12 7.99999C14.2091 7.99999 16 9.79085 16 12Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0004 4.00061C14.3273 4.0007 16.6019 4.69176 18.5356 5.98596C20.3484 7.1993 21.7854 8.89154 22.6889 10.8707L22.8627 11.2711L22.8754 11.3043C23.0212 11.6972 23.0396 12.1245 22.9301 12.526L22.8754 12.6959C22.8713 12.707 22.8672 12.7182 22.8627 12.7291C21.9755 14.8803 20.4694 16.72 18.5356 18.0143C16.7227 19.2276 14.6102 19.9101 12.436 19.9908L12.0004 19.9996C9.67343 19.9996 7.39814 19.3086 5.4643 18.0143C3.65127 16.8008 2.21453 15.108 1.31098 13.1285L1.13715 12.7291C1.13265 12.7182 1.12857 12.707 1.12446 12.6959C0.957836 12.247 0.957891 11.7533 1.12446 11.3043L1.13715 11.2711C2.02433 9.11997 3.53056 7.28025 5.4643 5.98596C7.39814 4.69167 9.67343 4.00061 12.0004 4.00061ZM12.0004 6.00061C10.0695 6.00061 8.18128 6.57408 6.5766 7.64807C4.98216 8.71529 3.73836 10.2291 3.00043 11.9996C3.73835 13.7704 4.98192 15.2848 6.5766 16.3522C8.18128 17.4262 10.0695 17.9996 12.0004 17.9996L12.3618 17.9928C14.1659 17.9258 15.919 17.359 17.4233 16.3522C19.0179 15.2849 20.2605 13.7703 20.9985 11.9996C20.2605 10.2293 19.0176 8.71522 17.4233 7.64807C15.8187 6.57417 13.9312 6.0007 12.0004 6.00061Z"
                      fill="black"
                    />
                    <path
                      d="M14 12C14 10.8954 13.1045 9.99999 12 9.99999C10.8954 9.99999 9.99996 10.8954 9.99996 12C9.99996 13.1046 10.8954 14 12 14C13.1045 14 14 13.1046 14 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79082 16 7.99996 14.2091 7.99996 12C7.99996 9.79085 9.79082 7.99999 12 7.99999C14.2091 7.99999 16 9.79085 16 12Z"
                      fill="black"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* رابط نسيان كلمة المرور */}
          <div className="forgot-password-wrapper">
            <span
              className="forgot-password-link"
              onClick={() => onNavigate("forgot-password")}
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              نسيت كلمة المرور؟
            </span>
          </div>

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

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            <span className="btn-arrow-left">←</span>
            <span>{isLoading ? "جاري الدخول..." : "تسجيل الدخول"}</span>
          </button>
        </form>

        {/* تذييل البطاقة لإنشاء حساب جديد */}
        <div className="login-card-footer">
          <p>
            ليس لديك حساب بالفعل؟{" "}
            <span
              className="create-account-link"
              onClick={() => onNavigate && onNavigate("register-patient")}
            >
              إنشاء حساب جديد
            </span>
          </p>
        </div>
      </div>

      {/* الفوتر السفلي الثابت بالخلفية البيضاء */}
      <footer className="login-bottom-minimal-footer">
        <div className="footer-links-row">
          <a href="#terms">الشروط والأحكام</a>
          <span className="divider">|</span>
          <a href="#privacy">سياسة الخصوصية</a>
        </div>
        <p className="footer-copyright-text">
          جميع الحقوق محفوظة Medlink © 2026
        </p>
      </footer>
    </div>
  );
};

export default PatientLogin;
