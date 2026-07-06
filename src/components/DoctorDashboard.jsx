import React, { useState } from "react";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";

const DoctorDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [subView, setSubView] = useState("list");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // لإدارة نص إشعار النجاح ديناميكياً (بين الحفظ والحذف)
  const [toastMessage, setToastMessage] = useState("");

  const [days] = useState([
    {
      id: 1,
      name: "الخميس",
      date: "2",
      appointments: "6 مواعيد",
      active: true,
    },
    {
      id: 2,
      name: "الأحد",
      date: "3",
      appointments: "2 مواعيد",
      active: false,
    },
    {
      id: 3,
      name: "الإثنين",
      date: "4",
      appointments: "0 مواعيد",
      active: false,
    },
    {
      id: 4,
      name: "الثلاثاء",
      date: "5",
      appointments: "0 مواعيد",
      active: false,
    },
    {
      id: 5,
      name: "الأربعاء",
      date: "6",
      appointments: "0 مواعيد",
      active: false,
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: "001",
      name: "محمد خالد",
      room: "غرفة الاستشارة 3A",
      time: "08:00 صباحاً (30 دقيقة)",
      status: "تم الإنجاز",
      period: "morning",
      age: 45,
      phone: "0591234567",
      date: "3/3/2025",
    },
    {
      id: "002",
      name: "محمد خالد",
      room: "غرفة الاستشارة 3A",
      time: "08:00 صباحاً (30 دقيقة)",
      status: "قيد التنفيذ",
      period: "morning",
      age: 38,
      phone: "0597654321",
      date: "3/3/2025",
    },
    {
      id: "003",
      name: "محمد خالد",
      room: "غرفة الاستشارة 3A",
      time: "08:00 صباحاً (30 دقيقة)",
      status: "قادم",
      period: "morning",
      age: 29,
      phone: "0592223334",
      date: "3/3/2025",
    },
    {
      id: "004",
      name: "محمد خالد",
      room: "غرفة الاستشارة 3A",
      time: "08:00 صباحاً (30 دقيقة)",
      status: "قادم",
      period: "evening",
      age: 50,
      phone: "0598887776",
      date: "3/3/2025",
    },
  ]);

  const [medicinesList, setMedicinesList] = useState([
    { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [generalInstructions, setGeneralInstructions] = useState("");

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setSubView("details");
  };

  const handleOpenPrescription = (patient) => {
    setSelectedPatient(patient);
    setMedicinesList([
      { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
    ]);
    setGeneralInstructions("");
    setSubView("create-prescription");
  };

  const handleAddMedicineInput = () => {
    setMedicinesList([
      ...medicinesList,
      { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const handleRemoveMedicineInput = (id) => {
    if (medicinesList.length === 1) {
      setMedicinesList([
        {
          id: Date.now(),
          medName: "",
          dosage: "",
          frequency: "",
          duration: "",
        },
      ]);
    } else {
      setMedicinesList(medicinesList.filter((med) => med.id !== id));
    }
  };

  const handleUpdateMedicineField = (id, field, value) => {
    setMedicinesList(
      medicinesList.map((med) =>
        med.id === id ? { ...med, [field]: value } : med,
      ),
    );
  };

  const handleConfirmDelete = () => {
    setMedicinesList([
      { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
    ]);
    setGeneralInstructions("");
    setShowDeleteModal(false);
    setToastMessage("تم الحذف بنجاح");
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2000);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    setToastMessage("تم حفظ الوصفة الطبية بنجاح");
    setShowSuccessToast(true);

    setAppointments(
      appointments.map((app) =>
        app.id === selectedPatient.id ? { ...app, status: "تم الإنجاز" } : app,
      ),
    );

    setTimeout(() => {
      setShowSuccessToast(false);
      setSubView("list");
    }, 2000);
  };

  return (
    <div className="doctor-dashboard-container" dir="rtl">
      <header className="doctor-main-header">
        <div className="header-logo">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          Medlink
        </div>
        <nav className="header-tabs-nav">
          <button
            className={`tab-link-btn ${activeTab === "schedule" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("schedule");
              setSubView("list");
            }}
          >
            جدول مواعيدي
          </button>
          <button
            className={`tab-link-btn ${activeTab === "prescriptions" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("prescriptions")}
          >
            سجل الوصفات
          </button>
        </nav>
      </header>

      <main className="doctor-dashboard-main">
        {activeTab === "schedule" && (
          <div className="view-transition-wrapper">
            {subView === "list" && (
              <div className="schedule-main-card">
                <div className="schedule-title-row">
                  <h3>جدول مواعيدي</h3>
                </div>

                <div className="days-filter-row">
                  <span className="month-selector">&lt; يوليو 2026 &gt;</span>
                  <div className="days-list-container">
                    {days.map((day) => (
                      <div
                        key={day.id}
                        className={`day-pill-item ${day.active ? "day-pill-active" : ""}`}
                      >
                        <span className="day-name">{day.name}</span>
                        <span className="day-date-num">{day.date}</span>
                        <span className="day-count-label">
                          {day.appointments}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="appointment-table-wrapper">
                  <div className="period-divider-title">
                    الفترات الصباحية{" "}
                    <span className="period-time">
                      (08:00 - 12:00) / 3 مواعيد
                    </span>
                  </div>
                  {appointments
                    .filter((a) => a.period === "morning")
                    .map((app) => (
                      <div key={app.id} className="appointment-list-row-item">
                        <div className="patient-meta-info">
                          <span className="pat-id">{app.id}</span>
                          <strong className="pat-name">{app.name}</strong>
                        </div>
                        <div className="pat-time-info">{app.time}</div>
                        <div className="pat-room-info">{app.room}</div>
                        <div className="pat-status-badge-cell">
                          <span
                            className={`status-tag ${
                              app.status === "تم الإنجاز"
                                ? "status-done"
                                : app.status === "قيد التنفيذ"
                                  ? "status-pending"
                                  : "status-next"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="pat-actions-cell">
                          <button
                            className="btn-action-view-details"
                            onClick={() => handleViewDetails(app)}
                          >
                            عرض تفاصيل
                          </button>
                          {app.status === "قيد التنفيذ" && (
                            <button
                              className="btn-action-quick-presc"
                              onClick={() => handleOpenPrescription(app)}
                            >
                              إنشاء الوصفة الطبية
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                  <div className="period-divider-title">
                    الفترة المسائية{" "}
                    <span className="period-time">
                      (01:00 - 03:00) / 3 مواعيد
                    </span>
                  </div>
                  {appointments
                    .filter((a) => a.period === "evening")
                    .map((app) => (
                      <div key={app.id} className="appointment-list-row-item">
                        <div className="patient-meta-info">
                          <span className="pat-id">{app.id}</span>
                          <strong className="pat-name">{app.name}</strong>
                        </div>
                        <div className="pat-time-info">{app.time}</div>
                        <div className="pat-room-info">{app.room}</div>
                        <div className="pat-status-badge-cell">
                          <span
                            className={`status-tag ${app.status === "قادم" ? "status-next" : "status-neutral"}`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="pat-actions-cell">
                          <button
                            className="btn-action-view-details"
                            onClick={() => handleViewDetails(app)}
                          >
                            عرض تفاصيل
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {subView === "details" && selectedPatient && (
              <div className="patient-details-outer-container">
                <div className="back-nav-row">
                  <button
                    className="btn-back-to-list-nav"
                    onClick={() => setSubView("list")}
                  >
                    الرجوع للخلف
                  </button>
                </div>

                <div className="patient-details-view-card">
                  <h4 className="details-main-heading">تفاصيل المريض</h4>
                  <div className="details-info-grid">
                    <div className="grid-info-item">
                      <span className="info-label">الاسم :</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.name}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">العمر:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.age}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">رقم الهاتف:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.phone}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">الفترة:</span>{" "}
                      <span className="info-value font-bold">9:00 صباحاً</span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">تاريخ الموعد:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.date}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">غرفة الاستشارة:</span>{" "}
                      <span className="info-value font-bold">A3</span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">الوصفة الطبية :</span>{" "}
                      {/* 🛠️ تعديل الكلاسات هنا لتعمل بشكل سليم وتمنع الـ Crash */}
                      <span 
                        className="info-value text-link-placeholder value link-style" 
                        onClick={() => onNavigate("prescriptions", { selectedPrescriptionId: 1 })}
                        style={{ cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline' }}
                      >
                        عرض الوصفة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subView === "create-prescription" && selectedPatient && (
              <div className="create-prescription-view-card">
                {showSuccessToast && (
                  <div className="toast-success-alert-bar">{toastMessage}</div>
                )}

                <div className="prescription-header-patient-summary">
                  <div className="patient-avatar-placeholder">👤</div>
                  <div className="summary-text-block">
                    <div className="title-row-patient">
                      <span className="p-name">{selectedPatient.name}</span>
                      <span className="p-age">
                        العمر: {selectedPatient.age}
                      </span>
                    </div>
                    <div className="meta-row-patient">
                      <span>رقم المريض: {selectedPatient.id}</span>
                      <span className="spacer-dash">|</span>
                      <span>تاريخ الموعد : {selectedPatient.date}</span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSavePrescription}
                  className="prescription-form-body"
                >
                  <div className="section-sub-title-row">
                    <span className="label-title">الأدوية المضافة:</span>
                    <button
                      type="button"
                      className="btn-add-more-meds-pill"
                      onClick={handleAddMedicineInput}
                    >
                      + إضافة دواء جديد
                    </button>
                    <button
                      type="button"
                      className="btn-trash-clear-all"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      🗑️ حذف الوصفة
                    </button>
                  </div>

                  {medicinesList.map((medicine, index) => (
                    <div
                      key={medicine.id}
                      className="dynamic-medicine-row-card"
                    >
                      <div className="medicine-row-header">
                        <span className="medicine-number-badge">
                          دواء #{index + 1}
                        </span>
                        {medicinesList.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-single-med"
                            onClick={() =>
                              handleRemoveMedicineInput(medicine.id)
                            }
                          >
                            ✕ حذف هذا الدواء
                          </button>
                        )}
                      </div>

                      <div className="form-inputs-two-columns-layout">
                        <div className="input-field-block">
                          <label>اسم الدواء:*</label>
                          <input
                            type="text"
                            required
                            value={medicine.medName}
                            onChange={(e) =>
                              handleUpdateMedicineField(
                                medicine.id,
                                "medName",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="input-field-block">
                          <label>الجرعة:</label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) =>
                              handleUpdateMedicineField(
                                medicine.id,
                                "dosage",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="input-field-block">
                          <label>التكرار:</label>
                          <input
                            type="text"
                            value={medicine.frequency}
                            onChange={(e) =>
                              handleUpdateMedicineField(
                                medicine.id,
                                "frequency",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="input-field-block">
                          <label>مدة العلاج:</label>
                          <input
                            type="text"
                            value={medicine.duration}
                            onChange={(e) =>
                              handleUpdateMedicineField(
                                medicine.id,
                                "duration",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="input-field-block full-width-textarea">
                    <label>تعليمات عامة وإضافية للمريض:</label>
                    <textarea
                      rows="3"
                      value={generalInstructions}
                      onChange={(e) => setGeneralInstructions(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="prescription-form-actions-bar">
                    <button
                      type="submit"
                      className="btn-submit-save-prescription"
                    >
                      حفظ الوصفة واعتمادها
                    </button>
                    <button
                      type="button"
                      className="btn-cancel-abort-prescription"
                      onClick={() => setSubView("list")}
                    >
                      إلغاء وتراجع
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="prescriptions-archive-view-card">
            <div className="archive-header-row">
              <h3>سجل وأرشيف الوصفات</h3>
              <span className="archive-counter-badge">
                إجمالي الوصفات الموثقة: 2
              </span>
            </div>

            <div className="archive-cards-vertical-list">
              <div className="archive-patient-item-card">
                <div className="card-top-header">
                  <div className="right-pat-profile">
                    <div className="avatar-circle-ui">KM</div>
                    <div>
                      <h4>محمد خالد</h4>
                      <p className="subtitle-meds-count">
                        💊 يحتوى على دواء ميتفورمين 850 ملغ وأدوية أخرى
                      </p>
                    </div>
                  </div>
                  <span className="card-date-stamp-badge">3 يونيو 2026</span>
                </div>
                <div className="card-expanded-details-area">
                  <div className="meds-section-title">
                    الأدوية الموصوفة سابقاً:
                  </div>
                  <div className="meds-grid-badges">
                    <span className="med-pill-tag">
                      أموكسيسيلين 500 ملغ (3 مرات - 7 أيام)
                    </span>
                    <span className="med-pill-tag">
                      باراسيتامول 500 ملغ (عند اللزوم)
                    </span>
                  </div>
                  <div className="notes-container-box">
                    <strong>التعليمات المصاحبة للوصفة:</strong>
                    <p>
                      تجنب تناول الأسبرين تماماً خلال فترة العلاج الحالية لسلامة
                      المعدة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showDeleteModal && (
        <div className="modal-backdrop-overlay">
          <div className="delete-alert-box-card">
            <h3 className="modal-main-title">هل انت متأكد من حذف الاجراءات؟</h3>
            <p className="modal-sub-title">
              سيتم حذف جميع البيانات التي تم ادخالها نهائياً
            </p>
            <div className="modal-actions-layout-row">
              <button
                className="btn-modal-action-confirm-red"
                onClick={handleConfirmDelete}
              >
                نعم
              </button>
              <button
                className="btn-modal-action-dismiss-grey"
                onClick={() => setShowDeleteModal(false)}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;