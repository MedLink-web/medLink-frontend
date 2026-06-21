import React from "react";
import "./ResetSuccess.css"; // تأكدي من استدعاء ملف التنسيق الجديد هنا
import logo from "../assets/logo.png"; // تأكدي أن الصورة الجديدة موجودة في المجلد

const ResetSuccess = ({ onNavigate }) => {
    return (
        <div className="Medlink-auth-page" dir="rtl">
        {/* الشعار العلوي المتناسق لكي لا يختفي المظهر العام */}
        <div className="Medlink-top-logo">
            <div className="logo-flex-container">
            <span className="Medlink-text-blue">Medlink</span>
            <div className="logo-circle-icon">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            </div>
        </div>

        {/* الكرت الموحد مع إضافة كلاس التوسيط الداخلي */}
        <div className="Medlink-auth-card success-card-center">
            <div className="success-icon-big">✓</div>
            <h2 className="Medlink-auth-title">تم تغير كلمة المرور بنجاح</h2>
            <p className="Medlink-auth-desc">
            يمكنك الآن الاستفادة من جميع خدمات المنصة
            </p>

            <button
            className="Medlink-submit-btn success-btn-wide"
            onClick={() => onNavigate("dashboard")}
            >
            الانتقال الى الصفحة الرئيسية
            <span className="btn-arrow">←</span>
            </button>
        </div>
        </div>
    );
};

export default ResetSuccess;
