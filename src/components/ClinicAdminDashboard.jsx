// ClinicAdminDashboard.jsx
import React, { useState } from 'react';
 // تأكدي أن الصورة الجديدة موجودة في المجلد
import ClinicRequestsList from './ClinicRequestsList';
import ClinicRequestDetails from './ClinicRequestDetails';
import './ClinicAdminDashboard.css';
import logo from "../assets/logo.png";
const ClinicAdminDashboard = () => {
    const [view, setView] = useState('list'); // 'list' أو 'details'
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [successStatus, setSuccessStatus] = useState(false);

    // البيانات المشتركة لطلبات العيادات
    const [requests, setRequests] = useState([
        { id: '001', name: 'عيادة النور الطبية', owner: 'د. أحمد الرشيدي', specialty: 'الطب الباطني', license: '123456', date: '3/6/2026', phone: '059326598', email: 'contact@alnoor-clinic.ps', address: 'غزة، الرمال، مقابل برج الشفاء', status: 'قيد الانتظار' },
        { id: '002', name: 'عيادة الأمل للأطفال', owner: 'د. ميساء علي', specialty: 'تخصص الأطفال', license: '654321', date: '4/6/2026', phone: '059912345', email: 'hope@child-care.ps', address: 'خانيونس، شارع البحر', status: 'قيد الانتظار' },
        { id: '003', name: 'عيادة الشفاء للقلب', owner: 'د. كمال النجار', specialty: 'تخصص القلب', license: '987654', date: '5/6/2026', phone: '059298765', email: 'shifa@cardio.ps', address: 'غزة، الساحة، بجانب بلدية غزة', status: 'قيد الانتظار' },
        { 
        id: '004', name: 'عيادة الشفاء للأطفال والرضع', owner: 'د. خالد صيام', specialty: 'طب الأطفال وحديثي الولادة', license: '332211', date: '24/6/2026', phone: '0592778899', 
        email: 'shifa.kids@medilink.ps', address: 'غزة، النصر، بجانب مستشفى النصر للأطفال', 
        status: 'قيد الانتظار' 
        },
        { 
        id: '005', name: 'مجمع الياسمين الطبي التخصصي', owner: 'د. رانيا منصور', 
        specialty: 'الطب الباطني والغدد الصماء', license: '556677', date: '25/6/2026', 
        phone: '0597334455', email: 'yasmin.center@medilink.ps', 
        address: 'غزة، الساحة، بجانب بلدية غزة', status: 'قيد الانتظار' 
        }
    ]);

    const handleViewDetails = (req) => {
        setSelectedRequest(req);
        setView('details');
        setSuccessStatus(false);
    };

    return (
        <div className="admin-dashboard-layout" dir="rtl">
        {/* القائمة الجانبية الموحدة */}
        <aside className="admin-sidebar">
            <div className="admin-brand">
            <span className="admin-logo-text">MedLink</span>
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            </div>
            <nav className="admin-nav-menu">
            <button className="admin-nav-item active">🏢 قسم العيادات</button>
            <button className="admin-nav-item">💊 قسم الصيدليات</button>
            <button className="admin-nav-item">👤 الملف الشخصي</button>
            </nav>
            <button className="admin-logout-btn">
            <span>تسجيل الخروج</span> ↪️
            </button>
        </aside>

        {/* منطقة عرض الواجهات المفصلة */}
        <main className="admin-main-content">
            {view === 'list' ? (
            <ClinicRequestsList 
                requests={requests} 
                onViewDetails={handleViewDetails} 
            />
            ) : (
            <ClinicRequestDetails 
                selectedRequest={selectedRequest}
                requests={requests}
                setRequests={setRequests}
                successStatus={successStatus}
                setSuccessStatus={setSuccessStatus}
                onBack={() => setView('list')}
            />
            )}
        </main>
        </div>
    );
};

export default ClinicAdminDashboard;