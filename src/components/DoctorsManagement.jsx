import React, { useState } from "react";
import "./DoctorsManagement.css";

const DoctorsManagement = ({ onNavigate, doctors, onDelete, showToast }) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    // 🆕 حالات التحكم في نافذة التأكيد المنبثقة
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);

    // تصفية الأطباء بناءً على البحث
    const filteredDoctors = doctors.filter((doc) =>
        doc.name.includes(searchTerm) || doc.specialty.includes(searchTerm)
    );

    // 🆕 فتح نافذة التأكيد وتحديد الطبيب المستهدف
    const triggerDeleteConfirmation = (doctor) => {
        setDoctorToDelete(doctor);
        setIsDeleteModalOpen(true);
    };

    // 🆕 تأكيد الحذف الفعلي
    const confirmDelete = () => {
        if (doctorToDelete) {
        onDelete(doctorToDelete.id);
        setIsDeleteModalOpen(false);
        setDoctorToDelete(null);
        }
    };

    // 🆕 إلغاء الحذف وإغلاق النافذة
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDoctorToDelete(null);
    };

    return (
        <div className="clinic-dashboard-layout" dir="rtl">
        {/* القائمة الجانبية (Sidebar) */}
        <aside className="clinic-sidebar">
            <div className="sidebar-brand">
            <div className="brand-logo-icon">🩺</div>
            <div className="brand-text-wrapper">
                <h3>عيادة النور الطبية</h3>
                <p>لوحة التحكم</p>
            </div>
            </div>
            
            <nav className="sidebar-menu-items">
            <p className="menu-section-title">القائمة الرئيسية</p>
            <button className="menu-item-btn" onClick={() => onNavigate("admin-dashboard")}>
                <span className="menu-icon">📊</span> لوحة التحكم
            </button>
            <button className="menu-item-btn active-tab-item">
                <span className="menu-icon">👩‍⚕️</span> إدارة الأطباء
            </button>
            <button className="menu-item-btn" onClick={() => alert("المواعيد")}>
                <span className="menu-icon">📅</span> المواعيد
            </button>
            <button className="menu-item-btn" onClick={() => alert("السجلات الطبية")}>
                <span className="menu-icon">📁</span> السجلات الطبية
            </button>
            <button className="menu-item-btn" onClick={() => onNavigate("clinic-profile")}>
                <span className="menu-icon">🏢</span> ملف العيادة
            </button>
            </nav>

            <button className="sidebar-logout-btn" onClick={() => onNavigate("home")}>
            <span className="logout-icon">🚪</span> تسجيل الخروج
            </button>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="clinic-main-content">
            {/* إشعار النجاح عند إضافة طبيب */}
            {showToast && (
            <div className="success-toast-banner-top">
                <span className="toast-text-message">تم إضافة الطبيب بنجاح</span>
                <div className="toast-check-circle">✓</div>
            </div>
            )}

            <div className="content-top-navigation-bar">
            <div className="breadcrumb-links">
                <span>لوحة التحكم</span> &gt; <span className="active-path">إدارة الأطباء</span>
            </div>
            <button className="edit-profile-action-btn" onClick={() => onNavigate("add-doctor")}>
                ➕ إضافة طبيب
            </button>
            </div>

            {/* كروت الإحصائيات السريعة */}
            <div className="stats-cards-grid-wrapper" style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
            <div className="profile-details-view-card" style={{ flex: 1, textAlign: "center" }}>
                <h3>إجمالي الأطباء</h3>
                <h2>{doctors.length}</h2>
            </div>
            <div className="profile-details-view-card" style={{ flex: 1, textAlign: "center" }}>
                <h3>الأطباء النشطون</h3>
                <h2>{doctors.filter(d => d.status === "نشط").length}</h2>
            </div>
            <div className="profile-details-view-card" style={{ flex: 1, textAlign: "center" }}>
                <h3>إجمالي المرضى</h3>
                <h2>734</h2>
            </div>
            </div>

            {/* شريط البحث */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
            <input
                type="text"
                placeholder="🔍 بحث بالاسم أو التخصص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #cbd5e0" }}
            />
            </div>

            {/* جدول الأطباء */}
            <div className="profile-details-view-card" style={{ padding: "0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                <thead>
                <tr style={{ backgroundColor: "#f7fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "16px" }}>الطبيب</th>
                    <th style={{ padding: "16px" }}>التواصل</th>
                    <th style={{ padding: "16px" }}>المرضى</th>
                    <th style={{ padding: "16px" }}>التقييم</th>
                    <th style={{ padding: "16px" }}>الحالة</th>
                    <th style={{ padding: "16px" }}>إجراءات</th>
                </tr>
                </thead>
                <tbody>
                {filteredDoctors.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                    <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "700", color: "#2d3748" }}>{doc.name}</div>
                        <div style={{ fontSize: "12px", color: "#718096" }}>{doc.specialty}</div>
                    </td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "#4a5568" }}>
                        <div>{doc.email}</div>
                        <div style={{ color: "#a0aec0" }}>{doc.phone}</div>
                    </td>
                    <td style={{ padding: "16px" }}>{doc.patients}</td>
                    <td style={{ padding: "16px", color: "#dd6b20", fontWeight: "700" }}>⭐ {doc.rating}</td>
                    <td style={{ padding: "16px" }}>
                        <span style={{
                        backgroundColor: doc.status === "نشط" ? "#c6f6d5" : "#fed7d7",
                        color: doc.status === "نشط" ? "#22543d" : "#742a2a",
                        padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700"
                        }}>
                        {doc.status}
                        </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                        {/* 🗑️ تعديل الزر ليستدعي نافذة التأكيد بدلاً من الحذف الفوري */}
                        <button 
                        onClick={() => triggerDeleteConfirmation(doc)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
                        >
                        🗑️
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 🆕 شاشة التأكيد الصغيرة المنبثقة (Delete Confirmation Modal) */}
            {isDeleteModalOpen && (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex",
                alignItems: "center", justifyContent: "center", zIndex: 1000
            }}>
                <div style={{
                backgroundColor: "white", padding: "30px", borderRadius: "12px",
                width: "400px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}>
                <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚠️</div>
                <h3 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>تأكيد حذف الطبيب</h3>
                <p style={{ color: "#718096", fontSize: "14px", marginBottom: "25px" }}>
                    هل أنت متأكد من رغبتك في حذف <strong>{doctorToDelete?.name}</strong> من قائمة أطباء العيادة؟
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button 
                    onClick={confirmDelete}
                    style={{
                        backgroundColor: "#e53e3e", color: "white", border: "none",
                        padding: "10px 24px", borderRadius: "6px", fontWeight: "700", cursor: "pointer"
                    }}
                    >
                    نعم، احذف
                    </button>
                    <button 
                    onClick={cancelDelete}
                    style={{
                        backgroundColor: "#e2e8f0", color: "#4a5568", border: "none",
                        padding: "10px 24px", borderRadius: "6px", fontWeight: "700", cursor: "pointer"
                    }}
                    >
                    إلغاء
                    </button>
                </div>
                </div>
            </div>
            )}
        </main>
        </div>
    );
};

export default DoctorsManagement;