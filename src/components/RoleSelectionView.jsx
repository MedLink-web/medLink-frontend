import React, { useState } from "react"; 
import "./RoleSelectionView.css";
import logo from "../assets/logo.png"; 
import patientIcon from "../assets/patient-icon.png";
import clinicIcon from "../assets/clinic-icon.png";
import pharmacyIcon from "../assets/pharamacy-icon.png";
// يمكنكِ استخدام نفس أيقونة العيادة أو أيقونة مخصصة لاحقاً للمسؤول، أو تركها كـ SVG/Emoji إن لم تتوفر صورة
import adminIcon from "../assets/clinic-icon.png"; 

const RoleSelectionView = ({ onNavigate }) => {
    const [activeRole, setActiveRole] = useState(null);

    const handleRoleSelect = (roleId) => {
        setActiveRole(roleId);
        console.log(`تم اختيار الدور: ${roleId}`);

        if (onNavigate) {
            // 🌟 شرط خاص بالمسؤول ليوجهه مباشرة للوحة التحكم
            if (roleId === "admin") {
                onNavigate("admin-dashboard");
            } else {
                // بقية الأدوار (مريض، عيادة، صيدلية) تذهب لصفحات التسجيل الخاصة بها
                onNavigate(`register-${roleId}`);
            }
        }
    };

    const handleLoginClick = () => {
        if (onNavigate) onNavigate("login");
    };

    // 🌟 مصفوفة البيانات مضاف إليها دور مسؤول النظام الجديد
    const rolesData = [
        {
        id: "patient",
        title: "مريض",
        icon: patientIcon,
        features: ["حجز المواعيد", "البحث عن الأدوية", "متابعة الحجوزات"],
        },
        {
        id: "clinic",
        title: "العيادة",
        icon: clinicIcon,
        features: ["إدارة المواعيد", "استقبال المرضى", "إصدار الوصفات"],
        },
        {
        id: "pharmacy",
        title: "الصيدلية",
        icon: pharmacyIcon,
        features: ["صرف الوصفات", "إدارة المخزون", "تحديث الأدوية"],
        },
    ];

    return (
        <div className="role-selection-root" dir="rtl">
        <div className="decor-dots decor-top-left"></div>
        <div className="decor-dots decor-bottom-right"></div>

        <header className="role-header">
            <div className="role-logo">
            <img src={logo} alt="Medlink Logo" className="role-logo-img" />
            <span className="role-logo-text">Medlink</span>
            </div>
        </header>

        <main className="role-main-content">
            <div className="role-welcome-text">
            <h1 className="role-main-title">
                مرحباً بك في <span className="brand-name">Medlink</span>
            </h1>
            <p className="role-sub-title">اختر نوع حسابك للمتابعة إلى المنصة</p>
            </div>

            <div className="roles-grid-container">
            {rolesData.map((role) => (
                <div
                key={role.id}
                className={`role-selection-card ${activeRole === role.id ? "selected-active" : ""} ${role.id === "admin" ? "admin-card-style" : ""}`}
                >
                <div className="role-icon-container">
                    <img
                    src={role.icon}
                    alt={role.title}
                    className="role-card-img"
                    />
                </div>
                <h3 className="role-card-title">{role.title}</h3>

                <ul className="role-features-list">
                    {role.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                    ))}
                </ul>

                <button
                    className="btn-create-account"
                    onClick={() => handleRoleSelect(role.id)}
                >
                    {role.id === "admin" ? "دخول الإدارة" : "إنشاء حساب"}
                </button>
                </div>
            ))}
            </div>

            <div className="role-footer-login">
            <span>لديك حساب بالفعل؟ </span>
            <button className="btn-link-login" onClick={() => onNavigate("login")}>
                تسجيل الدخول
            </button>
            </div>
        </main>
        </div>
    );
};

export default RoleSelectionView;
