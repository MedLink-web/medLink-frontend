import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./RegisterView.css";

const RegisterView = ({ role, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ إضافة: حالات التحميل والخطأ
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getTitle = () => {
    if (role === "clinic") return "إنشاء حساب العيادة";
    if (role === "pharmacy") return "إنشاء حساب الصيدلية";
    return "إنشاء حساب مريض";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ إصلاح: ربط التسجيل بالـ API بدل console.log
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // التحقق من تطابق كلمتي المرور
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين");
      return;
    }

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
            password_confirmation: formData.confirmPassword,
            role: role,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ حفظ التوكن لو الـ API بترجعه
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        onNavigate(`success-${role}`);
      } else {
        // عرض أخطاء الـ validation
        if (data.errors) {
          const msgs = Object.values(data.errors).flat().join("\n");
          setErrorMessage(msgs);
        } else {
          setErrorMessage(data.message || "حدث خطأ، حاول مرة أخرى");
        }
      }
    } catch (error) {
      setErrorMessage("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-root" dir="rtl">
      <div className="register-bg-decor top-left"></div>
      <div className="register-bg-decor bottom-right"></div>

      <div className="register-card-container">
        <div className="register-form-card">
          <div className="register-brand" onClick={() => onNavigate("landing")}>
            <img src={logo} alt="Medlink" className="brand-logo" />
            <span className="brand-text">Medlink</span>
          </div>

          <h2 className="form-main-title">{getTitle()}</h2>
          <p className="form-sub-title">خطوة واحدة فقط لإنشاء حسابك</p>

          <form onSubmit={handleSubmit} className="actual-form">
            <div className="input-group">
              <label>
                الاسم الكامل <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="أدخل اسمك الكامل"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                حساب الجيميل <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="email"
                  name="email"
                  placeholder="أدخل إيميلك الخاص"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>
                رقم الجوال <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="أدخل رقم الجوال"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {role !== "patient" && (
              <div className="input-group dynamic-field">
                <label>
                  {role === "clinic"
                    ? "رقم ترخيص العيادة الطبي"
                    : "رقم ترخيص الصيدلية"}
                  <span className="required"> *</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 3V5H15V3H9ZM17 5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5Z"
                        fill="black"
                      />
                      <path
                        d="M3 20V6C3 5.20435 3.3163 4.44152 3.87891 3.87891C4.44152 3.3163 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6C5.73478 5 5.4805 5.10543 5.29297 5.29297C5.10543 5.4805 5 5.73478 5 6V20L5.00488 20.0986C5.02757 20.3276 5.12883 20.5429 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V6C19 5.73478 18.8946 5.48051 18.707 5.29297C18.5429 5.12883 18.3276 5.02757 18.0986 5.00488L18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18L18.2969 3.01465C18.9835 3.08291 19.6289 3.38671 20.1211 3.87891C20.6837 4.44151 21 5.20435 21 6V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44151 22.6837 3.87891 22.1211C3.38671 21.6289 3.08291 20.9835 3.01465 20.2969L3 20Z"
                        fill="black"
                      />
                      <path
                        d="M16 10C16.5523 10 17 10.4477 17 11C17 11.5523 16.5523 12 16 12H12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10H16Z"
                        fill="black"
                      />
                      <path
                        d="M16 15C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15H16Z"
                        fill="black"
                      />
                      <path
                        d="M8.00977 10L8.1123 10.0049C8.61655 10.0561 9.00977 10.4822 9.00977 11C9.00977 11.5178 8.61655 11.9439 8.1123 11.9951L8.00977 12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H8.00977Z"
                        fill="black"
                      />
                      <path
                        d="M8.00977 15L8.1123 15.0049C8.61655 15.0561 9.00977 15.4822 9.00977 16C9.00977 16.5178 8.61655 16.9439 8.1123 16.9951L8.00977 17H8C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15H8.00977Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder={
                      role === "clinic"
                        ? "أدخل رقم الترخيص الطبي للعيادة"
                        : "أدخل رقم ترخيص الصيدلية"
                    }
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>
                كلمة المرور <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="password"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <span className="toggle-password-eye">
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
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>
                تأكيد كلمة المرور <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="أدخل كلمة المرور مجدداً"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span className="toggle-password-eye">
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
                </span>
              </div>
            </div>

            <div className="password-constraints">
              <span
                className={`constraint ${formData.password.length >= 8 ? "valid" : "invalid"}`}
              >
                {formData.password.length >= 8 ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.293 5.29295C19.6835 4.90243 20.3165 4.90243 20.707 5.29295C21.0976 5.68348 21.0976 6.31649 20.707 6.70702L9.70704 17.707C9.31652 18.0975 8.6835 18.0975 8.29298 17.707L3.29298 12.707L3.22462 12.6308C2.90427 12.2381 2.92686 11.6591 3.29298 11.293C3.65909 10.9268 4.2381 10.9042 4.63087 11.2246L4.70704 11.293L9.00001 15.5859L19.293 5.29295Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  "✗"
                )}{" "}
                8 أحرف على الأقل
              </span>
              <span
                className={`constraint ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "valid" : "invalid"}`}
              >
                {/[A-Z]/.test(formData.password) &&
                /[a-z]/.test(formData.password) ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.293 5.29295C19.6835 4.90243 20.3165 4.90243 20.707 5.29295C21.0976 5.68348 21.0976 6.31649 20.707 6.70702L9.70704 17.707C9.31652 18.0975 8.6835 18.0975 8.29298 17.707L3.29298 12.707L3.22462 12.6308C2.90427 12.2381 2.92686 11.6591 3.29298 11.293C3.65909 10.9268 4.2381 10.9042 4.63087 11.2246L4.70704 11.293L9.00001 15.5859L19.293 5.29295Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  "✗"
                )}{" "}
                حرف كبير وصغير
              </span>
              <span
                className={`constraint ${/\d/.test(formData.password) ? "valid" : "invalid"}`}
              >
                {/\d/.test(formData.password) ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.293 5.29295C19.6835 4.90243 20.3165 4.90243 20.707 5.29295C21.0976 5.68348 21.0976 6.31649 20.707 6.70702L9.70704 17.707C9.31652 18.0975 8.6835 18.0975 8.29298 17.707L3.29298 12.707L3.22462 12.6308C2.90427 12.2381 2.92686 11.6591 3.29298 11.293C3.65909 10.9268 4.2381 10.9042 4.63087 11.2246L4.70704 11.293L9.00001 15.5859L19.293 5.29295Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  "✗"
                )}{" "}
                رقم واحد على الأقل
              </span>
            </div>

            {/* ✅ عرض رسالة الخطأ */}
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
                  whiteSpace: "pre-line",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-submit-register"
              disabled={isLoading}
            >
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </button>

            <div className="form-footer-switch">
              <span>لديك حساب بالفعل؟ </span>
              <span className="login-link" onClick={() => onNavigate("login")}>
                تسجيل الدخول
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
