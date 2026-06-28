import React, { useState } from "react";
import "./ClinicProfile.css";

const ClinicProfile = ({ onNavigate }) => {
    // تتبع وضع الشاشة: "view" للعرض أو "edit" للتعديل
        const [mode, setMode] = useState("view");
        const [showSuccess, setShowSuccess] = useState(false);

        // بيانات العيادة الافتراضية
        const [clinicData, setClinicData] = useState({
            name: "عيادة النور الطبية",
            specialty: "طب الأسنان والتجميل",
            license: "SA-2024-MED-00471",
            phone: "+966 11 234 5678",
            email: "info@alnour-clinic.com",
            website: "infogalnour-clinic.com",
            days: "الأحد - الخميس",
            hours: "09:00 ص - 09:00 م",
            about: "عيادة متخصصة في طب الأسنان وتجميلها، نقدم أحدث التقنيات والخدمات في بيئة طبية معتمدة، بكادر طبي متخصص وذو خبرة تفوق 15 عاماً."
        });

        const [tempData, setTempData] = useState({ ...clinicData });

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setTempData(prev => ({ ...prev, [name]: value }));
        };

        const handleSave = (e) => {
            e.preventDefault();
            setClinicData({ ...tempData });
            setMode("view");
            
            // إظهار بانر "تم حفظ التغييرات بنجاح"
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        };

        return (
            <div className="clinic-dashboard-layout" dir="rtl">
            
            {/* القائمة الجانبية الموحدة (Sidebar) */}
            <aside className="clinic-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-logo-icon">🩺</div>
                    <div className="brand-text-wrapper">
                        <h3>{clinicData.name}</h3>
                        <p>لوحة التحكم</p>
                    </div>
                </div>
                
                <nav className="sidebar-menu-items">
                    <p className="menu-section-title">القائمة الرئيسية</p>
                    <button className="menu-item-btn" onClick={() => onNavigate("admin-dashboard")}>
                        <span className="menu-icon">📊</span> لوحة التحكم
                    </button>
                    
                    {/* زر إدارة الأطباء الموجه إلى الشاشة المحددة في App.jsx */}
                    <button className="menu-item-btn" onClick={() => onNavigate("doctors-management")}>
                        <span className="menu-icon">👩‍⚕️</span> إدارة الأطباء
                    </button>
                    
                    <button className="menu-item-btn" onClick={() => alert("المواعيد")}>
                        <span className="menu-icon">📅</span> المواعيد
                    </button>
                    <button className="menu-item-btn" onClick={() => alert("السجلات الطبية")}>
                        <span className="menu-icon">📁</span> السجلات الطبية
                    </button>
                    <button className="menu-item-btn active-tab-item">
                        <span className="menu-icon">🏢</span> ملف العيادة
                    </button>
                </nav>

                <button className="sidebar-logout-btn" onClick={() => onNavigate("home")}>
                    <span className="logout-icon">🚪</span> تسجيل الخروج
                </button>
            </aside>

            {/* المحتوى المتغير للعيادة */}
            <main className="clinic-main-content">
                
                {/* بانر النجاح الأخضر عند الحفظ */}
                {showSuccess && (
                    <div className="success-toast-banner-top">
                        <span className="toast-text-message">تم حفظ التغييرات بنجاح</span>
                        <div className="toast-check-circle">✓</div>
                    </div>
                )}

                {/* شريط المسار العلوي */}
                <div className="content-top-navigation-bar">
                    <div className="breadcrumb-links">
                        <span>لوحة التحكم</span> &gt; <span>ملف العيادة</span>
                        {mode === "edit" && <span className="active-path"> &gt; تعديل بيانات العيادة</span>}
                    </div>
                    
                    {mode === "view" ? (
                        <button className="edit-profile-action-btn" onClick={() => { setTempData({...clinicData}); setMode("edit"); }}>
                            📝 تعديل البيانات
                        </button>
                    ) : (
                        <div className="form-edit-actions">
                            <button className="save-changes-blue-btn" onClick={handleSave}>حفظ التغييرات</button>
                            <button className="cancel-edit-gray-btn" onClick={() => setMode("view")}>إلغاء</button>
                        </div>
                    )}
                </div>

                {/* عرض البيانات (Mode: View) */}
                {mode === "view" ? (
                    <div className="profile-details-view-card">
                        
                        <div className="clinic-main-intro-row">
                            <div className="clinic-avatar-placeholder">🏥</div>
                            <div className="clinic-intro-meta">
                                <h2>{clinicData.name}</h2>
                                <p className="specialty-badge-text">{clinicData.specialty}</p>
                                <span className="license-number-tag">{clinicData.license} <span className="verified-status-badge">✓ معتمدة</span></span>
                            </div>
                        </div>

                        <div className="info-sections-grid-wrapper">
                            <h3 className="section-grid-title">معلومات التواصل والعنوان</h3>
                            <div className="info-detail-row">
                                <span className="info-row-label">📞 رقم الهاتف:</span>
                                <span className="info-row-value">{clinicData.phone}</span>
                            </div>
                            <div className="info-detail-row">
                                <span className="info-row-label">✉️ البريد الإلكتروني:</span>
                                <span className="info-row-value">{clinicData.email}</span>
                            </div>
                            <div className="info-detail-row">
                                <span className="info-row-label">📍 عنوان العيادة:</span>
                                <span className="info-row-value">{clinicData.website}</span>
                            </div>
                            <div className="info-detail-row">
                                <span className="info-row-label">📅 أيام الدوام:</span>
                                <span className="info-row-value">{clinicData.days}</span>
                            </div>
                            <div className="info-detail-row">
                                <span className="info-row-label">🕒 ساعات العمل:</span>
                                <span className="info-row-value">{clinicData.hours}</span>
                            </div>
                        </div>

                        <div className="about-section-block-box">
                            <h3>📝 نبذة عن العيادة</h3>
                            <p>{clinicData.about}</p>
                        </div>

                    </div>
                ) : (
                    /* نموذج التعديل (Mode: Edit) */
                    <form className="profile-edit-form-container" onSubmit={handleSave}>
                        
                        <div className="edit-image-upload-section">
                            <div className="current-logo-preview">🏥</div>
                            <button type="button" className="change-photo-trigger-btn">تعديل الصورة</button>
                        </div>

                        <fieldset className="form-fields-group-wrapper">
                            <legend>المعلومات الأساسية</legend>
                            
                            <div className="input-field-block">
                                <label>اسم العيادة</label>
                                <input type="text" name="name" value={tempData.name} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>التخصص</label>
                                <input type="text" name="specialty" value={tempData.specialty} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>رقم الترخيص الطبي</label>
                                <input type="text" name="license" value={tempData.license} onChange={handleInputChange} />
                            </div>
                        </fieldset>

                        <fieldset className="form-fields-group-wrapper">
                            <legend>معلومات التواصل والعنوان</legend>

                            <div className="input-field-block">
                                <label>رقم الهاتف</label>
                                <input type="text" name="phone" value={tempData.phone} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>البريد الإلكتروني</label>
                                <input type="email" name="email" value={tempData.email} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>عنوان العيادة</label>
                                <input type="text" name="website" value={tempData.website} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>أيام الدوام</label>
                                <input type="text" name="days" value={tempData.days} onChange={handleInputChange} />
                            </div>

                            <div className="input-field-block">
                                <label>ساعات العمل</label>
                                <input type="text" name="hours" value={tempData.hours} onChange={handleInputChange} />
                            </div>
                        </fieldset>

                        <fieldset className="form-fields-group-wrapper">
                            <legend>نبذة عن العيادة</legend>
                            <div className="input-field-block">
                                <textarea name="about" rows="4" value={tempData.about} onChange={handleInputChange}></textarea>
                            </div>
                        </fieldset>

                    </form>
                )}

            </main>
            </div>
        );
};

export default ClinicProfile;