import React, { useState, useEffect } from "react";
import ClinicRequestsList from "./ClinicRequestsList";
import ClinicRequestDetails from "./ClinicRequestDetails";
import AdminProfile from "./AdminProfile";
import "./ClinicAdminDashboard.css";
import logo from "../assets/logo.png";

const ClinicAdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("clinics");
  const [activeView, setActiveView] = useState("list");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const [clinicRequests, setClinicRequests] = useState([]);
  const [pharmacyRequests, setPharmacyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [adminData] = useState({
    name: storedUser.full_name || "Admin",
    email: storedUser.email || "raninAdmin@gmailcom",
    role: "مدير النظام العام (Super Admin)",
    phone: storedUser.phone || "0593458957",
    joinedDate: "20/6/2026",
  });

  const getToken = () => localStorage.getItem("auth_token");

  // ─── جلب كل الطلبات ───────────────────────────
  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setIsLoading(true);
    try {
      const [clinicRes, pharmacyRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/clinic-requests/all", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }),
        fetch("http://127.0.0.1:8000/api/admin/pharmacy-requests", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }),
      ]);

      const clinicData = await clinicRes.json();
      const pharmacyData = await pharmacyRes.json();

      if (clinicRes.status === 401) {
        onNavigate && onNavigate("login");
        return;
      }

      if (clinicRes.ok && clinicData.success) {
        setClinicRequests(
          clinicData.data.map((req) => ({
            id: req.id,
            type: "clinic",
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
          })),
        );
      }

      if (pharmacyRes.ok && pharmacyData.success) {
        setPharmacyRequests(
          pharmacyData.data.map((req) => ({
            id: req.id,
            type: "pharmacy",
            name: req.pharmacy_name,
            owner: "—",
            license: req.license_number,
            date: new Date(req.created_at).toLocaleDateString("ar-EG"),
            phone: req.pharmacy_phone,
            email: req.pharmacy_email,
            address: req.pharmacy_address,
            status:
              req.status === "pending"
                ? "قيد الانتظار"
                : req.status === "approved"
                  ? "تمت الموافقة"
                  : "مرفوض",
          })),
        );
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setActiveView("details");
    setSuccessStatus(false);
  };

  // الطلبات الحالية حسب التبويب
  const currentRequests =
    activeTab === "clinics" ? clinicRequests : pharmacyRequests;

  if (isLoading) {
    return (
      <div
        className="admin-dashboard-container"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" dir="rtl">
      {/* ── Sidebar ──────────────────────────────── */}
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
            onClick={() => setActiveTab("profile")}
          >
            <span className="icon">👤</span> الملف الشخصي
          </button>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
              onNavigate && onNavigate("home");
            }}
          >
            <span className="icon">🚪</span> تسجيل الخروج
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <div className="admin-main-content">
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

        {activeTab === "profile" ? (
          <AdminProfile admin={adminData} />
        ) : activeView === "list" ? (
          <ClinicRequestsList
            requests={currentRequests}
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
            selectedRequest={selectedRequest}
            requests={currentRequests}
            setRequests={
              activeTab === "clinics" ? setClinicRequests : setPharmacyRequests
            }
            successStatus={successStatus}
            setSuccessStatus={setSuccessStatus}
            activeTab={activeTab}
            onBack={() => {
              setActiveView("list");
              fetchAllRequests();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClinicAdminDashboard;
