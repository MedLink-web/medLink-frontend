import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./PharmacyRegisterForm.css";
import pharmacyImg from "../assets/pharmacy.png";

const PharmacyRegisterForm = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    pharmacyName: "",
    pharmacyPhone: "",
    pharmacyEmail: "",
    licenseNumber: "",
    pharmacyAddress: "",
    pharmacyDesc: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append("pharmacy_name", formData.pharmacyName);
    data.append("pharmacy_phone", formData.pharmacyPhone);
    data.append("pharmacy_email", formData.pharmacyEmail);
    data.append("license_number", formData.licenseNumber);
    data.append("pharmacy_address", formData.pharmacyAddress);
    data.append("pharmacy_description", formData.pharmacyDesc);

    try {
      const response = await fetch(
        "https://medlink-backend-production-e2f2.up.railway.app/api/pharmacy-requests",
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
        className="pharmacy-reg-container"
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
            سيتم مراجعة طلب تسجيل صيدليتك من قِبل الإدارة وسنتواصل معك قريباً.
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

  return (
    <div className="pharmacy-reg-container" dir="rtl">
      {/* الشق الأيسر: الصورة */}
      <div className="pharmacy-reg-image-side">
        <img
          src={pharmacyImg}
          alt="Pharmacist working"
          className="side-bg-img"
        />
      </div>

      {/* الشق الأيمن: الفورم */}
      <div className="pharmacy-reg-form-side">
        <div className="navbar-logo">
          <img src={logo} alt="Medlink Logo" className="logo-image" />
          <span className="logo-text">Medlink</span>
        </div>

        <div className="form-wrapper">
          <h2 className="form-main-title">تسجيل طلب صيدلية</h2>

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
              {errors.pharmacy_name && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.pharmacy_name}
                </p>
              )}
            </div>

            {/* رقم الهاتف */}
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
              {errors.pharmacy_phone && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.pharmacy_phone}
                </p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div className="reg-input-group">
              <label className="reg-field-label">
                البريد الالكتروني للصيدلية :
              </label>
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
                <span className="input-internal-icon"></span>
              </div>
              {errors.pharmacy_email && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.pharmacy_email}
                </p>
              )}
            </div>

            {/* رقم الترخيص */}
            <div className="reg-input-group">
              <label className="reg-field-label">
                رقم الترخيص الطبي للصيدلية :
              </label>
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
              {errors.license_number && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.license_number}
                </p>
              )}
            </div>

            {/* العنوان */}
            <div className="reg-input-group">
              <label className="reg-field-label">عنوان الصيدلية:</label>
              <div className="input-with-icon-wrapper">
                <input
                  type="text"
                  name="pharmacyAddress"
                  value={formData.pharmacyAddress}
                  onChange={handleChange}
                  placeholder="عنوان الصيدلية"
                  className="reg-custom-input"
                  required
                />
                <span className="input-internal-icon">📍</span>
              </div>
              {errors.pharmacy_address && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.pharmacy_address}
                </p>
              )}
            </div>

            {/* الوصف */}
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

            <button
              type="submit"
              className="btn-submit-pharmacy-request"
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
    </div>
  );
};

export default PharmacyRegisterForm;
