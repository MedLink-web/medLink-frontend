import React, { useState } from "react";
import "./ClinicRequestDetails.css";

const ClinicRequestDetails = ({
  selectedRequest,
  requests,
  setRequests,
  successStatus,
  setSuccessStatus,
  activeTab,
  onBack,
}) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");
  const isPharmacy = activeTab === "pharmacies";

  // ─── قبول الطلب ───────────────────────────────
  const handleConfirmAccept = async () => {
    setIsProcessing(true);
    setError("");

    const endpoint = isPharmacy
      ? `https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests/${selectedRequest.id}/approve`
      : `https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/${selectedRequest.id}/approve`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRequests(
          requests.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: "تمت الموافقة" } : r,
          ),
        );
        setShowAcceptModal(false);
        setSuccessStatus(true);
      } else {
        setError(data.message || "حدث خطأ أثناء القبول");
        setShowAcceptModal(false);
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
      setShowAcceptModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── رفض الطلب ────────────────────────────────
  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("الرجاء إدخال سبب الرفض أولاً");
      return;
    }

    setIsProcessing(true);
    setError("");

    const endpoint = isPharmacy
      ? `https://medlink-backend-production-e2f2.up.railway.app/api/admin/pharmacy-requests/${selectedRequest.id}/reject`
      : `https://medlink-backend-production-e2f2.up.railway.app/api/admin/clinic-requests/${selectedRequest.id}/reject`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRequests(requests.filter((r) => r.id !== selectedRequest.id));
        setShowRejectModal(false);
        onBack();
      } else {
        setError(data.message || "حدث خطأ أثناء الرفض");
        setShowRejectModal(false);
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
      setShowRejectModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="request-details-wrapper">
      {/* شريط التنقل */}
      <div className="details-navigation-header">
        <button className="back-to-list-btn" onClick={onBack}>
          &gt; {isPharmacy ? "طلبات الصيدلية" : "طلبات العيادات"}
        </button>
        <span className="navigation-separator"> &lt; </span>
        <span className="current-sub-view">
          عرض تفاصيل {selectedRequest.name}
        </span>
      </div>

      {/* رسالة نجاح */}
      {successStatus && (
        <div className="success-banner-alert">
          ✅ تمت الموافقة على هذا الطلب وهو الآن نشط ومسجل رسمياً على منصة
          MedLink. تم إرسال بيانات الدخول على البريد الإلكتروني.
        </div>
      )}

      {/* رسالة خطأ */}
      {error && (
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
          ⚠️ {error}
        </div>
      )}

      {/* بطاقة البيانات */}
      <div className="details-card-container">
        <div className="details-grid">
          <div className="details-row">
            <span className="field-label">
              اسم {isPharmacy ? "الصيدلية" : "العيادة"} :
            </span>
            <span className="field-value font-bold">
              {selectedRequest.name}
            </span>
          </div>
          <div className="details-row">
            <span className="field-label">البريد الإلكتروني :</span>
            <span className="field-value ltr-text">
              {selectedRequest.email}
            </span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الترخيص الطبي :</span>
            <span className="field-value">
              {selectedRequest.license || "—"}
            </span>
          </div>
          <div className="details-row">
            <span className="field-label">تاريخ التقديم :</span>
            <span className="field-value">{selectedRequest.date}</span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الهاتف :</span>
            <span className="field-value">{selectedRequest.phone}</span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الطلب :</span>
            <span className="field-value">{selectedRequest.id}</span>
          </div>
          {!isPharmacy && selectedRequest.specialty && (
            <div className="details-row">
              <span className="field-label">التخصص :</span>
              <span className="field-value">{selectedRequest.specialty}</span>
            </div>
          )}
          <div className="details-row full-width-row">
            <span className="field-label">العنوان الكامل :</span>
            <span className="field-value">{selectedRequest.address}</span>
          </div>
        </div>
      </div>

      {/* أزرار القرار - تظهر فقط إذا الطلب قيد الانتظار */}
      {selectedRequest.status === "قيد الانتظار" && !successStatus && (
        <div className="details-action-buttons-footer">
          <button
            className="btn-decision-accept"
            onClick={() => setShowAcceptModal(true)}
            disabled={isProcessing}
          >
            <span className="icon-check">✓</span>
            {isProcessing ? "جاري المعالجة..." : "قبول الطلب"}
          </button>
          <button
            className="btn-decision-reject"
            onClick={() => setShowRejectModal(true)}
            disabled={isProcessing}
          >
            <span className="icon-cross">✕</span> رفض الطلب
          </button>
        </div>
      )}

      {/* ── مودال القبول ─────────────────────────── */}
      {showAcceptModal && (
        <div className="modal-overlay">
          <div className="modal-box-card">
            <div className="modal-icon-circle accept-circle">
              <span className="modal-icon-v">✓</span>
            </div>
            <h2>قبول طلب {selectedRequest.name}</h2>
            <p className="modal-description-text">
              بعد تأكيد القبول سيتم إنشاء حساب{" "}
              {isPharmacy ? "الصيدلية" : "العيادة"} تلقائياً وإرسال بيانات
              الدخول على بريدهم الإلكتروني.
            </p>
            <div className="modal-action-actions">
              <button
                className="modal-btn-confirm accept-bg"
                onClick={handleConfirmAccept}
                disabled={isProcessing}
              >
                {isProcessing ? "جاري المعالجة..." : "الموافقة على الطلب"}
              </button>
              <button
                className="modal-btn-cancel"
                onClick={() => setShowAcceptModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── مودال الرفض ──────────────────────────── */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-box-card">
            <div className="modal-icon-circle reject-circle">
              <span className="modal-icon-x">✕</span>
            </div>
            <h2>رفض طلب {selectedRequest.name}</h2>
            <p className="modal-description-text">
              يرجى توضيح سبب الرفض لمشاركته مع صاحب الطلب.
            </p>
            <textarea
              className="modal-reason-textarea"
              placeholder="اكتب سبب الرفض هنا (إجباري)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="modal-action-actions">
              <button
                className="modal-btn-confirm reject-bg"
                onClick={handleConfirmReject}
                disabled={isProcessing}
              >
                {isProcessing ? "جاري المعالجة..." : "تأكيد رفض الطلب"}
              </button>
              <button
                className="modal-btn-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicRequestDetails;
