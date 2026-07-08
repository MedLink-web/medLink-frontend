import React, { useState, useEffect } from "react";
// ☝️ تغيير 1: أضفنا useEffect
import logo from "../assets/logo.png";
import "./PatientsManagement.css";

const PatientsManagement = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("جميع الحالات");
  const [periodFilter, setPeriodFilter] = useState("جميع الفترات");

  const clinicName = "عيادة النور الطبية";

  // ✅ تغيير 2: بدل البيانات الثابتة — حالات جديدة
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ تغيير 3 (US-25): جلب حجوزات العيادة من الـ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://medlink-backend-production-e2f2.up.railway.app/api/clinic/bookings",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          // ✅ تغيير 4: تحويل بيانات الـ API لشكل الجدول الموجود
          const mapped = data.data.map((item) => {
            const startTime = item.slot?.start_time || "";
            const hour = parseInt(startTime.split(":")[0], 10);
            const period = hour < 12 ? "صباحاً" : "مساءً";
            const displayTime = startTime.substring(0, 5);

            // تحويل status من الـ API لنفس النصوص يلي بالجدول
            const statusMap = {
              مؤكد: "تم التأكيد",
              ملغي: "تم الإلغاء",
              "قيد الانتظار": "قيد الانتظار",
            };

            return {
              id: String(item.id).padStart(3, "0"),
              patient: item.patient?.name || "",
              date: item.slot?.date || "",
              period: period,
              time: displayTime,
              doctor: "", // الـ API ما بترجع اسم الدكتور حالياً
              status: statusMap[item.status_label] || item.status_label,
            };
          });
          setBookings(mapped);
        } else {
          setError("حدث خطأ في جلب الحجوزات");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // تصفية البيانات
  const filteredBookings = bookings.filter((item) => {
    const matchesSearch =
      item.patient.includes(searchTerm) ||
      item.doctor.includes(searchTerm) ||
      item.id.includes(searchTerm);
    const matchesStatus =
      statusFilter === "جميع الحالات" || item.status === statusFilter;
    const matchesPeriod =
      periodFilter === "جميع الفترات" || item.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // حساب الإحصائيات
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "تم التأكيد",
  ).length;
  const pendingCount = bookings.filter(
    (b) => b.status === "قيد الانتظار",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "تم الإنجاز",
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "تم التأكيد":
        return "status-confirmed";
      case "قيد الانتظار":
        return "status-pending";
      case "تم الإلغاء":
        return "status-cancelled";
      case "تم الإنجاز":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <div className="patients-management-container" dir="rtl">
      <aside className="clinic-sidebar-nav">
        <div className="sidebar-brand-section">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          <div className="sidebar-brand-text">
            <h4>{clinicName}</h4>
            <span className="sidebar-user-role">لوحة التحكم</span>
          </div>
        </div>

        <nav className="sidebar-menu-links">
          <div className="menu-group-label">القائمة الرئيسية</div>

          <button onClick={() => onNavigate && onNavigate("clinic-profile")}>
            <span className="menu-icon">📂</span> ملف العيادة
          </button>

          <button
            onClick={() => onNavigate && onNavigate("doctors-management")}
          >
            <span className="menu-icon">👥</span> إدارة الأطباء
          </button>

          <button
            onClick={() => onNavigate && onNavigate("clinic-appointments")}
          >
            <span className="menu-icon">
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5V1C5 0.447715 5.44772 0 6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5Z"
                  fill="black"
                />
                <path
                  d="M13 5V1C13 0.447715 13.4477 0 14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5Z"
                  fill="black"
                />
                <path
                  d="M18 5C18 4.44772 17.5523 4 17 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5ZM20 19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19Z"
                  fill="black"
                />
                <path
                  d="M19 8C19.5523 8 20 8.44771 20 9C20 9.55229 19.5523 10 19 10H1C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8H19Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            مواعيد العيادة
          </button>

          <button
            className="active-nav-btn"
            onClick={() => onNavigate && onNavigate("patients-management")}
          >
            <span className="menu-icon"></span> إدارة حجوزات المرضى
          </button>
        </nav>
      </aside>

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
            <span className="search-icon-inside"></span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="جميع الحالات">جميع الحالات</option>
            <option value="تم التأكيد">تم التأكيد</option>
            <option value="قيد الانتظار">قيد الانتظار</option>
            <option value="تم الإلغاء">تم الإلغاء</option>
            <option value="تم الإنجاز">تم الإنجاز</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="جميع الفترات">جميع الفترات</option>
            <option value="صباحاً">الفترة الصباحية</option>
            <option value="مساءً">الفترة المسائية</option>
          </select>
        </div>

        {/* ⏳ حالة التحميل */}
        {loading && (
          <p style={{ textAlign: "center", padding: "40px", color: "#6b7785" }}>
            جاري تحميل الحجوزات...
          </p>
        )}

        {/* ❌ حالة الخطأ */}
        {error && (
          <p style={{ textAlign: "center", padding: "40px", color: "#c0392b" }}>
            {error}
          </p>
        )}

        {/* الجدول الطبي */}
        {!loading && !error && (
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
                      <td>
                        <span className="period-badge">{book.period}</span>
                      </td>
                      <td>{book.time}</td>
                      <td>{book.doctor}</td>
                      <td>
                        <span
                          className={`status-pill-badge ${getStatusClass(book.status)}`}
                        >
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
        )}

        {!loading && !error && (
          <div className="table-footer-summary">
            <span>
              عرض {filteredBookings.length} من أصل {totalBookings} حجوزات
            </span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientsManagement;
