import React, { useState } from "react";
import logo from "../assets/logo.png"; // استيراد اللوغو الخاص بـ Medlink
import "./PatientsManagement.css";

const PatientsManagement = ({ onNavigate }) => {
  // حالات التصفية والبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("جميع الحالات");
  const [periodFilter, setPeriodFilter] = useState("جميع الفترات");

  // اسم العيادة لعرضه ديناميكياً في السايد بار المدمج
  const clinicName = "عيادة النور الطبية";

  // البيانات الافتراضية المطابقة لتصميم فبجما
  const [bookings, setBookings] = useState([
    { id: "001", patient: "احمد محمد", date: "3/6/2026", period: "صباحاً", time: "9:00", doctor: "د. خالد خليل", status: "تم التأكيد" },
    { id: "002", patient: "سارة علي", date: "3/6/2026", period: "صباحاً", time: "9:30", doctor: "د. خالد خليل", status: "قيد الانتظار" },
    { id: "003", patient: "محمد محمود", date: "3/6/2026", period: "مساءً", time: "4:00", doctor: "د. رانيا أحمد", status: "تم الإنجاز" },
    { id: "004", patient: "منى سعيد", date: "4/6/2026", period: "صباحاً", time: "10:15", doctor: "د. خالد خليل", status: "تم التأكيد" },
    { id: "005", patient: "بلال ياسين", date: "4/6/2026", period: "مساءً", time: "5:00", doctor: "د. رانيا أحمد", status: "تم الإلغاء" },
    { id: "006", patient: "فاطمة عمر", date: "5/6/2026", period: "صباحاً", time: "11:00", doctor: "د. خالد خليل", status: "تم التأكيد" }
  ]);

  // تصفية البيانات
  const filteredBookings = bookings.filter((item) => {
    const matchesSearch = item.patient.includes(searchTerm) || item.doctor.includes(searchTerm) || item.id.includes(searchTerm);
    const matchesStatus = statusFilter === "جميع الحالات" || item.status === statusFilter;
    const matchesPeriod = periodFilter === "جميع الفترات" || item.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // حساب الإحصائيات
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === "تم التأكيد").length;
  const pendingCount = bookings.filter((b) => b.status === "قيد الانتظار").length;
  const completedCount = bookings.filter((b) => b.status === "تم الإنجاز").length;

  const getStatusClass = (status) => {
    switch (status) {
      case "تم التأكيد": return "status-confirmed";
      case "قيد الانتظار": return "status-pending";
      case "تم الإلغاء": return "status-cancelled";
      case "تم الإنجاز": return "status-completed";
      default: return "";
    }
  };

  return (
    <div className="patients-management-container" dir="rtl">
      
      {/* 📥 شريط الملاحة الجانبي المدمج والأنيق (Dark Sidebar with Brand Identity) */}
      <aside className="clinic-sidebar-nav">
        {/* الهوية المدمجة من ملف العيادة */}
        <div className="sidebar-brand-section">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          <div className="sidebar-brand-text">
            <h4>{clinicName}</h4>
            <span className="sidebar-user-role">لوحة التحكم</span>
          </div>
        </div>

        {/* روابط القائمة الرئيسية الموحدة بستايل فبجما الأنيق */}
        <nav className="sidebar-menu-links">
          <div className="menu-group-label">القائمة الرئيسية</div>
          
          <button onClick={() => onNavigate && onNavigate("clinic-profile")}>
            <span className="menu-icon">📂</span> ملف العيادة
          </button>
          
          <button onClick={() => onNavigate && onNavigate("doctors-management")}>
            <span className="menu-icon">👥</span> إدارة الأطباء
          </button>
          
          <button onClick={() => onNavigate && onNavigate("clinic-appointments")}>
            <span className="menu-icon">📅</span> مواعيد العيادة
          </button>
          
          <button className="active-nav-btn" onClick={() => onNavigate && onNavigate("patients-management")}>
            <span className="menu-icon">💊</span> إدارة حجوزات المرضى
          </button>
        </nav>
      </aside>

      {/* محتوى الشاشة الرئيسي */}
      <main className="patients-main-content">
        <div className="page-title-block">
          <h2>حجوزات المرضى</h2>
          <p>إدارة ومراجعة جميع سجلات المواعيد</p>
        </div>

        {/* الإحصائيات */}
        <div className="stats-cards-row">
          <div className="mini-stat-card card-blue">
            <div className="stat-num">{totalBookings}</div>
            <div className="stat-label">إجمالي الحجوزات</div>
          </div>
          <div className="mini-stat-card card-green">
            <div className="stat-num">{confirmedCount}</div>
            <div className="stat-label">مؤكدة اليوم</div>
          </div>
          <div className="mini-stat-card card-orange">
            <div className="stat-num">{pendingCount}</div>
            <div className="stat-label">قيد الانتظار</div>
          </div>
          <div className="mini-stat-card card-purple">
            <div className="stat-num">{completedCount}</div>
            <div className="stat-label">تم إنجازها</div>
          </div>
        </div>

        {/* شريط البحث والتصفية */}
        <div className="filter-controls-card">
          <span className="filter-section-title">تصفية:</span>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="بحث عن مريض أو طبيب أو رقم حجز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon-inside">🔍</span>
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="جميع الحالات">جميع الحالات</option>
            <option value="تم التأكيد">تم التأكيد</option>
            <option value="قيد الانتظار">قيد الانتظار</option>
            <option value="تم الإلغاء">تم الإلغاء</option>
            <option value="تم الإنجاز">تم الإنجاز</option>
          </select>

          <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="جميع الفترات">جميع الفترات</option>
            <option value="صباحاً">الفترة الصباحية</option>
            <option value="مساءً">الفترة المسائية</option>
          </select>
        </div>

        {/* الجدول الطبي */}
        <div className="bookings-table-wrapper">
          <table className="patients-beautiful-table">
            <thead>
              <tr>
                <th>رقم الحجز</th>
                <th>المريض</th>
                <th>تاريخ الموعد</th>
                <th>الفترة</th>
                <th>الوقت</th>
                <th>الطبيب</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((book) => (
                  <tr key={book.id}>
                    <td className="bold-id">#{book.id}</td>
                    <td className="patient-name-cell">{book.patient}</td>
                    <td>{book.date}</td>
                    <td><span className="period-badge">{book.period}</span></td>
                    <td>{book.time}</td>
                    <td>{book.doctor}</td>
                    <td>
                      <span className={`status-pill-badge ${getStatusClass(book.status)}`}>
                        • {book.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-empty">
                    لا توجد حجوزات تطابق خيارات التصفية الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-summary">
          <span>عرض {filteredBookings.length} من أصل {totalBookings} حجوزات</span>
        </div>
      </main>
    </div>
  );
};

export default PatientsManagement;