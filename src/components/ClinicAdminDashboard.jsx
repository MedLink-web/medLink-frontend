import React, { useState } from "react";
import ClinicRequestsList from "./ClinicRequestsList";
import ClinicRequestDetails from "./ClinicRequestDetails";
import AdminProfile from "./AdminProfile"; // استيراد مكون الملف الشخصي الجديد
import "./ClinicAdminDashboard.css";
import logo from "../assets/logo.png"; // تأكدي أن الصورة الجديدة موجودة في المجلد


const ClinicAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("clinics"); // 'clinics' أو 'pharmacies' أو 'profile'
    const [activeView, setActiveView] = useState("list"); // 'list' أو 'details'
    const [selectedRequest, setSelectedRequest] = useState(null);

    // بيانات المسؤول (Admin Profile Data) الثابتة للواجهة
    const [adminData, setAdminData] = useState({
        name: "رنين أيوب",
        email: "admin.raneen@Medlink.ps",
        role: "مدير النظام العام (Super Admin)",
        phone: "059326598",
        joinedDate: "1/2/2026",
    });

    // مصفوفة البيانات الكاملة والموسعة (4 عيادات و 4 صيدليات) لمنع تقلص الأسطر
    const [requests, setRequests] = useState([
        // ===== طلبات قسم العيادات =====
        {
        id: "001",
        type: "clinic",
        name: "عيادة النور الطبية",
        owner: "د. أحمد الرشيدي",
        specialty: "الطب الباطني",
        license: "123456",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@alnoor-clinic.ps",
        address: "غزة ، الرمال، مقابل برج الشفاء",
        status: "قيد الانتظار",
        },
        {
        id: "002",
        type: "clinic",
        name: "عيادة الأمل للأطفال",
        owner: "د. ميساء علي",
        specialty: "تخصص الأطفال",
        license: "654321",
        date: "4/6/2026",
        phone: "059912345",
        email: "hope@child-care.ps",
        address: "خانيونس، شارع البحر",
        status: "قيد الانتظار",
        },
        {
        id: "003",
        type: "clinic",
        name: "عيادة الشفاء للقلب",
        owner: "د. كمال النجار",
        specialty: "تخصص القلب",
        license: "987654",
        date: "5/6/2026",
        phone: "059298765",
        email: "shifa@cardio.ps",
        address: "غزة، الساحة، بجانب بلدية غزة",
        status: "قيد الانتظار",
        },
        {
        id: "004",
        type: "clinic",
        name: "عيادة السرايا الطبية",
        owner: "د. أحمد الرشيدي",
        specialty: "الطب الباطني",
        license: "12356",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@alnoor-clinic.ps",
        address: "غزة ، الرمال، مقابل برج الشفاء",
        status: "قيد الانتظار",
        },

        // ===== طلبات قسم الصيدليات =====
        {
        id: "001",
        type: "pharmacy",
        name: "صيدلية عادل",
        owner: "أحمد محمد",
        license: "123456",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@aldawa-rx.sa",
        address: "غزة , الساحة , مقابل بلدية غزة",
        status: "قيد الانتظار",
        },
        {
        id: "002",
        type: "pharmacy",
        name: "صيدلية صلاح الدين",
        owner: "د. أحمد الرشيدي",
        license: "123456",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@alnoor-clinic.ps",
        address: "غزة، الساحة، مقابل بلدية غزة",
        status: "قيد الانتظار",
        },
        {
        id: "003",
        type: "pharmacy",
        name: "صيدلية النور",
        owner: "د. أحمد الرشيدي",
        license: "123456",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@alnoor-clinic.ps",
        address: "غزة، الساحة، مقابل بلدية غزة",
        status: "قيد الانتظار",
        },
        {
        id: "004",
        type: "pharmacy",
        name: "صيدلية السرايا",
        owner: "د. أحمد الرشيدي",
        license: "12356",
        date: "3/6/2026",
        phone: "059326598",
        email: "contact@alnoor-clinic.ps",
        address: "غزة، الساحة، مقابل بلدية غزة",
        status: "قيد الانتظار",
        },
    ]);

    // تصفية الطلبات بناءً على التبويب النشط
    const filteredRequests = requests.filter(
        (req) => req.type === (activeTab === "clinics" ? "clinic" : "pharmacy"),
    );

    const handleViewDetails = (req) => {
        setSelectedRequest(req);
        setActiveView("details");
    };

    const handleUpdateStatus = (id, type, newStatus, rejectionReason = '') => {
            // 1. تحديث حالة الطلب في المصفوفة الأساسية للمشروع
            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === id && req.type === type ? { ...req, status: newStatus } : req
                )
            );

            // 2. إيجاد بيانات الطلب الحالي لإرسال الإيميل له
            const targetRequest = requests.find(req => req.id === id && req.type === type);
            if (!targetRequest) return;

            // 3. منطق إرسال الإيميلات الافتراضي (Simulated Email Service)
            if (newStatus === 'تمت الموافقة') {
                console.log(`%c 📨 إشعار بريدي: تم إرسال إيميل تفعيل إلى (${targetRequest.email}) لانضمام [${targetRequest.name}] بنجاح!`, 'color: #008f68; font-weight: bold;');
            } 
            else if (newStatus === 'مرفوض') {
                console.log(`
        ==================================================
        📬 [MediLink Email Service]
        إلى: ${targetRequest.email}
        الموضوع: تحديث بشأن طلب انضمامكم إلى منصة MediLink

        مرحباً ${targetRequest.owner}،
        نأسف لإبلاغكم بأنه تم رفض طلب انضمام [${targetRequest.name}] إلى منصتنا بعد المراجعة.

        ملاحظة الإدارة وسبب الرفض:
        " ${rejectionReason} "

        إذا كان بإمكانكم تعديل المتطلبات المذكورة أعلاه، يسعدنا إعادة تقديمكم للطلب مرة أخرى.
        ==================================================
                `);
                
                // تنبيه سريع يظهر للمسؤول على الشاشة لتأكيد إرسال الإيميل تلقائياً
                alert(`تم رفض الطلب بنجاح، وتم إرسال بريد إلكتروني توضيحي إلى: ${targetRequest.email}`);
            }
        };

    return (
        <div className="admin-dashboard-container" dir="rtl">
        {/* القائمة الجانبية - Sidebar */}
        <div className="admin-sidebar">
            <div className="brand-logo">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            <h2>Medlink</h2>
            
            </div>
            <nav className="sidebar-menu">
            <button
                className={`menu-item ${activeTab === "clinics" ? "active" : ""}`}
                onClick={() => {
                setActiveTab("clinics");
                setActiveView("list");
                }}
            >
                <span className="icon">🏥</span> قسم العيادات
            </button>
            <button
                className={`menu-item ${activeTab === "pharmacies" ? "active" : ""}`}
                onClick={() => {
                setActiveTab("pharmacies");
                setActiveView("list");
                }}
            >
                <span className="icon">💊</span> قسم الصيدليات
            </button>
            <button
                className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => {
                setActiveTab("profile");
                }}
            >
                <span className="icon">👤</span> الملف الشخصي
            </button>
            </nav>
            <div className="sidebar-footer">
            <button className="logout-btn">
                <span className="icon">🚪</span> تسجيل الخروج
            </button>
            </div>
        </div>

        {/* المحتوى الرئيسي المتغير */}
        <div className="admin-main-content">
            {activeTab === "profile" ? (
            <AdminProfile admin={adminData} />
            ) : activeView === "list" ? (
            <ClinicRequestsList
                requests={filteredRequests}
                title={
                activeTab === "clinics" ? "طلبات العيادات" : "طلبات الصيدلية"
                }
                subtitle={
                activeTab === "clinics"
                    ? "مراجعة وإدارة طلبات تسجيل العيادات"
                    : "مراجعة وإدارة طلبات تسجيل الصيدلية"
                }
                isPharmacy={activeTab === "pharmacies"}
                onViewDetails={handleViewDetails}
            />
            ) : (
            <ClinicRequestDetails
                request={selectedRequest}
                onBack={() => setActiveView("list")}
                onStatusUpdate={handleUpdateStatus}
            />
            )}
        </div>
        </div>
    );
};

export default ClinicAdminDashboard;
