import React, { useState } from "react";
import "./PatientLogin.css";
import logo from "../assets/logo.png";

const PatientLogin = ({ onNavigate, onLoginSuccess }) => {
    const [loginData, setLoginData] = useState({
        emailOrPhone: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onLoginSuccess) {
        onLoginSuccess();
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
                <span className="input-field-icon">✉️</span>
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
                <span className="input-field-icon">🔒</span>
                <span
                    className="password-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
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

            {/* زر تسجيل الدخول */}
            <button type="submit" className="login-submit-btn">
                <span className="btn-arrow-left">←</span>
                <span>تسجيل الدخول</span>
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
