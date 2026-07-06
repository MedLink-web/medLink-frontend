import React, { useState } from "react";
import "./PharmacyDashboard.css";
import logo from "../assets/logo.png";

const PharmacyDashboard = () => {
  // 1. التحكم في التبويب الحالي (مخزون الأدوية أو الملف الشخصي)
  const [currentTab, setCurrentTab] = useState("inventory");

  // 2. بيانات الملف الشخصي الافتراضية المأخوذة من صورة Figma (image_efe5fe.png)
  const [profileData, setProfileData] = useState({
    name: "صيدلية الشفاء",
    license: "PH-20394",
    email: "info@shifapharm.ps",
    address: "غزة - الساحة مقابل بلدية غزة",
    phone: "0599-123-456",
    hours:
      "8:00 ص - 12:00 م يومياً ما عدا يوم الجمعة من 04:00 عصراً حتى 12:00 مساءً",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // 3. بيانات مخزون الأدوية الافتراضية المأخوذة من صورة Figma (image_efe67c.png)
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "أموكسيسيلين 500 ملغ",
      category: "مضاد حيوي",
      price: "22 شيكل",
      stock: 330,
      available: true,
    },
    {
      id: 2,
      name: "باراسيتامول 500 ملغ",
      category: "مسكن",
      price: "22 شيكل",
      stock: 150,
      available: true,
    },
    {
      id: 3,
      name: "إيبوبروفين 400 ملغ",
      category: "السكري",
      price: "22 شيكل",
      stock: 90,
      available: true,
    },
    {
      id: 4,
      name: "أوميبرازول 20 ملغ",
      category: "أمراض القلب والأوعية الدموية",
      price: "22 شيكل",
      stock: 0,
      available: false,
    },
    {
      id: 5,
      name: "فيتامين د 1000 وحدة",
      category: "فيتامين",
      price: "22 شيكل",
      stock: 600,
      available: true,
    },
  ]);

  // 4. حالات التحكم بالـ Modal (إضافة وتعديل الأدوية)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" أو "edit"
  const [selectedMedicine, setSelectedMedicine] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: 0,
    available: true,
  });

  // 5. حالة نافذة التأكيد المنبثقة للحذف (Delete Confirmation Modal)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);

  // دالة فتح المودال لإضافة دواء جديد
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
    setIsModalOpen(true);
  };

  // دالة فتح المودال لتعديل دواء موجود
  const openEditModal = (medicine) => {
    setModalMode("edit");
    setSelectedMedicine({ ...medicine });
    setIsModalOpen(true);
  };

  // حفظ التعديلات أو الإضافة الجديدة للأدوية
  const handleSaveMedicine = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newId = medicines.length + 1;
      setMedicines([...medicines, { ...selectedMedicine, id: newId }]);
    } else {
      setMedicines(
        medicines.map((m) =>
          m.id === selectedMedicine.id ? selectedMedicine : m,
        ),
      );
    }
    setIsModalOpen(false);
  };

  // تفعيل الحذف المؤكد
  const confirmDelete = () => {
    setMedicines(medicines.filter((m) => m.id !== medToDelete));
    setIsDeleteModalOpen(false);
  };

  // حفظ ملف الصيدلية الشخصي
  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  return (
    <div className="dashboard-layout-root" dir="rtl">
      {/* 📋 شريط التنقل العلوي الموحد لربط التبويبات والمخزون بسلاسة */}
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
            🏥 الملف التعريفي للصيدلية
          </button>
        </div>
      </header>

      {/* ⚡ المحتوى المتغير ديناميكياً بناءً على اختيار الصيدلاني */}
      <main className="dashboard-content-body">
        {/* التبويب الأول: إدارة مخزن الأدوية */}
        {currentTab === "inventory" && (
          <div className="inventory-section-card">
            <div className="inventory-header-actions">
              <h3 className="section-main-title">إدارة مخزن الأدوية</h3>
              <button className="btn-add-new-medicine" onClick={openAddModal}>
                ➕ إضافة دواء
              </button>
            </div>

            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="🔍 البحث باسم الدواء..."
                className="search-input-field"
              />
            </div>

            <div className="table-responsive-container">
              <table className="medicines-data-table">
                <thead>
                  <tr>
                    <th>اسم الدواء</th>
                    <th>الفئة</th>
                    <th>السعر</th>
                    <th>حالة التوفر</th>
                    <th>الجراءات</th>
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
                        <span
                          className={`status-indicator-badge ${med.available ? "in-stock" : "out-of-stock"}`}
                        >
                          {med.available ? "متوفر" : "غير متوفر"}
                        </span>
                      </td>
                      <td className="action-buttons-cell">
                        <button
                          className="icon-btn-edit"
                          onClick={() => openEditModal(med)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn-delete"
                          onClick={() => {
                            setMedToDelete(med.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* التبويب الثاني: الملف التعريفي للصيدلية (image_efe5fe.png) */}
        {currentTab === "profile" && (
          <div className="profile-section-card">
            <h3 className="section-main-title">الملف التعريفي لصيدلية</h3>

            {!isEditingProfile ? (
              /* واجهة عرض البيانات */
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
            ) : (
              /* واجهة تعديل البيانات المتطابقة تماماً مع التصميم الأيمن */
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
                  >
                    حفظ التعديلات
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

      {/* 📥 نافذة المودال المشتركة لـ (إضافة دواء جديد / تعديل الدواء الحالي) من صورة image_efe67c.png */}
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
                  placeholder="22 شيكل"
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
                <button type="submit" className="btn-modal-save-primary">
                  حفظ التعديلات
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

      {/* 🗑️ نافذة التأكيد المنبثقة لحذف الدواء (تطابق الكرت الأيسر من صورة image_efe67c.png) */}
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
              >
                حذف
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
