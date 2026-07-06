import React, { useState } from "react";
import "./ClinicRegister.css";
import pharmacyImg from "../assets/clinic.png";

const ClinicRegister = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    clinicName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    specialty: "",
    address: "",
    document: null, // سيخزن كائن الملف الحقيقي المرفوع هنا
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🛠️ الدالة المسؤولة عن التعامل مع رفع الملف الفعلي من الجهاز
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // التقاط الملف الأول المختار
    if (selectedFile) {
      setFormData({ ...formData, document: selectedFile });
    }
  };

  // 🛠️ دالة إضافية اختيارية تتيح للمستخدم حذف الملف المرفوع إذا غير رأيه
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // منع حدوث نقرة مزدوجة على الـ Label
    setFormData({ ...formData, document: null });
    document.getElementById("clinic-file-upload").value = ""; // إعادة تعيين قيمة التحديد برمجياً
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.clinicName) newErrors.clinicName = "اسم العيادة مطلوب";
    if (!formData.phone) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!formData.licenseNumber) newErrors.licenseNumber = "رقم الترخيص مطلوب";
    if (!formData.specialty) newErrors.specialty = "التخصص الطبي مطلوب";
    if (!formData.address) newErrors.address = "عنوان العيادة مطلوب";
    if (!formData.document)
      newErrors.document = "يرجى تحميل المستندات الداعمة للعيادة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // في المستقبل، لرفع الملف للـ Backend الفعلي، يتم إرساله كـ FormData:
    // const uploadData = new FormData();
    // uploadData.append("document", formData.document);

    setIsSubmitted(true);
    if (onRegistrationSuccess) {
      setTimeout(() => {
        onRegistrationSuccess();
      }, 3000);
    }
  };

  return (
    <div className="clinic-register-page-container" dir="rtl">
      <div className="register-form-section">
        <div className="register-header-brand">
          <span className="brand-logo-icon">🩺</span>
          <span className="brand-text-logo">Medlink</span>
        </div>

        {isSubmitted ? (
          <div className="registration-success-message">
            <div className="success-checkmark-circle">✓</div>
            <h3>تم تقديم طلبك بنجاح!</h3>
            <p>
              طلب العيادة الخاص بك الآن قيد المراجعة من قِبل إدارة المنصة. سيتم
              إرسال بريد إلكتروني فور تفعيل الحساب لتتمكن من إدارة مواعيدك.
            </p>
          </div>
        ) : (
          <div className="register-card-content">
            <h2 className="register-main-title">تسجيل طلب عيادة</h2>

            <form onSubmit={handleSubmit} className="clinic-onboarding-form">
              <div
                className={`form-input-wrapper ${errors.clinicName ? "input-has-error" : ""}`}
              >
                <label>اسم العيادة :</label>
                <div className="input-with-icon-box">
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="اسم العيادة"
                    value={formData.clinicName}
                    onChange={handleChange}
                  />
                  <span className="input-box-icon">🏢</span>
                </div>
              </div>

              <div
                className={`form-input-wrapper ${errors.phone ? "input-has-error" : ""}`}
              >
                <label>رقم هاتف العيادة :</label>
                <div className="input-with-icon-box">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <span className="input-box-icon">📞</span>
                </div>
              </div>

              <div
                className={`form-input-wrapper ${errors.email ? "input-has-error" : ""}`}
              >
                <label>البريد الإلكتروني :</label>
                <div className="input-with-icon-box">
                  <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="input-box-icon">✉️</span>
                </div>
              </div>

              <div
                className={`form-input-wrapper ${errors.licenseNumber ? "input-has-error" : ""}`}
              >
                <label>رقم الترخيص الطبي للعيادة :</label>
                <div className="input-with-icon-box">
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="رقم الترخيص"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                  <span className="input-box-icon">🪪</span>
                </div>
              </div>

              <div
                className={`form-input-wrapper ${errors.specialty ? "input-has-error" : ""}`}
              >
                <label>التخصص الطبي :</label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  <option value="">اختار تخصص العيادة</option>
                  <option value="تخصص الأطفال">تخصص الأطفال</option>
                  <option value="تخصص القلب">تخصص القلب</option>
                  <option value="طب وجراحة الأسنان">طب وجراحة الأسنان</option>
                  <option value="طب عام">طب عام</option>
                </select>
              </div>

              <div
                className={`form-input-wrapper ${errors.address ? "input-has-error" : ""}`}
              >
                <label>عنوان العيادة :</label>
                <div className="input-with-icon-box">
                  <input
                    type="text"
                    name="address"
                    placeholder="عنوان العيادة"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <span className="input-box-icon">📍</span>
                </div>
              </div>

              {/* 🛠️ تعديل واجهة حقل تحميل الملفات الحقيقي */}
              <div
                className={`form-input-wrapper ${errors.document ? "input-has-error" : ""}`}
              >
                <label>المستندات الداعمة :</label>
                <div
                  className={`file-uploader-dropzone ${formData.document ? "has-file-loaded" : ""}`}
                >
                  <input
                    type="file"
                    id="clinic-file-upload"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg" // تحديد الصيغ المقبولة طبياً للتراخيص
                  />
                  <label
                    htmlFor="clinic-file-upload"
                    className="dropzone-inner-label"
                  >
                    {formData.document ? (
                      <div className="file-info-preview-block">
                        <span className="file-icon-attached">📄</span>
                        <div className="file-meta-details">
                          <p className="file-name-text">
                            {formData.document.name}
                          </p>
                          <span className="file-size-subtext">
                            ({(formData.document.size / 1024 / 1024).toFixed(2)}{" "}
                            MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn-remove-uploaded-file"
                          onClick={handleRemoveFile}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="upload-cloud-icon">☁️</span>
                        <p>انقر هنا لاختيار مستند الترخيص الطبي من جهازك</p>
                        <span className="allowed-extensions-hint">
                          الصيغ المتاحة: PDF, PNG, JPG
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {errors.document && (
                  <span
                    className="error-text-span"
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.document}
                  </span>
                )}
              </div>

              <button type="submit" className="btn-submit-registration">
                تقديم الطلب
              </button>
            </form>
          </div>
        )}
      </div>

      {/* الجزء الأيسر: الصورة والجانب الجمالي المنسق مع تصاميم فبجما */}
      <div className="register-visual-sidebar">
        <div className="visual-image-wrapper">
          <img
            src={pharmacyImg}
            alt="Doctor Welcome"
            className="doctor-main-avatar"
          />
          <div className="floating-bubble-phrase">آمن، سريع، وسهل</div>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegister;
