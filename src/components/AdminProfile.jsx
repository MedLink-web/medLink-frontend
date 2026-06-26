import React from "react";
import "./AdminProfile.css";

const AdminProfile = ({ admin }) => {
    return (
        <div className="admin-profile-wrapper">
        <div className="profile-header-zone">
            <h1>الملف الشخصي للمسؤول</h1>
            <p>عرض وإدارة معلومات حساب إدارة منصة Medlink</p>
        </div>

        <div className="profile-card-container">
            {/* الصورة الرمزية للمسؤول */}
            <div className="profile-avatar-section">
            <div className="avatar-circle">ر</div>
            <h2>{admin.name}</h2>
            <span className="admin-role-tag">{admin.role}</span>
            </div>

            {/* تفاصيل البيانات */}
            <div className="profile-info-grid">
            <div className="profile-info-row">
                <span className="info-label">الاسم الكامل:</span>
                <span className="info-value font-bold">{admin.name}</span>
            </div>

            <div className="profile-info-row">
                <span className="info-label">البريد الإلكتروني للإدارة:</span>
                <span className="info-value ltr-text">{admin.email}</span>
            </div>

            <div className="profile-info-row">
                <span className="info-label">رقم الهاتف:</span>
                <span className="info-value">{admin.phone}</span>
            </div>

            <div className="profile-info-row">
                <span className="info-label">تاريخ الانضمام للطاقم:</span>
                <span className="info-value">{admin.joinedDate}</span>
            </div>

            <div className="profile-info-row">
                <span className="info-label">صلاحيات الحساب:</span>
                <span className="info-value text-success">
                التحكم الكامل والقبول الفوري للطلبات
                </span>
            </div>
            </div>
        </div>
        </div>
    );
};

export default AdminProfile;
