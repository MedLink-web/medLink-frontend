import React, { useState, useRef } from "react";
import logo from "../assets/logo.png";
import "./UserLogin.css";

// ==========================================
// 1. المكون الرئيسي: تسجيل الدخول الشامل
// ==========================================
const PatientLogin = ({ onNavigate, onLoginSuccess }) => {
    const [currentStep, setCurrentStep] = useState("login"); // login | forgot | verify | reset | success
    const [userEmail, setUserEmail] = useState("");
    const [loginData, setLoginData] = useState({ emailOrPhone: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
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
            // حفظ التوكن والمستخدم في المتصفح
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (onLoginSuccess) {
            onLoginSuccess(data.user);
            }

            // 🌟 التوجيه الذكي حسب الـ role القادم من السيرفر 🌟
            const userRole = data.user?.role; // يتوقع قيم مثل: clinic, pharmacy, doctor, patient

            if (userRole === "clinic") {
                onNavigate("clinic-profile");
            } else if (userRole === "pharmacy") {
                onNavigate("pharmacy-dashboard");
            } else if (userRole === "doctor") {
                // 🚀 الدور الجديد: توجيه الطبيب إلى لوحة التحكم الخاصة به
                onNavigate("doctor-dashboard");
            } else {
                // الافتراضي للمريض
                onNavigate("patient-dashboard"); 
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

    // التحكم بالخطوات الفرعية لاستعادة كلمة المرور داخلياً
    if (currentStep === "forgot") {
        return (
        <ForgotPassword 
            onNavigate={() => setCurrentStep("login")} 
            onNextStep={(next, email) => {
            setUserEmail(email);
            setCurrentStep(next);
            }} 
        />
        );
    }

    if (currentStep === "verify") {
        return <VerifyCode email={userEmail} onNextStep={(next) => setCurrentStep(next)} />;
    }

    if (currentStep === "reset") {
        return <ResetPassword onNextStep={(next) => setCurrentStep(next)} />;
    }

    if (currentStep === "success") {
        return <ResetSuccess onNavigate={() => setCurrentStep("login")} />;
    }

    return (
        <div className="login-page-container" dir="rtl">
        <div className="login-top-brand">
            <img src={logo} alt="Medlink Logo" className="brand-logo-img" />
            <span className="brand-logo-text">Medlink</span>
        </div>

        <div className="login-card">
            <h1 className="login-card-title">تسجيل الدخول</h1>

            <form onSubmit={handleLoginSubmit} className="login-form-fields">
            <div className="form-group">
                <label>البريد الإلكتروني / رقم الجوال <span className="required-star">*</span></label>
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
                <span className="input-field-icon">✉️</span>
                </div>
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
                <label>كلمة المرور <span className="required-star">*</span></label>
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
                <span className="input-field-icon">🔒</span>
                <span className="password-toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
                </div>
            </div>

            <div className="forgot-password-wrapper">
                <span className="forgot-password-link" onClick={() => setCurrentStep("forgot")} style={{ cursor: "pointer" }}>
                نسيت كلمة المرور؟
                </span>
            </div>

            {errorMessage && (
                <div className="login-error-alert">⚠️ {errorMessage}</div>
            )}

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
                <span className="btn-arrow-left">←</span>
                <span>{isLoading ? "جاري الدخول..." : "تسجيل الدخول"}</span>
            </button>
            </form>

            <div className="login-card-footer">
            <p>
                ليس لديك حساب بالفعل؟{" "}
                <span className="create-account-link" onClick={() => onNavigate && onNavigate("role-selection")}>
                إنشاء حساب جديد
                </span>
            </p>
            </div>
        </div>

        <footer className="login-bottom-minimal-footer">
            <div className="footer-links-row">
            <a href="#terms">الشروط والأحكام</a>
            <span className="divider">|</span>
            <a href="#privacy">سياسة الخصوصية</a>
            </div>
            <p className="footer-copyright-text">جميع الحقوق محفوظة Medlink © 2026</p>
        </footer>
        </div>
    );
    };

    // ==========================================
    // 2. مكون: نسيت كلمة المرور
    // ==========================================
    const ForgotPassword = ({ onNavigate, onNextStep }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
        setError("الرجاء إدخل البريد الإلكتروني");
        } else if (!emailRegex.test(email)) {
        setError("صيغة البريد الإلكتروني غير صحيحة");
        } else {
        setError("");
        onNextStep("verify", email);
        }
    };

    return (
        <div className="Medlink-auth-page" dir="rtl">
        <div className="Medlink-top-logo">
            <div className="logo-flex-container">
            <span className="Medlink-text-blue">Medlink</span>
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
        </div>

        <div className="Medlink-auth-card">
            <h2 className="Medlink-auth-title">نسيت كلمة المرور؟</h2>
            <p className="Medlink-auth-desc">
            أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور.
            </p>

            <div className="Medlink-field-group">
            <label>البريد الإلكتروني <span className="star-red">*</span></label>
            <div className="input-with-icon-wrapper">
                <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                }}
                className={`Medlink-input-field ${error ? "input-error-border" : ""}`}
                />
                <span className="field-inner-icon">✉</span>
            </div>
            {error && <span className="error-message-text">{error}</span>}
            </div>

            <button className="Medlink-submit-btn" onClick={handleSubmit}>
            تأكيد البريد الإلكتروني <span className="btn-arrow">←</span>
            </button>

            <div className="Medlink-bottom-links">
            <span className="back-to-login-link" onClick={onNavigate}>
                العودة لصفحة تسجيل الدخول
            </span>
            </div>
        </div>
        </div>
    );
    };

    // ==========================================
    // 3. مكون: كود التحقق OTP
    // ==========================================
    const VerifyCode = ({ email, onNextStep }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        if (otp.join("").length < 6) {
        alert("الرجاء إدخال الرمز المكون من 6 أرقام كاملاً");
        } else {
        onNextStep("reset");
        }
    };

    return (
        <div className="Medlink-auth-page" dir="rtl">
        <div className="Medlink-top-logo">
            <div className="logo-flex-container">
            <span className="Medlink-text-blue">Medlink</span>
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
        </div>

        <div className="Medlink-auth-card">
            <h2 className="Medlink-auth-title">تحقق من بريدك</h2>
            <p className="Medlink-auth-desc">
            تم إرسال كود مؤلف من 6 أرقام إلى <br />
            <strong className="user-email-display">{email || "example***@email.com"}</strong>
            </p>

            <div className="Medlink-otp-container">
            {otp.map((data, index) => (
                <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="Medlink-otp-box"
                />
            ))}
            </div>

            <button className="Medlink-submit-btn" onClick={handleVerify}>
            إرسال كود التحقق <span className="btn-arrow">←</span>
            </button>

            <div className="Medlink-bottom-links">
            <span className="resend-code-link">إعادة إرسال الرمز</span>
            </div>
        </div>
        </div>
    );
    };

    // ==========================================
    // 4. مكون: تعيين كلمة المرور الجديدة
    // ==========================================
    const ResetPassword = ({ onNextStep }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [matchError, setMatchError] = useState("");

    const isLengthValid = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password) && /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    const handleResetSubmit = () => {
        if (!isLengthValid || !hasUpperCase || !hasNumber) {
        setMatchError("الرجاء استيفاء جميع شروط قوة كلمة المرور أولاً");
        return;
        }
        if (password !== confirmPassword) {
        setMatchError("كلمتا المرور غير متطابقتين");
        return;
        }
        setMatchError("");
        onNextStep("success");
    };

    return (
        <div className="Medlink-auth-page" dir="rtl">
        <div className="Medlink-top-logo">
            <div className="logo-flex-container">
            <span className="Medlink-text-blue">Medlink</span>
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
        </div>

        <div className="Medlink-auth-card">
            <h2 className="Medlink-auth-title">كلمة مرور جديدة</h2>

            <div className="Medlink-field-group">
            <label>كلمة المرور الجديدة <span className="star-red">*</span></label>
            <div className="input-with-icon-wrapper">
                <input
                type={showPass ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Medlink-input-field"
                />
                <span className="field-inner-icon">🔒</span>
                <span className="field-eye-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁"}
                </span>
            </div>
            </div>

            <div className="Medlink-field-group">
            <label>تأكيد كلمة المرور <span className="star-red">*</span></label>
            <div className="input-with-icon-wrapper">
                <input
                type={showConfirm ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (matchError) setMatchError("");
                }}
                className="Medlink-input-field"
                />
                <span className="field-inner-icon">🔒</span>
                <span className="field-eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "🙈" : "👁"}
                </span>
            </div>
            {matchError && <span className="error-message-text">{matchError}</span>}
            </div>

            <div className="password-checkpoints">
            <span className={`checkpoint ${isLengthValid ? "met" : "unmet"}`}>
                {isLengthValid ? "✔" : "✕"} 8 أحرف على الأقل
            </span>
            <span className={`checkpoint ${hasUpperCase ? "met" : "unmet"}`}>
                {hasUpperCase ? "✔" : "✕"} حرف كبير وصغير
            </span>
            <span className={`checkpoint ${hasNumber ? "met" : "unmet"}`}>
                {hasNumber ? "✔" : "✕"} رقم واحد على الأقل
            </span>
            </div>

            <button className="Medlink-submit-btn" onClick={handleResetSubmit}>
            تأكيد كلمة المرور <span className="btn-arrow">←</span>
            </button>
        </div>
        </div>
    );
    };

    // ==========================================
    // 5. مكون: نجاح تغيير كلمة المرور
    // ==========================================
    const ResetSuccess = ({ onNavigate }) => {
    return (
        <div className="Medlink-auth-page" dir="rtl">
        <div className="Medlink-top-logo">
            <div className="logo-flex-container">
            <span className="Medlink-text-blue">Medlink</span>
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
        </div>

        <div className="Medlink-auth-card success-card-center">
            <div className="success-icon-big">✓</div>
            <h2 className="Medlink-auth-title">تم تغيير كلمة المرور بنجاح</h2>
            <p className="Medlink-auth-desc">يمكنك الآن تسجيل الدخول مجدداً والاستفادة من خدماتنا.</p>

            <button className="Medlink-submit-btn success-btn-wide" onClick={() => onNavigate("login")}>
            العودة لتسجيل الدخول <span className="btn-arrow">←</span>
            </button>
        </div>
        </div>
    );
};

export default PatientLogin;