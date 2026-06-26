import React from 'react';
import "./ClinicRequestsList.css";

const ClinicRequestsList = ({ requests, title, subtitle, isPharmacy, onViewDetails }) => {
    // حساب عدد الطلبات قيد الانتظار
    const pendingCount = requests.filter(r => r.status === 'قيد الانتظار').length;

    return (
        <div className="requests-list-wrapper">
        <div className="list-header">
            <div className="header-title-zone">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            </div>
            <div className="header-stats-zone">
            <div className="stat-badge pending">
                <span className="stat-count">{pendingCount} قيد المراجعة</span>
                <span className="stat-icon">🕒</span>
            </div>
            <div className="stat-badge total">
                <span className="stat-count">{requests.length} إجمالي الطلبات</span>
                <span className="stat-icon">📄</span>
            </div>
            </div>
        </div>

        <div className="table-responsive-container">
            <table className="custom-admin-table">
            <thead>
                <tr>
                <th>رقم الطلب</th>
                <th>{isPharmacy ? 'اسم الصيدلية' : 'اسم العيادة'}</th>
                <th>المالك</th>
                {!isPharmacy && <th>التخصص</th>}
                <th>رقم الترخيص الطبي</th>
                <th>تاريخ التقديم</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((req) => (
                <tr key={`${req.type}-${req.id}`}>
                    <td>{req.id}</td>
                    <td className="font-bold">{req.name}</td>
                    <td>{req.owner}</td>
                    {!isPharmacy && <td>{req.specialty}</td>}
                    <td>{req.license}</td>
                    <td>{req.date}</td>
                    <td>
                    <span className={`status-tag ${req.status === 'قيد الانتظار' ? 'waiting' : req.status === 'تمت الموافقة' ? 'approved' : 'rejected'}`}>
                        {req.status}
                    </span>
                    </td>
                    <td>
                    <button className="view-details-action-btn" onClick={() => onViewDetails(req)}>
                        عرض التفاصيل
                    </button>
                    </td>
                </tr>
                ))}
                {requests.length === 0 && (
                <tr>
                    <td colSpan={isPharmacy ? 7 : 8} style={{ textAlign: 'center', padding: '30px' }}>
                    لا توجد طلبات في هذا القسم حالياً
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default ClinicRequestsList;