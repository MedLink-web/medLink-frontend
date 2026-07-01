import React, { useState } from "react";
import "./ClinicAppointmentsView.css";

const ClinicAppointmentsView = ({ onBack }) => {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    
    const [selectedDay, setSelectedDay] = useState("الأحد");
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [modalMode, setModalMode] = useState("add"); // "add" أو "edit"
    const [alertConfig, setAlertConfig] = useState({ show: false, type: "", message: "" }); 

    // 1. تحويل المواعيد إلى State موزع على كل أيام الأسبوع كبيانات أولية (مبنية على الـ Figma)
    const [appointmentsData, setAppointmentsData] = useState({
        "الأحد": [
            { id: 1, startTime: "08:00", endTime: "10:00", duration: "30 دقيقة", booked: "3 / 4 محجوز", percentage: 75, status: "نشط" },
            { id: 2, startTime: "10:00", endTime: "12:00", duration: "30 دقيقة", booked: "4 / 4 محجوز", percentage: 100, status: "نشط" },
            { id: 3, startTime: "14:00", endTime: "17:00", duration: "30 دقيقة", booked: "2 / 4 محجوز", percentage: 50, status: "نشط" }
        ],
        "الإثنين": [
            { id: 4, startTime: "09:00", endTime: "11:00", duration: "20 دقيقة", booked: "0 / 5 محجوز", percentage: 0, status: "نشط" }
        ],
        "الثلاثاء": [],
        "الأربعاء": [],
        "الخميس": [],
        "الجمعة": [],
        "السبت": []
    });

    // حالات التحكم بنماذج المدخلات داخل المودال
    const [targetDay, setTargetDay] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [duration, setDuration] = useState("30 دقيقة");
    const [maxPatients, setMaxPatients] = useState(4);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    const stats = [
        { label: "إجمالي الفترات", value: Object.values(appointmentsData).flat().length.toString(), sub: "عبر جميع الأيام" },
        { label: "الفترات النشطة", value: Object.values(appointmentsData).flat().filter(s => s.status === "نشط").length.toString(), sub: "نشطة حالياً" },
        { label: "الحجوزات", value: "35", sub: "هذا الأسبوع" },
        { label: "معدل الإشغال", value: "59%", sub: "مبني على الحجوزات" }
    ];

    // دالة تحويل الوقت النصي (HH:MM) إلى دقائق لتسهيل مقارنة التداخل والتقاطع
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // فتح مودال إضافة فترة جديدة
    const openAddModal = () => {
        setModalMode("add");
        setTargetDay(selectedDay); // تحديد اليوم الحالي تلقائياً للتسهيل
        setStartTime("09:00");
        setEndTime("10:00");
        setDuration("30 دقيقة");
        setMaxPatients(4);
        setAlertConfig({ show: false, type: "", message: "" });
        setIsModalOpen(true);
    };

    // فتح مودال التعديل والحذف وتعبئة البيانات الحالية للفترة
    const openEditModal = (slot) => {
        setModalMode("edit");
        setSelectedSlotId(slot.id);
        setTargetDay(selectedDay);
        setStartTime(slot.startTime);
        setEndTime(slot.endTime);
        setDuration(slot.duration);
        setMaxPatients(parseInt(slot.booked.split("/")[1]) || 4);
        setAlertConfig({ show: false, type: "", message: "" });
        setIsModalOpen(true);
    };

    // دالة الحفظ (إضافة أو تعديل) مع فحص التداخل الفعلي
    const handleSavePeriod = (e) => {
        e.preventDefault();

        if (!targetDay) {
            setAlertConfig({ show: true, type: "error", message: "يرجى اختيار يوم الأسبوع أولاً" });
            return;
        }

        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);

        if (newStart >= newEnd) {
            setAlertConfig({ show: true, type: "error", message: "وقت البدء يجب أن يكون قبل وقت الانتهاء" });
            return;
        }

        // جلب الفترات الموجودة في اليوم المحدد للفحص (مع استثناء الفترة الحالية إن كنا في وضع التعديل)
        const existingSlots = appointmentsData[targetDay] || [];
        const hasConflict = existingSlots.some(slot => {
            if (modalMode === "edit" && slot.id === selectedSlotId) return false;
            
            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);
            // شرط التداخل الرياضي: (وقت البدء الجديد < وقت نهاية القديم) و (وقت الانتهاء الجديد > وقت بدء القديم)
            return newStart < slotEnd && newEnd > slotStart;
        });

        // إذا وُجد تداخل، يظهر شريط الخطأ الأحمر مباشرة ولا يتم الحفظ
        if (hasConflict) {
            setAlertConfig({
                show: true,
                type: "error",
                message: `هناك تداخل مع فترة محددة مسبقاً في يوم ${targetDay}`
            });
            return;
        }

        // تحضير كائن الفترة
        const periodPayload = {
            id: modalMode === "add" ? Date.now() : selectedSlotId,
            startTime,
            endTime,
            duration,
            booked: `0 / ${maxPatients} محجوز`,
            percentage: 0,
            status: "نشط"
        };

        if (modalMode === "add") {
            // إضافة الفترة الجديدة لليوم المحدد فعلياً
            setAppointmentsData(prev => ({
                ...prev,
                [targetDay]: [...prev[targetDay], periodPayload]
            }));
            setAlertConfig({ show: true, type: "success", message: "تم اضافة فترة الموعد بنجاح" });
        } else {
            // تعديل الفترة الحالية في اليوم المحدد فعلياً
            setAppointmentsData(prev => {
                // إذا قام المستخدم بتغيير اليوم، نحذفها من اليوم القديم وننقلها للجديد
                const updatedData = { ...prev };
                if (targetDay !== selectedDay) {
                    updatedData[selectedDay] = updatedData[selectedDay].filter(s => s.id !== selectedSlotId);
                    updatedData[targetDay] = [...(updatedData[targetDay] || []), periodPayload];
                } else {
                    updatedData[selectedDay] = updatedData[selectedDay].map(s => s.id === selectedSlotId ? periodPayload : s);
                }
                return updatedData;
            });
            setAlertConfig({ show: true, type: "success", message: "تم تعديل فترة الموعد بنجاح" });
        }

        // إغلاق المودال بعد ثانية ونصف لرؤية شريط النجاح الأخضر
        setTimeout(() => {
            setIsModalOpen(false);
            setAlertConfig({ show: false, type: "", message: "" });
            setSelectedDay(targetDay); // الانتقال التلقائي لليوم الذي تمت الإضافة فيه
        }, 1200);
    };

    // دالة الحذف الفعلي للفترة نهائياً
    const handleDeletePeriod = () => {
        setAppointmentsData(prev => ({
            ...prev,
            [selectedDay]: prev[selectedDay].filter(slot => slot.id !== selectedSlotId)
        }));

        setAlertConfig({ show: true, type: "success", message: "تم حذف فترة الموعد بنجاح" });

        setTimeout(() => {
            setIsModalOpen(false);
            setAlertConfig({ show: false, type: "", message: "" });
        }, 1000);
    };

    // تنسيق عرض الوقت النصي لعرضه في الجدول بشكل احترافي أمثلة: (08:00 صباحاً)
    const formatTimeDisplay = (timeStr) => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(":").map(Number);
        const ampm = h >= 12 ? "مساءً" : "صباحاً";
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const displayMinute = m < 10 ? `0${m}` : m;
        return `${displayHour}:${displayMinute} ${ampm}`;
    };

    return (
        <div className="appointments-management-page" dir="rtl">
            <header className="appointments-header-bar">
                <div className="header-right-side">
                    <button className="btn-select-clinic-dropdown">
                        إدارة : عيادة النور طب اسنان <span>▼</span>
                    </button>
                </div>
                <h2>ادارة المواعيد</h2>
            </header>

            <div className="appointments-body-container">
                <div className="clinic-meta-appointment-row">
                    <div className="clinic-title-info">
                        <h3>عيادة النور طب اسنان</h3>
                        <p>طب عام خبرة منذ 21 سنة</p>
                    </div>
                    <button className="btn-add-time-slot" onClick={openAddModal}>
                        + اضافة فترة موعد
                    </button>
                </div>

                <div className="appointment-stats-grid-row">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="appointment-stat-mini-card">
                            <span className="stat-label-title">{stat.label}</span>
                            <h3 className="stat-value-num">{stat.value}</h3>
                            <span className="stat-sub-desc">{stat.sub}</span>
                        </div>
                    ))}
                </div>

                {/* شريط اختيار الأيام السبعة بالكامل */}
                <div className="days-navigation-tab-bar">
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`day-tab-item-btn ${selectedDay === day ? "active-day" : ""}`}
                            onClick={() => setSelectedDay(day)}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                <div className="appointments-slots-table-wrapper">
                    <div className="table-header-titles-row">
                        <div className="col-cell text-right">الوقت</div>
                        <div className="col-cell text-center">الحجز</div>
                        <div className="col-cell text-center">الحالة</div>
                        <div className="col-cell text-center">إجراءات</div>
                    </div>

                    <div className="table-body-rows-list">
                        {(appointmentsData[selectedDay] || []).length === 0 ? (
                            <div className="no-appointments-placeholder">
                                لا يوجد فترات مواعيد مضافة ليوم {selectedDay} حتي الآن.
                            </div>
                        ) : (
                            appointmentsData[selectedDay].map((slot) => (
                                <div key={slot.id} className="table-data-item-row">
                                    <div className="col-cell text-right slot-time-cell">
                                        <span className="main-time-range">
                                            {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                                        </span>
                                        <span className="sub-duration-txt">({slot.duration} للموعد)</span>
                                    </div>
                                    <div className="col-cell text-center slot-booking-progress-cell">
                                        <span className="booked-count-txt">{slot.booked}</span>
                                        <div className="progress-bar-track">
                                            <div 
                                                className="progress-bar-fill" 
                                                style={{ 
                                                    width: `${slot.percentage}%`, 
                                                    backgroundColor: slot.percentage === 100 ? "#e53e3e" : slot.percentage === 0 ? "#cbd5e0" : "#dd6b20" 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="col-cell text-center">
                                        <span className="status-badge-active">{slot.status}</span>
                                    </div>
                                    <div className="col-cell text-center">
                                        <button className="btn-table-action-edit" onClick={() => openEditModal(slot)}>
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

            {/* المودال المنبثق التفاعلي */}
            {isModalOpen && (
                <div className="modal-overlay-backdrop">
                    <div className="add-slot-modal-card">
                        
                        {/* شريط التنبيه العلوي الديناميكي بالألوان الصحيحة */}
                        {alertConfig.show && (
                            <div className={`modal-alert-banner banner-${alertConfig.type}`}>
                                <span>{alertConfig.message}</span>
                                <span className="close-alert-btn" onClick={() => setAlertConfig({ ...alertConfig, show: false })}>✕</span>
                            </div>
                        )}

                        <header className="modal-custom-header">
                            <span className="modal-close-icon" onClick={() => setIsModalOpen(false)}>✕</span>
                            <h3>{modalMode === "add" ? "إضافة فترة موعد" : "تعديل او حذف البيانات"}</h3>
                        </header>

                        <form className="modal-form-content" onSubmit={handleSavePeriod}>
                            <div className="form-input-group">
                                <label>اليوم والوقت:</label>
                                <select 
                                    className="modal-select-field"
                                    value={targetDay}
                                    onChange={(e) => setTargetDay(e.target.value)}
                                >
                                    <option value="">اختار يوم الأسبوع</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

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

                            <div className="form-input-group">
                                <label>مدة الموعد:</label>
                                <div className="duration-options-row">
                                    {["15 دقيقة", "20 دقيقة", "25 دقيقة", "30 دقيقة", "40 دقيقة"].map((dur, i) => (
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

                            <div className="form-input-group">
                                <label>عدد المرضى المسموح به:</label>
                                <input 
                                    type="number" 
                                    className="modal-input-field input-small-width" 
                                    value={maxPatients}
                                    onChange={(e) => setMaxPatients(e.target.value)}
                                />
                            </div>

                            <div className="form-toggle-switch-row">
                                <label className="switch-container">
                                    <input type="checkbox" defaultChecked />
                                    <span className="switch-slider"></span>
                                </label>
                                <span className="toggle-label-text">الفترة مفتوحة لاستقبال حجوزات جديدة.</span>
                            </div>

                            <div className="modal-action-footer-buttons">
                                {modalMode === "add" ? (
                                    <>
                                        <button type="submit" className="btn-modal-submit-action">
                                            + إضافة فترة
                                        </button>
                                        <button type="button" className="btn-modal-cancel-action" onClick={() => setIsModalOpen(false)}>
                                            إلغاء
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="submit" className="btn-modal-submit-action save-edit-btn">
                                            ✓ حفظ التعديلات
                                        </button>
                                        <button type="button" className="btn-modal-delete-action" onClick={handleDeletePeriod}>
                                            🗑️ حذف الفترة نهائياً
                                        </button>
                                        <button type="button" className="btn-modal-cancel-action" onClick={() => setIsModalOpen(false)}>
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