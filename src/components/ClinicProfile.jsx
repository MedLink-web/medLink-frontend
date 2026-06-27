import React, { useState } from "react";
import "./ClinicProfile.css";

const ClinicProfile = ({ onNavigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    // 🌟 حالة جديدة للتحكم في ظهور إشعار نجاح الحفظ الأخضر
    const [showNotification, setShowNotification] = useState(false);

    const [clinicData, setClinicData] = useState({
        id: "SA-2024-MED-00471",
        name: "عيادة النور الطبية",
        specialty: "طب الأسنان والتجميل",
        license: "SA-2024-MED-00471",
        status: "معتمدة",
        phone: "+966 11 234 5678",
        email: "info@alnour-clinic.com",
        website: "info@alnour-clinic.com",
        days: "الأحد - الخميس",
        hours: "09:00 ص - 09:00 م",
        about: "عيادة متخصصة في طب الأسنان وتجميلها، نقدم أحدث التقنيات والخدمات في بيئة طبية معتمدة، بكادر طبي متخصص وذو خبرة تفوق 15 عاماً."
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClinicData((prev) => ({ ...prev, [name]: value }));
    };

    // 🚀 دالة الحفظ المحدثة لإظهار الشريط الأخضر كما في التصميم
    const handleSave = () => {
        setIsEditing(false); // العودة لوضع العرض
        setShowNotification(true); // إظهار الإشعار الأخضر

        // إخفاء الإشعار تلقائياً بعد 4 ثوانٍ لإعطاء تجربة مستخدم ذكية
        setTimeout(() => {
        setShowNotification(false);
        }, 4000);
    };

    return (
        <div className="clinic-layout-wrapper" dir="rtl">
        
        {/* 🏢 القائمة الجانبية */}
        <div className="clinic-sidebar">
            <div className="sidebar-clinic-header">
            <div className="sidebar-clinic-logo">🏥</div>
            <div className="sidebar-clinic-titles">
                <h2 className="sidebar-clinic-name">{clinicData.name}</h2>
                <p className="sidebar-clinic-sub">لوحة التحكم</p>
            </div>
            </div>

            <p className="menu-section-title">القائمة الرئيسية</p>
            <div className="sidebar-menu">
            <div className="menu-item" onClick={() => onNavigate && onNavigate("clinic-dashboard")}>
                <span className="menu-icon">🎛️</span>
                <span className="menu-text">لوحة التحكم</span>
            </div>
            <div className="menu-item" onClick={() => alert("إدارة المرضى قيد التطوير")}>
                <span className="menu-icon">👥</span>
                <span className="menu-text">إدارة المرضى</span>
            </div>
            <div className="menu-item" onClick={() => alert("المواعيد قيد التطوير")}>
                <span className="menu-icon">📅</span>
                <span className="menu-text">المواعيد</span>
            </div>
            <div className="menu-item" onClick={() => alert("السجلات الطبية قيد التطوير")}>
                <span className="menu-icon">📝</span>
                <span className="menu-text">السجلات الطبية</span>
            </div>
            <div className="menu-item active">
                <span className="menu-icon">🏢</span>
                <span className="menu-text">ملف العيادة</span>
            </div>
            </div>

            <div className="sidebar-footer">
            <div className="logout-btn-wrapper" onClick={() => onNavigate && onNavigate("home")}>
                <span className="logout-icon">🚪</span>
                <span className="logout-text">تسجيل الخروج</span>
            </div>
            </div>
        </div>

        {/* 📄 منطقة المحتوى الرئيسي */}
        <div className="clinic-main-content">
            
            {/* 🌟 شريط نجاح التعديل الأخضر يظهر هنا بناءً على image_7f16c0.png */}
            {showNotification && (
            <div className="success-toast-banner">
                <span className="toast-check-icon">✓</span>
                <span className="toast-text-message">تم حفظ التغييرات بنجاح</span>
            </div>
            )}

            {/* هيدر الصفحة */}
            <div className="profile-header-row">
            <div className="breadcrumb-block">
                <span className="breadcrumb-path">لوحة التحكم &gt; ملف العيادة</span>
                <h1 className="current-view-title">
                {isEditing ? "تعديل بيانات العيادة" : "ملف العيادة"}
                </h1>
            </div>
            
            {isEditing ? (
                <div className="action-buttons-group">
                <button className="save-changes-btn" onClick={handleSave}>حفظ التغييرات</button>
                <button className="cancel-edit-btn" onClick={() => setIsEditing(false)}>إلغاء</button>
                </div>
            ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <span>تعديل البيانات</span>
                <i className="edit-icon">✏️</i>
                </button>
            )}
            </div>

            {/* ------------------ وضع التعديل ------------------ */}
            {isEditing ? (
            <div className="edit-profile-form">
                <div className="form-section-card image-edit-card">
                <div className="clinic-avatar-large">🏥</div>
                <button className="change-photo-btn" onClick={() => alert("رفع صورة جديدة قيد التطوير")}>
                    تعديل ع الصورة
                </button>
                </div>

                <div className="form-section-card">
                <h2 className="section-form-title">المعلومات الأساسية</h2>
                <div className="input-field-wrapper">
                    <label className="field-label">اسم العيادة:</label>
                    <div className="input-with-icon">
                    <input type="text" name="name" value={clinicData.name} onChange={handleChange} />
                    <span className="input-icon-slot">🏢</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">التخصص:</label>
                    <div className="input-with-icon">
                    <input type="text" name="specialty" value={clinicData.specialty} onChange={handleChange} />
                    <span className="input-icon-slot">🩺</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">رقم الترخيص الطبي:</label>
                    <div className="input-with-icon">
                    <input type="text" name="license" value={clinicData.license} onChange={handleChange} />
                    <span className="input-icon-slot">📋</span>
                    </div>
                </div>
                </div>

                <div className="form-section-card">
                <h2 className="section-form-title">معلومات التواصل والعنوان</h2>
                <div className="input-field-wrapper">
                    <label className="field-label">رقم الهاتف</label>
                    <div className="input-with-icon">
                    <input type="text" name="phone" value={clinicData.phone} onChange={handleChange} />
                    <span className="input-icon-slot">📱</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">البريد الإلكتروني</label>
                    <div className="input-with-icon">
                    <input type="email" name="email" value={clinicData.email} onChange={handleChange} />
                    <span className="input-icon-slot">✉️</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">عنوان العيادة</label>
                    <div className="input-with-icon">
                    <input type="text" name="website" value={clinicData.website} onChange={handleChange} />
                    <span className="input-icon-slot">📍</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">أيام الدوام</label>
                    <div className="input-with-icon">
                    <input type="text" name="days" value={clinicData.days} onChange={handleChange} />
                    <span className="input-icon-slot">📅</span>
                    </div>
                </div>
                <div className="input-field-wrapper">
                    <label className="field-label">ساعات العمل</label>
                    <div className="input-with-icon">
                    <input type="text" name="hours" value={clinicData.hours} onChange={handleChange} />
                    <span className="input-icon-slot">🕒</span>
                    </div>
                </div>
                </div>

                <div className="form-section-card">
                <h2 className="section-form-title">نبذة عن العيادة</h2>
                <textarea name="about" value={clinicData.about} onChange={handleChange} rows="4" className="form-textarea"></textarea>
                </div>
            </div>
            ) : (
            // ------------------ وضع العرض الافتراضي ------------------
            <div className="view-profile-details">
                <div className="main-info-card">
                <div className="right-brand-section">
                    <div className="clinic-logo-placeholder">🏥</div>
                    <div className="clinic-title-block">
                    <h2 className="clinic-main-name">{clinicData.name}</h2>
                    <p className="clinic-sub-specialty">{clinicData.specialty}</p>
                    </div>
                </div>
                <div className="left-status-section">
                    <span className="clinic-id-badge">{clinicData.id}</span>
                    <span className="status-badge-active">✓ {clinicData.status}</span>
                </div>
                </div>

                <div className="details-section-box">
                <h2 className="section-main-title">معلومات التواصل والعنوان</h2>
                <div className="info-grid-list">
                    <div className="info-grid-item"><div className="item-icon">📱</div><div className="item-text-group"><span className="item-label">رقم الهاتف</span><span className="item-value">{clinicData.phone}</span></div></div>
                    <div className="info-grid-item"><div className="item-icon">✉️</div><div className="item-text-group"><span className="item-label">البريد الإلكتروني</span><span className="item-value">{clinicData.email}</span></div></div>
                    <div className="info-grid-item"><div className="item-icon">📍</div><div className="item-text-group"><span className="item-label">عنوان العيادة</span><span className="item-value">{clinicData.website}</span></div></div>
                    <div className="info-grid-item"><div className="item-icon">📅</div><div className="item-text-group"><span className="item-label">أيام الدوام</span><span className="item-value">{clinicData.days}</span></div></div>
                    <div className="info-grid-item"><div className="item-icon">🕒</div><div className="item-text-group"><span className="item-label">ساعات العمل</span><span className="item-value">{clinicData.hours}</span></div></div>
                </div>
                </div>

                <div className="about-section-box">
                <h2 className="section-main-title">نبذة عن العيادة</h2>
                <p className="about-paragraph-text">{clinicData.about}</p>
                </div>
            </div>
            )}

        </div>
        </div>
    );
};

export default ClinicProfile;