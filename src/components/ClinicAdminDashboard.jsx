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
    email: storedUser.email || "rawanqaoud4@gmailcom",
    role: "مدير النظام العام (Super Admin)",
    phone: storedUser.phone || "0593458957",
    joinedDate: "20/6/2026",
  });

  const getToken = () => localStorage.getItem("token");

  // ─── جلب كل الطلبات ───────────────────────────
  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setIsLoading(true);
    try {
      const [clinicRes, pharmacyRes] = await Promise.all([
        fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/all",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: "application/json",
            },
          },
        ),
        fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: "application/json",
            },
          },
        ),
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
            <span className="icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 10V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10Z"
                  fill="black"
                />
                <path
                  d="M14 13C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44771 15 9 14.5523 9 14C9 13.4477 9.44771 13 10 13H14Z"
                  fill="black"
                />
                <path
                  d="M14 17C14.5523 17 15 17.4477 15 18C15 18.5523 14.5523 19 14 19H10C9.44771 19 9 18.5523 9 18C9 17.4477 9.44771 17 10 17H14Z"
                  fill="black"
                />
                <path
                  d="M14 7C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H10C9.44771 9 9 8.55228 9 8C9 7.44772 9.44771 7 10 7H14Z"
                  fill="black"
                />
                <path
                  d="M1 20V11C1 10.2044 1.3163 9.44151 1.87891 8.87891C2.44151 8.3163 3.20435 8 4 8H6C6.55228 8 7 8.44772 7 9C7 9.55229 6.55228 10 6 10H4C3.73478 10 3.48051 10.1054 3.29297 10.293C3.10543 10.4805 3 10.7348 3 11V20C3 20.2652 3.10543 20.5195 3.29297 20.707C3.48051 20.8946 3.73478 21 4 21H20C20.2652 21 20.5195 20.8946 20.707 20.707C20.8946 20.5195 21 20.2652 21 20V14C21 13.7348 20.8946 13.4805 20.707 13.293C20.5195 13.1054 20.2652 13 20 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H20C20.7957 11 21.5585 11.3163 22.1211 11.8789C22.6837 12.4415 23 13.2043 23 14V20C23 20.7957 22.6837 21.5585 22.1211 22.1211C21.5585 22.6837 20.7957 23 20 23H4C3.20435 23 2.44151 22.6837 1.87891 22.1211C1.3163 21.5585 1 20.7957 1 20Z"
                  fill="black"
                />
                <path
                  d="M17 22V4C17 3.73478 16.8946 3.48051 16.707 3.29297C16.5195 3.10543 16.2652 3 16 3H8C7.73478 3 7.4805 3.10543 7.29297 3.29297C7.10543 3.4805 7 3.73478 7 4V22C7 22.5523 6.55228 23 6 23C5.44772 23 5 22.5523 5 22V4C5 3.20435 5.3163 2.44152 5.87891 1.87891C6.44152 1.3163 7.20435 1 8 1H16C16.7956 1 17.5585 1.3163 18.1211 1.87891C18.6837 2.44151 19 3.20435 19 4V22C19 22.5523 18.5523 23 18 23C17.4477 23 17 22.5523 17 22Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            قسم العيادات
          </button>
          <button
            className={`menu-item ${activeTab === "pharmacies" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pharmacies");
              setActiveView("list");
            }}
          >
            <span className="icon"></span> قسم الصيدليات
          </button>
          <button
            className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="icon"></span> الملف الشخصي
          </button>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              onNavigate && onNavigate("home");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.293 6.29297C15.6591 5.92685 16.2381 5.90426 16.6309 6.22461L16.707 6.29297L21.707 11.293C22.0976 11.6835 22.0976 12.3165 21.707 12.707L16.707 17.707C16.3165 18.0976 15.6835 18.0976 15.293 17.707C14.9024 17.3165 14.9024 16.6835 15.293 16.293L19.5859 12L15.293 7.70703L15.2246 7.63086C14.9043 7.23809 14.9269 6.65908 15.293 6.29297Z"
                fill="black"
              />
              <path
                d="M21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H21Z"
                fill="black"
              />
              <path
                d="M2 19V5C2 4.20435 2.3163 3.44152 2.87891 2.87891C3.44152 2.3163 4.20435 2 5 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H5C4.73478 4 4.4805 4.10543 4.29297 4.29297C4.10543 4.4805 4 4.73478 4 5V19C4 19.2652 4.10543 19.5195 4.29297 19.707C4.48051 19.8946 4.73478 20 5 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H5C4.20435 22 3.44151 21.6837 2.87891 21.1211C2.3163 20.5585 2 19.7957 2 19Z"
                fill="black"
              />
            </svg>
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
