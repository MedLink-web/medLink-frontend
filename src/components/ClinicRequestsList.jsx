import React from "react";
import "./ClinicRequestsList.css";

const ClinicRequestsList = ({ requests, onViewDetails }) => {
    const pendingCount = requests.filter(
        (r) => r.status === "قيد الانتظار",
    ).length;

    return (
        <div className="admin-view-section">
        <div className="admin-header-zone">
            <h1 className="admin-page-title">طلبات العيادات</h1>
            <p className="admin-page-subtitle">
            مراجعة وإدارة طلبات تسجيل العيادات
            </p>
        </div>

        <div className="admin-tabs-row">
            <div className="admin-tab active">
            <span>{pendingCount} قيد المراجعة</span> 🕒
            </div>
            <div className="admin-tab total">
            <span>{requests.length} إجمالي الطلبات</span> 📄
            </div>
        </div>

        <div className="admin-table-wrapper">
            <table className="admin-data-table">
            <thead>
                <tr>
                <th>رقم الطلب</th>
                <th>اسم العيادة</th>
                <th>المالك</th>
                <th>التخصص</th>
                <th>تاريخ التقديم</th>
                <th>الحالة</th>
                <th>العمليات</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((req) => (
                <tr key={req.id}>
                    <td>{req.id}</td>
                    <td className="bold-text">{req.name}</td>
                    <td>{req.owner}</td>
                    <td>{req.specialty}</td>
                    <td>{req.date}</td>
                    <td>
                    <span
                        className={`status-badge ${req.status === "تمت الموافقة" ? "approved" : "pending"}`}
                    >
                        {req.status}
                    </span>
                    </td>
                    <td>
                    <button
                        className="action-link-btn"
                        onClick={() => onViewDetails(req)}
                    >
                        عرض التفاصيل
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default ClinicRequestsList;
