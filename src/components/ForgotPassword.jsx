import React, { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png"; // تأكدي أن الصورة الجديدة موجودة في المجلد

const ForgotPassword = ({ onNavigate, onNextStep }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
        setError("الرجاء إدخال البريد الإلكتروني");
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
            <span className="Medlink-text-blue"> Medlink</span>
            <div className="logo-circle-icon">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            </div>
        </div>

        <div className="Medlink-auth-card">
            <h2 className="Medlink-auth-title">نسيت كلمة المرور؟</h2>
            <p className="Medlink-auth-desc">
            أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رمز تحقق لإعادة تعيين
            كلمة المرور.
            </p>

            <div className="Medlink-field-group">
            <label>
                البريد الإلكتروني <span className="star-red">*</span>
            </label>
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
            <span
                className="back-to-login-link"
                onClick={() => onNavigate("login")}
            >
                العودة لصفحة تسجيل الدخول
            </span>
            </div>
        </div>
        </div>
    );
};

export default ForgotPassword;
