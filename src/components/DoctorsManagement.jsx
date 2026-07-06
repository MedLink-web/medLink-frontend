import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./DoctorsManagement.css";

const DoctorsManagement = ({ onNavigate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // 🌟 States الجديدة لإدارة نافذة تأكيد حذف الطبيب الممركّزة
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    // خمسة أطباء ببيانات مختلفة ومتنوعة لتطابق متطلباتك
    const [doctors, setDoctors] = useState([
        { id: 1, name: "د. خالد العمري", specialty: "طب أسنان", email: "khaled.omari@alnour.com", phone: "+966 50 111 2233", patients: 148, rating: 4.9, status: "نشط" },
        { id: 2, name: "د. سارة الأحمد", specialty: "تخصص الأطفال", email: "sara.ahmed@alnour.com", phone: "+966 50 222 3344", patients: 210, rating: 4.8, status: "نشط" },
        { id: 3, name: "د. عمر الفيصل", specialty: "تخصص القلب", email: "omar.faisal@alnour.com", phone: "+966 50 333 4455", patients: 95, rating: 4.7, status: "نشط" },
        { id: 4, name: "د. ليلى القحطاني", specialty: "طب أسنان", email: "layla.q@alnour.com", phone: "+966 50 444 5566", patients: 162, rating: 4.9, status: "نشط" },
        { id: 5, name: "د. محمد الشمري", specialty: "تخصص الأطفال", email: "mohammed.sh@alnour.com", phone: "+966 50 555 6677", patients: 119, rating: 4.6, status: "نشط" }
    ]);

    // حالة الفورم الجديد
    const [newDoctor, setNewDoctor] = useState({
        name: "",
        email: "",
        specialty: "اختيار تخصص العيادة",
        phone: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({ ...newDoctor, [name]: value });
    };

    const handleAddDoctorSubmit = (e) => {
        e.preventDefault();
        const doctorObj = {
            id: Date.now(),
            name: newDoctor.name,
            specialty: newDoctor.specialty,
            email: newDoctor.email,
            phone: newDoctor.phone,
            patients: 0,
            rating: 5.0,
            status: "نشط"
        };

        setDoctors([doctorObj, ...doctors]);
        setIsAdding(false);
        setNewDoctor({ name: "", email: "", specialty: "اختيار تخصص العيادة", phone: "", password: "" });
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // 🌟 فتح نافذة الحذف المتمركزة وحفظ الـ id المستهدف
    const handleDeleteClick = (id) => {
        setSelectedDoctorId(id);
        setIsDeleteConfirmOpen(true);
    };

    // 🌟 تنفيذ الحذف الفعلي من داخل الكرت الممركّز وسط الشاشة
    const handleConfirmDelete = () => {
        setDoctors(doctors.filter(doc => doc.id !== selectedDoctorId));
        setIsDeleteConfirmOpen(false);
        setSelectedDoctorId(null);
        
        // إظهار توست التحديث بنجاح
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // تصفية الأطباء بناءً على البحث
    const filteredDoctors = doctors.filter(doc =>
        doc.name.includes(searchQuery) || doc.specialty.includes(searchQuery)
    );

    return (
        <div className="clinic-dashboard-root" dir="rtl">
        
        {showToast && (
            <div className="clinic-success-toast animate-toast">
                <span className="toast-check-icon">✓</span>
                <span className="toast-text">تم حفظ التغييرات بنجاح</span>
            </div>
        )}

        {/* الشريط الجانبي (Sidebar) */}
        <aside className="clinic-sidebar">
            <div className="sidebar-brand-section">
                <img src={logo} alt="Medlink" className="sidebar-logo-img" />
                <div className="sidebar-brand-text">
                    <h4>عيادة النور الطبية</h4>
                    <span className="sidebar-user-role">لوحة التحكم</span>
                </div>
            </div>
            <nav className="sidebar-menu-links">
                <div className="menu-group-label">القائمة الرئيسية</div>
                <ul>
                    <li onClick={() => onNavigate("clinic-profile")}>📂 ملف العيادة</li>
                    <li className="menu-item-active" onClick={() => onNavigate("doctors-management")}>👥 إدارة الأطباء</li>
                    <li onClick={() => onNavigate("clinic-appointments")}>📅 المواعيد</li>
                    <li onClick={() => onNavigate && onNavigate("patients-management")}>
                        <span className="menu-icon">💊</span> إدارة حجوزات المرضى
                    </li>
                </ul>
            </nav>
            <div className="sidebar-logout-footer" onClick={() => onNavigate("login")}>🚪 تسجيل الخروج</div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="clinic-main-content">
            <header className="content-top-header">
                <div className="breadcrumb-trail">
                    <span>لوحة التحكم</span>
                    <span className="trail-arrow">&gt;</span>
                    <span className="trail-current">إدارة الأطباء</span>
                    {isAdding && (
                        <>
                            <span className="trail-arrow">&gt;</span>
                            <span className="trail-current-sub">إضافة طبيب</span>
                        </>
                    )}
                </div>
            </header>

            {!isAdding ? (
            <>
                <div className="doctors-header-actions">
                    <button className="btn-add-doctor-trigger" onClick={() => setIsAdding(true)}>
                        <span>+</span> إضافة طبيب
                    </button>
                </div>

                {/* الكروت الإحصائية الثلاثية */}
                <div className="stats-cards-grid">
                    <div className="stat-item-card">
                        <span className="stat-num">{doctors.length}</span>
                        <span className="stat-lbl">إجمالي الأطباء</span>
                    </div>
                    <div className="stat-item-card">
                        <span className="stat-num">{doctors.filter(d => d.status === "نشط").length}</span>
                        <span className="stat-lbl">الأطباء النشطون</span>
                    </div>
                    <div className="stat-item-card">
                        <span className="stat-num">734</span>
                        <span className="stat-lbl">إجمالي المرضى</span>
                    </div>
                </div>

                {/* حقل البحث المقابل للتصميم */}
                <div className="search-filter-wrapper">
                    <span className="search-count-badge">{filteredDoctors.length} من {doctors.length}</span>
                    <div className="search-input-container">
                        <input 
                            type="text" 
                            placeholder="بحث بالاسم أو تخصص" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="search-icon-lens">🔍</span>
                    </div>
                </div>

                {/* جدول الأطباء */}
                <div className="doctors-table-container">
                    <table className="doctors-data-table">
                        <thead>
                            <tr>
                                <th>الطبيب</th>
                                <th>التواصل</th>
                                <th>المرضى</th>
                                <th>التقييم</th>
                                <th>الحالة</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map((doc) => (
                                <tr key={doc.id}>
                                    <td>
                                        <div className="table-doctor-profile">
                                            <div className="doc-avatar-circle">👤</div>
                                            <div>
                                                <div className="doc-table-name">{doc.name}</div>
                                                <div className="doc-table-spec">{doc.specialty}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="doc-table-contact" dir="ltr">
                                            <div>{doc.email}</div>
                                            <div className="phone-sub-text">{doc.phone}</div>
                                        </div>
                                    </td>
                                    <td className="bold-table-cell">{doc.patients}</td>
                                    <td>
                                        <span className="rating-star-badge">⭐ {doc.rating}</span>
                                    </td>
                                    <td>
                                        <span className="status-pill-active">• {doc.status}</span>
                                    </td>
                                    <td>
                                        {/* استدعاء نافذة التأكيد المحدثة */}
                                        <button className="btn-delete-action" onClick={() => handleDeleteClick(doc.id)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
            ) : (
            /* فورم إضافة طبيب جديد */
            <div className="clinic-profile-card-container">
                <div className="clinic-edit-form-wrapper">
                    <h3 className="form-welcome-title-center">إنشاء حساب جديد للطبيب وإضافته تلقائياً إلى قائمة أطباء العيادة.</h3>
                    
                    <form onSubmit={handleAddDoctorSubmit} className="doctors-input-form">
                        <div className="form-field-group">
                            <label>الاسم الكامل للطبيب*</label>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="أدخل الاسم الكامل"
                                value={newDoctor.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-field-group">
                            <label>البريد الإلكتروني*</label>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="khaled.omari@alnour.com"
                                value={newDoctor.email}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-field-group">
                            <label>التخصص الطبي*</label>
                            <div className="select-dropdown-wrapper">
                                <select 
                                    name="specialty" 
                                    value={newDoctor.specialty} 
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="اختيار تخصص العيادة" disabled>اختيار تخصص العيادة</option>
                                    <option value="طب أسنان">طب أسنان</option>
                                    <option value="تخصص الأطفال">تخصص الأطفال</option>
                                    <option value="تخصص القلب">تخصص القلب</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-field-group">
                            <label>رقم الهاتف*</label>
                            <input 
                                type="text" 
                                name="phone"
                                placeholder="أدخل رقم الهاتف"
                                value={newDoctor.phone}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-field-group">
                            <label>كلمة المرور*</label>
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••"
                                value={newDoctor.password}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-buttons-action-row-center">
                            <button type="submit" className="btn-submit-add-doc">
                                👥 إضافة طبيب
                            </button>
                            <button type="button" className="btn-cancel-add-doc" onClick={() => setIsAdding(false)}>
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            )}
        </main>

        {/* 🌟 نافذة تأكيد حذف الطبيب الممركّزة المتناسقة بالكامل */}
        {isDeleteConfirmOpen && (
            <div className="doctors-delete-overlay">
                <div className="doctors-delete-modal-card">
                    <div className="doctors-delete-icon">⚠️</div>
                    <h3>تأكيد حذف الطبيب</h3>
                    <p>هل أنتِ متأكدة من إزالة هذا الطبيب نهائياً من العيادة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                    
                    <div className="doctors-delete-actions">
                        <button className="btn-doctors-danger" onClick={handleConfirmDelete}>
                            نعم، احذفه
                        </button>
                        <button className="btn-doctors-cancel" onClick={() => setIsDeleteConfirmOpen(false)}>
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        )}

        </div>
    );
};

export default DoctorsManagement;
