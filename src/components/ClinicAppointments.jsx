import React, { useState } from "react";
import "./ClinicAppointments.css";

const ClinicAppointments = ({ onNavigate }) => {
    const [selectedDay, setSelectedDay] = useState("الأحد");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // 🌟 نافذة الحذف المتمركزة
    const [modalMode, setModalMode] = useState("add"); // 'add' أو 'edit'
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    
    // بيانات الفترات الافتراضية المعروضة بالتصميم لـ "عيادة النور طب اسنان"
    const [appointments, setAppointments] = useState([
        { id: 1, day: "الأحد", timeStr: "08:00 - 10:00", duration: "20 دقيقة", booked: 3, total: 4, status: "نشط" },
        { id: 2, day: "الأحد", timeStr: "10:00 - 12:00", duration: "30 دقيقة", booked: 4, total: 4, status: "نشط" },
        { id: 3, day: "الأحد", timeStr: "14:00 - 17:00", duration: "15 دقيقة", booked: 1, total: 3, status: "نشط" },
    ]);

    // إضافة حقل isActive لتتبع حالة صندوق الاختيار
    const [formData, setFormData] = useState({
        id: null,
        day: "الأحد",
        startTime: "09:00",
        endTime: "10:00",
        duration: "20 دقيقة",
        maxPatients: 4,
        isActive: true 
    });

    const triggerNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
    };

    const handleOpenAdd = () => {
        setModalMode("add");
        setFormData({ 
            id: null, 
            day: selectedDay, 
            startTime: "09:00", 
            endTime: "10:00", 
            duration: "20 دقيقة", 
            maxPatients: 4,
            isActive: true 
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (app) => {
        const [start, end] = app.timeStr.split(" - ");
        setModalMode("edit");
        setFormData({
            id: app.id,
            day: app.day,
            startTime: start.trim(),
            endTime: end.trim(),
            duration: app.duration,
            maxPatients: app.total,
            isActive: app.status === "نشط" 
        });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        // 1. تحويل الوقت الجديد المدخل إلى دقائق
        const [startH, startM] = formData.startTime.split(":").map(Number);
        const [endH, endM] = formData.endTime.split(":").map(Number);
        const newStartMinutes = startH * 60 + startM;
        const newEndMinutes = endH * 60 + endM;

        if (newStartMinutes >= newEndMinutes) {
            triggerNotification("error", "وقت البدء يجب أن يكون قبل وقت الانتهاء.");
            return;
        }

        // 2. فحص التداخل الديناميكي مع التحقق من اليوم
        const hasOverlap = appointments.some(app => {
            if (app.day !== formData.day || (modalMode === "edit" && app.id === formData.id)) {
                return false;
            }

            const times = app.timeStr.split("-").map(t => t.trim());
            if (times.length !== 2) return false;

            const cleanStart = times[0].replace(/[أ-ي\s]/g, "");
            const cleanEnd = times[1].replace(/[أ-ي\s]/g, "");

            const [oldStartH, oldStartM] = cleanStart.split(":").map(Number);
            const [oldEndH, oldEndM] = cleanEnd.split(":").map(Number);

            if (isNaN(oldStartH) || !oldEndH) return false;

            const oldStartMinutes = oldStartH * 60 + oldStartM;
            const oldEndMinutes = oldEndH * 60 + oldEndM;

            return (newStartMinutes < oldEndMinutes && newEndMinutes > oldStartMinutes);
        });

        if (hasOverlap) {
            triggerNotification("error", `هناك تداخل مع فترة محددة مسبقاً: ${formData.startTime} - ${formData.endTime}`);
            return; 
        }

        const updatedStatus = formData.isActive ? "نشط" : "غير نشط";

        if (modalMode === "add") {
            const newApp = {
                id: Date.now(),
                day: formData.day,
                timeStr: `${formData.startTime} - ${formData.endTime}`,
                duration: formData.duration,
                booked: 0,
                total: parseInt(formData.maxPatients),
                status: updatedStatus
            };
            setAppointments([...appointments, newApp]);
            triggerNotification("success", "تم إضافة فترة الموعد بنجاح");
        } else {
            setAppointments(appointments.map(item => item.id === formData.id ? {
                ...item,
                day: formData.day,
                timeStr: `${formData.startTime} - ${formData.endTime}`,
                duration: formData.duration,
                total: parseInt(formData.maxPatients),
                status: updatedStatus 
            } : item));
            triggerNotification("success", "تم حفظ التغييرات بنجاح");
        }
        setIsModalOpen(false);
    };

    // 🌟 فتح نافذة التأكيد المخصصة بدلاً من confirm الافتراضية
    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    // 🌟 تأكيد الحذف الفعلي من داخل النافذة المتمركزة
    const handleConfirmDelete = () => {
        setAppointments(appointments.filter(item => item.id !== formData.id));
        setIsDeleteConfirmOpen(false);
        setIsModalOpen(false);
        triggerNotification("success", "تم حذف الفترة بنجاح");
    };

    const formatDisplayTime = (timeStr) => {
        try {
            return timeStr.split("-").map(t => {
                const cleanT = t.replace(/[أ-ي\s]/g, "").trim();
                const [h, m] = cleanT.split(":").map(Number);
                if (isNaN(h)) return t;
                const ampm = h >= 12 ? "مساءً" : "صباحاً";
                const adjustedHour = h % 12 === 0 ? 12 : h % 12;
                return `${adjustedHour}:${m.toString().padStart(2, '0')} ${ampm}`;
            }).join(" - ");
        } catch (e) {
            return timeStr;
        }
    };

    return (
        <div className="appointments-manager-container" dir="rtl">
        
        {notification.show && (
            <div className={`notification-banner ${notification.type === "success" ? "bg-success" : "bg-error"}`}>
                <span className="banner-icon">{notification.type === "success" ? "✓" : "✕"}</span>
                <span className="banner-text">{notification.message}</span>
            </div>
        )}

        <div className="appointments-dashboard-header">
            <div className="header-meta-info">
                <div className="clinic-selector-dropdown">
                    <span>عيادة النور طب الاسنان</span>
                    <span className="arrow-down-icon">▼</span>
                </div>
                <h2 className="panel-main-title">ادارة المواعيد</h2>
                <button 
                    className="btn-back-navigation" 
                    onClick={() => onNavigate("clinic-profile")}
                >
                    <span> رجوع</span>
                    <span className="back-icon">←</span>
                </button>
            </div>
            
            <div className="sub-profile-info">
                <h3>عيادة النور طب اسنان</h3>
                <p>نستقبل عام طب عام خبرة تتجاوز 21 سنة</p>
            </div>
        </div>

        <div className="action-row-with-stats">
            <button className="btn-add-period" onClick={handleOpenAdd}>
                <span className="plus-sign">+</span> اضافة فترة موعد
            </button>

            <div className="stats-mini-grid">
                <div className="stat-box-card">
                    <div className="stat-percentage">59%</div>
                    <div className="stat-box-desc">معدل الاشغال <span className="sub-desc">35 / 59 فترة</span></div>
                </div>
                <div className="stat-box-card">
                    <div className="stat-big-number">35</div>
                    <div className="stat-box-desc">الحجوزات <span className="sub-desc">هذا الاسبوع</span></div>
                </div>
                <div className="stat-box-card">
                    <div className="stat-big-number">9</div>
                    <div className="stat-box-desc">الفترات النشطة <span className="sub-desc">1 غير نشطة</span></div>
                </div>
                <div className="stat-box-card">
                    <div className="stat-big-number">10</div>
                    <div className="stat-box-desc">إجمالي الفترات <span className="sub-desc">عبر جميع الايام</span></div>
                </div>
            </div>
        </div>

        <div className="days-tabs-bar">
            {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
                <button 
                    key={day} 
                    className={`day-tab-item ${selectedDay === day ? "tab-item-active" : ""}`}
                    onClick={() => setSelectedDay(day)}
                >
                    {day}
                </button>
            ))}
        </div>

        <div className="periods-list-table">
            <div className="table-header-row">
                <div className="col-time">الوقت</div>
                <div className="col-booking">الحجز</div>
                <div className="col-status">الحالة</div>
                <div className="col-actions">إجراءات</div>
            </div>

            {appointments.filter(app => app.day === selectedDay).map((app) => {
                const fillPercentage = (app.booked / app.total) * 100;
                return (
                    <div className="table-body-row" key={app.id}>
                        <div className="col-time font-bold">
                            {formatDisplayTime(app.timeStr)}
                            <span className="duration-sub-label">({app.duration} المدة المحددة للموعد)</span>
                        </div>
                        <div className="col-booking">
                            <div className="booking-progress-container">
                                <span className="booking-count-txt">{app.booked} / {app.total} محجوز</span>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${fillPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-status">
                            <span className={app.status === "نشط" ? "status-pill-green" : "status-pill-red"}>
                                • {app.status}
                            </span>
                        </div>
                        <div className="col-actions">
                            <button className="btn-table-edit" onClick={() => handleOpenEdit(app)}>✏️ تعديل</button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* النافذة الجانبية للتعديل والإضافة */}
        {isModalOpen && (
            <div className="appointments-backdrop-overlay">
                <div className="appointment-side-modal">
                    <div className="modal-top-header">
                        <h3>{modalMode === "edit" ? "تعديل او حذف البيانات" : "إضافة فترة موعد"}</h3>
                        <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>✕</button>
                    </div>

                    <form onSubmit={handleSave} className="modal-input-form">
                        <div className="input-group-field">
                            <label>اليوم والوقت:</label>
                            <select value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})}>
                                <option value="الأحد">الأحد (يوم الاسبوع)</option>
                                <option value="الإثنين">الإثنين</option>
                                <option value="الثلاثاء">الثلاثاء</option>
                                <option value="الأربعاء">الأربعاء</option>
                                <option value="الخميس">الخميس</option>
                            </select>
                        </div>

                        <div className="input-flex-row">
                            <div className="input-group-field flex-1">
                                <label>وقت البدء:</label>
                                <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <div className="input-flex-row flex-1" style={{ gap: "inherit" }}>
                                <div className="input-group-field flex-1">
                                    <label>وقت الانتهاء:</label>
                                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="input-group-field">
                            <label>مدة الموعد:</label>
                            <div className="duration-chips-selector">
                                {["15 دقيقة", "20 دقيقة", "25 دقيقة", "30 دقيقة", "45 دقيقة"].map(dur => (
                                    <button 
                                        type="button" 
                                        key={dur}
                                        className={`chip-btn ${formData.duration === dur ? "chip-btn-active" : ""}`}
                                        onClick={() => setFormData({...formData, duration: dur})}
                                    >
                                        {dur}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group-field">
                            <label>عدد المرضى المسموح به:</label>
                            <select value={formData.maxPatients} onChange={(e) => setFormData({...formData, maxPatients: e.target.value})}>
                                <option value={2}>2 مرضى</option>
                                <option value={3}>3 مرضى</option>
                                <option value={4}>4 مرضى</option>
                                <option value={5}>5 مرضى</option>
                            </select>
                        </div>

                        <div className="checkbox-toggle-option">
                            <input 
                                type="checkbox" 
                                id="openPeriod" 
                                checked={formData.isActive} 
                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})} 
                            />
                            <label htmlFor="openPeriod">الفترة مفتوحة لاستقبال حجوزات جديدة.</label>
                        </div>

                        <div className="modal-actions-footer-buttons">
                            <button type="submit" className="btn-modal-save">✓ حفظ التغييرات</button>
                            {modalMode === "edit" && (
                                <button type="button" className="btn-modal-delete" onClick={handleDeleteClick}>🗑️ حذف الفترة نهائياً</button>
                            )}
                            <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* 🌟 نافذة تأكيد الحذف الممركِزة الجديدة بالكامل */}
        {isDeleteConfirmOpen && (
            <div className="delete-modal-overlay">
                <div className="delete-confirm-modal-card">
                    <div className="delete-modal-icon">⚠️</div>
                    <h3>تأكيد حذف الفترة</h3>
                    <p>هل أنتِ متأكدة من حذف هذه الفترة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
                    
                    <div className="delete-modal-actions">
                        <button className="btn-confirm-danger" onClick={handleConfirmDelete}>
                            نعم، احذفها
                        </button>
                        <button className="btn-confirm-cancel" onClick={() => setIsDeleteConfirmOpen(false)}>
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        )}

        </div>
    );
};

export default ClinicAppointments;