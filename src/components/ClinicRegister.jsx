import React, { useState } from "react";
import "./ClinicRegister.css";

const ClinicRegister = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    clinicName: "",
    phone: "",
    email: "",
    licenseNumber: "",
    specialty: "",
    address: "",
  });
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ─── Handle Text Inputs ───────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // ─── Handle File Input ────────────────────────
  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  // ─── Submit ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("clinic_name", formData.clinicName);
    data.append("clinic_phone", formData.phone);
    data.append("clinic_email", formData.email);
    data.append("specialty", formData.specialty);
    data.append("clinic_address", formData.address);
    data.append("license_number", formData.licenseNumber);
    if (document) data.append("document", document);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/clinic-requests",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
      } else if (response.status === 422) {
        const backendErrors = {};
        Object.entries(result.errors).forEach(([field, messages]) => {
          backendErrors[field] = messages[0];
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: result.message || "حدث خطأ، حاول مرة أخرى" });
      }
    } catch {
      setErrors({ general: "تعذر الاتصال بالسيرفر" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── شاشة النجاح ──────────────────────────────
  if (isSuccess) {
    return (
      <div
        className="clinic-reg-container"
        dir="rtl"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "480px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#276749", marginBottom: "12px" }}>
            تم إرسال الطلب بنجاح!
          </h2>
          <p style={{ color: "#4a5568", marginBottom: "24px" }}>
            سيتم مراجعة طلب تسجيل عيادتك من قِبل الإدارة وسنتواصل معك قريباً.
          </p>
          <div
            style={{
              background: "#f0fff4",
              border: "1px solid #9ae6b4",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "24px",
              color: "#276749",
            }}
          >
            🕐 حالة الطلب: <strong>قيد المراجعة</strong>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("landing")}
            style={{
              background: "#3182ce",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // ─── الفورم الرئيسي ───────────────────────────
  return (
    <div className="clinic-reg-container" dir="rtl">
      {/* ─── النصف الأيسر: الصورة ─── */}
      <div className="clinic-reg-left-side">
        <div className="doctor-image-wrapper">
          <img src="/clinic.png" alt="Doctor" className="doctor-main-img" />
          <div className="floating-badge-text">
            <span>آمن، سريع، وسهل</span>
          </div>
        </div>
      </div>

      {/* ─── النصف الأيمن: الفورم ─── */}
      <div className="clinic-reg-right-side">
        <div className="clinic-reg-brand">
          <span className="clinic-logo-text">MedLink</span>
        </div>

        <h1 className="clinic-reg-title">تسجيل طلب عيادة</h1>

        {/* رسالة خطأ عامة */}
        {errors.general && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fed7d7",
              color: "#c53030",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            ⚠️ {errors.general}
          </div>
        )}

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
            {errors.clinic_name && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.clinic_name}
              </p>
            )}
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
            {errors.clinic_phone && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.clinic_phone}
              </p>
            )}
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
              <span className="clinic-input-icon"></span>
            </div>
            {errors.clinic_email && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.clinic_email}
              </p>
            )}
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
                <option value="" disabled hidden>
                  اختار تخصص العيادة
                </option>
                <option value="طب عام">طب عام</option>
                <option value="أطفال">تخصص الأطفال</option>
                <option value="قلبية">تخصص القلب</option>
                <option value="جلدية">تخصص الجلدية</option>
                <option value="عظام">تخصص العظام</option>
                <option value="عيون">تخصص العيون</option>
                <option value="أسنان">تخصص الأسنان</option>
                <option value="نساء وتوليد">نساء وتوليد</option>
                <option value="أنف وأذن وحنجرة">أنف وأذن وحنجرة</option>
                <option value="نفسية">تخصص نفسي</option>
              </select>
              <span className="clinic-input-icon">🩺</span>
            </div>
            {errors.specialty && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.specialty}
              </p>
            )}
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
            {errors.clinic_address && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.clinic_address}
              </p>
            )}
          </div>

          {/* المستندات الداعمة */}
          <div className="clinic-form-group">
            <label>المستندات الداعمة :</label>
            <div className="clinic-file-upload-zone">
              <input
                type="file"
                id="clinic-file-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="clinic-file-input" className="file-upload-label">
                <div className="upload-cloud-icon">☁️</div>
                <span className="upload-placeholder-text">
                  {document ? document.name : "تحميل المستندات (اختياري)"}
                </span>
              </label>
            </div>
            {errors.document && (
              <p
                style={{ color: "#e53e3e", fontSize: "13px", marginTop: "4px" }}
              >
                {errors.document}
              </p>
            )}
          </div>

          {/* زر تقديم الطلب */}
          <button
            type="submit"
            className="clinic-submit-btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "جاري الإرسال..." : "تقديم الطلب"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClinicRegister;
