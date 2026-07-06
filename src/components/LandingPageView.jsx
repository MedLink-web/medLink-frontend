import React, { useState } from "react"; 
import logo from "../assets/logo.png"; 
import heroImage from "../assets/hero.png"; 
import "./LandingPageView.css"; 

const LandingPageView = ({ onNavigate }) => {
    // إضافة الـ State جاهزاً لأي استخدام تفاعلي داخلي مستقبلي
    const [currentSection, setCurrentSection] = useState("home");

    const handleRegisterClick = () => {
        // عند الضغط على إنشاء حساب، نتوجه إلى شاشة اختيار نوع الحساب لتطابق الـ case القادمة
        if (onNavigate) onNavigate("role-selection");
    };

    const handleLoginClick = () => {
        if (onNavigate) onNavigate("login");
    };

    // مصفوفة الخدمات من ملف Services.jsx
    const servicesData = [
        {
        id: 1,
        icon: '📅',
        title: 'حجز المواعيد',
        desc: 'احجز موعدك بسهولة مع الأطباء والمراكز الطبية',
        colorClass: 'icon-green'
        },
        {
        id: 2,
        icon: '👤',
        title: 'ابحث عن طبيب',
        desc: 'ابحث عن أفضل الأطباء حسب التخصص والموقع والتقييم',
        colorClass: 'icon-blue'
        },
        {
        id: 3,
        icon: '💬',
        title: 'استشارات عبر الإنترنت',
        desc: 'تحدث مع الأطباء من المنزل في أي وقت ومن أي مكان',
        colorClass: 'icon-purple'
        },
        {
        id: 4,
        icon: '📄',
        title: 'الملفات الطبية',
        desc: 'الوصول الآمن إلى سجلاتك وتقاريرك الطبية في مكان واحد',
        colorClass: 'icon-teal'
        }
    ];

    // مصفوفة الإحصائيات من ملف Stats.jsx
    const statsData = [
        { id: 1, number: '+10K', label: 'مستخدم نشط', icon: '👥' },
        { id: 2, number: '+500', label: 'طبيب معتمد', icon: '🩺' },
        { id: 3, number: '+1K', label: 'موعد محجوز', icon: '📅' },
        { id: 4, number: '+50', label: 'مركز طبي', icon: '🏢' },
    ];

    // مصفوفة خطوات العمل من ملف HowItWorks.jsx
    const stepsData = [
        {
        id: 1,
        stepNumber: '01',
        title: 'سجل دخولك أولاً',
        desc: 'أنشئ حسابك الجديد أو سجل دخولك لتفعيل ملفك الطبي وتخصيص تجربتك.',
        icon: '🔐'
        },
        {
        id: 2,
        stepNumber: '02',
        title: 'ابحث عن طبيبك',
        desc: 'اختر التخصص المطلوب وتصفح مئات الأطباء المعتمدين والموثوقين.',
        icon: '🔍'
        },
        {
        id: 3,
        stepNumber: '03',
        title: 'احجز الموعد المناسب',
        desc: 'حدد التاريخ والوقت الذي يناسب جدولك اليومي بكل مرونة وسهولة.',
        icon: '📅'
        },
        {
        id: 4,
        stepNumber: '04',
        title: 'ابدأ استشارتك فوراً',
        desc: 'تواصل مع طبيبك سواء داخل العيادة أو عبر استشارة فيديو آمنة ومباشرة.',
        icon: '🤝'
        }
    ];

    return (
        <div className="landing-page-view-root" dir="rtl">

        {/* 1️⃣ [Navbar] */}
        <nav className="navbar">
            <div className="navbar-logo">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
            <span className="logo-text">Medlink</span>
            </div>

            <ul className="navbar-links">
            <li><a href="#home" onClick={() => setCurrentSection("home")}>الرئيسية</a></li>
            <li><a href="#services" onClick={() => setCurrentSection("services")}>الخدمات</a></li>
            <li><a href="#about" onClick={() => setCurrentSection("about")}>عن المنصة</a></li>
            <li><a href="#support" onClick={() => setCurrentSection("support")}>الدعم الفني</a></li>
            </ul>

            <div className="navbar-actions">
            <button className="btn-outline" onClick={() => onNavigate("login")}>
                <span className="btn-icon">↩</span> تسجيل الدخول
            </button>
            <button className="btn-solid" onClick={handleRegisterClick}>
                <span className="btn-icon">👤</span> إنشاء حساب
            </button>
            </div>
        </nav>

        {/* 2️⃣ [Hero] */}
        <section id="home" className="hero-container">
            <div className="hero-text-side">
            <h1 className="hero-title">
                رعاية صحية <br />
                <span className="blue-highlight">أسهل وأقرب إليك</span>
            </h1>
            <p className="hero-desc">
                منصة متكاملة تربط المرضى بالأطباء والمراكز الصحية لحجز المواعيد، 
                الاستشارات، والوصول إلى خدمات صحية موثوقة بكل سهولة.
            </p>
            <div className="hero-buttons">
                <button className="btn-hero-solid" onClick={handleRegisterClick}>
                <span className="icon">👤</span> إنشاء حساب
                </button>
                <a href="#services" className="btn-hero-outline">استكشف الخدمات</a>
            </div>
            <div className="hero-features">
                <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>أطباء معتمدون</span>
                </div>
                <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>خدمات آمنة</span>
                </div>
                <div className="feature-item">
                <span className="feature-icon">🎧</span>
                <span>دعم على مدار الساعة</span>
                </div>
            </div>
            </div>
            <div className="hero-image-side">
            <img src={heroImage} alt="Healthcare Illustration" className="hero-illustration" />
            </div>
        </section>

        {/* 3️⃣ [Services] */}
        <section id="services" className="services-section">
            <div className="services-header">
            <h2 className="services-main-title">خدماتنا</h2>
            <p className="services-sub-title">نقدم مجموعة متكاملة من الخدمات الصحية لتلبية احتياجاتك</p>
            </div>
            <div className="services-grid">
            {servicesData.map((service) => (
                <div key={service.id} className="service-card">
                <div className={`service-icon-wrapper ${service.colorClass}`}>
                    <span className="service-icon-emoji">{service.icon}</span>
                </div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.desc}</p>
                </div>
            ))}
            </div>
        </section>

        {/* 4️⃣ [Stats] */}
        <div className="stats-outer-wrapper">
            <div className="stats-container">
            {statsData.map((stat) => (
                <div key={stat.id} className="stat-item-box">
                <div className="stat-top-row">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>

        {/* 5️⃣ [About] */}
        <section id="about" className="about-section">
            <div className="about-container">
            <div className="about-text-side">
                <span className="about-tag">عن المنصة</span>
                <h2 className="about-main-title">منصتك الذكية للصحة</h2>
                <p className="about-description">
                نحن منصة صحية رقمية تهدف إلى تسهيل الوصول إلى الخدمات الصحية 
                وتحسين تجربة المرضى من خلال التكنولوجيا والابتكار.
                </p>
                <div className="about-features-grid">
                <div className="about-feature-card">
                    <div className="feature-icon-circle icon-purple-bg">🏅</div>
                    <h4 className="feature-card-title">الجودة</h4>
                    <p className="feature-card-desc">نلتزم بتقديم خدمات صحية عالية الجودة</p>
                </div>
                <div className="about-feature-card">
                    <div className="feature-icon-circle icon-green-bg">⚙️</div>
                    <h4 className="feature-card-title">السهولة</h4>
                    <p className="feature-card-desc">تجربة بسيطة وسلسة لجميع المستخدمين</p>
                </div>
                <div className="about-feature-card">
                    <div className="feature-icon-circle icon-blue-bg">💙</div>
                    <h4 className="feature-card-title">الثقة</h4>
                    <p className="feature-card-desc">بياناتك آمنة وخدماتنا موثوقة ومعتمدة</p>
                </div>
                </div>
            </div>
            <div className="about-image-side">
                <div className="about-image-wrapper">
                <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600" 
                    alt="Modern Clinic" 
                    className="about-main-img" 
                />
                <div className="vision-floating-card">
                    <div className="vision-icon-shield">🛡️</div>
                    <div className="vision-card-text">
                    <h4 className="vision-title">رؤيتنا</h4>
                    <p className="vision-desc">مجتمع أكثر صحة من خلال تقنيات مبتكرة وخدمات موثوقة.</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* 6️⃣ [How It Works] */}
        <section id="how-it-works" className="steps-section">
            <div className="steps-header">
            <span className="steps-tag">خطوات بسيطة</span>
            <h2 className="steps-main-title">كيف تعمل المنصة?</h2>
            <p className="steps-sub-title">احصل على الرعاية الطبية التي تحتاجها في دقائق معدودة</p>
            </div>
            <div className="steps-grid">
            {stepsData.map((step) => (
                <div key={step.id} className="step-card">
                <div className="step-badge">{step.stepNumber}</div>
                <div className="step-icon-box">{step.icon}</div>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.desc}</p>
                </div>
            ))}
            </div>
        </section>

        {/* 7️⃣ [Footer] */}
        <footer className="main-footer">
            <div className="footer-container">
            <div className="footer-brand-column">
                <div className="footer-logo">
                <img src={logo} alt="Medlink Logo" className="brand-logo-img" />
                <span className="logo-text">Medlink</span>
                </div>
                <div className="social-links">
                <a href="#facebook" className="social-icon" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                </a>
                <a href="#twitter" className="social-icon" aria-label="Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <a href="#instagram" className="social-icon" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
                <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                </a>
                </div>
            </div>

            <div className="footer-links-column">
                <h4 className="column-title">روابط سريعة</h4>
                <ul>
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#about">عن المنصة</a></li>
                <li><a href="#services">الخدمات</a></li>
                <li><a href="#support">الدعم الفني</a></li>
                </ul>
            </div>

            <div className="footer-links-column">
                <h4 className="column-title">الخدمات</h4>
                <ul>
                <li><a href="#appointments">حجز المواعيد</a></li>
                <li><a href="#consultations">استشارات عبر الإنترنت</a></li>
                <li><a href="#search-doctor">ابحث عن طبيب</a></li>
                <li><a href="#medical-files">الملفات الطبية</a></li>
                </ul>
            </div>

            <div id="support" className="footer-links-column">
                <h4 className="column-title">الدعم الفني</h4>
                <ul>
                <li><a href="#faq">الأسئلة الشائعة</a></li>
                <li><a href="#privacy">سياسة الخصوصية</a></li>
                <li><a href="#terms">الشروط والأحكام</a></li>
                <li><a href="#contact">تواصل معنا</a></li>
                </ul>
            </div>
            </div>

            <div className="footer-bottom-bar">
            <p>جميع الحقوق محفوظة © Medlink 2026</p>
            <span 
                onClick={() => onNavigate && onNavigate('admin-dashboard')} 
                style={{ 
                cursor: 'pointer', 
                color: '#fafafa', 
                fontSize: '13px',
                userSelect: 'none',
                marginRight: '15px',
                transition: 'color 0.2s ease'
                }}
                title="Admin Access"
            >
                رنين
            </span>
            </div>
        </footer>

        </div>
    );
};

export default LandingPageView;