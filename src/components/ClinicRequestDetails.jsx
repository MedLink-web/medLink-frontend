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
    const [isProcessing, setIsProcessing]       = useState(false);
    const [error, setError]                     = useState("");

    const getToken = () => localStorage.getItem("auth_token");

    // ─── قبول الطلب ───────────────────────────────
    const handleAccept = async () => {
        setIsProcessing(true);
        setError("");
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/clinic-requests/${selectedRequest.id}/approve`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                // تحديث حالة الطلب محلياً
                setRequests(requests.map(r =>
                    r.id === selectedRequest.id
                        ? { ...r, status: "تمت الموافقة" }
                        : r
                ));
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
    const handleReject = async (reason) => {
        setIsProcessing(true);
        setError("");
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/clinic-requests/${selectedRequest.id}/reject`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ reason }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setRequests(requests.filter(r => r.id !== selectedRequest.id));
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
        <div className="admin-view-section">
        <div className="breadcrumb-trail">
            <span>طلبات العيادات</span> <span className="separator">&lt;</span>
            <span className="current-node">
            عرض تفاصيل عيادة {selectedRequest.name}
            </span>
        </div>

        {/* رسالة نجاح */}
        {successStatus && (
            <div className="success-banner-alert">
            ✅ تمت الموافقة على هذه العيادة وتم إنشاء حسابها على منصة MedLink. تم إرسال بيانات الدخول على البريد الإلكتروني.
            </div>
        )}

        {/* رسالة خطأ */}
        {error && (
            <div style={{
                background:"#fff5f5", border:"1px solid #fed7d7",
                color:"#c53030", padding:"12px", borderRadius:"8px",
                marginBottom:"16px"
            }}>
                ⚠️ {error}
            </div>
        )}

        <div className="details-card-container">
            <div className="details-grid">
            <div className="details-row">
                <span className="field-label">اسم العيادة :</span>
                <span className="field-value bold-text">{selectedRequest.name}</span>
            </div>
            <div className="details-row">
                <span className="field-label">البريد الالكتروني :</span>
                <span className="field-value ltr-text">{selectedRequest.email}</span>
            </div>
            <div className="details-row">
                <span className="field-label">رقم الترخيص الطبي :</span>
                <span className="field-value">{selectedRequest.license || "—"}</span>
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
            <div className="details-row">
                <span className="field-label">التخصص :</span>
                <span className="field-value">{selectedRequest.specialty}</span>
            </div>
            <div className="details-row">
                <span className="field-label">العنوان :</span>
                <span className="field-value">{selectedRequest.address}</span>
            </div>
            </div>
        </div>

        {!successStatus && (
            <div className="action-buttons-group">
            <button
                className="btn-action-reject"
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
            >
                ❌ رفض الطلب
            </button>
            <button
                className="btn-action-accept"
                onClick={() => setShowAcceptModal(true)}
                disabled={isProcessing}
            >
                {isProcessing ? "جاري المعالجة..." : "✔️ قبول الطلب"}
            </button>
            </div>
        )}

        <button className="back-to-list-btn" onClick={onBack}>
            ↩️ العودة للقائمة
        </button>

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
