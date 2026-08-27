import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./PharmacyRegister.css";
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
        "https://medlink-s.apps.taqat.academy /api/pharmacy-requests",
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
                <span className="input-internal-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 4C8 3.73478 7.89457 3.48051 7.70703 3.29297C7.54289 3.12883 7.32763 3.02757 7.09863 3.00488L7 3H4C3.73478 3 3.4805 3.10543 3.29297 3.29297C3.10543 3.4805 3 3.73478 3 4L3.00488 4.42188C3.11289 8.77767 4.89094 12.932 7.97949 16.0205C11.1676 19.2086 15.4913 21 20 21C20.2652 21 20.5195 20.8946 20.707 20.707C20.8946 20.5195 21 20.2652 21 20V17C21 16.7348 20.8946 16.4805 20.707 16.293C20.5195 16.1054 20.2652 16 20 16H17C16.8448 16 16.6916 16.036 16.5527 16.1055C16.4139 16.1749 16.2933 16.2762 16.2002 16.4004L16.1953 16.4072L15.8398 16.8701L15.8408 16.8711C15.5656 17.2326 15.1752 17.4894 14.7344 17.5996C14.3486 17.696 13.944 17.6748 13.5723 17.541L13.415 17.4766L13.3916 17.4658C10.4157 16.0053 8.00728 13.6 6.54297 10.626L6.54102 10.6221C6.33868 10.2069 6.28622 9.73455 6.39258 9.28516C6.49903 8.83567 6.75789 8.4366 7.125 8.15625L7.13184 8.15137L7.59961 7.7998L7.68848 7.72559C7.77262 7.64574 7.84239 7.55154 7.89453 7.44727C7.96396 7.30841 8 7.15525 8 7V4ZM10 7C10 7.46573 9.89188 7.92523 9.68359 8.3418C9.5014 8.70619 9.24674 9.0288 8.93652 9.29102L8.7998 9.40039L8.33789 9.74512C9.60317 12.3136 11.6816 14.3917 14.249 15.6582L14.5996 15.2002L14.709 15.0635C14.9712 14.7533 15.2938 14.4986 15.6582 14.3164C16.0748 14.1081 16.5343 14 17 14H20C20.7957 14 21.5585 14.3163 22.1211 14.8789C22.6837 15.4415 23 16.2043 23 17V20C23 20.7957 22.6837 21.5585 22.1211 22.1211C21.5585 22.6837 20.7957 23 20 23C14.9609 23 10.1286 20.9978 6.56543 17.4346C3.11356 13.9827 1.12662 9.33986 1.00586 4.47168L1 4C1 3.20435 1.3163 2.44152 1.87891 1.87891C2.44152 1.3163 3.20435 1 4 1H7L7.29688 1.01465C7.98351 1.08291 8.6289 1.38671 9.12109 1.87891C9.6837 2.44151 10 3.20435 10 4V7Z"
                      fill="black"
                    />
                  </svg>
                </span>
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
                <span className="input-internal-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9912 9.65332C18.9055 7.92303 18.181 6.28061 16.9502 5.0498C15.7194 3.819 14.077 3.09452 12.3467 3.00879L12 3C10.1435 3 8.36256 3.73705 7.0498 5.0498C5.73705 6.36256 5 8.14348 5 10C5 12.1593 6.21679 14.4871 7.79785 16.5645C9.32566 18.5717 11.0795 20.1963 12 20.9951C12.9205 20.1963 14.6743 18.5717 16.2021 16.5645C17.7832 14.4871 19 12.1593 19 10L18.9912 9.65332ZM21 10C21 12.8337 19.4474 15.603 17.7939 17.7754C16.327 19.7028 14.6832 21.2859 13.6553 22.2041L13.2549 22.5557C13.2379 22.5704 13.2201 22.5851 13.2021 22.5986C12.899 22.8266 12.538 22.9626 12.1621 22.9932L12 23C11.6207 23 11.2504 22.8919 10.9316 22.6904L10.7979 22.5986L10.7451 22.5557C9.78983 21.7308 7.88248 19.978 6.20605 17.7754C4.55262 15.603 3 12.8337 3 10C3 7.61305 3.94791 5.32357 5.63574 3.63574C7.32357 1.94791 9.61305 1 12 1C14.3869 1 16.6764 1.94791 18.3643 3.63574C20.0521 5.32357 21 7.61305 21 10Z"
                      fill="black"
                    />
                    <path
                      d="M14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10ZM16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10Z"
                      fill="black"
                    />
                  </svg>
                </span>
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
