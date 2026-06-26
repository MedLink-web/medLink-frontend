import React, { useState } from "react";
import "./ClinicRequestDetails.css";

const ClinicRequestDetails = ({ request, onBack, onStatusUpdate }) => {
  // حالات التحكم في ظهور المودالات واللافتة العلوية
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [currentStatus, setCurrentStatus] = useState(request.status); // 'قيد الانتظار'، 'تمت الموافقة'، 'مرفوض'
    const [showSuccessBanner, setShowSuccessBanner] = useState(
      request.status === "تمت الموافقة",
    );

    const isPharmacy = request.type === "pharmacy";

    // معالجة تأكيد القبول
    const handleConfirmAccept = () => {
      setCurrentStatus("تمت الموافقة");
      setShowSuccessBanner(true);
      setShowAcceptModal(false);
      if (onStatusUpdate) {
        onStatusUpdate(request.id, request.type, "تمت الموافقة");
      }
    };

    // معالجة تأكيد الرفض
  // معالجة تأكيد الرفض وإرسال الإيميل بالسبب
    const handleConfirmReject = () => {
        if (!rejectionReason.trim()) {
            alert('الرجاء إدخال سبب الرفض أولاً');
            return;
        }
        
        setCurrentStatus('مرفوض');
        setShowSuccessBanner(false);
        setShowRejectModal(false);
        
        // تمرير المعطيات إلى الداشبورد (المعرف، النوع، الحالة الجديدة، وسبب الرفض)
        if (onStatusUpdate) {
            onStatusUpdate(request.id, request.type, 'مرفوض', rejectionReason);
        }
    };

    return (
      <div className="request-details-wrapper">
        {/* شريط التنقل العلوي */}
        <div className="details-navigation-header">
          <button className="back-to-list-btn" onClick={onBack}>
            &gt; {isPharmacy ? "طلبات الصيدلية" : "طلبات العيادات"}
          </button>
          <span className="navigation-separator"> &lt; </span>
          <span className="current-sub-view">عرض تفاصيل {request.name}</span>
        </div>

        {/* لافتة النجاح عند الموافقة المشابهة لتصميمك اللبني والأخضر */}
        {showSuccessBanner && (
          <div className="success-banner-alert">
            تمت الموافقة على هذا الطلب وهو الآن نشط ومسجل رسميًا على منصة Medlink.
          </div>
        )}

        {/* بطاقة عرض البيانات التفصيلية اللبنية */}
        <div className="details-card-container">
          <div className="details-grid">
            <div className="details-row">
              <span className="field-label">
                اسم {isPharmacy ? "الصيدلية" : "العيادة"} :
              </span>
              <span className="field-value font-bold">{request.name}</span>
            </div>
            <div className="details-row">
              <span className="field-label">البريد الإلكتروني :</span>
              <span className="field-value ltr-text">{request.email}</span>
            </div>
            <div className="details-row">
              <span className="field-label">رقم الترخيص الطبي :</span>
              <span className="field-value">{request.license}</span>
            </div>
            <div className="details-row">
              <span className="field-label">تاريخ التقديم :</span>
              <span className="field-value">{request.date}</span>
            </div>
            <div className="details-row">
              <span className="field-label">رقم الهاتف :</span>
              <span className="field-value">{request.phone}</span>
            </div>
            <div className="details-row">
              <span className="field-label">رقم الطلب :</span>
              <span className="field-value">{request.id}</span>
            </div>
            <div className="details-row">
              <span className="field-label">المالك :</span>
              <span className="field-value">{request.owner}</span>
            </div>
            {!isPharmacy && request.specialty && (
              <div className="details-row">
                <span className="field-label">التخصص :</span>
                <span className="field-value">{request.specialty}</span>
              </div>
            )}
            <div className="details-row full-width-row">
              <span className="field-label">العنوان الكامل :</span>
              <span className="field-value">{request.address}</span>
            </div>
          </div>
        </div>

        {/* أزرار اتخاذ القرار التفاعلية - تظهر فقط إن كانت الحالة 'قيد الانتظار' لربط منطقي سليم */}
        {currentStatus === "قيد الانتظار" && (
          <div className="details-action-buttons-footer">
            <button
              className="btn-decision-accept"
              onClick={() => setShowAcceptModal(true)}
            >
              <span className="icon-check">✓</span> قبول الطلب
            </button>
            <button
              className="btn-decision-reject"
              onClick={() => setShowRejectModal(true)}
            >
              <span className="icon-cross">✕</span> رفض الطلب
            </button>
          </div>
        )}

        {/* ----------------- نافذة تأكيد القبول المنبثقة (Modal) ----------------- */}
        {showAcceptModal && (
          <div className="modal-overlay">
            <div className="modal-box-card">
              <div className="modal-icon-circle accept-circle">
                <span className="modal-icon-v">✓</span>
              </div>
              <h2>قبول طلب {request.name}</h2>
              <p className="modal-description-text">
                بعد تأكيد قبول {isPharmacy ? "الصيدلية" : "العيادة"} <br />
                <strong>
                  سيتم تفعيل الحساب الخاص بهم وإرسال إشعار تفعيل على بريدهم
                  الإلكتروني.
                </strong>
              </p>
              <div className="modal-action-actions">
                <button
                  className="modal-btn-confirm accept-bg"
                  onClick={handleConfirmAccept}
                >
                  الموافقة على الطلب
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

        {/* ----------------- نافذة تأكيد الرفض المنبثقة (Modal) ----------------- */}
        {showRejectModal && (
          <div className="modal-overlay">
            <div className="modal-box-card">
              <div className="modal-icon-circle reject-circle">
                <span className="modal-icon-x">✕</span>
              </div>
              <h2>رفض طلب {request.name}</h2>
              <p className="modal-description-text">
                يرجى توضيح سبب رفض طلب الانضمام هذا لمشاركته مع المالك بشكل شفاف.
              </p>

              <textarea
                className="modal-reason-textarea"
                placeholder="اكتبي سبب الرفض هنا (حقل إجباري)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />

              <div className="modal-action-actions">
                <button
                  className="modal-btn-confirm reject-bg"
                  onClick={handleConfirmReject}
                >
                  تأكيد رفض الطلب
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
