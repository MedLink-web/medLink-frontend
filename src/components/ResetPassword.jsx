import React, { useState } from "react";
import "./ResetPassword.css";
import logo from "../assets/logo.png"; // تأكدي أن الصورة الجديدة موجودة في المجلد

const ResetPassword = ({ onNextStep }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [matchError, setMatchError] = useState("");

    // شروط فحص كلمة المرور
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
            <label>
                كلمة المرور الجديدة <span className="star-red">*</span>
            </label>
            <div className="input-with-icon-wrapper">
                <input
                type={showPass ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Medlink-input-field"
                />
                <span className="field-inner-icon">🔒</span>
                <span
                className="field-eye-icon"
                onClick={() => setShowPass(!showPass)}
                >
                {showPass ? "🙈" : "👁"}
                </span>
            </div>
            </div>

            <div className="Medlink-field-group">
            <label>
                تأكيد كلمة المرور <span className="star-red">*</span>
            </label>
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
                <span
                className="field-eye-icon"
                onClick={() => setShowConfirm(!showConfirm)}
                >
                {showConfirm ? "🙈" : "👁"}
                </span>
            </div>
            {matchError && (
                <span className="error-message-text">{matchError}</span>
            )}
            </div>

            {/* فحص الشروط الحي */}
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

export default ResetPassword;
