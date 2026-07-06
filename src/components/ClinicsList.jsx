import React, { useState } from "react";
import "./ClinicsList.css";
import logo from "../assets/logo.png";

const ClinicsList = ({ onNavigate }) => {
  const categories = [
    "الكل",
    "طب الأسنان",
    "طب العيون",
    "طب الأطفال",
    "طب القلب",
    "طب الأعصاب",
  ];
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const clinics = [
    {
      id: 1,
      name: "عيادة النور لطب الأسنان",
      specialty: "طب الأطفال",
      doctor: "د. سارة المنصور (استشارية طب أطفال)",
      assistant: "د. علي الغامدي (أخصائي جراحة الوجه والفكين)",
      location: "غزة - شارع الوحدة",
      time: "08:00 صباحاً - 4:00 مساءً",
      rating: 4.8,
    },
    {
      id: 2,
      name: "مركز الرؤية لطب العيون",
      specialty: "طب العيون",
      doctor: "د. أحمد جودة (استشاري طب وجراحة العيون)",
      assistant: "د. ياسمين الحلو (أخصائية بصريات)",
      location: "غزة - الرمال - مقابل مفترق الاتصالات",
      time: "09:00 صباحاً - 5:00 مساءً",
      rating: 4.9,
    },
    {
      id: 3,
      name: "مجمع الشفاء التخصصي للأسنان",
      specialty: "طب الأسنان",
      doctor: "د. خالد العفيفي (أخصائي تركيبات وتقويم)",
      assistant: "د. منى رضوان (طب أسنان عام)",
      location: "غزة - شارع عمر المختار",
      time: "10:00 صباحاً - 6:00 مساءً",
      rating: 4.7,
    },
    {
      id: 4,
      name: "عيادة الحياة التخصصية للقلب",
      specialty: "طب القلب",
      doctor: "د. محمد القدوة (استشاري أمراض القلب والأوعية)",
      assistant: "د. رامي طه (أخصائي قسطرة قلبية)",
      location: "غزة - النصر - بالقرب من مستشفى العيون",
      time: "08:30 صباحاً - 3:30 مساءً",
      rating: 4.8,
    },
    {
      id: 5,
      name: "المركز الدولي لطب وجراحة الأعصاب",
      specialty: "طب الأعصاب",
      doctor: "د. يوسف المغاري (أخصائي مخ وأعصاب)",
      assistant: "د. هند شرف (علاج طبيعي وتأهيل)",
      location: "غزة - الثلاثيني",
      time: "11:00 صباحاً - 7:00 مساءً",
      rating: 4.6,
    }
  ];

  /* 🌟 منطق الفلترة المحدث دون حذف أي شيء من المصفوفة الأساسية */
  const filteredClinics = selectedCategory === "الكل"
    ? clinics
    : clinics.filter(clinic => clinic.specialty === selectedCategory);

  return (
    <div className="clinics-list-page" dir="rtl">
      {/* الهيدر العلوي بنصوص واضحة وعريضة */}
      <header className="Medlink-custom-navbar">
        <div className="nav-right-side">
          {/* الشعار الدائري الأزرق */}
          <div className="Medlink-nav-logo">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
          </div>
          {/* الروابط بالترتيب والمسميات الدقيقة */}
          <nav className="Medlink-nav-links">
            <span
              className="Medlink-nav-item"
              onClick={() => onNavigate("patient-dashboard")}
            >
              الرئيسية
            </span>
            <span
              className="Medlink-nav-item active-nav-tab"
              onClick={() => onNavigate("clinics-list")}
            >
              العيادات
            </span>
            <span
              className="Medlink-nav-item"
              onClick={() => onNavigate("appointments")}
            >
              مواعيدي
            </span>
            <span
              className="Medlink-nav-item"
              onClick={() => onNavigate("patient-pharmacies")}
            >
              الصيدليات
            </span>
            <span
              className="Medlink-nav-item"
              onClick={() => onNavigate("prescriptions")}
            >
              الوصفات الطبية
            </span>
            <span
              className="Medlink-nav-item"
              onClick={() => onNavigate("profile")}
            >
              الملف الشخصي
            </span>
          </nav>
        </div>

        {/* زر تسجيل الخروج المستطيل الأزرق على اليسار */}
        <div className="nav-left-side">
          <button
            className="btn-Medlink-logout"
            onClick={() => onNavigate("login")}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="figma-layout-container">
        {/* البنر الأزرق الكبير */}
        <section className="search-hero-banner">
          <h1>ابحث عن العيادة المناسبة لاحتياجاتك</h1>
          <p>
            تصفح شبكتنا من العيادات المعتمدة والموثوقة، قم بالتصفية حسب التخصص
            واعثر على الرعاية التي تستحقها.
          </p>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="ابحث عن العيادات، أو الأطباء، أو التخصصات..."
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="stats-badges-row">
            <div className="stat-badge">
              <span>+6</span> تخصصات
            </div>
            <div className="stat-badge">
              <span>+10</span> أطباء موظفين
            </div>
            <div className="stat-badge">
              <span>+6</span> عيادات معتمدة
            </div>
          </div>
        </section>

        {/* فلتر التخصصات */}
        <section className="categories-filter-section">
          <span className="filter-label">التخصص:</span>
          <div className="categories-chips-row">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`category-chip ${selectedCategory === cat ? "active-chip" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 🌟 مؤشر سحب جانبي مرئي للمريض ليشبه تصميم صورة image_c08485.jpg */}
        {filteredClinics.length > 3 && (
          <div style={{ fontSize: "13px", color: "#2563eb", marginBottom: "10px", paddingRight: "10px", fontWeight: "600" }}>
            ← اسحبي لمشاهدة المزيد من العيادات
          </div>
        )}

        {/* شبكة العيادات */}
        <main className="clinics-grid-section">
          {/* 🌟 تم التغيير لعرض filteredClinics المفلترة حياً */}
          <div className="clinics-cards-grid">
            {filteredClinics.map((clinic, index) => (
              <div className="clinic-figma-card" key={index}>
                <div className="card-top-row">
                  <span className="rating-tag">⭐ {clinic.rating}</span>
                  <div className="mini-avatar-placeholder">🏥</div>
                </div>
                <div className="card-main-info">
                  <h4>{clinic.name}</h4>
                  <span className="spec-badge">{clinic.specialty}</span>
                  <hr className="card-divider" />
                  <div className="info-item">
                    👤 {clinic.doctor}
                  </div>
                  <div className="info-item">
                    📞 {clinic.assistant}
                  </div>
                  <div className="info-item">📍 {clinic.location}</div>
                  <div className="info-item">🕒 {clinic.time}</div>
                </div>
                <button
                  className="btn-view-details-full"
                  onClick={() => onNavigate("clinic-details")}
                >
                  عرض تفاصيل العيادة
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* الفوتر الممركز والموسط تماماً في أسفل الشاشة */}
      <footer className="simple-figma-footer">
        <div className="footer-logo">Medlink </div>
        <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
      </footer>
    </div>
  );
};

export default ClinicsList;
