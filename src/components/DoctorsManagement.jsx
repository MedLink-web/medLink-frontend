import React, { useState, useEffect } from "react";
import "./DoctorsManagement.css";

const DoctorsManagement = ({ onNavigate, onDelete, showToast }) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // حالات الحذف
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // حالات التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [editData, setEditData] = useState({
    full_name: "",
    specialty: "",
    phone: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const getToken = () => localStorage.getItem("auth_token");

  // ─── جلب الأطباء من API ───────────────────────
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/clinic/doctors",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setDoctors(
          data.data.map((doc) => ({
            id: doc.id,
            name: doc.full_name,
            specialty: doc.specialty,
            email: doc.email,
            phone: doc.phone || "—",
            patients: 0,
            rating: 5.0,
            status: "نشط",
          })),
        );
      } else if (response.status === 401) {
        onNavigate && onNavigate("login");
      } else {
        setError("فشل تحميل بيانات الأطباء");
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── تصفية الأطباء ────────────────────────────
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.includes(searchTerm) || doc.specialty.includes(searchTerm),
  );

  // ─── الحذف ────────────────────────────────────
  const triggerDeleteConfirmation = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/clinic/doctors/${doctorToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );
      if (response.ok) {
        setDoctors(doctors.filter((d) => d.id !== doctorToDelete.id));
        if (onDelete) onDelete(doctorToDelete.id);
      }
    } catch {
      setError("فشل حذف الطبيب");
    } finally {
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
    }
  };

  // ─── التعديل ──────────────────────────────────
  const triggerEdit = (doctor) => {
    setDoctorToEdit(doctor);
    setEditData({
      full_name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone === "—" ? "" : doctor.phone,
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors({ ...editErrors, [name]: "" });
  };

  const confirmEdit = async () => {
    setIsSaving(true);
    setEditErrors({});
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/clinic/doctors/${doctorToEdit.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(editData),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // تحديث القائمة محلياً
        setDoctors(
          doctors.map((d) =>
            d.id === doctorToEdit.id
              ? {
                  ...d,
                  name: editData.full_name,
                  specialty: editData.specialty,
                  phone: editData.phone || "—",
                }
              : d,
          ),
        );
        setIsEditModalOpen(false);
        setDoctorToEdit(null);
      } else if (response.status === 422) {
        const backendErrors = {};
        Object.entries(data.errors).forEach(([field, messages]) => {
          backendErrors[field] = messages[0];
        });
        setEditErrors(backendErrors);
      } else {
        setEditErrors({ general: data.message || "حدث خطأ" });
      }
    } catch {
      setEditErrors({ general: "تعذر الاتصال بالسيرفر" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="clinic-dashboard-layout"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل بيانات الأطباء...</p>
      </div>
    );
  }

  return (
    <div className="clinic-dashboard-layout" dir="rtl">
      {/* ── Sidebar ──────────────────────────────── */}
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
          <button className="menu-item-btn">
            <span className="menu-icon">📊</span> لوحة التحكم
          </button>
          <button className="menu-item-btn active-tab-item">
            <span className="menu-icon">👩‍⚕️</span> إدارة الأطباء
          </button>
          <button className="menu-item-btn">
            <span className="menu-icon">📅</span> المواعيد
          </button>
          <button className="menu-item-btn">
            <span className="menu-icon">📁</span> السجلات الطبية
          </button>
          <button
            className="menu-item-btn"
            onClick={() => onNavigate("clinic-profile")}
          >
            <span className="menu-icon">🏢</span> ملف العيادة
          </button>
        </nav>
        <button
          className="sidebar-logout-btn"
          onClick={() => {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            onNavigate("home");
          }}
        >
          <span className="logout-icon">🚪</span> تسجيل الخروج
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="clinic-main-content">
        {showToast && (
          <div className="success-toast-banner-top">
            <span className="toast-text-message">تم إضافة الطبيب بنجاح</span>
            <div className="toast-check-circle">✓</div>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fed7d7",
              color: "#c53030",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className="content-top-navigation-bar">
          <div className="breadcrumb-links">
            <span>لوحة التحكم</span> &gt;{" "}
            <span className="active-path">إدارة الأطباء</span>
          </div>
          <button
            className="edit-profile-action-btn"
            onClick={() => onNavigate("add-doctor")}
          >
            ➕ إضافة طبيب
          </button>
        </div>

        {/* إحصائيات */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>إجمالي الأطباء</h3>
            <h2>{doctors.length}</h2>
          </div>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>الأطباء النشطون</h3>
            <h2>{doctors.filter((d) => d.status === "نشط").length}</h2>
          </div>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>إجمالي المرضى</h3>
            <h2>0</h2>
          </div>
        </div>

        {/* بحث */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <input
            type="text"
            placeholder="🔍 بحث بالاسم أو التخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #cbd5e0",
            }}
          />
        </div>

        {/* جدول */}
        <div
          className="profile-details-view-card"
          style={{ padding: "0", overflow: "hidden" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "right",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th style={{ padding: "16px" }}>الطبيب</th>
                <th style={{ padding: "16px" }}>التواصل</th>
                <th style={{ padding: "16px" }}>المرضى</th>
                <th style={{ padding: "16px" }}>التقييم</th>
                <th style={{ padding: "16px" }}>الحالة</th>
                <th style={{ padding: "16px" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#718096",
                    }}
                  >
                    لا يوجد أطباء حالياً
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr
                    key={doc.id}
                    style={{ borderBottom: "1px solid #edf2f7" }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: "700", color: "#2d3748" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#718096" }}>
                        {doc.specialty}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "13px",
                        color: "#4a5568",
                      }}
                    >
                      <div>{doc.email}</div>
                      <div style={{ color: "#a0aec0" }}>{doc.phone}</div>
                    </td>
                    <td style={{ padding: "16px" }}>{doc.patients}</td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#dd6b20",
                        fontWeight: "700",
                      }}
                    >
                      ⭐ {doc.rating}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          backgroundColor:
                            doc.status === "نشط" ? "#c6f6d5" : "#fed7d7",
                          color: doc.status === "نشط" ? "#22543d" : "#742a2a",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td
                      style={{ padding: "16px", display: "flex", gap: "8px" }}
                    >
                      {/* زر التعديل */}
                      <button
                        onClick={() => triggerEdit(doc)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      {/* زر الحذف */}
                      <button
                        onClick={() => triggerDeleteConfirmation(doc)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── مودال الحذف ──────────────────────── */}
        {isDeleteModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "400px",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚠️</div>
              <h3 style={{ margin: "0 0 10px", color: "#2d3748" }}>
                تأكيد حذف الطبيب
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "14px",
                  marginBottom: "25px",
                }}
              >
                هل أنت متأكد من حذف <strong>{doctorToDelete?.name}</strong>؟
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: "#e53e3e",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDoctorToDelete(null);
                  }}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#4a5568",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── مودال التعديل ────────────────────── */}
        {isEditModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "12px",
                width: "460px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
              dir="rtl"
            >
              <h3 style={{ margin: "0 0 20px", color: "#2d3748" }}>
                ✏️ تعديل بيانات الطبيب
              </h3>

              {editErrors.general && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #fed7d7",
                    color: "#c53030",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  ⚠️ {editErrors.general}
                </div>
              )}

              {/* الاسم */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${editErrors.full_name ? "#e53e3e" : "#cbd5e0"}`,
                    boxSizing: "border-box",
                  }}
                />
                {editErrors.full_name && (
                  <p
                    style={{
                      color: "#e53e3e",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {editErrors.full_name}
                  </p>
                )}
              </div>

              {/* التخصص */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  التخصص
                </label>
                <select
                  name="specialty"
                  value={editData.specialty}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${editErrors.specialty ? "#e53e3e" : "#cbd5e0"}`,
                    boxSizing: "border-box",
                  }}
                >
                  <option value="تخصص الأطفال">تخصص الأطفال</option>
                  <option value="تخصص القلب">تخصص القلب</option>
                  <option value="طب أسنان">طب أسنان</option>
                  <option value="طب عام">طب عام</option>
                  <option value="جلدية">جلدية</option>
                  <option value="عظام">عظام</option>
                  <option value="نساء وتوليد">نساء وتوليد</option>
                  <option value="عيون">عيون</option>
                </select>
                {editErrors.specialty && (
                  <p
                    style={{
                      color: "#e53e3e",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {editErrors.specialty}
                  </p>
                )}
              </div>

              {/* الهاتف */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={confirmEdit}
                  disabled={isSaving}
                  style={{
                    backgroundColor: isSaving ? "#90cdf4" : "#3182ce",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaving ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setDoctorToEdit(null);
                  }}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#4a5568",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
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
