import React from "react";
import logo from "../assets/logo.png"; // تأكدي من مسار الشعار لديكِ
import "./SuccessView.css";

const SuccessView = ({ role, onNavigate }) => {
  return (
    <div className="success-root" dir="rtl">
      {/* النقاط الزخرفية في الخلفية كما بالفيجما */}
      <div className="success-bg-decor top-right-dots"></div>
      <div className="success-bg-decor bottom-left-dots"></div>

      {/* الكارت الأبيض الرئيسي للموجّه */}
      <div className="success-card">
        {/* الشعار والاسم متمركزان في الأعلى */}
        <div className="success-brand">
          <img src={logo} alt="Medlink" className="success-logo" />
          <span className="success-brand-text">Medlink</span>
        </div>

        {/* أيقونة علامة الصح الخضراء الدائرية */}
        <div className="success-icon-wrapper">
          <div className="success-check-circle">
            <span className="check-mark">✓</span>
          </div>
        </div>

        {/* نصوص النجاح والترحيب */}
        <h2 className="success-main-title">تم إنشاء الحساب بنجاح</h2>
        <p className="success-sub-text">
          مرحباً بك في Medlink، يمكنك الآن حجز المواعيد والبحث عن الأدوية بكل
          سهولة.
        </p>

        {/* الأزرار والروابط التفاعلية */}
        <button className="btn-start-now" onClick={() => onNavigate("landing")}>
          ابدأ الآن
        </button>

        <span className="back-to-login" onClick={() => onNavigate("login")}>
          العودة لتسجيل الدخول
        </span>
      </div>
    </div>
  );
};

export default SuccessView;
