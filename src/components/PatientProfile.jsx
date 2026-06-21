import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./PatientProfile.css";

const PatientProfile = ({ onNavigate }) => {
  // استخدام دالة الملاحة للتنقل بين الصفحات عند الضغط على أزرار القائمة الجانبية
  const menuItems = [
    { id: "home", text: "الصفحة الرئيسية", icon: "📺" },
    { id: "clinics", text: "العيادات", icon: "🏥" },
    { id: "pharmacies", text: "بحث عن الصيدلية", icon: "🔍" },
    { id: "prescriptions", text: "الوصفات الطبية", icon: "📋" },
    { id: "appointments", text: "مواعيدي", icon: "📅" },
    { id: "profile", text: "الملف الشخصي", icon: "👤", active: true },
  ];

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "example@example.com",
    address: "",
    phone: "0595987654",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="profile-page-wrapper" dir="rtl">
      {/* القسم الأيمن: شريط التنقل الجانبي الثابت (Sidebar) */}
      <aside className="profile-sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Medlink Logo" className="logo-image" />
          <span className="brand-logo-text">Medlink</span>
        </div>

        <ul className="sidebar-menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item-link ${item.id === "profile" ? "active-link" : ""}`} // يحافظ على إضاءة خيار "الملف الشخصي" كونه النشط حالياً
              onClick={(e) => {
                e.preventDefault(); // منع المتصفح من إعادة تحميل الصفحة أو تغيير الروابط العلوية

                if (onNavigate) {
                  // 🌟 إذا ضغط المستخدم على زر "الصفحة الرئيسية"، يتم توجيهه برمجياً إلى لوحة التحكم (الداشبورد)
                  if (item.id === "home") {
                    onNavigate("dashboard");
                  } else {
                    onNavigate(item.id); // للتنقلات الأخرى المستقبلية
                  }
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* القسم الأيسر: استمارة تعديل البيانات الشخصية */}
      <main className="profile-content-area">
        <form onSubmit={handleSave} className="profile-form-container">
          {/* جزء الصورة الشخصية وزر التغيير العلوى */}
          <div className="profile-avatar-section">
            <div className="avatar-circle-icon">👤</div>
            <button type="button" className="btn-change-photo">
              تغيير الصورة
            </button>
          </div>

          {/* شبكة الحقول (Form Fields) */}
          <div className="profile-fields-grid">
            <div className="form-input-group">
              <label className="field-label-text">الاسم الأول :</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="الاسم الاول"
                className="profile-custom-input"
              />
            </div>

            <div className="form-input-group">
              <label className="field-label-text">الاسم العائلة :</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="الاسم الاخير"
                className="profile-custom-input"
              />
            </div>

            <div className="form-input-group full-width-field">
              <label className="field-label-text">البريد الإلكتروني:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="example@example.com"
                className="profile-custom-input text-left"
              />
            </div>

            <div className="form-input-group full-width-field">
              <label className="field-label-text">مكان السكن :</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                placeholder="غزة - مفترق السرايا"
                className="profile-custom-input"
              />
            </div>

            <div className="form-input-group full-width-field">
              <label className="field-label-text">رقم الجوال :</label>
              <div className="phone-input-combined">
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="0595987654"
                  className="profile-custom-input phone-main-input text-left"
                />
                <div className="phone-code-badge">+970</div>
              </div>
            </div>
          </div>

          {/* زر حفظ التغييرات السفلي */}
          <div className="profile-form-footer">
            <button type="submit" className="btn-save-profile-changes">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PatientProfile;
