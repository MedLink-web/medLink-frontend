import React from 'react';
import './Services.css';

function Services() {
    // مصفوفة تحتوي على البيانات لتوليد البطاقات الأربعة بشكل ذكي ونظيف بدلاً من التكرار
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

    return (
        <section id="services" className="services-section">

            {/* رأس القسم: العناوين */}
            <div className="services-header">
                <h2 className="services-main-title">خدماتنا</h2>
                <p className="services-sub-title">نقدم مجموعة متكاملة من الخدمات الصحية لتلبية احتياجاتك</p>
            </div>

            {/* حاوية البطاقات الأربعة */}
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
    );
}

export default Services;