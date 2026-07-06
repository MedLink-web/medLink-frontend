import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./ClinicProfile.css";

const ClinicProfile = ({ onNavigate }) => {
    // 1. إدارة وضع التعديل وحالة التنبيه بالنجاح
    const [isEditing, setIsEditing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // 2. بيانات العيادة (الأولية والافتراضية لتطابق واجهة Figma)
    const [clinicData, setClinicData] = useState({
        name: "عيادة النور الطبية",
        specialty: "طب الأسنان والتجميل",
        licenseNumber: "SA-2024-MED-00471",
        phone: "+966 11 234 5678",
        email: "info@alnour-clinic.com",
        address: "info@alnour-clinic.com", // الحقل كما ظهر في تصميم النموذج
        workDays: "الأحد - الخميس",
        workHours: "09:00 ص - 09:00 م",
        about: "عيادة متخصصة في طب الأسنان وتجميلها، نقدم أحدث التقنيات والخدمات في بيئة طبية معتمدة، بكادر طبي متخصص وذو خبرة تفوق 15 عاماً."
    });

    // حالة مؤقتة لحفظ التعديلات أثناء الكتابة وقبل الضغط على "حفظ"
    const [tempData, setTempData] = useState({ ...clinicData });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData({ ...tempData, [name]: value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setClinicData({ ...tempData });
        setIsEditing(false);
        
        // إظهار توست النجاح الأخضر المماثل للصورة الثالثة
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleCancel = () => {
        setTempData({ ...clinicData }); // إلغاء التغييرات والعودة للبيانات الأصلية
        setIsEditing(false);
    };

    return (
        <div className="clinic-dashboard-root" dir="rtl">
        
        {/* 🟢 بنر النجاح المنبثق (Toast Notification) المماثل لـ image_de6082.png */}
        {showToast && (
            <div className="clinic-success-toast animate-toast">
            <span className="toast-check-icon">✓</span>
            <span className="toast-text">تم حفظ التغييرات بنجاح</span>
            </div>
        )}

        {/* 右 شريط الملاحة الجانبي (Sidebar) */}
        {/* الشريط الجانبي (Sidebar) المطور للملاحة والتنقل */}
        <aside className="clinic-sidebar-nav">
                {/* الهوية المدمجة من ملف العيادة */}
            <div className="sidebar-brand-section">
                <img src={logo} alt="Medlink" className="sidebar-logo-img" />
                <div className="sidebar-brand-text">
                <h4>{clinicData.name}</h4>
                <span className="sidebar-user-role">لوحة التحكم</span>
                </div>
            </div>
    
            {/* روابط القائمة الرئيسية الموحدة بستايل فبجما الأنيق */}
            <nav className="sidebar-menu-links">
                <div className="menu-group-label">القائمة الرئيسية</div>
                
                <button className="active-nav-btn" onClick={() => onNavigate && onNavigate("clinic-profile")}>
                <span className="menu-icon">📂</span> ملف العيادة
                </button>
                
                <button onClick={() => onNavigate && onNavigate("doctors-management")}>
                <span className="menu-icon">👥</span> إدارة الأطباء
                </button>
                
                <button onClick={() => onNavigate && onNavigate("clinic-appointments")}>
                <span className="menu-icon">📅</span> مواعيد العيادة
                </button>
                
                <button  onClick={() => onNavigate && onNavigate("patients-management")}>
                <span className="menu-icon">💊</span> إدارة حجوزات المرضى
                </button>
            </nav>
            </aside>

        {/* 左 المحتوى الرئيسي المتغير */}
        <main className="clinic-main-content">
            
            {/* شريط العنوان العلوي (Breadcrumbs) */}
            <header className="content-top-header">
            <div className="breadcrumb-trail">
                <span>لوحة التحكم</span>
                <span className="trail-arrow">&gt;</span>
                <span className="trail-current">ملف العيادة</span>
                {isEditing && (
                <>
                    <span className="trail-arrow">&gt;</span>
                    <span className="trail-current-sub">تعديل بيانات العيادة</span>
                </>
                )}
            </div>
            </header>

            <div className="clinic-profile-card-container">
            
            {/* ======================================================== */}
            {/* وضع العرض العادي المستوحى من صورة image_de5d99.png */}
            {/* ======================================================== */}
            {!isEditing ? (
                <>
                {/* كارت البطاقة العلوية للعيادة */}
                <div className="clinic-identity-card">
                    <div className="identity-right-side">
                    <div className="clinic-avatar-display">🏥</div>
                    <div className="clinic-main-titles">
                        <h2>{clinicData.name}</h2>
                        <p className="specialty-sub-text">{clinicData.specialty}</p>
                        <span className="license-badge-number">{clinicData.licenseNumber}</span>
                    </div>
                    </div>
                    <div className="identity-left-side">
                    <button className="btn-edit-profile-trigger" onClick={() => setIsEditing(true)}>
                        <span className="edit-icon-pen">📝</span> تعديل البيانات
                    </button>
                    <span className="status-verified-pill">✓ معتمدة</span>
                    </div>
                </div>

                {/* قسم معلومات التواصل والعنوان */}
                <div className="clinic-info-section-box">
                    <h3 className="section-block-title">معلومات التواصل والعنوان</h3>
                    
                    <div className="info-details-row">
                    <div className="info-item-cell">
                        <span className="cell-icon">📞</span>
                        <div className="cell-text">
                        <label>رقم الهاتف</label>
                        <p dir="ltr">{clinicData.phone}</p>
                        </div>
                    </div>
                    
                    <div className="info-item-cell">
                        <span className="cell-icon">✉️</span>
                        <div className="cell-text">
                        <label>البريد الإلكتروني</label>
                        <p>{clinicData.email}</p>
                        </div>
                    </div>

                    <div className="info-item-cell">
                        <span className="cell-icon">📍</span>
                        <div className="cell-text">
                        <label>عنوان العيادة</label>
                        <p>{clinicData.address}</p>
                        </div>
                    </div>

                    <div className="info-item-cell">
                        <span className="cell-icon">📅</span>
                        <div className="cell-text">
                        <label>أيام الدوام</label>
                        <p>{clinicData.workDays}</p>
                        </div>
                    </div>

                    <div className="info-item-cell">
                        <span className="cell-icon">🕒</span>
                        <div className="cell-text">
                        <label>ساعات العمل</label>
                        <p>{clinicData.workHours}</p>
                        </div>
                    </div>

                    </div>
                </div>

                {/* قسم نبذة عن العيادة */}
                <div className="clinic-info-section-box bio-box">
                    <h3 className="section-block-title">نبذة عن العيادة</h3>
                    <p className="clinic-bio-paragraph">{clinicData.about}</p>
                </div>
                </>
            ) : (
                // ========================================================
                // وضع التعديل الكامل المستوحى من صورة image_de5ddb.png
                // ========================================================
                <form onSubmit={handleSave} className="clinic-edit-form-wrapper">
                
                <div className="form-action-sticky-bar">
                    <button type="submit" className="btn-save-changes">حفظ التغييرات</button>
                    <button type="button" className="btn-cancel-changes" onClick={handleCancel}>إلغاء</button>
                </div>

                <div className="form-avatar-upload-zone">
                    <div className="uploaded-avatar-preview">🏥</div>
                    <button type="button" className="btn-trigger-upload-img">تعديل الصورة</button>
                </div>

                {/* المجموعة الأولى: المعلومات الأساسية */}
                <div className="form-input-section-block">
                    <h3 className="section-block-title">المعلومات الأساسية</h3>
                    
                    <div className="form-grid-two-columns">
                    <div className="form-field-group">
                        <label>اسم العيادة</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="name" 
                            value={tempData.name} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">🏥</span>
                        </div>
                    </div>

                    <div className="form-field-group">
                        <label>التخصص</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="specialty" 
                            value={tempData.specialty} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">🩺</span>
                        </div>
                    </div>

                    <div className="form-field-group full-width-field">
                        <label>رقم الترخيص الطبي</label>
                        <div className="input-with-inline-icon disabled-input-style">
                        <input 
                            type="text" 
                            name="licenseNumber" 
                            value={tempData.licenseNumber} 
                            disabled 
                        />
                        <span className="inline-icon">📄</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* المجموعة الثانية: معلومات التواصل والعنوان */}
                <div className="form-input-section-block" style={{ marginTop: "30px" }}>
                    <h3 className="section-block-title">معلومات التواصل والعنوان</h3>
                    
                    <div className="form-grid-two-columns">
                    <div className="form-field-group">
                        <label>رقم الهاتف</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="phone" 
                            value={tempData.phone} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">📞</span>
                        </div>
                    </div>

                    <div className="form-field-group">
                        <label>البريد الإلكتروني</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="email" 
                            name="email" 
                            value={tempData.email} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">✉️</span>
                        </div>
                    </div>

                    <div className="form-field-group full-width-field">
                        <label>عنوان العيادة</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="address" 
                            value={tempData.address} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">📍</span>
                        </div>
                    </div>

                    <div className="form-field-group">
                        <label>أيام الدوام</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="workDays" 
                            value={tempData.workDays} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">📅</span>
                        </div>
                    </div>

                    <div className="form-field-group">
                        <label>ساعات العمل</label>
                        <div className="input-with-inline-icon">
                        <input 
                            type="text" 
                            name="workHours" 
                            value={tempData.workHours} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span className="inline-icon">🕒</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* المجموعة الثالثة: نبذة عن العيادة */}
                <div className="form-input-section-block" style={{ marginTop: "30px" }}>
                    <h3 className="section-block-title">نبذة عن العيادة</h3>
                    <div className="form-field-group full-width-field">
                    <textarea 
                        name="about" 
                        rows="4" 
                        value={tempData.about} 
                        onChange={handleInputChange}
                        required
                    ></textarea>
                    </div>
                </div>

                </form>
            )}

            </div>
        </main>
        </div>
    );
};

export default ClinicProfile;
