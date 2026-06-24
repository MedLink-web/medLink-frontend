import React, { useState } from 'react';
import './ClinicModals.css';

const ClinicModals = ({ isOpen, type, clinicName, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-blur">
        {type === 'accept' ? (
            <div className="modal-body-box">
            <div className="modal-circle-icon accept-style">✓</div>
            <h2 className="modal-box-title">قبول طلب {clinicName}</h2>
            <p className="modal-box-desc">بعد تأكيد قبول العيادة، سيتم تفعيل الحساب الخاص بهم وإرسال إشعار التفعيل المباشر.</p>
            <div className="modal-buttons-row">
                <button className="modal-btn-cancel" onClick={onClose}>إلغاء</button>
                <button className="modal-btn-confirm accept-green" onClick={onConfirm}>الموافقة على الطلب</button>
            </div>
            </div>
        ) : (
            <div className="modal-body-box">
            <div className="modal-circle-icon reject-style">✕</div>
            <h2 className="modal-box-title">رفض طلب {clinicName}</h2>
            <p className="modal-box-desc">يرجى تقديم سبب الرفض، وسيتم مشاركته تلقائياً مع مقدم الطلب عبر البريد.</p>
            <textarea 
                className="modal-reject-textarea"
                placeholder="سبب الرفض (اجباري)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal-buttons-row">
                <button className="modal-btn-cancel" onClick={onClose}>إلغاء</button>
                <button 
                className="modal-btn-confirm reject-red" 
                onClick={() => onConfirm(reason)}
                disabled={!reason.trim()}
                >
                رفض الطلب
                </button>
            </div>
            </div>
        )}
        </div>
    );
};

export default ClinicModals;