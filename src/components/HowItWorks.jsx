import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
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
        <section id="how-it-works" className="steps-section">
        
        {/* رأس القسم */}
        <div className="steps-header">
            <span className="steps-tag">خطوات بسيطة</span>
            <h2 className="steps-main-title">كيف تعمل المنصة؟</h2>
            <p className="steps-sub-title">احصل على الرعاية الطبية التي تحتاجها في دقائق معدودة</p>
        </div>

        {/* حاوية الخطوات الأربعة */}
        <div className="steps-grid">
            {stepsData.map((step) => (
            <div key={step.id} className="step-card">
                
                {/* الرقم العائم للخطوة */}
                <div className="step-badge">{step.stepNumber}</div>
                
                {/* أيقونة الخطوة */}
                <div className="step-icon-box">{step.icon}</div>
                
                {/* نصوص الخطوة */}
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.desc}</p>
                
            </div>
            ))}
        </div>

        </section>
    );
};

export default HowItWorks;