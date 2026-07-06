import React, { useState } from "react";
import "./PatientDashboard.css";
import logo from "../assets/logo.png";
import person from "../assets/person.png";
const PatientDashboard = ({ onNavigate }) => {
  // بيانات المريض الافتراضية
  const [patientInfo] = useState({
    name: "Amjad Al-Masri",
    avatar: person,
  });

  // 📅 بيانات مواعيد مكثفة للتمرير الأفقي (يمين - يسار)
  // 📅 بيانات مواعيد مكثفة مع روابط صور مستقرة ومجربة تماماً لضمان ظهورها
  const [appointments] = useState([
    {
      id: 1,
      doctor: "د. رانيا أحمد",
      specialty: "الجلدية والتجميل الليزر",
      date: "2026-07-22",
      time: "04:30 م",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 2,
      doctor: "د. عبد الرحمن علي",
      specialty: "طب وجراحة الأسنان",
      date: "2026-07-05",
      time: "10:30 ص",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    },
    ,
    {
      id: 3,
      doctor: "د. خالد خليل",
      specialty: "أمراض القلب والأوعية",
      date: "2026-07-18",
      time: "09:15 ص",
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
    },

    {
      id: 4,
      doctor: "د. سمير الباز",
      specialty: "جراحة العظام والمفاصل",
      date: "2026-07-29",
      time: "11:00 ص",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 5,
      doctor: "د. مها السعيد",
      specialty: "طب وجراحة العيون",
      date: "2026-08-02",
      time: "06:15 م",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    },
  ]);

  // 💊 بيانات وصفات طبية مكثفة للتمرير الأفقي (يمين - يسار)
  const [prescriptions] = useState([
    {
      id: "RX-8841",
      doctor: "د. خالد خليل",
      specialty: "القلب والأوعية الدموية",
      date: "2026-06-28",
      status: "نشطة",
    },
    {
      id: "RX-3021",
      doctor: "د. رانيا أحمد",
      specialty: "الطب العام الباطني",
      date: "2026-06-15",
      status: "مكتملة الصرف",
    },
    {
      id: "RX-4412",
      doctor: "د. سمير الباز",
      specialty: "جراحة العظام",
      date: "2026-06-10",
      status: "نشطة",
    },
    {
      id: "RX-9905",
      doctor: "د. مها السعيد",
      specialty: "طب وجراحة العيون",
      date: "2026-05-24",
      status: "منتهية",
    },
    {
      id: "RX-1152",
      doctor: "د. عبد الرحمن علي",
      specialty: "جراحة الأسنان",
      date: "2026-05-01",
      status: "مكتملة الصرف",
    },
  ]);

  // 🏪 صيدليتان فقط كما طلبتِ (تظهر بشكل شبكة ثابتة متناسقة)
  const [pharmacies] = useState([
    {
      id: 1,
      name: "صيدلية الشفاء المركزية",
      branch: "الساحة - مقابل البلدية القديمة",
      timing: "متوفرة على مدار 24/7",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "صيدلية القدس الدولية",
      branch: "شارع الجلاء - بجانب بنك فلسطين",
      timing: "متوفرة على مدار 24/7",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  // 🏢 عيادات مقترحة للتمرير الأفقي الشامل
  const [suggestedClinics] = useState([
    {
      id: 1,
      name: "مركز النور الطبي التخصصي",
      specialty: "طب الأطفال والأسنان",
      rating: 4.7,
    },
    {
      id: 2,
      name: "مجمع الشفاء الطبي الخاص",
      specialty: "العيادات الخارجية الشاملة",
      rating: 4.5,
    },
    {
      id: 3,
      name: "عيادة الرحمة التخصصية",
      specialty: "النساء والولادة والأطفال",
      rating: 4.9,
    },
    {
      id: 4,
      name: "المركز البريطاني لتقويم الأسنان",
      specialty: "تجميل وتقويم الأسنان",
      rating: 4.8,
    },
    {
      id: 5,
      name: "مستوصف الحجاز الشامل",
      specialty: "الجلدية والعلاج الطبيعي",
      rating: 4.4,
    },
    {
      id: 6,
      name: "عيادات ابن سينا التخصصية",
      specialty: "القلب والباطنية والأوعية",
      rating: 4.9,
    },
  ]);

  const [contactForm, setContactForm] = useState({ name: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      "شكراً لتواصلك معنا. تم إرسال استفسارك إلى الدعم الفني لـ Medlink بنجاح!",
    );
    setContactForm({ name: "", message: "" });
  };

  return (
    <div className="patient-dashboard-container" dir="rtl">
      {/* 1. شريط التنقل العلوي الفاخر */}
      <header className="patient-nav-header">
        <div className="patient-header-brand">
          <img src={logo} alt="Medlink Logo" className="logo-image" />
          <span className="Medlink-text-title">Medlink</span>
        </div>
        <nav className="patient-header-menu">
          <span
            className="nav-link-active"
            onClick={() => onNavigate("patient-dashboard")}
          >
            الرئيسية
          </span>
          <span
            onClick={() => onNavigate("clinics-list")}
            style={{ cursor: "pointer" }}
          >
            العيادات
          </span>
          <span onClick={() => onNavigate("appointments")}>المواعيد</span>
          <span onClick={() => onNavigate("prescriptions")}>
            الوصفات الطبية
          </span>
          <span onClick={() => onNavigate("patient-pharmacies")}>
            الصيدليات
          </span>
          <span onClick={() => onNavigate("profile")}>الملف الشخصي</span>
        </nav>
        <button
          className="btn-logout-patient"
          onClick={() => onNavigate("login")}
        >
          تسجيل الخروج
        </button>
      </header>

      {/* 2. قطاع الترحيب والبنر الرئيسي للمريض */}
      <section className="patient-welcome-hero">
        <div className="hero-text-side">
          <h1>مرحباً، {patientInfo.name} 👋</h1>
          <p>
            أهلاً بكِ مجدداً في لوحة تحكمكِ الصحية. يمكنكِ الآن سحب وتمرير
            المواعيد والوصفات الطبية أفقياً لاستعراض كافة السجلات الطبية بسرعة
            وسلاسة.
          </p>
          <div className="hero-action-buttons">
            <button className="btn-hero-primary">🔍 البحث عن عيادة</button>
            <button className="btn-hero-secondary">💊 البحث عن صيدلية</button>
          </div>
        </div>
        <div className="hero-avatar-side">
          <img
            src={patientInfo.avatar}
            alt={patientInfo.name}
            className="patient-main-avatar-img"
          />
        </div>
      </section>

      {/* 3. كروت العدادات الفوقية */}
      <section className="patient-stats-counters">
        <div className="stat-counter-card blue-glow">
          <span className="stat-card-icon">📅</span>
          <div className="stat-card-details">
            <h3>{appointments.length}</h3>
            <p>المواعيد تم حجزها</p>
          </div>
        </div>
        <div className="stat-counter-card cyan-glow">
          <span className="stat-card-icon">📄</span>
          <div className="stat-card-details">
            <h3>{prescriptions.length}</h3>
            <p>الوصفات الطبية المتوفرة</p>
          </div>
        </div>
      </section>

      {/* 4. موجز المواعيد الطبية - يمرر يمين ويسار ↔️ */}
      <section className="dashboard-section-block">
        <div className="section-title-with-hint">
          <h2 className="section-block-main-title">
            📅 موجز المواعيد تم حجزها
          </h2>
          <span className="scroll-hint-badge">اسحبي لمشاهدة المزيد ↔️</span>
        </div>
        <div className="dashboard-scrollable-row">
          {appointments.map((appt) => (
            <div
              className="patient-interactive-card scroll-card-width"
              key={appt.id}
            >
              <img
                src={appt.image}
                alt={appt.doctor}
                className="card-top-thumbnail"
              />
              <div className="card-inner-body">
                <h4>{appt.doctor}</h4>
                <p className="card-sub-info">🧑‍⚕️ التخصص: {appt.specialty}</p>
                <p className="card-sub-info">🗓️ التاريخ: {appt.date}</p>
                <p className="card-sub-info">🕒 الوقت: {appt.time}</p>
                <button className="btn-card-action-details">
                  التفاصيل الكاملة
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. موجز الوصفات الطبية الرقمية - يمرر يمين ويسار ↔️ */}
      <section className="dashboard-section-block">
        <div className="section-title-with-hint">
          <h2 className="section-block-main-title">
            💊 موجز الوصفات الطبية الرقمية
          </h2>
          <span className="scroll-hint-badge">اسحبي لمشاهدة المزيد ↔️</span>
        </div>
        <div className="dashboard-scrollable-row">
          {prescriptions.map((prescription) => (
            <div
              className="patient-interactive-card prescription-card-style scroll-card-width"
              key={prescription.id}
            >
              <div className="prescription-card-header">
                <span className="rx-badge-code">وصفة {prescription.id}</span>
                <span
                  className={`rx-status-tag ${prescription.status === "نشطة" ? "rx-active" : prescription.status === "منتهية" ? "rx-expired" : "rx-done"}`}
                >
                  {prescription.status}
                </span>
              </div>
              <div className="card-inner-body">
                <h4>{prescription.doctor}</h4>
                <p className="card-sub-info">
                  🩺 التخصص: {prescription.specialty}
                </p>
                <p className="card-sub-info">
                  📅 تاريخ الإصدار: {prescription.date}
                </p>
                <button className="btn-card-action-details btn-rx-color">
                  عرض التفاصيل والباركود
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. موجز الصيدليات الشريكة - كرتين ثابتين بشكل شبكي متناسق */}
      <section className="dashboard-section-block">
        <h2 className="section-block-main-title">🏪 موجز الصيدليات الشريكة</h2>
        <div className="pharmacies-fixed-grid">
          {pharmacies.map((pharmacy) => (
            <div className="patient-interactive-card" key={pharmacy.id}>
              <img
                src={pharmacy.image}
                alt={pharmacy.name}
                className="card-top-thumbnail"
              />
              <div className="card-inner-body">
                <h4>{pharmacy.name}</h4>
                <p className="card-sub-info">📍 الفرع: {pharmacy.branch}</p>
                <p className="card-sub-timing">⏱️ {pharmacy.timing}</p>
                <div className="card-footer-rating-row">
                  <span className="rating-star-text">⭐ {pharmacy.rating}</span>
                  <button className="btn-pharmacy-nav-action">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. عيادات ومراكز طبية مقترحة - تمرر يمين ويسار ↔️ */}
      <section className="dashboard-section-block">
        <div className="section-title-with-hint">
          <h2 className="section-block-main-title">
            🏢 عيادات ومراكز طبية مقترحة
          </h2>
          <span className="scroll-hint-badge">اسحبي لمشاهدة المزيد ↔️</span>
        </div>
        <div className="suggested-clinics-flex-row">
          {suggestedClinics.map((clinic) => (
            <div className="suggested-clinic-mini-card" key={clinic.id}>
              <div className="clinic-mini-icon-box">🏥</div>
              <h4>{clinic.name}</h4>
              <p>{clinic.specialty}</p>
              <span className="clinic-star-rating">⭐ {clinic.rating}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. نموذج تواصل معنا */}
      <section className="dashboard-contact-section-wrapper">
        <div className="contact-form-inner-card">
          <h3>✉️ تواصل معنا</h3>
          <p>
            هل تواجه أي مشكلة أو لديك استفسار؟ راسل فريق الدعم الفني لـ Medlink
          </p>
          <form onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="تفاصيل تواصلك مع الدعم الفني والتقني للمنصة..."
              rows="4"
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              required
            ></textarea>
            <button type="submit" className="btn-submit-contact-form">
              إرسال الاستفسار
            </button>
          </form>
        </div>
      </section>

      {/* 9. الفوتر السفلي العريض للمنصة بالكامل */}
      <footer className="Medlink-footer-broad-block">
        <div className="footer-top-columns-grid">
          <div className="footer-brand-column">
            <h4>Medlink</h4>
            <p>
              منصتكِ المتكاملة للربط الذكي الآمن بين العيادات الطبية، الصيدليات
              المعتمدة، والمرضى لتقديم تجربة رعاية صحية تليق بكِ.
            </p>
            <div className="footer-social-icons-row">
              <span>🔵 Facebook</span>
              <span>📸 Instagram</span>
              <span>💼 LinkedIn</span>
            </div>
          </div>
          <div className="footer-links-column">
            <h5>روابط سريعة</h5>
            <ul>
              <li>
                <a href="#home" onClick={() => onNavigate("home")}>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#about" onClick={() => onNavigate("about")}>
                  عن المنصة
                </a>
              </li>
              <li>
                <a href="#services" onClick={() => onNavigate("services")}>
                  الخدمات الطبية
                </a>
              </li>
              <li>
                <a href="#support" onClick={() => onNavigate("support")}>
                  الدعم الفني
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-links-column">
            <h5>الخدمات</h5>
            <ul>
              <li>حجز موعد عيادة</li>
              <li>استشارات عبر الإنترنت</li>
              <li>البحث عن طبيب</li>
              <li>الملفات الطبية الرقمية</li>
            </ul>
          </div>
          <div className="footer-links-column">
            <h5>الدعم الفني</h5>
            <ul>
              <li>الأسئلة الشائعة</li>
              <li>سياسة الخصوصية</li>
              <li>الشروط والأحكام</li>
              <li>تواصل معنا</li>
            </ul>
          </div>
        </div>
        <div className="footer-copyrights-bottom-bar">
          <p>
            © 2026 منصة Medlink للرعاية الطبية الذكية. جميع الحقوق محفوظة للجهة
            المطورة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
