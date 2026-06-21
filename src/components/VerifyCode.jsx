import React, { useRef, useState } from "react";
import "./VerifyCode.css";
import logo from "../assets/logo.png"; // تأكدي أن الصورة الجديدة موجودة في المجلد

const VerifyCode = ({ email, onNextStep }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // الانتقال التلقائي للمربع التالي
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // الرجوع للمربع السابق عند ضغط Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length < 6) {
      alert("الرجاء إدخال الرمز المكون من 6 أرقام كاملاً");
    } else {
      onNextStep("reset");
    }
  };

  return (
    <div className="Medlink-auth-page" dir="rtl">
      <div className="Medlink-top-logo">
        <div className="logo-flex-container">
          <span className="Medlink-text-blue">Medlink</span>
          <div className="logo-circle-icon">
            <img src={logo} alt="Medlink Logo" className="logo-image" />
          </div>
        </div>
      </div>

      <div className="Medlink-auth-card">
        <h2 className="Medlink-auth-title">تحقق من بريدك</h2>
        <p className="Medlink-auth-desc">
          تم إرسال كود مؤلف من 6 أرقام إلى <br />
          <strong className="user-email-display">
            {email || "example***@email.com"}
          </strong>
        </p>

        <div className="Medlink-otp-container">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="Medlink-otp-box"
            />
          ))}
        </div>

        <button className="Medlink-submit-btn" onClick={handleVerify}>
          إرسال كود التحقق <span className="btn-arrow">←</span>
        </button>

        <div className="Medlink-bottom-links">
          <span className="resend-code-link">إعادة إرسال الرمز</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
