import React from "react";
import "./PatientDashboard.css";

const PatientDashboard = ({ onLogout, onNavigate }) => {
  // بيانات تجريبية لمحاكاة محتوى لوحة التحكم (Cards Data)
  const appointments = [1, 2, 3];
  const prescriptions = [1, 2, 3];
  const pharmacies = [
    { name: "صيدلية عادل", address: "الساحة مقابل بلدية غزة", rating: "4.9" },
    { name: "صيدلية عادل", address: "الساحة مقابل بلدية غزة", rating: "4.9" },
  ];
  const clinics = [
    "مركز النور الطبي أطفال",
    "مركز النور الطبي أطفال",
    "مركز النور الطبي أطفال",
  ];

  return (
    <div className="dashboard-wrapper" dir="rtl">
      {/* 1. الشريط العلوي للوحة التحكم (Dashboard Navbar) */}
      <nav className="dashboard-nav">
        <div className="nav-right">
          <span className="nav-logo-text">Medlink</span>

          <div className="nav-links">
            <a href="#home" className="active">
              الرئيسية
            </a>
            <a href="#clinics">العيادات</a>
            <a href="#appointments">مواعيدي</a>
            <a href="#pharmacies">الصيدليات</a>
            <a href="#prescriptions">الوصفات الطبية</a>

            {/* 👤 تم تعديل رابط الملف الشخصي الأصلي ليعمل برمجياً فوراً عند الضغط */}
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate("profile");
                }
              }}
              style={{ fontWeight: "bold" }}
            >
              الملف الشخصي
            </a>
          </div>
        </div>

        {/* زر تسجيل الخروج مربوط بدالة onLogout الممررة من App */}
        <button
          className="btn-logout"
          onClick={() => onLogout && onLogout()}
          style={{ cursor: "pointer" }}
        >
          تسجيل الخروج
        </button>
      </nav>

      <div className="dashboard-container">
        {/* 2. قسم الترحيب والبيانات السريعة الإحصائية */}
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">مرحباً ، مستخدم</h1>
            <div className="action-buttons-group">
              <button className="btn-action-blue">البحث عن عيادة</button>
              <button className="btn-action-blue">البحث عن صيدلية</button>
            </div>
          </div>

          {/* الضغط على الصورة الشخصية أيضاً ينقل للملف الشخصي كلفتة تجربة مستخدم رائعة */}
          <div
            className="user-avatar-wrapper"
            onClick={() => onNavigate && onNavigate("profile")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
              alt="User Profile"
              className="user-avatar-img"
            />
          </div>
        </header>

        {/* 3. الكروت الإحصائية العلوية (Stats Counters) */}
        <section className="stats-counters-grid">
          <div className="counter-card">
            <div className="counter-icon-box">📅</div>
            <div className="counter-info">
              <span className="counter-number">02</span>
              <span className="counter-label">المواعيد تم حجزها</span>
            </div>
          </div>
          <div className="counter-card">
            <div className="counter-icon-box">📄</div>
            <div className="counter-info">
              <span className="counter-number">02</span>
              <span className="counter-label">
                الوصفات الطبية المتوفرة حالياً
              </span>
            </div>
          </div>
        </section>

        {/* 4. موجز المواعيد التي تم حجزها */}
        <section className="dashboard-section">
          <h2 className="section-main-title">موجز المواعيد تم حجزها</h2>
          <div className="cards-scroll-grid">
            {appointments.map((_, idx) => (
              <div key={idx} className="medical-item-card">
                <div className="card-image-placeholder appointments-bg"></div>
                <div className="card-details-body">
                  <p className="detail-line">اسم الدكتور :</p>
                  <p className="detail-line">التخصص :</p>
                  <p className="detail-line">التاريخ :</p>
                  <button className="btn-card-details">التفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. موجز الوصفات الطبية */}
        <section className="dashboard-section">
          <h2 className="section-main-title">موجز الوصفات الطبية :</h2>
          <div className="cards-scroll-grid">
            {prescriptions.map((_, idx) => (
              <div key={idx} className="medical-item-card">
                <div className="card-image-placeholder doctor-avatar-bg"></div>
                <div className="card-details-body">
                  <p className="detail-line">اسم الدكتور :</p>
                  <p className="detail-line">التخصص :</p>
                  <p className="detail-line">رقم الوصفة :</p>
                  <p className="detail-line">التاريخ :</p>
                  <button className="btn-card-details">التفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. موجز الصيدليات الطبية */}
        <section className="dashboard-section">
          <h2 className="section-main-title">موجز الصيدليات الطبية :</h2>
          <div className="cards-scroll-grid">
            {pharmacies.map((pharmacy, idx) => (
              <div key={idx} className="medical-item-card horizontal-style">
                <div className="card-image-placeholder pharmacy-bg"></div>
                <div className="card-details-body">
                  <p className="detail-line">
                    اسم الصيدلية :{" "}
                    <span className="bold-text">{pharmacy.name}</span>
                  </p>
                  <p className="detail-line">
                    الفرع :{" "}
                    <span className="bold-text">{pharmacy.address}</span>
                  </p>
                  <p className="detail-line highlight-green">
                    متوفرة على مدار 24/7
                  </p>
                  <p className="detail-line rating-line">
                    التقييم : <span>⭐ {pharmacy.rating}</span>
                  </p>
                  <div className="card-footer-buttons">
                    <button className="btn-card-action outline">
                      عرض على الخريطة
                    </button>
                    <button className="btn-card-action primary">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. عيادات مقترحة */}
        <section className="dashboard-section">
          <h2 className="section-main-title">عيادات مقترحة</h2>
          <div className="clinics-suggested-grid">
            {clinics.map((clinicName, idx) => (
              <div key={idx} className="clinic-suggestion-card">
                <div className="clinic-icon-circle">🏥</div>
                <h3 className="clinic-card-name">{clinicName}</h3>
                <div className="clinic-rating">⭐ 4.3</div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. نموذج تواصل معنا (Contact Section) */}
        <section className="dashboard-contact-section">
          <h2 className="contact-main-title">تواصل معنا</h2>
          <form
            className="dashboard-contact-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="الاسم"
              className="contact-input-field"
            />
            <textarea
              placeholder="تواصل مع الدعم الفني"
              className="contact-textarea-field"
              rows="4"
            ></textarea>
            <button type="submit" className="btn-send-query">
              ارسال الاستفسار
            </button>
          </form>
          <div className="contact-footer-info">
            <span className="info-item">📞 +970596555555</span>
            <span className="info-item">📧 example@example.com</span>
          </div>
        </section>
      </div>

      {/* 9. تذييل الصفحة المعتمد */}
      <footer className="dashboard-main-footer">
        <p className="footer-copyright">جميع الحقوق محفوظة Medlink © 2026</p>
        <div className="footer-bottom-links">
          <a href="#privacy">سياسة الخصوصية</a>
          <a href="#terms">الشروط والأحكام</a>
          <a href="#about">تواصل معنا</a>
          <a href="#blog">المدونة</a>
        </div>
        <p className="footer-brand-slogan">ابدأ رحلتك الصحية الرقمية اليوم</p>
      </footer>
    </div>
  );
};

export default PatientDashboard;
