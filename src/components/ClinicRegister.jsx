import React, { useState } from 'react';
import './ClinicRegister.css';

const ClinicRegister = () => {
    const [formData, setFormData] = useState({
        clinicName: '',
        phone: '',
        email: '',
        licenseNumber: '',
        specialty: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('طلب تسجيل عيادة:', formData);
    };

    return (
        <div className="clinic-reg-container" dir="rtl">
        
        {/* ─── النصف الأيسر: استدعاء الصورة المطلوبة للموقع بأمان ─── */}
        <div className="clinic-reg-left-side">
            <div className="doctor-image-wrapper">
            {/* هنا نقرأ الصورة مباشرة من مجلد public بدون import */}
            <img 
                src="/clinic.png"  /* تم استخدام المسار المباشر للصورة من مجلد public */
                alt="Doctor" 
                className="doctor-main-img" 
            />
            <div className="floating-badge-text">
                <span>آمن، سريع، وسهل</span>
            </div>
            </div>
        </div>

        {/* ─── النصف الأيمن: نموذج البيانات المكتمل ─── */}
        <div className="clinic-reg-right-side">
            <div className="clinic-reg-brand">
            <span className="clinic-logo-text">MedLink</span>
            </div>

            <h1 className="clinic-reg-title">تسجيل طلب عيادة</h1>

            <form onSubmit={handleSubmit} className="clinic-reg-form">
            
            {/* اسم العيادة */}
            <div className="clinic-form-group">
                <label>اسم العيادة:</label>
                <div className="clinic-input-wrapper">
                <input 
                    type="text" 
                    name="clinicName"
                    placeholder="اسم العيادة" 
                    value={formData.clinicName}
                    onChange={handleChange}
                    required 
                />
                <span className="clinic-input-icon">🏢</span>
                </div>
            </div>

            {/* رقم هاتف العيادة */}
            <div className="clinic-form-group">
                <label>رقم هاتف العيادة :</label>
                <div className="clinic-input-wrapper">
                <input 
                    type="tel" 
                    name="phone"
                    placeholder="رقم الهاتف" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                />
                <span className="clinic-input-icon">📞</span>
                </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="clinic-form-group">
                <label>البريد الالكتروني :</label>
                <div className="clinic-input-wrapper">
                <input 
                    type="email" 
                    name="email"
                    placeholder="البريد الإلكتروني" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />
                <span className="clinic-input-icon">✉️</span>
                </div>
            </div>

            {/* رقم الترخيص الطبي */}
            <div className="clinic-form-group">
                <label>رقم الترخيص الطبي للعيادة :</label>
                <div className="clinic-input-wrapper">
                <input 
                    type="text" 
                    name="licenseNumber"
                    placeholder="رقم الترخيص" 
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required 
                />
                <span className="clinic-input-icon">🪪</span>
                </div>
            </div>

            {/* التخصص الطبي */}
            <div className="clinic-form-group">
                <label>التخصص الطبي :</label>
                <div className="clinic-input-wrapper">
                <select 
                    name="specialty" 
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>اختار تخصص العيادة</option>
                    <option value="pediatrics">تخصص الأطفال</option>
                    <option value="cardiology">تخصص القلب</option>
                    <option value="dermatology">تخصص الجلدية</option>
                </select>
                <span className="clinic-input-icon">🩺</span>
                </div>
            </div>

            {/* عنوان العيادة */}
            <div className="clinic-form-group">
                <label>عنوان العيادة:</label>
                <div className="clinic-input-wrapper">
                <input 
                    type="text" 
                    name="address"
                    placeholder="عنوان العيادة" 
                    value={formData.address}
                    onChange={handleChange}
                    required 
                />
                <span className="clinic-input-icon">📍</span>
                </div>
            </div>

            {/* المستندات الداعمة */}
            <div className="clinic-form-group">
                <label>المستندات الداعمة :</label>
                <div className="clinic-file-upload-zone">
                <input type="file" id="clinic-file-input" style={{ display: 'none' }} />
                <label htmlFor="clinic-file-input" className="file-upload-label">
                    <div className="upload-cloud-icon">☁️</div>
                    <span className="upload-placeholder-text">تحميل المستندات (اختياري)</span>
                </label>
                </div>
            </div>

            {/* زر تقديم الطلب */}
            <button type="submit" className="clinic-submit-btn">
                تقديم الطلب
            </button>

            </form>
        </div>

        </div>
    );
};

export default ClinicRegister;