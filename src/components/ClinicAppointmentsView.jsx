import React, { useState, useEffect } from "react";
import "./ClinicAppointmentsView.css";

const ClinicAppointmentsView = ({ onBack }) => {
  const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const [selectedDay, setSelectedDay] = useState("الأحد");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  // حالات المودال
  const [targetDay, setTargetDay] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [duration, setDuration] = useState("30 دقيقة");
  const [maxPatients, setMaxPatients] = useState(4);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const getToken = () => localStorage.getItem("auth_token");

  // ─── تحويل اسم اليوم إلى أقرب تاريخ ────────────
  const getNextDateForDay = (dayName) => {
    const dayMap = {
      الأحد: 0,
      الإثنين: 1,
      الثلاثاء: 2,
      الأربعاء: 3,
      الخميس: 4,
      الجمعة: 5,
      السبت: 6,
    };
    const today = new Date();
    const targetDay = dayMap[dayName];
    const diff = (targetDay - today.getDay() + 7) % 7 || 7;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return date.toISOString().split("T")[0];
  };

  // ─── جلب الـ slots من API ─────────────────────
  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/clinic/slots",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setAllSlots(data.data);
      }
    } catch {
      console.error("فشل تحميل المواعيد");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── تصفية الـ slots حسب اليوم المختار ─────────
  const getDayName = (dateStr) => {
    const dayNames = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return dayNames[new Date(dateStr).getDay()];
  };

  const currentDaySlots = allSlots.filter(
    (s) => getDayName(s.date) === selectedDay,
  );

  // ─── إحصائيات ────────────────────────────────
  const stats = [
    {
      label: "إجمالي الفترات",
      value: allSlots.length.toString(),
      sub: "عبر جميع الأيام",
    },
    {
      label: "الفترات النشطة",
      value: allSlots.filter((s) => !s.is_fully_booked).length.toString(),
      sub: "نشطة حالياً",
    },
    {
      label: "الحجوزات",
      value: allSlots.reduce((sum, s) => sum + s.booked_count, 0).toString(),
      sub: "إجمالي الحجوزات",
    },
    {
      label: "الأماكن المتبقية",
      value: allSlots
        .reduce((sum, s) => sum + s.remaining_capacity, 0)
        .toString(),
      sub: "مكان متاح",
    },
  ];

  // ─── تنسيق الوقت ─────────────────────────────
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "مساءً" : "صباحاً";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMinute = m < 10 ? `0${m}` : m;
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // ─── فتح مودال الإضافة ───────────────────────
  const openAddModal = () => {
    setModalMode("add");
    setTargetDay(selectedDay);
    setSelectedDate(getNextDateForDay(selectedDay));
    setStartTime("09:00");
    setEndTime("10:00");
    setDuration("30 دقيقة");
    setMaxPatients(4);
    setAlertConfig({ show: false, type: "", message: "" });
    setIsModalOpen(true);
  };

  // ─── فتح مودال التعديل ───────────────────────
  const openEditModal = (slot) => {
    setModalMode("edit");
    setSelectedSlotId(slot.id);
    setTargetDay(getDayName(slot.date));
    setSelectedDate(slot.date);
    setStartTime(slot.start_time.substring(0, 5));
    setEndTime(slot.end_time.substring(0, 5));
    setMaxPatients(slot.max_capacity);
    setAlertConfig({ show: false, type: "", message: "" });
    setIsModalOpen(true);
  };

  // ─── حفظ (إضافة أو تعديل) ────────────────────
  const handleSavePeriod = async (e) => {
    e.preventDefault();

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    if (newStart >= newEnd) {
      setAlertConfig({
        show: true,
        type: "error",
        message: "وقت البدء يجب أن يكون قبل وقت الانتهاء",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (modalMode === "add") {
        // POST إضافة slot جديد
        const response = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/clinic/slots",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              date: selectedDate,
              start_time: startTime,
              end_time: endTime,
              max_capacity: maxPatients,
            }),
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setAllSlots((prev) => [...prev, data.data]);
          setAlertConfig({
            show: true,
            type: "success",
            message: "تم إضافة فترة الموعد بنجاح ✅",
          });
        } else if (response.status === 422) {
          const firstError = Object.values(data.errors)[0][0];
          setAlertConfig({ show: true, type: "error", message: firstError });
          return;
        }
      } else {
        // PUT تعديل slot
        const response = await fetch(
          `https://medlink-backend-production-e2f2.up.railway.app/api/clinic/slots/${selectedSlotId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              date: selectedDate,
              start_time: startTime,
              end_time: endTime,
              max_capacity: maxPatients,
            }),
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setAllSlots((prev) =>
            prev.map((s) => (s.id === selectedSlotId ? data.data : s)),
          );
          setAlertConfig({
            show: true,
            type: "success",
            message: "تم تعديل فترة الموعد بنجاح ✅",
          });
        } else if (response.status === 422) {
          const firstError = Object.values(data.errors)[0][0];
          setAlertConfig({ show: true, type: "error", message: firstError });
          return;
        }
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setAlertConfig({ show: false, type: "", message: "" });
        setSelectedDay(targetDay);
      }, 1200);
    } catch {
      setAlertConfig({
        show: true,
        type: "error",
        message: "تعذر الاتصال بالسيرفر",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── حذف slot ────────────────────────────────
  const handleDeletePeriod = async () => {
    try {
      const response = await fetch(
        `https://medlink-backend-production-e2f2.up.railway.app/api/clinic/slots/${selectedSlotId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        setAllSlots((prev) => prev.filter((s) => s.id !== selectedSlotId));
        setAlertConfig({
          show: true,
          type: "success",
          message: "تم حذف فترة الموعد بنجاح ✅",
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setAlertConfig({ show: false, type: "", message: "" });
        }, 1000);
      }
    } catch {
      setAlertConfig({ show: true, type: "error", message: "فشل حذف الموعد" });
    }
  };

  if (isLoading) {
    return (
      <div
        className="appointments-management-page"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل المواعيد...</p>
      </div>
    );
  }

  return (
    <div className="appointments-management-page" dir="rtl">
      <header className="appointments-header-bar">
        <div className="header-right-side">
          <button className="btn-select-clinic-dropdown">
            إدارة المواعيد <span>▼</span>
          </button>
        </div>
        <h2>إدارة المواعيد</h2>
      </header>

      <div className="appointments-body-container">
        <div className="clinic-meta-appointment-row">
          <div className="clinic-title-info">
            <h3>إدارة فترات المواعيد</h3>
            <p>أضف وعدّل فترات استقبال المرضى</p>
          </div>
          <button className="btn-add-time-slot" onClick={openAddModal}>
            + إضافة فترة موعد
          </button>
        </div>

        {/* إحصائيات */}
        <div className="appointment-stats-grid-row">
          {stats.map((stat, idx) => (
            <div key={idx} className="appointment-stat-mini-card">
              <span className="stat-label-title">{stat.label}</span>
              <h3 className="stat-value-num">{stat.value}</h3>
              <span className="stat-sub-desc">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* تبويبات الأيام */}
        <div className="days-navigation-tab-bar">
          {days.map((day) => (
            <button
              key={day}
              className={`day-tab-item-btn ${selectedDay === day ? "active-day" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
              {allSlots.filter((s) => getDayName(s.date) === day).length >
                0 && (
                <span
                  style={{
                    marginRight: "4px",
                    background: "#3182ce",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "1px 6px",
                    fontSize: "11px",
                  }}
                >
                  {allSlots.filter((s) => getDayName(s.date) === day).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* جدول الـ slots */}
        <div className="appointments-slots-table-wrapper">
          <div className="table-header-titles-row">
            <div className="col-cell text-right">التاريخ والوقت</div>
            <div className="col-cell text-center">الحجز</div>
            <div className="col-cell text-center">الحالة</div>
            <div className="col-cell text-center">إجراءات</div>
          </div>

          <div className="table-body-rows-list">
            {currentDaySlots.length === 0 ? (
              <div className="no-appointments-placeholder">
                لا يوجد فترات مواعيد مضافة ليوم {selectedDay} حتى الآن.
              </div>
            ) : (
              currentDaySlots.map((slot) => (
                <div key={slot.id} className="table-data-item-row">
                  <div className="col-cell text-right slot-time-cell">
                    <span style={{ fontSize: "12px", color: "#718096" }}>
                      {slot.date}
                    </span>
                    <br />
                    <span className="main-time-range">
                      {formatTimeDisplay(slot.start_time)} -{" "}
                      {formatTimeDisplay(slot.end_time)}
                    </span>
                  </div>
                  <div className="col-cell text-center slot-booking-progress-cell">
                    <span className="booked-count-txt">
                      {slot.booked_count} / {slot.max_capacity} محجوز
                    </span>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(slot.booked_count / slot.max_capacity) * 100}%`,
                          backgroundColor: slot.is_fully_booked
                            ? "#e53e3e"
                            : slot.booked_count === 0
                              ? "#cbd5e0"
                              : "#dd6b20",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-cell text-center">
                    <span
                      className={
                        slot.is_fully_booked
                          ? "status-badge-full"
                          : "status-badge-active"
                      }
                    >
                      {slot.is_fully_booked ? "ممتلئ" : "نشط"}
                    </span>
                  </div>
                  <div className="col-cell text-center">
                    <button
                      className="btn-table-action-edit"
                      onClick={() => openEditModal(slot)}
                    >
                      📝 تعديل
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="btn-back-to-clinic-profile" onClick={onBack}>
          ← العودة لبيانات العيادة
        </button>
      </div>

      {/* ── المودال ──────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay-backdrop">
          <div className="add-slot-modal-card">
            {alertConfig.show && (
              <div className={`modal-alert-banner banner-${alertConfig.type}`}>
                <span>{alertConfig.message}</span>
                <span
                  className="close-alert-btn"
                  onClick={() =>
                    setAlertConfig({ ...alertConfig, show: false })
                  }
                >
                  ✕
                </span>
              </div>
            )}

            <header className="modal-custom-header">
              <span
                className="modal-close-icon"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </span>
              <h3>
                {modalMode === "add"
                  ? "إضافة فترة موعد"
                  : "تعديل أو حذف الفترة"}
              </h3>
            </header>

            <form className="modal-form-content" onSubmit={handleSavePeriod}>
              {/* اليوم */}
              <div className="form-input-group">
                <label>اليوم:</label>
                <select
                  className="modal-select-field"
                  value={targetDay}
                  onChange={(e) => {
                    setTargetDay(e.target.value);
                    setSelectedDate(getNextDateForDay(e.target.value));
                  }}
                >
                  <option value="">اختار يوم الأسبوع</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* التاريخ */}
              <div className="form-input-group">
                <label>التاريخ:</label>
                <input
                  type="date"
                  className="modal-input-field"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* الوقت */}
              <div className="form-row-two-col">
                <div className="form-input-group">
                  <label>وقت البدء:</label>
                  <input
                    type="time"
                    className="modal-input-field"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="form-input-group">
                  <label>وقت الانتهاء:</label>
                  <input
                    type="time"
                    className="modal-input-field"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* مدة الموعد */}
              <div className="form-input-group">
                <label>مدة الموعد:</label>
                <div className="duration-options-row">
                  {[
                    "15 دقيقة",
                    "20 دقيقة",
                    "25 دقيقة",
                    "30 دقيقة",
                    "40 دقيقة",
                  ].map((dur, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`btn-duration-option ${duration === dur ? "selected-dur" : ""}`}
                      onClick={() => setDuration(dur)}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* عدد المرضى */}
              <div className="form-input-group">
                <label>عدد المرضى المسموح به:</label>
                <input
                  type="number"
                  className="modal-input-field input-small-width"
                  value={maxPatients}
                  min="1"
                  max="100"
                  onChange={(e) => setMaxPatients(parseInt(e.target.value))}
                />
              </div>

              {/* أزرار */}
              <div className="modal-action-footer-buttons">
                {modalMode === "add" ? (
                  <>
                    <button
                      type="submit"
                      className="btn-modal-submit-action"
                      disabled={isSaving}
                    >
                      {isSaving ? "جاري الإضافة..." : "+ إضافة فترة"}
                    </button>
                    <button
                      type="button"
                      className="btn-modal-cancel-action"
                      onClick={() => setIsModalOpen(false)}
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="btn-modal-submit-action save-edit-btn"
                      disabled={isSaving}
                    >
                      {isSaving ? "جاري الحفظ..." : "✓ حفظ التعديلات"}
                    </button>
                    <button
                      type="button"
                      className="btn-modal-delete-action"
                      onClick={handleDeletePeriod}
                    >
                      🗑️ حذف الفترة
                    </button>
                    <button
                      type="button"
                      className="btn-modal-cancel-action"
                      onClick={() => setIsModalOpen(false)}
                    >
                      إلغاء
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicAppointmentsView;
