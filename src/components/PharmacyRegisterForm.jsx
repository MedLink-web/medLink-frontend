import React, { useState } from 'react';
import logo from '../assets/logo.png'; // أو استخدمي "/logo.png" إذا نقلتيه للمجلد العام public
import './PharmacyRegisterForm.css';
import pharmacyImg from '../assets/pharmacy.png';

const PharmacyRegisterForm = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        pharmacyName: '',
        pharmacyPhone: '',
        pharmacyEmail: '',
        licenseNumber: '',
        pharmacyAddress: '',
        pharmacyDesc: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('طلب تسجيل الصيدلية:', formData);
    };

    return (
        <div className="pharmacy-reg-container" dir="rtl">
            {/* 📸 الشق الأيسر: الصورة الجانبية الممتدة */}
            <div className="pharmacy-reg-image-side">
                <img src={pharmacyImg} alt="Pharmacist working" className="side-bg-img" />
            </div>

            {/* 📄 الشق الأيمن: استمارة التسجيل */}
            <div className="pharmacy-reg-form-side">
                
                {/* 🌟 تعديل مكانه: تم إخراجه هنا ليكون حراً في أعلى الصفحة بالكامل */}
                <div className="navbar-logo">
                        <img src={logo} alt="Medlink Logo" className="logo-image" />
                        <span className="logo-text">Medlink</span>
                        
                    </div>

                {/* غلاف الحقول الفعلي (مستقل تماماً الآن) */}
                <div className="form-wrapper">
                    <h2 className="form-main-title">تسجيل طلب صيدلية</h2>

                    <form onSubmit={handleSubmit} className="actual-form">
                        
                        {/* اسم الصيدلية */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">اسم الصيدلية:</label>
                            <div className="input-with-icon-wrapper">
                                <input 
                                    type="text" 
                                    name="pharmacyName"
                                    value={formData.pharmacyName}
                                    onChange={handleChange}
                                    placeholder="اسم الصيدلية" 
                                    className="reg-custom-input"
                                    required
                                />
                                <span className="input-internal-icon">🏢</span>
                            </div>
                        </div>

                        {/* رقم هاتف الصيدلية */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">رقم هاتف الصيدلية :</label>
                            <div className="input-with-icon-wrapper">
                                <input 
                                    type="tel" 
                                    name="pharmacyPhone"
                                    value={formData.pharmacyPhone}
                                    onChange={handleChange}
                                    placeholder="رقم الهاتف للصيدلية" 
                                    className="reg-custom-input"
                                    required
                                />
                                <span className="input-internal-icon">📞</span>
                            </div>
                        </div>

                        {/* البريد الإلكتروني للصيدلية */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">البريد الالكتروني للصيدلية :</label>
                            <div className="input-with-icon-wrapper">
                                <input 
                                    type="email" 
                                    name="pharmacyEmail"
                                    value={formData.pharmacyEmail}
                                    onChange={handleChange}
                                    placeholder="البريد الإلكتروني" 
                                    className="reg-custom-input"
                                    required
                                />
                                <span className="input-internal-icon">✉️</span>
                            </div>
                        </div>

                        {/* رقم الترخيص الطبي */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">رقم الترخيص الطبي للصيدلية :</label>
                            <div className="input-with-icon-wrapper">
                                <input 
                                    type="text" 
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="رقم الترخيص" 
                                    className="reg-custom-input"
                                    required
                                />
                                <span className="input-internal-icon">🪪</span>
                            </div>
                        </div>

                        {/* عنوان الصيدلية */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">عنوان للصيدلية:</label>
                            <div className="input-with-icon-wrapper">
                                <input 
                                    type="text" 
                                    name="pharmacyAddress"
                                    value={formData.pharmacyAddress}
                                    onChange={handleChange}
                                    placeholder="عنوان للصيدلية" 
                                    className="reg-custom-input"
                                    required
                                />
                                <span className="input-internal-icon">📍</span>
                            </div>
                        </div>

                        {/* وصف الصيدلية */}
                        <div className="reg-input-group">
                            <label className="reg-field-label">وصف الصيدلية (اختياري)</label>
                            <textarea 
                                name="pharmacyDesc"
                                value={formData.pharmacyDesc}
                                onChange={handleChange}
                                placeholder="وصف الصيدلية (اختياري)" 
                                className="reg-custom-textarea"
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-submit-pharmacy-request">
                            تقديم الطلب
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default PharmacyRegisterForm;