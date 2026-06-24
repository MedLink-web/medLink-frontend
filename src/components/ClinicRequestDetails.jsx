// ClinicRequestDetails.jsx
import React, { useState } from "react";
import ClinicModals from "./ClinicModals";
import "./ClinicRequestDetails.css";

const ClinicRequestDetails = ({
  selectedRequest,
  requests,
  setRequests,
  successStatus,
  setSuccessStatus,
  onBack,
}) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAccept = () => {
    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "تمت الموافقة" } : r,
      ),
    );
    setShowAcceptModal(false);
    setSuccessStatus(true);
  };

  const handleReject = (reason) => {
    setRequests(requests.filter((r) => r.id !== selectedRequest.id));
    setShowRejectModal(false);
    onBack();
  };

  return (
    <div className="admin-view-section">
      <div className="breadcrumb-trail">
        <span>طلبات العيادات</span> <span className="separator">&lt;</span>
        <span className="current-node">
          عرض تفاصيل عيادة {selectedRequest.name}
        </span>
      </div>

      {successStatus && (
        <div className="success-banner-alert">
          تمت الموافقة على هذه العيادة ومسجلة الآن على منصة MediLink.
        </div>
      )}

      <div className="details-card-container">
        <div className="details-grid">
          <div className="details-row">
            <span className="field-label">اسم العيادة :</span>{" "}
            <span className="field-value bold-text">
              {selectedRequest.name}
            </span>
          </div>
          <div className="details-row">
            <span className="field-label">البريد الالكتروني :</span>{" "}
            <span className="field-value ltr-text">
              {selectedRequest.email}
            </span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الترخيص الطبي :</span>{" "}
            <span className="field-value">{selectedRequest.license}</span>
          </div>
          <div className="details-row">
            <span className="field-label">تاريخ التقديم :</span>{" "}
            <span className="field-value">{selectedRequest.date}</span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الهاتف :</span>{" "}
            <span className="field-value">{selectedRequest.phone}</span>
          </div>
          <div className="details-row">
            <span className="field-label">رقم الطلب :</span>{" "}
            <span className="field-value">{selectedRequest.id}</span>
          </div>
          <div className="details-row">
            <span className="field-label">المالك :</span>{" "}
            <span className="field-value">{selectedRequest.owner}</span>
          </div>
          <div className="details-row">
            <span className="field-label">العنوان :</span>{" "}
            <span className="field-value">{selectedRequest.address}</span>
          </div>
        </div>
      </div>

      {!successStatus && (
        <div className="action-buttons-group">
          <button
            className="btn-action-reject"
            onClick={() => setShowRejectModal(true)}
          >
            ❌ رفض الطلب
          </button>
          <button
            className="btn-action-accept"
            onClick={() => setShowAcceptModal(true)}
          >
            ✔️ قبول الطلب
          </button>
        </div>
      )}

      <button className="back-to-list-btn" onClick={onBack}>
        ↩️ العودة للقائمة
      </button>

      {/* استدعاء مكون النوافذ المنبثقة بشكل منفصل */}
      <ClinicModals
        isOpen={showAcceptModal || showRejectModal}
        type={showAcceptModal ? "accept" : "reject"}
        clinicName={selectedRequest.name}
        onClose={() => {
          setShowAcceptModal(false);
          setShowRejectModal(false);
        }}
        onConfirm={showAcceptModal ? handleAccept : handleReject}
      />
    </div>
  );
};

export default ClinicRequestDetails;
