import React from "react";
import logo from "../assets/logo.png";
import "./PatientDashboard.css";

function PatientDashboard({ onLogout, onNavigate, activeView }) {
  return (
    <div className="dashboard-wrapper" dir="rtl">
      {/* شريط التنقل العلوي الاحترافي المدمج (Navbar) */}
      <nav className="dashboard-nav">
        <div className="nav-right">
          <div className="brand-identity">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            <span className="nav-logo-text">MedLink</span>
          </div>
          <div className="nav-links">
            <a
              href="#home"
              className={activeView === "home" ? "active" : ""}
              onClick={() => onNavigate && onNavigate("home")}
            >
              الرئيسية
            </a>
            <a
              href="#!"
              className={activeView === "clinics" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault(); // يمنع المتصفح من تغيير الرابط أو تحريك الشاشة للأعلى
                if (onNavigate) onNavigate("patient-clinics");
              }}
            >
              العيادات
            </a>
            <a
              href="#appointments"
              className={activeView === "appointments" ? "active" : ""}
              onClick={() => onNavigate && onNavigate("appointments")}
            >
              مواعيدي
            </a>
            <a
              href="#pharmacies"
              className={activeView === "pharmacies" ? "active" : ""}
              onClick={() => onNavigate && onNavigate("pharmacies")}
            >
              الصيدليات
            </a>
            <a
              href="#prescriptions"
              className={activeView === "prescriptions" ? "active" : ""}
              onClick={() => onNavigate && onNavigate("prescriptions")}
            >
              الوصفات الطبية
            </a>
            <a
              href="#profile"
              className={activeView === "profile" ? "active" : ""}
              onClick={() => onNavigate && onNavigate("profile")}
            >
              الملف الشخصي
            </a>
          </div>
        </div>
        <div className="nav-left">
          <button className="btn-logout" onClick={onLogout}>
            تسجيل الخروج
          </button>
        </div>
      </nav>

      {/* حاوية المحتوى الرئيسي المحاذية ممتدة الأطراف */}
      <div className="dashboard-container">
        {/* 1️⃣ البانر الترحيبي المتكامل ولوحة التحكم العليا */}
        <div className="welcome-banner">
          <div className="user-profile-meta">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
              className="user-avatar-img"
              alt="User Avatar"
            />
            <div className="welcome-text">
              <h1>مرحباً، Amira Amjad</h1>
              <p className="welcome-subtext">
                مرحباً بك مجدداً في لوحتك الطبية الموحدة المخصصة لرعاية صحتك
              </p>
            </div>
          </div>
          <div className="quick-actions">
            <button
              className="btn-action-blue"
              onClick={() => onNavigate && onNavigate("clinics")}
            >
              البحث عن عيادة
            </button>
            <button
              className="btn-action-blue"
              onClick={() => onNavigate && onNavigate("pharmacies")}
            >
              البحث عن صيدلية
            </button>
          </div>
        </div>

        {/* 2️⃣ شبكة الإحصائيات الرقمية العليا (Grid) */}
        <div className="stats-counters-grid">
          <div className="counter-card">
            <div className="counter-icon-box">📅</div>
            <div>
              <span className="counter-number">02</span>
              <span className="counter-label">المواعيد تم حجزها</span>
            </div>
          </div>

          <div className="counter-card">
            <div className="counter-icon-box">📄</div>
            <div>
              <span className="counter-number">02</span>
              <span className="counter-label">
                الوصفات الطبية المتوفرة حالياً
              </span>
            </div>
          </div>
        </div>

        {/* 3️⃣ قسم موجز المواعيد المحجوزة المنظم بالـ Grid */}
        <div className="dashboard-section">
          <h3 className="section-main-title">موجز المواعيد التي تم حجزها</h3>
          <div className="medical-data-grid">
            {/* كارت مواعيد 1 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Doctor"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الدكتور:</span> د. أحمد محمد
                </div>
                <div className="detail-line">
                  <span className="bold-text">التخصص:</span> طب أسنان
                </div>
                <div className="detail-line">
                  <span className="bold-text">التاريخ:</span> 2026/06/28
                </div>
                <button className="btn-card-details">التفاصيل</button>
              </div>
            </div>

            {/* كارت مواعيد 2 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Doctor"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الدكتور:</span> د. سميرة علي
                </div>
                <div className="detail-line">
                  <span className="bold-text">التخصص:</span> طب باطني
                </div>
                <div className="detail-line">
                  <span className="bold-text">التاريخ:</span> 2026/07/02
                </div>
                <button className="btn-card-details">التفاصيل</button>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ قسم موجز الوصفات الطبية */}
        <div className="dashboard-section">
          <h3 className="section-main-title">موجز الوصفات الطبية</h3>
          <div className="medical-data-grid">
            {/* كارت وصفة 1 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Prescription"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الدكتور:</span> د. أحمد محمد
                </div>
                <div className="detail-line">
                  <span className="bold-text">التخصص:</span> طب أسنان
                </div>
                <div className="detail-line">
                  <span className="bold-text">رقم الوصفة:</span> #MED-9921
                </div>
                <button className="btn-card-details">عرض الوصفة</button>
              </div>
            </div>

            {/* كارت وصفة 2 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Prescription"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الدكتور:</span> د. رانيا كمال
                </div>
                <div className="detail-line">
                  <span className="bold-text">التخصص:</span> جلدية
                </div>
                <div className="detail-line">
                  <span className="bold-text">رقم الوصفة:</span> #MED-7452
                </div>
                <button className="btn-card-details">عرض الوصفة</button>
              </div>
            </div>
          </div>
        </div>

        {/* 5️⃣ قسم موجز الصيدليات المطور */}
        <div className="dashboard-section">
          <h3 className="section-main-title">موجز الصيدليات المتاحة</h3>
          <div className="medical-data-grid">
            {/* كارت صيدلية 1 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Pharmacy"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الصيدلية:</span> صيدلية عادل
                </div>
                <div className="detail-line">
                  <span className="bold-text">الفرع:</span> الساحة مقابل بلدية
                  غزة
                </div>
                <div className="detail-line highlight-green">
                  متوفرة على مدار 24/7
                </div>
                <div className="detail-line">
                  <span className="bold-text">التقييم:</span> ⭐ 4.9
                </div>
                <div className="card-footer-buttons">
                  <button className="btn-card-action primary">
                    عرض التفاصيل
                  </button>
                  <button className="btn-card-action outline">
                    على الخريطة
                  </button>
                </div>
              </div>
            </div>

            {/* كارت صيدلية 2 */}
            <div className="medical-item-card">
              <div className="card-image-box">
                <img
                  src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=400&auto=format&fit=crop"
                  className="card-img-src"
                  alt="Pharmacy"
                />
              </div>
              <div className="card-details-body">
                <div className="detail-line">
                  <span className="bold-text">اسم الصيدلية:</span> صيدلية الشفاء
                  المحدثة
                </div>
                <div className="detail-line">
                  <span className="bold-text">الفرع:</span> النصر بجانب مفترق
                  اللبابيدي
                </div>
                <div className="detail-line highlight-green">
                  متوفرة على مدار 24/7
                </div>
                <div className="detail-line">
                  <span className="bold-text">التقييم:</span> ⭐ 4.7
                </div>
                <div className="card-footer-buttons">
                  <button className="btn-card-action primary">
                    عرض التفاصيل
                  </button>
                  <button className="btn-card-action outline">
                    على الخريطة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6️⃣ قسم العيادات المقترحة ممتد الأطراف والمنظم بالـ Grid */}
        <div className="dashboard-section">
          <h3 className="section-main-title">عيادات مقترحة لكِ</h3>
          <div className="clinics-suggested-grid">
            <div className="clinic-suggestion-card">
              <div className="clinic-icon-circle">🏥</div>
              <div className="clinic-card-name">مركز النور الطبي أطفال</div>
              <div className="clinic-rating">4.3 ⭐</div>
            </div>
            <div className="clinic-suggestion-card">
              <div className="clinic-icon-circle">🦷</div>
              <div className="clinic-card-name">
                عيادة الشفاء للأسنان التخصصية
              </div>
              <div className="clinic-rating">4.8 ⭐</div>
            </div>
            <div className="clinic-suggestion-card">
              <div className="clinic-icon-circle">👁️</div>
              <div className="clinic-card-name">
                مركز القدس لطب العيون والقلب
              </div>
              <div className="clinic-rating">4.5 ⭐</div>
            </div>
          </div>
        </div>

        {/* 7️⃣ قسم تواصل معنا المطور بصرياً */}
        <div className="dashboard-contact-section">
          <h3 className="contact-main-title">تواصل معنا والدعم الفني</h3>
          <form
            className="dashboard-contact-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="contact-input-field"
              required
            />
            <textarea
              placeholder="تواصل مع الدعم الفني أو ارسل استفسارك هنا..."
              rows="4"
              className="contact-textarea-field"
              required
            ></textarea>
            <button type="submit" className="btn-send-query">
              ارسال الاستفسار
            </button>
          </form>
          <div className="contact-footer-info">
            <span>📞 +970596555555</span>
            <span>📧 support@Medlink.com</span>
          </div>
        </div>
      </div>

      {/* 8️⃣ الفوتر السفلي العريض والأنيق */}
      <footer className="dashboard-main-footer">
        <p>جميع الحقوق محفوظة © Medlink 2026</p>
        <div className="footer-bottom-links">
          <a href="#privacy">سياسة الخصوصية</a>
          <a href="#terms">الشروط والأحكام</a>
          <a href="#contact">تواصل معنا</a>
          <a href="#blog">المدونة</a>
        </div>
        <p className="footer-brand-slogan">
          ابدأ رحلتك الصحية الآمنة اليوم مع منصتنا الموحدة
        </p>
      </footer>
    </div>
  );
}

export default PatientDashboard;
