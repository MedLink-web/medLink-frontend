import React, { useState, useEffect } from "react";
import ClinicRequestsList from "./ClinicRequestsList";
import ClinicRequestDetails from "./ClinicRequestDetails";
import "./ClinicAdminDashboard.css";
import logo from "../assets/logo.png";

const ClinicAdminDashboard = ({ onNavigate }) => {
  const [view, setView] = useState("list");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("auth_token");

  // ─── جلب الطلبات من API ───────────────────────
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/clinic-requests/all",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // نحول البيانات لنفس شكل الـ static data القديم
        const formatted = data.data.map((req) => ({
          id: req.id,
          name: req.clinic_name,
          owner: "—",
          specialty: req.specialty,
          license: req.license_number,
          date: new Date(req.created_at).toLocaleDateString("ar-EG"),
          phone: req.clinic_phone,
          email: req.clinic_email,
          address: req.clinic_address,
          status:
            req.status === "pending"
              ? "قيد الانتظار"
              : req.status === "approved"
                ? "تمت الموافقة"
                : "مرفوض",
        }));
        setRequests(formatted);
      } else if (response.status === 401) {
        onNavigate && onNavigate("login");
      } else {
        setError("فشل تحميل الطلبات");
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setView("details");
    setSuccessStatus(false);
  };

  if (isLoading) {
    return (
      <div
        className="admin-dashboard-layout"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout" dir="rtl">
      {/* القائمة الجانبية */}
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
        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            onNavigate && onNavigate("home");
          }}
        >
          <span>تسجيل الخروج</span> ↪️
        </button>
      </aside>

      {/* منطقة المحتوى */}
      <main className="admin-main-content">
        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fed7d7",
              color: "#c53030",
              padding: "12px",
              borderRadius: "8px",
              margin: "20px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {view === "list" ? (
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
            onBack={() => {
              setView("list");
              fetchRequests(); // نحدث القائمة بعد الرجوع
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ClinicAdminDashboard;
