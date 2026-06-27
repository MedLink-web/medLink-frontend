import React from "react";
import "./RegisterModal.css";

const RegisterModal = ({ isOpen, onClose, onSelectPatient, onSelectPharmacy, onNavigate, onSelectClinic, onLoginClick }) => {
  if (!isOpen) return null;

  const accountTypes = [
    {
      id: "patient",
      title: "مريض",
      features: ["حجز المواعيد", "البحث عن الأدوية", "متابعة الحجوزات"],
      icon: "👤",
    },
    {
      id: "clinic",
      title: "العيادة",
      features: ["إدارة المواعيد", "استقبال المرضى", "السجلات الطبية"],
      icon: "🏥",
    },
    {
      id: "pharmacy",
      title: "الصيدلية",
      features: ["إدارة المخزون", "تحديث الأدوية", "تلقي الطلبات"],
      icon: "💊",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* شريط التحكم العلوي يحتوي على زر إغلاق بشكل إكس */}
        <div className="modal-window-actions">
          <button className="close-x-btn" onClick={onClose} title="إغلاق">
            &times;
          </button>
        </div>

        {/* رأس النافذة المنبثقة */}
        <div className="modal-header">
          <h1 className="modal-main-title">مرحباً بك في Medlink</h1>
          <p className="modal-sub-title">اختر نوع حسابك للمتابعة إلى المنصة</p>
        </div>

        {/* شبكة البطاقات (Grid) */}
        <div className="account-types-grid">
          {accountTypes.map((type) => (
            <div key={type.id} className="account-card">
              <div className="account-icon-wrapper">{type.icon}</div>
              <h3 className="account-card-title">{type.title}</h3>
              <ul className="account-features-list">
                {type.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <button
                className="account-submit-btn"
                onClick={() => {
                  if (type.id === "patient") {
                    onClose();
                    if (onSelectPatient) onSelectPatient();
                    else if (onNavigate) onNavigate("register-patient");
                  } else if (type.id === "clinic") {
                    // 🌟 إصلاح انتقال العيادة: إغلاق وتوجيه آمن ومباشر لمنع التعطل
                    onClose();
                    if (onSelectClinic) onSelectClinic();
                    else if (onNavigate) onNavigate("register-clinic");
                  } else if (type.id === "pharmacy") {
                    // 🌟 ربط الصيدلية بشكل سليم ومطابق للـ App.jsx المحدث
                    onClose();
                    if (onSelectPharmacy) onSelectPharmacy();
                    else if (onNavigate) onNavigate("pharmacy-register");
                  } else {
                    alert(`واجهة حساب (${type.title}) قيد التطوير حالياً!`);
                  }
                }}
              >
                إنشاء حساب
              </button>
            </div>
          ))}
        </div>

        {/* التذييل الخاص بالنافذة */}
        <div
          className="modal-footer"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <p>
            لديك حساب بالفعل؟{" "}
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                if (onLoginClick) {
                  onLoginClick();
                }
              }}
              style={{
                color: "#2b6cb0",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
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

export default RegisterModal;
