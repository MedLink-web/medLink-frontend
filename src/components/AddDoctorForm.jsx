import React, { useState } from "react";
import "./AddDoctorForm.css"
const AddDoctor = ({ onNavigate, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialty: "تخصص الأطفال", // القيمة الافتراضية المحددة في الـ Dropdown
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        alert("يرجى ملء كافة الحقول الإلزامية المحددة بالنجمة (*)");
        return;
        }
        onSave(formData);
    };

    return (
        <div className="dashboard-layout-root" dir="rtl">
        
        {/* 🏢 نفس القائمة الجانبية الموحدة للترابط المباشر */}
        <aside className="global-app-sidebar">
            <div className="sidebar-header-profile">
            <div className="avatar-box">🏥</div>
            <div>
                <h4>عيادة النور الطبية</h4>
                <p>لوحة التحكم</p>
            </div>
            </div>
            <nav className="sidebar-navigation-links">
            <p className="section-label">القائمة الرئيسية</p>
            <button className="nav-link-btn" onClick={() => alert("لوحة التحكم")}>📊 لوحة التحكم</button>
            <button className="nav-link-btn" onClick={() => alert("إدارة المرضى")}>👥 إدارة المرضى</button>
            <button className="nav-link-btn" onClick={() => alert("المواعيد")}>📅 المواعيد</button>
            <button className="nav-link-btn" onClick={() => alert("السجلات الطبية")}>📁 السجلات الطبية</button>
            <button className="nav-link-btn active-link" onClick={() => onNavigate("doctors-management")}>👩‍⚕️ ملف الأطباء</button>
            <button className="nav-link-btn" onClick={() => onNavigate("clinic-profile")}>🏢 ملف العيادة</button>
            </nav>
            <button className="sidebar-footer-logout" onClick={() => onNavigate("doctors-management")}>🚪 إلغاء العودة</button>
        </aside>

        {/* 📄 نموذج الإدخال الرئيسي */}
        <main className="dashboard-main-body">
            <div className="top-view-header">
            <div className="breadcrumb-trail">
                <span>لوحة التحكم</span> &gt; <span>إدارة الأطباء</span> &gt; <span className="current-path">إضافة طبيب</span>
            </div>
            </div>

            <div className="form-card-container">
            <div className="form-instruction-banner">
                إنشاء حساب جديد للطبيب وإضافته تلقائياً إلى قائمة أطباء العيادة.
            </div>

            <form onSubmit={handleSubmit} className="doctor-creation-form">
                
                <div className="form-input-group">
                <label>الاسم الكامل للطبيب<span className="required-star">*</span></label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="أدخل الاسم الرباعي للطبيب" 
                    value={formData.name}
                    onChange={handleChange}
                />
                </div>

                <div className="form-input-group">
                <label>البريد الإلكتروني<span className="required-star">*</span></label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="khaled.omari@alnour.com" 
                    value={formData.email}
                    onChange={handleChange}
                />
                </div>

                {/* حقل القائمة المنسدلة المخصص للتخصص كما في Screenshot (854).png */}
                <div className="form-input-group">
                <label>التخصص الطبي<span className="required-star">*</span></label>
                <select 
                    name="specialty" 
                    value={formData.specialty} 
                    onChange={handleChange}
                    className="styled-form-select"
                >
                    <option value="اختار تخصص العيادة">اختار تخصص العيادة</option>
                    <option value="تخصص الأطفال">تخصص الأطفال</option>
                    <option value="تخصص القلب">تخصص القلب</option>
                    <option value="طب أسنان">طب أسنان</option>
                </select>
                </div>

                <div className="form-input-group">
                <label>رقم الهاتف<span className="required-star">*</span></label>
                <input 
                    type="text" 
                    name="phone"
                    placeholder="+966 50 000 0000" 
                    value={formData.phone}
                    onChange={handleChange}
                />
                </div>

                <div className="form-input-group">
                <label>كلمة المرور<span className="required-star">*</span></label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                />
                </div>

                {/* أزرار العمليات السفلية */}
                <div className="form-action-buttons-row">
                <button type="submit" className="form-submit-blue-btn">
                    <span className="plus-icon-symbol">➕</span> إضافة طبيب
                </button>
                <button type="button" className="form-cancel-gray-btn" onClick={() => onNavigate("doctors-management")}>
                    إلغاء
                </button>
                </div>

            </form>
            </div>
        </main>
        </div>
    );
};

export default AddDoctor;