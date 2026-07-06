import React, { useState } from "react";
import "./PharmacyRegister.css";
import pharmacyImg from "../assets/pharmacy.png";

const PharmacyRegister = ({ onNavigate }) => {
  // 1. حالة لإدارة البيانات المدخلة
  const [formData, setFormData] = useState({
    pharmacyName: "",
    pharmacyPhone: "",
    pharmacyEmail: "",
    licenseNumber: "",
    pharmacyAddress: "",
    ownerName: "",
  });

  const [attachedFile, setAttachedFile] = useState(null);

  // 2. حالة للتحكم في عرض الفورم أو واجهة النجاح (false = يعرض الفورم، true = يعرض النجاح)
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // عند الضغط على تقديم الطلب، نقوم بتحويل الحالة مباشرة دون الانتقال لصفحة أخرى
    setIsSubmittedSuccessfully(true);
  };

  const handleStartNow = () => {
    if (onNavigate) {
      onNavigate("pharmacy-dashboard"); // التوجيه للوحة تحكم الصيدلية عند الضغط على ابدأ الآن
    }
  };

  return (
    <div className="pharmacy-register-container" dir="rtl">
      <div className="pharmacy-register-split-card">
        {/* 📝 الجانب الأيمن التفاعلي: يتغير حسب حالة الإرسال */}
        <div className="register-form-side">
          <div className="brand-header-mini">
            <span className="brand-logo-dot">🔵</span>
            <span className="brand-name-text">Medlink</span>
          </div>

          {!isSubmittedSuccessfully ? (
            /* أولاً: عرض نموذج التسجيل المعتاد */
            <>
              <h2 className="register-main-title">تسجيل طلب صيدلية</h2>
              <form
                onSubmit={handleFormSubmit}
                className="pharmacy-fields-form"
              >
                <div className="register-field-group">
                  <label>اسم الصيدلية :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="text"
                      name="pharmacyName"
                      value={formData.pharmacyName}
                      onChange={handleInputChange}
                      placeholder="اسم الصيدلية"
                      required
                    />
                    <span className="field-inner-icon">🏥</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>رقم هاتف الصيدلية :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="tel"
                      name="pharmacyPhone"
                      value={formData.pharmacyPhone}
                      onChange={handleInputChange}
                      placeholder="رقم هاتف الصيدلية"
                      required
                    />
                    <span className="field-inner-icon">📞</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>البريد الإلكتروني للصيدلية :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="email"
                      name="pharmacyEmail"
                      value={formData.pharmacyEmail}
                      onChange={handleInputChange}
                      placeholder="البريد الإلكتروني"
                      required
                    />
                    <span className="field-inner-icon">✉️</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>رقم الترخيص الطبي للصيدلية :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="رقم الترخيص"
                      required
                    />
                    <span className="field-inner-icon">🆔</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>عنوان الصيدلية :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="text"
                      name="pharmacyAddress"
                      value={formData.pharmacyAddress}
                      onChange={handleInputChange}
                      placeholder="عنوان الصيدلية بالتفصيل"
                      required
                    />
                    <span className="field-inner-icon">📍</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>اسم المالك :</label>
                  <div className="input-with-icon-wrapper">
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="اسم المالك المعتمد"
                      required
                    />
                    <span className="field-inner-icon">👤</span>
                  </div>
                </div>

                <div className="register-field-group">
                  <label>المستندات الداعمة :</label>
                  <label
                    htmlFor="pharmacy-docs-upload"
                    className="docs-upload-zone-box"
                  >
                    <div className="upload-box-content">
                      <span className="cloud-upload-emoji">☁️</span>
                      <p className="upload-box-hint-text">
                        {attachedFile
                          ? `تم اختيار: ${attachedFile.name}`
                          : "اضغط هنا لرفع الملفات والوثائق القانونية"}
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="pharmacy-docs-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>

                <button type="submit" className="btn-submit-pharmacy-request">
                  تقديم الطلب
                </button>
              </form>
            </>
          ) : (
            /* ثانياً: شاشة النجاح التلقائية المدمجة المتطابقة مع الـ Screenshots واختفاء الفورم */
            <div className="success-status-wrapper">
              <div className="green-circle-checkmark">✓</div>

              <h2 className="success-main-heading">تم تقديم طلبك بنجاح!</h2>

              <p className="success-sub-description">
                طلب الصيدلية الخاص بك الآن قيد المراجعة من قبل إدارة المنصة.
                سيتم إرسال بريد إلكتروني فور تفعيل الحساب لتتمكن من إدارة أدويتك
                ووصفاتك الطبية بكل سهولة.
              </p>

              <div className="success-action-buttons-zone">
                <button
                  className="btn-start-now-primary"
                  onClick={handleStartNow}
                >
                  ابدأ الآن
                </button>
                <button
                  className="btn-back-to-login-link"
                  onClick={() => onNavigate("login")}
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🖼️ الجانب الأيسر: الصورة الثابتة في الحالتين لجمالية التصميم */}
        <div className="register-image-side">
          <div className="image-side-overlay-cover">
            <div className="safety-badge-pill">
              <img
                src={pharmacyImg}
                alt="Pharmacist working"
                className="side-bg-img"
              />
              آمن، سريع، وسهل
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRegister;
