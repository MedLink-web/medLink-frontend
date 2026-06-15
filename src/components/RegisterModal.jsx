import React from 'react';
import './RegisterModal.css';

const RegisterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const accountTypes = [
        {
        id: 'patient',
        title: 'مريض',
        features: ['حجز المواعيد', 'البحث عن الأدوية', 'متابعة الحجوزات'],
        icon: '👤'
        },
        {
        id: 'clinic',
        title: 'العيادة',
        features: ['حجز المواعيد', 'البحث عن الأدوية', 'متابعة الحجوزات'],
        icon: '🏥'
        },
        {
        id: 'pharmacy',
        title: 'الصيدلية',
        features: ['حجز المواعيد', 'البحث عن الأدوية', 'متابعة الحجوزات'],
        icon: '💊'
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* شريط التحكم العلوي يحتوي على زر إغلاق بشكل إكس */}
            <div className="modal-window-actions">
            <button className="close-x-btn" onClick={onClose} title="إغلاق">&times;</button>
            </div>
            
            {/* رأس النافذة المنبثقة */}
            <div className="modal-header">
            <h1 className="modal-main-title">مرحباً بك في MedLink</h1>
            <p className="modal-sub-title">اختر نوع حسابك للمتابعة إلى المنصة</p>
            </div>

            {/* شبكة البطاقات (Grid) */}
            <div className="account-types-grid">
            {accountTypes.map((type) => (
                <div key={type.id} className="account-card">
                <div className="account-icon-wrapper">{type.icon}</div>
                <h3 className="account-card-title">{type.title}</h3>
                <ul className="account-features-list">
                    {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                    ))}
                </ul>
                <button className="account-submit-btn">إنشاء حساب</button>
                </div>
            ))}
            </div>

            {/* التذييل الخاص بالنافذة */}
            <div className="modal-footer">
            <p>ليس لديك حساب بالفعل؟ <a href="#login" onClick={onClose}>تسجيل الدخول</a></p>
            </div>

        </div>
        </div>
    );
};

export default RegisterModal;