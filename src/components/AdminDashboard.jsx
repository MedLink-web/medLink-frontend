import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";

const AdminDashboard = ({ onNavigate }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ✅ حالات الداشبورد (الإحصائيات)
  const [stats, setStats] = useState({
    total_clinics: 0,
    total_pharmacies: 0,
    pending_clinic_requests: 0,
    pending_pharmacy_requests: 0,
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ حالات طلبات العيادات
  const [clinicRequests, setClinicRequests] = useState([]);
  const [clinicRequestsLoading, setClinicRequestsLoading] = useState(false);

  // ✅ حالات طلبات الصيدليات
  const [pharmacyRequests, setPharmacyRequests] = useState([]);
  const [pharmacyRequestsLoading, setPharmacyRequestsLoading] = useState(false);

  // ✅ حالات تفاصيل الطلب
  const [requestDetails, setRequestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ✅ حالات الملف الشخصي
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // ✅ حالة الموافقة/الرفض
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ 1. جلب الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/admin/statistics",
          { headers },
        );
        const data = await res.json();
        if (data.success) {
          setStats({
            total_clinics: data.data.clinics?.total || 0,
            total_pharmacies: data.data.pharmacies?.total || 0,
            pending_clinic_requests: data.data.clinics?.pending || 0,
            pending_pharmacy_requests: data.data.pharmacies?.pending || 0,
            total_patients: data.data.users?.patients || 0,
            total_doctors: data.data.users?.doctors || 0,
          });
        }
      } catch (err) {
        console.error("فشل جلب الإحصائيات:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ✅ 2. جلب طلبات العيادات
  const fetchClinicRequests = async () => {
    try {
      setClinicRequestsLoading(true);
      const res = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests",
        { headers },
      );
      const data = await res.json();
      if (data.success) setClinicRequests(data.data);
    } catch (err) {
      console.error("فشل جلب طلبات العيادات:", err);
    } finally {
      setClinicRequestsLoading(false);
    }
  };

  // ✅ 3. جلب طلبات الصيدليات
  const fetchPharmacyRequests = async () => {
    try {
      setPharmacyRequestsLoading(true);
      const res = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests",
        { headers },
      );
      const data = await res.json();
      if (data.success) setPharmacyRequests(data.data);
    } catch (err) {
      console.error("فشل جلب طلبات الصيدليات:", err);
    } finally {
      setPharmacyRequestsLoading(false);
    }
  };

  // ✅ 4. جلب تفاصيل طلب معين
  const fetchRequestDetails = async (id, type) => {
    try {
      setDetailsLoading(true);
      const endpoint =
        type === "clinic"
          ? `https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/${id}`
          : `https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests/${id}`;
      const res = await fetch(endpoint, { headers });
      const data = await res.json();
      if (data.success) setRequestDetails(data.data);
    } catch (err) {
      console.error("فشل جلب التفاصيل:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ 5. جلب الملف الشخصي
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/profile",
        { headers },
      );
      const data = await res.json();
      if (data.success) setAdminProfile(data.data);
    } catch (err) {
      console.error("فشل جلب الملف الشخصي:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // ✅ تحميل البيانات حسب التاب المختار
  useEffect(() => {
    if (activeView === "clinic-requests") fetchClinicRequests();
    if (activeView === "pharmacy-requests") fetchPharmacyRequests();
    if (activeView === "profile") fetchProfile();
  }, [activeView]);

  // ✅ 6. الموافقة على طلب
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const endpoint =
        selectedRequestType === "clinic"
          ? `https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/${selectedRequestId}/approve`
          : `https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests/${selectedRequestId}/approve`;
      const res = await fetch(endpoint, { method: "POST", headers });
      const data = await res.json();
      if (data.success) {
        setShowApproveModal(false);
        setSuccessMessage("تمت الموافقة على الطلب بنجاح");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        if (selectedRequestType === "clinic") fetchClinicRequests();
        else fetchPharmacyRequests();
        setActiveView(
          selectedRequestType === "clinic"
            ? "clinic-requests"
            : "pharmacy-requests",
        );
      }
    } catch (err) {
      alert("فشل الموافقة على الطلب");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ 7. رفض طلب
  const handleReject = async () => {
    try {
      setActionLoading(true);
      const endpoint =
        selectedRequestType === "clinic"
          ? `https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/${selectedRequestId}/reject`
          : `https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests/${selectedRequestId}/reject`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setShowRejectModal(false);
        setRejectReason("");
        setSuccessMessage("تم رفض الطلب");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        if (selectedRequestType === "clinic") fetchClinicRequests();
        else fetchPharmacyRequests();
        setActiveView(
          selectedRequestType === "clinic"
            ? "clinic-requests"
            : "pharmacy-requests",
        );
      }
    } catch (err) {
      alert("فشل رفض الطلب");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ 8. حفظ الملف الشخصي
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const res = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/profile",
        {
          method: "PUT",
          headers,
          body: JSON.stringify(adminProfile),
        },
      );
      const data = await res.json();
      if (data.success) {
        setIsEditingProfile(false);
        setSuccessMessage("تم حفظ التعديلات بنجاح");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (err) {
      alert("فشل حفظ التعديلات");
    } finally {
      setSavingProfile(false);
    }
  };

  // فتح تفاصيل طلب
  const openRequestDetails = (id, type) => {
    setSelectedRequestId(id);
    setSelectedRequestType(type);
    fetchRequestDetails(id, type);
    setActiveView(
      type === "clinic" ? "clinic-request-details" : "pharmacy-request-details",
    );
  };

  // helper: حالة الطلب
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { label: "قيد المراجعة", className: "badge-pending" };
      case "approved":
        return { label: "تمت الموافقة", className: "badge-approved" };
      case "rejected":
        return { label: "مرفوض", className: "badge-rejected" };
      default:
        return { label: status, className: "badge-pending" };
    }
  };

  return (
    <div className="admin-dashboard-layout" dir="rtl">
      {/* Toast */}
      {showSuccessToast && (
        <div className="admin-success-toast">{successMessage}</div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          <div className="brand-text-wrapper">
            <h3>Medlink</h3>
            <p>لوحة الإدارة</p>
          </div>
        </div>
        <nav className="sidebar-menu-items">
          <span className="menu-section-title">القائمة الرئيسية</span>
          <button
            className={`menu-item-btn ${activeView === "dashboard" ? "active-tab-item" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <span className="menu-icon">📊</span> لوحة التحكم
          </button>
          <button
            className={`menu-item-btn ${activeView === "clinic-requests" ? "active-tab-item" : ""}`}
            onClick={() => setActiveView("clinic-requests")}
          >
            <span className="menu-icon">🏥</span> طلبات العيادات
          </button>
          <button
            className={`menu-item-btn ${activeView === "pharmacy-requests" ? "active-tab-item" : ""}`}
            onClick={() => setActiveView("pharmacy-requests")}
          >
            <span className="menu-icon">💊</span> طلبات الصيدليات
          </button>
          <button
            className={`menu-item-btn ${activeView === "profile" ? "active-tab-item" : ""}`}
            onClick={() => setActiveView("profile")}
          >
            <span className="menu-icon">👤</span> الملف الشخصي
          </button>
        </nav>
        <button
          className="sidebar-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            onNavigate("landing");
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* ===== لوحة التحكم ===== */}
        {activeView === "dashboard" && (
          <div>
            <h2 className="page-main-title">لوحة التحكم الرئيسية</h2>
            {statsLoading ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل الإحصائيات...
              </p>
            ) : (
              <div className="stats-cards-grid">
                <div className="stat-card blue">
                  <span className="stat-num">{stats.total_clinics}</span>
                  <span className="stat-label">العيادات المسجلة</span>
                </div>
                <div className="stat-card green">
                  <span className="stat-num">{stats.total_pharmacies}</span>
                  <span className="stat-label">الصيدليات المسجلة</span>
                </div>
                <div className="stat-card orange">
                  <span className="stat-num">
                    {stats.pending_clinic_requests}
                  </span>
                  <span className="stat-label">طلبات عيادات معلقة</span>
                </div>
                <div className="stat-card purple">
                  <span className="stat-num">
                    {stats.pending_pharmacy_requests}
                  </span>
                  <span className="stat-label">طلبات صيدليات معلقة</span>
                </div>
                <div className="stat-card cyan">
                  <span className="stat-num">{stats.total_patients}</span>
                  <span className="stat-label">المرضى المسجلين</span>
                </div>
                <div className="stat-card red">
                  <span className="stat-num">{stats.total_doctors}</span>
                  <span className="stat-label">الأطباء المسجلين</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== طلبات العيادات ===== */}
        {activeView === "clinic-requests" && (
          <div>
            <h2 className="page-main-title">طلبات تسجيل العيادات</h2>
            {clinicRequestsLoading ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل الطلبات...
              </p>
            ) : clinicRequests.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                لا توجد طلبات حالياً.
              </p>
            ) : (
              <div className="requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم العيادة</th>
                      <th>التخصص</th>
                      <th>الهاتف</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicRequests.map((req, i) => {
                      const badge = getStatusBadge(req.status);
                      return (
                        <tr key={req.id}>
                          <td>{i + 1}</td>
                          <td className="bold-cell">{req.clinic_name}</td>
                          <td>{req.specialty}</td>
                          <td>{req.clinic_phone}</td>
                          <td>
                            <span className={`status-badge ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-view-details"
                              onClick={() =>
                                openRequestDetails(req.id, "clinic")
                              }
                            >
                              عرض التفاصيل
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== طلبات الصيدليات ===== */}
        {activeView === "pharmacy-requests" && (
          <div>
            <h2 className="page-main-title">طلبات تسجيل الصيدليات</h2>
            {pharmacyRequestsLoading ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل الطلبات...
              </p>
            ) : pharmacyRequests.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                لا توجد طلبات حالياً.
              </p>
            ) : (
              <div className="requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم الصيدلية</th>
                      <th>الهاتف</th>
                      <th>العنوان</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyRequests.map((req, i) => {
                      const badge = getStatusBadge(req.status);
                      return (
                        <tr key={req.id}>
                          <td>{i + 1}</td>
                          <td className="bold-cell">{req.pharmacy_name}</td>
                          <td>{req.pharmacy_phone}</td>
                          <td>{req.pharmacy_address}</td>
                          <td>
                            <span className={`status-badge ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-view-details"
                              onClick={() =>
                                openRequestDetails(req.id, "pharmacy")
                              }
                            >
                              عرض التفاصيل
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== تفاصيل طلب عيادة/صيدلية ===== */}
        {(activeView === "clinic-request-details" ||
          activeView === "pharmacy-request-details") && (
          <div>
            <button
              className="btn-back-link"
              onClick={() =>
                setActiveView(
                  selectedRequestType === "clinic"
                    ? "clinic-requests"
                    : "pharmacy-requests",
                )
              }
            >
              ← العودة للقائمة
            </button>
            <h2 className="page-main-title">تفاصيل الطلب</h2>
            {detailsLoading ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل التفاصيل...
              </p>
            ) : requestDetails ? (
              <div className="request-details-card">
                <div className="details-grid">
                  {selectedRequestType === "clinic" ? (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">اسم العيادة:</span>
                        <span className="detail-value">
                          {requestDetails.clinic_name}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">التخصص:</span>
                        <span className="detail-value">
                          {requestDetails.specialty}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">الهاتف:</span>
                        <span className="detail-value">
                          {requestDetails.clinic_phone}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">البريد:</span>
                        <span className="detail-value">
                          {requestDetails.clinic_email}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">العنوان:</span>
                        <span className="detail-value">
                          {requestDetails.clinic_address}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">رقم الترخيص:</span>
                        <span className="detail-value">
                          {requestDetails.license_number}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">اسم الصيدلية:</span>
                        <span className="detail-value">
                          {requestDetails.pharmacy_name}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">الهاتف:</span>
                        <span className="detail-value">
                          {requestDetails.pharmacy_phone}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">البريد:</span>
                        <span className="detail-value">
                          {requestDetails.pharmacy_email}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">العنوان:</span>
                        <span className="detail-value">
                          {requestDetails.pharmacy_address}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">رقم الترخيص:</span>
                        <span className="detail-value">
                          {requestDetails.license_number}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">الحالة:</span>
                    <span
                      className={`status-badge ${getStatusBadge(requestDetails.status).className}`}
                    >
                      {getStatusBadge(requestDetails.status).label}
                    </span>
                  </div>
                </div>

                {requestDetails.status === "pending" && (
                  <div className="details-actions">
                    <button
                      className="btn-approve"
                      onClick={() => setShowApproveModal(true)}
                    >
                      ✅ موافقة
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => setShowRejectModal(true)}
                    >
                      ❌ رفض
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#c0392b" }}>
                لم يتم العثور على التفاصيل.
              </p>
            )}
          </div>
        )}

        {/* ===== الملف الشخصي ===== */}
        {activeView === "profile" && (
          <div>
            <h2 className="page-main-title">الملف الشخصي</h2>
            {profileLoading ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل البيانات...
              </p>
            ) : !isEditingProfile ? (
              <div className="profile-view-card">
                <div className="profile-info-row">
                  <strong>الاسم:</strong>
                  <span>{adminProfile.name}</span>
                </div>
                <div className="profile-info-row">
                  <strong>البريد الإلكتروني:</strong>
                  <span>{adminProfile.email}</span>
                </div>
                <div className="profile-info-row">
                  <strong>رقم الهاتف:</strong>
                  <span>{adminProfile.phone}</span>
                </div>
                <button
                  className="btn-edit-profile"
                  onClick={() => setIsEditingProfile(true)}
                >
                  تعديل البيانات
                </button>
              </div>
            ) : (
              <div className="profile-edit-card">
                <div className="edit-field">
                  <label>الاسم:</label>
                  <input
                    type="text"
                    value={adminProfile.name}
                    onChange={(e) =>
                      setAdminProfile({ ...adminProfile, name: e.target.value })
                    }
                  />
                </div>
                <div className="edit-field">
                  <label>البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-field">
                  <label>رقم الهاتف:</label>
                  <input
                    type="text"
                    value={adminProfile.phone}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-actions">
                  <button
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== Modal: تأكيد الموافقة ===== */}
      {showApproveModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>تأكيد الموافقة</h3>
            <p>هل أنت متأكد من الموافقة على هذا الطلب؟</p>
            <div className="modal-actions">
              <button
                className="btn-approve"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? "جاري..." : "نعم، موافقة"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowApproveModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal: تأكيد الرفض ===== */}
      {showRejectModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>تأكيد الرفض</h3>
            <p>يرجى كتابة سبب الرفض:</p>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="سبب الرفض..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontFamily: "inherit",
                marginBottom: "14px",
              }}
            />
            <div className="modal-actions">
              <button
                className="btn-reject"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? "جاري..." : "تأكيد الرفض"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
