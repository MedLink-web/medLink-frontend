import React, { useState, useEffect } from "react";
// ☝️ تغيير 1: أضفنا useEffect
import "./PharmacyDashboard.css";
import logo from "../assets/logo.png";

const PharmacyDashboard = () => {
  const [currentTab, setCurrentTab] = useState("inventory");

  // ✅ تغيير 2 (US-34): بيانات الملف الشخصي — فاضية بالبداية
  const [profileData, setProfileData] = useState({
    name: "",
    license: "",
    email: "",
    address: "",
    phone: "",
    hours: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // ✅ تغيير 3 (US-39): بيانات المخزون — فاضية بالبداية
  const [medicines, setMedicines] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedMedicine, setSelectedMedicine] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: 0,
    available: true,
  });

  // ✅ تغيير 4 (US-35/36): حالات حفظ الدواء
  const [savingMedicine, setSavingMedicine] = useState(false);
  const [medicineError, setMedicineError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);
  const [deletingMed, setDeletingMed] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ✅ تغيير 5 (US-39): جلب المخزون من الـ API
  const fetchMedicines = async (search = "") => {
    try {
      setInventoryLoading(true);
      setInventoryError(null);
      const url = search
        ? `https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications?search=${search}`
        : "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications";
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.map((item) => ({
          id: item.id,
          name: item.medication_name,
          category: item.description || "",
          price: item.price + " شيكل",
          stock: 0,
          available: item.is_available,
          rawPrice: item.price,
        }));
        setMedicines(mapped);
      } else {
        setInventoryError("حدث خطأ في جلب المخزون");
      }
    } catch (err) {
      setInventoryError("تعذر الاتصال بالخادم");
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ✅ تغيير 6 (US-34): جلب بيانات الملف الشخصي
  useEffect(() => {
    if (currentTab !== "profile") return;
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const response = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/profile",
          { headers },
        );
        const data = await response.json();
        if (data.success) {
          setProfileData({
            name: data.data.pharmacy_name || "",
            license: "",
            email: data.data.pharmacy_email || "",
            address: data.data.pharmacy_address || "",
            phone: data.data.pharmacy_phone || "",
            hours: "",
          });
        } else {
          setProfileError("حدث خطأ في جلب بيانات الصيدلية");
        }
      } catch (err) {
        setProfileError("تعذر الاتصال بالخادم");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [currentTab]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedMedicine({
      id: null,
      name: "",
      category: "مضاد حيوي",
      price: "",
      stock: "",
      available: true,
    });
    setMedicineError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (medicine) => {
    setModalMode("edit");
    setSelectedMedicine({
      ...medicine,
      price: medicine.rawPrice || medicine.price,
    });
    setMedicineError(null);
    setIsModalOpen(true);
  };

  // ✅ تغيير 7 (US-35 + US-36): حفظ/تعديل دواء — يستدعي API
  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    setSavingMedicine(true);
    setMedicineError(null);
    try {
      const body = {
        medication_name: selectedMedicine.name,
        price: parseFloat(selectedMedicine.price) || 0,
        is_available: selectedMedicine.available,
        description: selectedMedicine.category,
      };

      let url, method;
      if (modalMode === "add") {
        url =
          "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications";
        method = "POST";
      } else {
        url = `https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications/${selectedMedicine.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchMedicines(); // إعادة جلب المخزون
      } else {
        if (data.errors) {
          setMedicineError(Object.values(data.errors).flat().join("\n"));
        } else {
          setMedicineError(data.message || "فشل الحفظ");
        }
      }
    } catch (err) {
      setMedicineError("تعذر الاتصال بالخادم");
    } finally {
      setSavingMedicine(false);
    }
  };

  // ✅ تغيير 8 (US-38): حذف دواء — يستدعي API
  const confirmDelete = async () => {
    try {
      setDeletingMed(true);
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications/${medToDelete}`,
        { method: "DELETE", headers },
      );
      const data = await response.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        fetchMedicines();
      } else {
        alert(data.message || "فشل الحذف");
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم");
      setIsDeleteModalOpen(false);
    } finally {
      setDeletingMed(false);
    }
  };

  // ✅ تغيير 9 (US-34): حفظ الملف الشخصي — يستدعي API
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileError(null);
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/profile",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            pharmacy_name: profileData.name,
            pharmacy_phone: profileData.phone,
            pharmacy_address: profileData.address,
            pharmacy_description: profileData.hours,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setIsEditingProfile(false);
        setProfileSuccessMsg(true);
        setTimeout(() => setProfileSuccessMsg(false), 3000);
      } else {
        if (data.errors) {
          setProfileError(Object.values(data.errors).flat().join("\n"));
        } else {
          setProfileError(data.message || "فشل الحفظ");
        }
      }
    } catch (err) {
      setProfileError("تعذر الاتصال بالخادم");
    } finally {
      setSavingProfile(false);
    }
  };

  // ✅ تغيير 10 (US-37): تبديل حالة التوفر — يستدعي API
  const handleToggleAvailability = async (medId) => {
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy/medications/${medId}/toggle`,
        { method: "PATCH", headers },
      );
      const data = await response.json();
      if (data.success) {
        setMedicines(
          medicines.map((m) =>
            m.id === medId ? { ...m, available: data.data.is_available } : m,
          ),
        );
      }
    } catch (err) {
      alert("تعذر تحديث حالة التوفر");
    }
  };

  // ✅ تغيير 11 (US-39): البحث بالمخزون
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === "") {
      fetchMedicines();
    } else {
      fetchMedicines(value);
    }
  };

  return (
    <div className="dashboard-layout-root" dir="rtl">
      <header className="dashboard-main-nav">
        <div className="nav-brand-logo">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          <span>Medlink</span>
        </div>
        <div className="nav-navigation-links">
          <button
            className={`nav-tab-btn ${currentTab === "inventory" ? "active-tab" : ""}`}
            onClick={() => setCurrentTab("inventory")}
          >
            📦 إدارة مخزن الأدوية
          </button>
          <button
            className={`nav-tab-btn ${currentTab === "profile" ? "active-tab" : ""}`}
            onClick={() => setCurrentTab("profile")}
          >
            الملف التعريفي للصيدلية
          </button>
        </div>
      </header>

      <main className="dashboard-content-body">
        {currentTab === "inventory" && (
          <div className="inventory-section-card">
            <div className="inventory-header-actions">
              <h3 className="section-main-title">إدارة مخزن الأدوية</h3>
              <button className="btn-add-new-medicine" onClick={openAddModal}>
                ➕ إضافة دواء
              </button>
            </div>

            {/* ✅ تغيير 12: البحث مربوط بالـ API */}
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder=" البحث باسم الدواء..."
                className="search-input-field"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {inventoryLoading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل المخزون...
              </p>
            )}
            {inventoryError && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#c0392b",
                }}
              >
                {inventoryError}
              </p>
            )}
            {!inventoryLoading && !inventoryError && medicines.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                لا توجد أدوية في المخزون.
              </p>
            )}

            {!inventoryLoading && !inventoryError && medicines.length > 0 && (
              <div className="table-responsive-container">
                <table className="medicines-data-table">
                  <thead>
                    <tr>
                      <th>اسم الدواء</th>
                      <th>الفئة</th>
                      <th>السعر</th>
                      <th>حالة التوفر</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med) => (
                      <tr key={med.id}>
                        <td className="bold-med-name">{med.name}</td>
                        <td>
                          <span className="category-tag-pill">
                            {med.category}
                          </span>
                        </td>
                        <td className="price-text">{med.price}</td>
                        <td>
                          {/* ✅ تغيير 13 (US-37): الضغط على البادج بيغير الحالة */}
                          <span
                            className={`status-indicator-badge ${med.available ? "in-stock" : "out-of-stock"}`}
                            onClick={() => handleToggleAvailability(med.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {med.available ? "متوفر" : "غير متوفر"}
                          </span>
                        </td>
                        <td className="action-buttons-cell">
                          <button
                            className="icon-btn-edit"
                            onClick={() => openEditModal(med)}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.9999 19C21.5522 19 21.9999 19.4477 21.9999 20C21.9999 20.5523 21.5522 21 20.9999 21H11.9999C11.4476 21 10.9999 20.5523 10.9999 20C10.9999 19.4477 11.4476 19 11.9999 19H20.9999Z"
                                fill="black"
                              />
                              <path
                                d="M18.9999 5.12329C18.9999 4.82559 18.8813 4.53989 18.6708 4.32935C18.4867 4.1452 18.2451 4.03169 17.9882 4.0061L17.8769 4.00024C17.6163 4.00025 17.3647 4.09043 17.165 4.25415L17.0829 4.32935L5.07219 16.3401C4.98291 16.4293 4.91118 16.5345 4.86125 16.6497L4.81926 16.7668L4.23527 18.7629L6.23234 18.1809L6.35148 18.1379C6.46652 18.088 6.57186 18.0172 6.66105 17.928L18.6708 5.91724L18.745 5.83423C18.9087 5.63452 18.9998 5.38372 18.9999 5.12329ZM20.9999 5.12329C20.9998 5.89975 20.7101 6.6462 20.1913 7.21899L20.0849 7.3313L8.07512 19.342C7.76279 19.6544 7.38563 19.8929 6.9716 20.0422L6.79289 20.1008L3.92082 20.9387C3.66276 21.014 3.38923 21.0191 3.12883 20.9524C2.86841 20.8857 2.63047 20.7499 2.44035 20.5598C2.25022 20.3697 2.11451 20.1318 2.04777 19.8713C1.98108 19.611 1.9853 19.3374 2.06047 19.0793L2.89933 16.2073L2.95793 16.0276C3.10743 15.6141 3.34609 15.2379 3.65812 14.926L15.6689 2.91528L15.7812 2.80786C16.354 2.2893 17.1005 2.00025 17.8769 2.00024L18.0321 2.00415C18.8038 2.04253 19.536 2.36635 20.0849 2.91528C20.6704 3.5009 20.9999 4.29516 20.9999 5.12329Z"
                                fill="black"
                              />
                              <path
                                d="M14.2929 4.29295C14.659 3.92683 15.238 3.90424 15.6308 4.22459L15.7069 4.29295L18.7069 7.29295L18.7753 7.36912C19.0956 7.76189 19.073 8.34089 18.7069 8.70701C18.3408 9.07313 17.7618 9.09572 17.369 8.77537L17.2929 8.70701L14.2929 5.70701L14.2245 5.63084C13.9042 5.23806 13.9268 4.65906 14.2929 4.29295Z"
                                fill="black"
                              />
                            </svg>
                          </button>
                          <button
                            className="icon-btn-delete"
                            onClick={() => {
                              setMedToDelete(med.id);
                              setIsDeleteModalOpen(true);
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
                                d="M21 5C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H21Z"
                                fill="black"
                              />
                              <path
                                d="M4 20V6C4 5.44772 4.44772 5 5 5C5.55228 5 6 5.44772 6 6V20C6 20.1748 6.09738 20.4333 6.33203 20.668C6.56669 20.9026 6.82523 21 7 21H17C17.1748 21 17.4333 20.9026 17.668 20.668C17.9026 20.4333 18 20.1748 18 20V6C18 5.44772 18.4477 5 19 5C19.5523 5 20 5.44772 20 6V20C20 20.8252 19.5974 21.5667 19.082 22.082C18.5667 22.5974 17.8252 23 17 23H7C6.17477 23 5.43331 22.5974 4.91797 22.082C4.40262 21.5667 4 20.8252 4 20Z"
                                fill="black"
                              />
                              <path
                                d="M15 6V4C15 3.82523 14.9026 3.56669 14.668 3.33203C14.4333 3.09738 14.1748 3 14 3H10C9.82523 3 9.56669 3.09738 9.33203 3.33203C9.09738 3.56669 9 3.82523 9 4V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V4C7 3.17477 7.40262 2.43331 7.91797 1.91797C8.43331 1.40262 9.17477 1 10 1H14C14.8252 1 15.5667 1.40262 16.082 1.91797C16.5974 2.43331 17 3.17477 17 4V6C17 6.55228 16.5523 7 16 7C15.4477 7 15 6.55228 15 6Z"
                                fill="black"
                              />
                              <path
                                d="M9 17V11C9 10.4477 9.44772 10 10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17Z"
                                fill="black"
                              />
                              <path
                                d="M13 17V11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17Z"
                                fill="black"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {currentTab === "profile" && (
          <div className="profile-section-card">
            <h3 className="section-main-title">الملف التعريفي لصيدلية</h3>

            {profileLoading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل البيانات...
              </p>
            )}
            {profileError && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#c0392b",
                }}
              >
                {profileError}
              </p>
            )}

            {!profileLoading && !profileError && !isEditingProfile && (
              <div className="profile-display-mode-box">
                <div className="profile-info-grid-row">
                  <strong>اسم الصيدلية:</strong> <span>{profileData.name}</span>
                </div>
                <div className="profile-info-grid-row">
                  <strong>رقم الترخيص:</strong>{" "}
                  <span>{profileData.license}</span>
                </div>
                <div className="profile-info-grid-row">
                  <strong>البريد الإلكتروني:</strong>{" "}
                  <span>{profileData.email}</span>
                </div>
                <div className="profile-info-grid-row">
                  <strong>العنوان:</strong> <span>{profileData.address}</span>
                </div>
                <div className="profile-info-grid-row">
                  <strong>رقم الهاتف:</strong> <span>{profileData.phone}</span>
                </div>
                <div className="profile-info-grid-row">
                  <strong>ساعات العمل:</strong> <span>{profileData.hours}</span>
                </div>
                <button
                  className="btn-trigger-edit-profile"
                  onClick={() => setIsEditingProfile(true)}
                >
                  تعديل البيانات
                </button>
              </div>
            )}

            {!profileLoading && isEditingProfile && (
              <form
                onSubmit={handleProfileSave}
                className="profile-editable-form-box"
              >
                <div className="form-field-row">
                  <label>اسم الصيدلية</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-field-row">
                  <label>رقم الترخيص</label>
                  <input
                    type="text"
                    value={profileData.license}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        license: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-field-row">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-field-row">
                  <label>العنوان</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-field-row">
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-field-row">
                  <label>ساعات العمل</label>
                  <textarea
                    rows="2"
                    value={profileData.hours}
                    onChange={(e) =>
                      setProfileData({ ...profileData, hours: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions-footer-row">
                  <button
                    type="submit"
                    className="btn-save-profile-modifications"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel-profile-modifications"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}

            {profileSuccessMsg && (
              <div className="green-success-toast-bar">
                تم حفظ التعديلات بنجاح
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fullscreen-overlay-modal-backdrop">
          <div className="centered-modal-content-card">
            <div className="modal-header-top">
              <h4>
                {modalMode === "add" ? "إضافة دواء جديد" : "تعديل على الدواء"}
              </h4>
              <button
                className="btn-close-modal-x"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSaveMedicine}
              className="modal-interactive-form"
            >
              {medicineError && (
                <p
                  style={{
                    color: "#c0392b",
                    whiteSpace: "pre-line",
                    marginBottom: "10px",
                  }}
                >
                  {medicineError}
                </p>
              )}
              <div className="modal-input-group">
                <label>اسم الدواء *</label>
                <input
                  type="text"
                  required
                  value={selectedMedicine.name}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      name: e.target.value,
                    })
                  }
                  placeholder="مثال: أموكسيسيلين 500 ملغ"
                />
              </div>
              <div className="modal-input-group">
                <label>السعر *</label>
                <input
                  type="text"
                  required
                  value={selectedMedicine.price}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      price: e.target.value,
                    })
                  }
                  placeholder="22"
                />
              </div>
              <div className="modal-input-group">
                <label>الكمية المتوفرة في المخزن *</label>
                <input
                  type="number"
                  required
                  value={selectedMedicine.stock}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="modal-input-group">
                <label>الفئة *</label>
                <select
                  value={selectedMedicine.category}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="مضاد حيوي">مضاد حيوي</option>
                  <option value="السكري">السكري</option>
                  <option value="أمراض القلب والأوعية الدموية">
                    أمراض القلب والأوعية الدموية
                  </option>
                  <option value="فيتامين">فيتامين</option>
                  <option value="مسكن">مسكن</option>
                </select>
              </div>
              <div className="modal-input-group toggle-row-alignment">
                <label>حالة التوفر</label>
                <input
                  type="checkbox"
                  checked={selectedMedicine.available}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      available: e.target.checked,
                    })
                  }
                />
                <span className="toggle-hint-label">
                  متاح حالياً في الصيدلية
                </span>
              </div>
              <div className="modal-buttons-footer">
                <button
                  type="submit"
                  className="btn-modal-save-primary"
                  disabled={savingMedicine}
                >
                  {savingMedicine ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
                <button
                  type="button"
                  className="btn-modal-cancel-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fullscreen-overlay-modal-backdrop">
          <div className="delete-confirmation-alert-box">
            <div className="red-trash-icon-container">🚨</div>
            <h5>هل أنت متأكد من أنك تريد حذف الدواء؟</h5>
            <p>لا يمكن التراجع عن هذا الإجراء بعد إتمامه.</p>
            <div className="confirmation-action-buttons">
              <button
                className="btn-confirm-red-delete"
                onClick={confirmDelete}
                disabled={deletingMed}
              >
                {deletingMed ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                className="btn-stay-abort"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                الإبقاء على الدواء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
