import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";

const DoctorDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [subView, setSubView] = useState("list");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  // ✅ بدل الأيام الثابتة — بنحسبها تلقائي من المواعيد يلي جاءت من الـ API
  const [selectedDayFilter, setSelectedDayFilter] = useState(null);

  const arabicDayNames = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // US-27: حالات المواعيد
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // استخراج الأيام من تواريخ المواعيد الحقيقية (بعد تعريف appointments)
  const days = (() => {
    const uniqueDates = [...new Set(appointments.map((a) => a.date))].sort();
    return uniqueDates.map((dateStr, index) => {
      const dateObj = new Date(dateStr);
      const dayName = arabicDayNames[dateObj.getDay()];
      const dayNum = dateObj.getDate();
      const count = appointments.filter((a) => a.date === dateStr).length;
      return {
        id: index + 1,
        name: dayName,
        date: String(dayNum),
        fullDate: dateStr,
        appointments: `${count} مواعيد`,
        active: selectedDayFilter ? selectedDayFilter === dateStr : index === 0,
      };
    });
  })();

  // US-28: حالات تفاصيل المريض
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState(null);

  // ✅ تغيير 1 (US-29): حالة حفظ الوصفة
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);

  // ✅ تغيير 2 (US-29): حقل التشخيص (مطلوب من الـ API)
  const [diagnosis, setDiagnosis] = useState("");

  // ✅ تغيير 3 (US-31): حالات سجل الوصفات
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [prescriptionsError, setPrescriptionsError] = useState(null);

  // US-27: جلب مواعيد الدكتور
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/doctor/appointments",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          const mapped = data.data.map((item) => {
            const startTime = item.slot?.start_time || "";
            const hour = parseInt(startTime.split(":")[0], 10);
            const period = hour < 12 ? "morning" : "evening";
            const displayTime = startTime.substring(0, 5);
            return {
              id: String(item.id).padStart(3, "0"),
              name: item.patient?.name || "",
              room: "غرفة الاستشارة 3A",
              time: displayTime + (period === "morning" ? " صباحاً" : " مساءً"),
              status: "قادم",
              period: period,
              phone: item.patient?.phone || "",
              email: item.patient?.email || "",
              date: item.slot?.date || "",
              appointmentId: item.id,
              patientId: item.patient?.id || null, // ✅ تغيير 4: حفظ patientId للوصفة
            };
          });
          setAppointments(mapped);
        } else {
          setError("حدث خطأ في جلب المواعيد");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // ✅ تغيير 5 (US-31): جلب سجل الوصفات لما يفتح التاب
  useEffect(() => {
    if (activeTab !== "prescriptions") return;

    const fetchPrescriptions = async () => {
      try {
        setPrescriptionsLoading(true);
        setPrescriptionsError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/prescriptions",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setPrescriptions(data.data);
        } else {
          setPrescriptionsError("حدث خطأ في جلب الوصفات");
        }
      } catch (err) {
        setPrescriptionsError("تعذر الاتصال بالخادم");
      } finally {
        setPrescriptionsLoading(false);
      }
    };
    fetchPrescriptions();
  }, [activeTab]);

  // US-28: جلب تفاصيل المريض
  const handleViewDetails = async (patient) => {
    try {
      setPatientLoading(true);
      setPatientError(null);
      setSelectedPatient(patient);
      setSubView("details");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/doctor/appointments/${patient.appointmentId}/patient`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setSelectedPatient({
          ...patient,
          name: data.data.patient?.full_name || patient.name,
          phone: data.data.patient?.phone || patient.phone,
          email: data.data.patient?.email || "",
          date: data.data.appointment?.date || patient.date,
          time:
            (data.data.appointment?.start_time || "") +
            " - " +
            (data.data.appointment?.end_time || ""),
        });
      } else {
        setPatientError(data.message || "غير مصرح لك بالوصول");
      }
    } catch (err) {
      setPatientError("تعذر الاتصال بالخادم");
    } finally {
      setPatientLoading(false);
    }
  };

  const handleOpenPrescription = (patient) => {
    setSelectedPatient(patient);
    setMedicinesList([
      { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
    ]);
    setGeneralInstructions("");
    setDiagnosis(""); // ✅ تغيير 6: تفريغ التشخيص
    setPrescriptionError(null);
    setSubView("create-prescription");
  };

  const [medicinesList, setMedicinesList] = useState([
    { id: Date.now(), medName: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [generalInstructions, setGeneralInstructions] = useState("");

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
    setDiagnosis("");
    setShowDeleteModal(false);
    setToastMessage("تم الحذف بنجاح");
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2000);
  };

  // ✅ تغيير 7 (US-29 + US-30): حفظ الوصفة — يستدعي POST /api/prescriptions
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setPrescriptionError(null);

    // تحويل الأدوية لشكل الـ API
    const items = medicinesList.map((med) => ({
      medication_name: med.medName,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
    }));

    try {
      setSavingPrescription(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/prescriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient_id: selectedPatient.patientId,
            appointment_id: selectedPatient.appointmentId,
            diagnosis: diagnosis,
            notes: generalInstructions,
            items: items,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        setToastMessage("تم حفظ الوصفة الطبية بنجاح");
        setShowSuccessToast(true);

        setAppointments(
          appointments.map((app) =>
            app.id === selectedPatient.id
              ? { ...app, status: "تم الإنجاز" }
              : app,
          ),
        );

        setTimeout(() => {
          setShowSuccessToast(false);
          setSubView("list");
        }, 2000);
      } else {
        // عرض أخطاء الـ validation
        if (data.errors) {
          const msgs = Object.values(data.errors).flat().join("\n");
          setPrescriptionError(msgs);
        } else {
          setPrescriptionError(data.message || "فشل حفظ الوصفة");
        }
      }
    } catch (err) {
      setPrescriptionError("تعذر الاتصال بالخادم");
    } finally {
      setSavingPrescription(false);
    }
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
                        onClick={() => setSelectedDayFilter(day.fullDate)}
                        style={{ cursor: "pointer" }}
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

                {loading && (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#6b7785",
                    }}
                  >
                    جاري تحميل المواعيد...
                  </p>
                )}
                {error && (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#c0392b",
                    }}
                  >
                    {error}
                  </p>
                )}
                {!loading && !error && appointments.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#6b7785",
                    }}
                  >
                    لا توجد مواعيد قادمة.
                  </p>
                )}

                {/* ✅ تصفية المواعيد حسب اليوم المختار */}
                {!loading &&
                  !error &&
                  appointments.length > 0 &&
                  (() => {
                    const activeDay =
                      selectedDayFilter ||
                      (days.length > 0 ? days[0].fullDate : null);
                    const dayAppointments = activeDay
                      ? appointments.filter((a) => a.date === activeDay)
                      : appointments;
                    return (
                      <div className="appointment-table-wrapper">
                        <div className="period-divider-title">
                          الفترات الصباحية{" "}
                          <span className="period-time">
                            (08:00 - 12:00) /{" "}
                            {
                              dayAppointments.filter(
                                (a) => a.period === "morning",
                              ).length
                            }{" "}
                            مواعيد
                          </span>
                        </div>
                        {dayAppointments
                          .filter((a) => a.period === "morning")
                          .map((app) => (
                            <div
                              key={app.id}
                              className="appointment-list-row-item"
                            >
                              <div className="patient-meta-info">
                                <span className="pat-id">{app.id}</span>
                                <strong className="pat-name">{app.name}</strong>
                              </div>
                              <div className="pat-time-info">{app.time}</div>
                              <div className="pat-room-info">{app.room}</div>
                              <div className="pat-status-badge-cell">
                                <span
                                  className={`status-tag ${app.status === "تم الإنجاز" ? "status-done" : app.status === "قيد التنفيذ" ? "status-pending" : "status-next"}`}
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
                                <button
                                  className="btn-action-quick-presc"
                                  onClick={() => handleOpenPrescription(app)}
                                >
                                  إنشاء الوصفة الطبية
                                </button>
                              </div>
                            </div>
                          ))}

                        <div className="period-divider-title">
                          الفترة المسائية{" "}
                          <span className="period-time">
                            (01:00 - 03:00) /{" "}
                            {
                              dayAppointments.filter(
                                (a) => a.period === "evening",
                              ).length
                            }{" "}
                            مواعيد
                          </span>
                        </div>
                        {dayAppointments
                          .filter((a) => a.period === "evening")
                          .map((app) => (
                            <div
                              key={app.id}
                              className="appointment-list-row-item"
                            >
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
                    );
                  })()}
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
                  {patientLoading && (
                    <p style={{ textAlign: "center", color: "#6b7785" }}>
                      جاري تحميل بيانات المريض...
                    </p>
                  )}
                  {patientError && (
                    <p style={{ textAlign: "center", color: "#c0392b" }}>
                      {patientError}
                    </p>
                  )}
                  <div className="details-info-grid">
                    <div className="grid-info-item">
                      <span className="info-label">الاسم :</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.name}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">رقم الهاتف:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.phone}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">البريد الإلكتروني:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.email || "—"}
                      </span>
                    </div>
                    <div className="grid-info-item">
                      <span className="info-label">الفترة:</span>{" "}
                      <span className="info-value font-bold">
                        {selectedPatient.time}
                      </span>
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
                      <span
                        className="info-value text-link-placeholder value link-style"
                        onClick={() =>
                          onNavigate("prescriptions", {
                            selectedPrescriptionId: 1,
                          })
                        }
                        style={{
                          cursor: "pointer",
                          color: "#3b82f6",
                          textDecoration: "underline",
                        }}
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
                  <div className="patient-avatar-placeholder"></div>
                  <div className="summary-text-block">
                    <div className="title-row-patient">
                      <span className="p-name">{selectedPatient.name}</span>
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
                  {/* ✅ تغيير 8 (US-29): حقل التشخيص — مطلوب من الـ API */}
                  <div className="input-field-block full-width-textarea">
                    <label>التشخيص:*</label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="أدخل التشخيص..."
                    />
                  </div>

                  {/* ✅ تغيير 9: عرض أخطاء الـ validation */}
                  {prescriptionError && (
                    <p
                      style={{
                        color: "#c0392b",
                        whiteSpace: "pre-line",
                        marginBottom: "10px",
                      }}
                    >
                      {prescriptionError}
                    </p>
                  )}

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
                      حذف الوصفة
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
                          <label>الجرعة:*</label>
                          <input
                            type="text"
                            required
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
                          <label>التكرار:*</label>
                          <input
                            type="text"
                            required
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
                          <label>مدة العلاج:*</label>
                          <input
                            type="text"
                            required
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
                    {/* ✅ تغيير 10: الزر يعرض حالة التحميل */}
                    <button
                      type="submit"
                      className="btn-submit-save-prescription"
                      disabled={savingPrescription}
                    >
                      {savingPrescription
                        ? "جاري الحفظ..."
                        : "حفظ الوصفة واعتمادها"}
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

        {/* ✅ تغيير 11 (US-31): تاب سجل الوصفات — البيانات من الـ API */}
        {activeTab === "prescriptions" && (
          <div className="prescriptions-archive-view-card">
            <div className="archive-header-row">
              <h3>سجل وأرشيف الوصفات</h3>
              <span className="archive-counter-badge">
                إجمالي الوصفات الموثقة: {prescriptions.length}
              </span>
            </div>

            {prescriptionsLoading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6b7785",
                }}
              >
                جاري تحميل الوصفات...
              </p>
            )}
            {prescriptionsError && (
              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#c0392b",
                }}
              >
                {prescriptionsError}
              </p>
            )}

            {!prescriptionsLoading &&
              !prescriptionsError &&
              prescriptions.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#6b7785",
                  }}
                >
                  لا توجد وصفات طبية سابقة.
                </p>
              )}

            {!prescriptionsLoading &&
              !prescriptionsError &&
              prescriptions.length > 0 && (
                <div className="archive-cards-vertical-list">
                  {prescriptions.map((presc) => (
                    <div key={presc.id} className="archive-patient-item-card">
                      <div className="card-top-header">
                        <div className="right-pat-profile">
                          <div className="avatar-circle-ui">
                            {(presc.patient?.name || "").substring(0, 2)}
                          </div>
                          <div>
                            <h4>{presc.patient?.name || ""}</h4>
                            <p className="subtitle-meds-count">
                              {presc.items?.length || 0} أدوية — التشخيص:{" "}
                              {presc.diagnosis}
                            </p>
                          </div>
                        </div>
                        <span className="card-date-stamp-badge">
                          {presc.date}
                        </span>
                      </div>
                      <div className="card-expanded-details-area">
                        <div className="meds-section-title">
                          الأدوية الموصوفة:
                        </div>
                        <div className="meds-grid-badges">
                          {(presc.items || []).map((item) => (
                            <span key={item.id} className="med-pill-tag">
                              {item.medication_name} {item.dosage} (
                              {item.frequency} - {item.duration})
                            </span>
                          ))}
                        </div>
                        {presc.notes && (
                          <div className="notes-container-box">
                            <strong>التعليمات المصاحبة للوصفة:</strong>
                            <p>{presc.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
