import React, { useState } from "react";
import "./PatientProfile.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png";
const PatientProfile = ({ onNavigate }) => {
  // إدارة بيانات المدخلات المستوحاة من Figma في image_bd8764.png
    const [formData, setFormData] = useState({
        firstName: "Amjad",
        lastName: "Al-Masri",
        email: "amjad.almasri@gmail.com",
        address: "غزة - مفترق السرايا",
        phoneCode: "+970",
        phoneNumber: "0595987654",
    });

    const [profileImage, setProfileImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
        setProfileImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("تم حفظ التغييرات وتحديث بيانات الملف الشخصي بنجاح!");
    };

    return (
        <div className="patient-profile-page" dir="rtl">
        {/* 🌐 نافبار داشبورد المريض الموحد والثابت */}
        <header className="Medlink-custom-navbar">
            <div className="nav-right-side">
            <div className="Medlink-nav-logo">
                <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            <nav className="Medlink-nav-links">
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("patient-dashboard")}
                >
                الرئيسية
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("clinics-list")}
                >
                العيادات
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("appointments")}
                >
                مواعيدي
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("patient-pharmacies")}
                >
                الصيدليات
                </span>
                <span
                className="Medlink-nav-item"
                onClick={() => onNavigate("prescriptions")}
                >
                الوصفات الطبية
                </span>
                <span className="Medlink-nav-item active-nav-tab">
                الملف الشخصي
                </span>
            </nav>
            </div>
            <div className="nav-left-side">
            <button
                className="btn-Medlink-logout"
                onClick={() => onNavigate("login")}
            >
                تسجيل الخروج
            </button>
            </div>
        </header>

        {/* 🪪 الحاوية المركزية لبطاقة الملف الشخصي */}
        <main className="profile-main-container">
            <form className="profile-form-card" onSubmit={handleSubmit}>
            {/* 👤 قسم الصورة الشخصية وزر التغيير */}
            <div className="profile-avatar-upload-section">
                <div className="avatar-frame">
                {profileImage ? (
                    <img
                    src={profileImage}
                    alt="Profile"
                    className="uploaded-avatar-img"
                    />
                ) : (
                    <img
                    src={person}
                    alt="Profile"
                    className="default-avatar-vector"
                    />
                )}
                </div>
                <label
                htmlFor="avatar-file-input"
                className="btn-change-avatar-label"
                >
                تغيير الصورة
                </label>
                <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                />
            </div>

            {/* 📝 شبكة الحقول والمدخلات (Inputs Grid) */}
            <div className="profile-inputs-grid">
                {/* الاسم الأول والاسم الأخير في نفس السطر */}
                <div className="input-group-field">
                <label>الاسم الأول :</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="الاسم الأول"
                />
                </div>

                <div className="input-group-field">
                <label>الاسم العائلة :</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="الاسم الأخير"
                />
                </div>

                {/* البريد الإلكتروني */}
                <div className="input-group-field full-width-field">
                <label>البريد الإلكتروني :</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                />
                </div>

                {/* مكان السكن */}
                <div className="input-group-field full-width-field">
                <label>مكان السكن :</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="غزة - مفترق السرايا"
                />
                </div>

                {/* رقم الجوال مع رمز الدولة المدمج */}
                <div className="input-group-field full-width-field">
                <label>رقم الجوال :</label>
                <div className="phone-input-combined">
                    <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="0595987654"
                    className="phone-number-part"
                    />
                    <input
                    type="text"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleInputChange}
                    placeholder="+970"
                    className="phone-code-part"
                    />
                </div>
                </div>
            </div>

            {/* 💾 زر حفظ التغييرات السفلي الأزرق */}
            <div className="profile-actions-row">
                <button type="submit" className="btn-save-profile-changes">
                حفظ التغيرات
                </button>
            </div>
            </form>
        </main>
        <footer className="simple-figma-footer">
            <div className="footer-logo">Medlink </div>
            <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
        </footer>
        </div>
    );
};

export default PatientProfile;
