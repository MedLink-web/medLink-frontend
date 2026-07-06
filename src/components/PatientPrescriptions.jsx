import React, { useState, useEffect } from "react";
import "./PatientPrescriptions.css";
import logo from "../assets/logo.png";

const PatientPrescriptions = ({ onNavigate, selectedPrescriptionId }) => {
    // إدارة الأكورديون: تخزين معرّف الوصفة المفتوحة حالياً (الوصفة الأولى مفتوحة تلقائياً)
    const [openPrescriptionId, setOpenPrescriptionId] = useState(1);

    // شاشة العرض الحالية: 'list' لعرض الوصفات، أو 'search' لعرض شاشة البحث عن الدواء
    const [currentView, setCurrentView] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // بيانات الوصفات الطبية المستوحاة بالكامل من تصميم Figma في image_390a42.png
    const prescriptionsData = [
        {
        id: 1,
        doctorName: "د. محمد خالد",
        date: "3 يوليو 2026",
        medsCount: "2 دواء",
        medications: [
            {
            name: "باراسيتامول",
            dosage: "500 ملغ",
            frequency: "3 مرات يومياً",
            duration: "7 أيام",
            },
            {
            name: "أموكسيسيلين",
            dosage: "500 ملغ",
            frequency: "عند الحاجة",
            duration: "5 أيام",
            },
        ],
        },
        {
        id: 2,
        doctorName: "د. محمود وليد",
        date: "15 يوليو 2026",
        medsCount: "2 دواء",
        medications: [
            {
            name: "باراسيتامول",
            dosage: "500 ملغ",
            frequency: "3 مرات يومياً",
            duration: "7 أيام",
            },
        ],
        },
    ];

    // بيانات الصيدليات التجريبية للمحاكاة بناءً على الموضح في image_390a7c.png
    const mockPharmacies = [
        {
        id: 1,
        name: "صيدلية النور الطبية",
        status: "متوفر",
        phone: "0591234567",
        address: "غزة، الساحة، مقابل بلدية غزة",
        price: "22 شيكل",
        supportedMeds: ["باراسيتامول", "أموكسيسيلين"],
        },
        {
        id: 2,
        name: "صيدلية النور الطبية", // نفس الاسم لتطابق محتوى الصورة الفيجما الثانية
        status: "متوفر بكمية محدودة",
        phone: "0591234567",
        address: "غزة، الساحة، مقابل بلدية غزة",
        price: "22 شيكل",
        supportedMeds: ["باراسيتامول"],
        },
    ];

    /* 🛠️ تأثير جانبي (Effect) لفتح الأكورديون المختار تلقائياً في حال تمريره من صفحة تفاصيل المريض */
    useEffect(() => {
        if (selectedPrescriptionId) {
            setOpenPrescriptionId(selectedPrescriptionId);
        }
    }, [selectedPrescriptionId]);

    /* 🛠️ تصفية المصفوفة: إذا وُجد معرّف ممرر، اعرض الوصفة المطابقة فقط، وإلا اعرض القائمة الكاملة */
    const displayedPrescriptions = selectedPrescriptionId
        ? prescriptionsData.filter((pres) => pres.id === selectedPrescriptionId)
        : prescriptionsData;

    const toggleAccordion = (id) => {
        setOpenPrescriptionId(openPrescriptionId === id ? null : id);
    };

    const handleQuickSearch = (medName) => {
        setSearchQuery(medName);
        setHasSearched(true);
        setCurrentView("search");
    };

    const triggerSearchAction = () => {
        if (searchQuery.trim() !== "") {
        setHasSearched(true);
        }
    };

    return (
        <div className="patient-prescriptions-page" dir="rtl">
        {/* 🌐 نافبار داشبورد المريض الموحد من Figma - يتم إخفاؤه إذا كان العرض قادماً من الطبيب */}
        {!selectedPrescriptionId && (
            <header className="Medlink-custom-navbar">
                <div className="nav-right-side">
                <div className="Medlink-nav-logo">
                    <img src={logo} alt="Medlink Logo" className="logo-image" />
                </div>
                <nav className="Medlink-nav-links">
                    <span
                    className="Medlink-nav-item"
                    onClick={() => onNavigate("patient-dashboard")}
                    >
                    الرئيسية
                    </span>
                    <span
                    className="Medlink-nav-item"
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
                    className="Medlink-nav-item active-nav-tab"
                    onClick={() => {
                        setCurrentView("list");
                    }}
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
                <div className="nav-left-side">
                <button
                    className="btn-Medlink-logout"
                    onClick={() => onNavigate("login")}
                >
                    تسجيل الخروج
                </button>
                </div>
            </header>
        )}

        {/* 📄 الحاوية الرئيسية للعنوان والبطاقات */}
        <main className="prescriptions-main-container">
            {currentView === "list" ? (
            <>
                <div className="page-header-zone" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="page-main-title">وصفاتي الطبية</h2>
                
                {/* 🛠️ في حال وجود معرّف وصفة ممرر، يظهر زر العودة لجدول الطبيب بدلاً من زر البحث عن وصفة للمريض */}
                {selectedPrescriptionId ? (
                    <button
                    className="btn-top-general-search"
                    onClick={() => onNavigate("doctor-dashboard")}
                    style={{ backgroundColor: "#6b7280", color: "#fff" }}
                    >
                    ← العودة لجدول المواعيد
                    </button>
                ) : (
                    <button
                    className="btn-top-general-search"
                    onClick={() => {
                    setSearchQuery("");
                    setHasSearched(false);
                    setCurrentView("search");
                    }}
                    >
                    البحث عن وصفة
                    </button>
                )}
                </div>

                <div className="prescriptions-accordion-list">
                {/* 🛠️ رندرة المصفوفة المصفّاة بدلاً من البيانات الخام */}
                {displayedPrescriptions.map((pres) => {
                    const isOpen = openPrescriptionId === pres.id;
                    return (
                    <div
                        key={pres.id}
                        className={`prescription-accordion-card ${isOpen ? "card-is-expanded" : ""}`}
                    >
                        {/* الرأس الهيدر الخاص بالوصفة */}
                        <div
                        className="prescription-card-header"
                        onClick={() => toggleAccordion(pres.id)}
                        >
                        <div className="header-right-side">
                            <div className="doctor-avatar-badge">👤</div>
                            <div className="doctor-meta-details">
                            <h3>{pres.doctorName}</h3>
                            <span className="meds-count-tag">
                                {pres.medsCount}
                            </span>
                            </div>
                        </div>

                        <div className="header-left-side">
                            <span className="prescription-date-text">
                            {pres.date}
                            </span>
                            <span
                            className={`accordion-chevron-icon ${isOpen ? "chevron-up" : ""}`}
                            >
                            ▼
                            </span>
                        </div>
                        </div>

                        {/* جدول تفاصيل الأدوية وزر البحث المتطابق مع image_390a42.png */}
                        <div
                        className={`prescription-card-body ${isOpen ? "body-visible" : "body-hidden"}`}
                        >
                        <div className="medications-table-responsive">
                            <table className="medications-custom-table">
                            <tbody>
                                {pres.medications.map((med, index) => (
                                <tr key={index}>
                                    <td className="med-name-cell">{med.name}</td>
                                    <td>{med.dosage}</td>
                                    <td>{med.frequency}</td>
                                    <td>{med.duration}</td>
                                    
                                    {/* 🛠️ فحص شرطي: يظهر زر البحث عن الدواء للمريض فقط، ويختفي تماماً إذا كان المستعرض هو الطبيب */}
                                    {!selectedPrescriptionId && (
                                        <td className="search-action-cell">
                                        <button
                                            className="btn-search-inside-table"
                                            onClick={() => handleQuickSearch(med.name)}
                                        >
                                            البحث عن الدواء
                                        </button>
                                        </td>
                                    )}
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </>
            ) : (
            /* 🔍 شاشة البحث المخصصة كما تظهر في صورة image_390a7c.png */
            <div className="search-view-wrapper">
                <button
                className="btn-back-to-prescriptions"
                onClick={() => setCurrentView("list")}
                >
                ← العودة للوصفات الطبية
                </button>

                <div className="search-header-box-figma">
                <h3>البحث عن الدواء</h3>
                <p className="search-sub-desc-figma">
                    ابحث باسم الدواء لمعرفة الصيدليات المتوفر لديها
                </p>

                <div className="search-bar-layout-figma">
                    <input
                    type="text"
                    placeholder="البحث عن اسم الدواء"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === "") setHasSearched(false);
                    }}
                    />
                    <button
                    className="btn-submit-search-figma"
                    onClick={triggerSearchAction}
                    >
                    بحث
                    </button>
                </div>
                </div>

                {hasSearched && (
                <div className="search-results-container-figma">
                    {mockPharmacies.filter((p) =>
                    p.supportedMeds.some((m) => m.includes(searchQuery.trim())),
                    ).length > 0 ? (
                    /* [حالة متوفر]: الهيكل البرمجي المطابق للنصف العلوي في image_390a7c.png */
                    <div className="pharmacies-cards-stack-figma">
                        {mockPharmacies
                        .filter((p) =>
                            p.supportedMeds.some((m) =>
                            m.includes(searchQuery.trim()),
                            ),
                        )
                        .map((pharmacy) => (
                            <div key={pharmacy.id} className="pharmacy-figma-card">
                            <div className="pharmacy-grid-info">
                                <div className="grid-line">
                                <span className="lbl">اسم الصيدلية:</span>{" "}
                                <span className="val">{pharmacy.name}</span>
                                </div>
                                <div className="grid-line">
                                <span className="lbl">حالة التوفر:</span>
                                <span
                                    className={`val status-${pharmacy.status.includes("محدودة") ? "limited" : "available"}`}
                                >
                                    {pharmacy.status}
                                </span>
                                </div>
                                <div className="grid-line">
                                <span className="lbl">رقم الهاتف:</span>{" "}
                                <span className="val">{pharmacy.phone}</span>
                                </div>
                                <div className="grid-line">
                                <span className="lbl">عنوان المكان:</span>{" "}
                                <span className="val">{pharmacy.address}</span>
                                </div>
                            </div>
                            <div className="pharmacy-price-block">
                                <span className="price-label">السعر:</span>
                                <span className="price-value">
                                {pharmacy.price}
                                </span>
                            </div>
                            </div>
                        ))}
                    </div>
                    ) : (
                    /* [حالة عدم توفر الدواء]: المطابق تماماً للنصف السفلي في image_390a7c.png */
                    <div className="not-found-figma-container">
                        <h3 className="not-found-title-msg">
                        لم يتم العثور على الدواء
                        </h3>
                        <p className="not-found-sub-msg">
                        لا تتوفر أي صيدلية بهذا الدواء حالياً
                        </p>
                    </div>
                    )}
                </div>
                )}
            </div>
            )}
        </main>
        
        {/* 🛠️ يتم إخفاء الفوتر إذا كان العرض قادماً من الطبيب */}
        {!selectedPrescriptionId && (
            <footer className="simple-figma-footer">
                <div className="footer-logo">Medlink </div>
                <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
            </footer>
        )}
        </div>
    );
};

export default PatientPrescriptions;