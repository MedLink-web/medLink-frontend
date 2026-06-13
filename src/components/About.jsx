import React from 'react';
import './About.css';

const About = () => {
    return (
        <section className="about-section">
        <div className="about-container">
            
            {/* الجانب الأيمن: النصوص والمميزات الثلاثة */}
            <div className="about-text-side">
            <span className="about-tag">عن المنصة</span>
            <h2 className="about-main-title">منصتك الذكية للصحة</h2>
            
            <p className="about-description">
                نحن منصة صحية رقمية تهدف إلى تسهيل الوصول إلى الخدمات الصحية 
                وتحسين تجربة المرضى من خلال التكنولوجيا والابتكار.
            </p>

            {/* شبكة الميزات المصغرة بالأسفل */}
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

            {/* الجانب الأيسر: الصورة والبطاقة الطافية المحدثة */}
            <div className="about-image-side">
            <div className="about-image-wrapper">
                
                <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600" 
                alt="Modern Clinic" 
                className="about-main-img" 
                />
                
                {/* ✅ تم تعديل هذا الجزء وإضافة النصوص والأيقونة بدلاً من الثلاث نقاط */}
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
    );
};

export default About;