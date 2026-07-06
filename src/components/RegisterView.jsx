import React, { useState } from "react";
import logo from "../assets/logo.png"; // تأكدي من المسار
import "./RegisterView.css";

const RegisterView = ({ role, onNavigate }) => {
  // تخزين قيم الحقول في State واحد منظم
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        licenseNumber: "", // الحقل المتغير للعيادة والصيدلية
        password: "",
        confirmPassword: "",
    });

    // تحديد العنوان بناءً على الـ role الممرر
    const getTitle = () => {
        if (role === "clinic") return "إنشاء حساب العيادة";
        if (role === "pharmacy") return "إنشاء حساب الصيدلية";
        return "إنشاء حساب مريض";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`تم إرسال بيانات التسجيل لـ ${role}:`, formData);
        onNavigate(`success-${role}`);
        // هنا تضعين منطق إرسال البيانات للـ Backend لاحقاً
    };

    return (
        <div className="register-root" dir="rtl">
        {/* الخلفية الزخرفية كما في Figma */}
        <div className="register-bg-decor top-left"></div>
        <div className="register-bg-decor bottom-right"></div>

        <div className="register-card-container">
            {/* كارت الفورم الأبيض الرئيسي */}
            <div className="register-form-card">
            {/* 🌟 تم نقل الشعار إلى هنا ليكون منبثقاً جهة اليمين داخل حيز الكارت 🌟 */}
            <div className="register-brand" onClick={() => onNavigate("landing")}>
                <img src={logo} alt="Medlink" className="brand-logo" />
                <span className="brand-text">Medlink</span>
            </div>

            <h2 className="form-main-title">{getTitle()}</h2>
            <p className="form-sub-title">خطوة واحدة فقط لإنشاء حسابك</p>

            <form onSubmit={handleSubmit} className="actual-form">
                {/* 1. حقل الاسم الكامل */}
                <div className="input-group">
                <label>
                    الاسم الكامل <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">👤</span>
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

                {/* 2. حقل حساب الجيميل */}
                <div className="input-group">
                <label>
                    حساب الجيميل <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
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

                {/* 3. حقل رقم الجوال */}
                <div className="input-group">
                <label>
                    رقم الجوال <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">📱</span>
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

                {/* 🌟 الحقل الديناميكي المشروط (يظهر فقط إذا كان الحساب عيادة أو صيدلية) 🌟 */}
                {role !== "patient" && (
                <div className="input-group dynamic-field">
                    <label>
                    {role === "clinic"
                        ? "رقم ترخيص العيادة الطبي"
                        : "رقم ترخيص الصيدلية"}
                    <span className="required"> *</span>
                    </label>
                    <div className="input-wrapper">
                    <span className="input-icon">📄</span>
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

                {/* 4. حقل كلمة المرور */}
                <div className="input-group">
                <label>
                    كلمة المرور <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                    type="password"
                    name="password"
                    placeholder="أدخل كلمة المرور"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    />
                    <span className="toggle-password-eye">👁️</span>
                </div>
                </div>

                {/* 5. حقل تأكيد كلمة المرور */}
                <div className="input-group">
                <label>
                    تأكيد كلمة المرور <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="أدخل كلمة المرور مجدداً"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    />
                    <span className="toggle-password-eye">👁️</span>
                </div>
                </div>

                {/* شروط كلمة المرور كما بالـ Figma */}
                <div className="password-constraints">
                <span className="constraint valid">✓ 8 أحرف على الأقل</span>
                <span className="constraint invalid">✗ حرف كبير وصغير</span>
                <span className="constraint invalid">✗ رقم واحد على الأقل</span>
                </div>

                {/* أزرار الإجراءات */}
                <button type="submit" className="btn-submit-register">
                إنشاء الحساب
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
