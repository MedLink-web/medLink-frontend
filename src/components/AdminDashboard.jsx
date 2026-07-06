import React, { useState } from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";

const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // شاشات فرعية لإدارة طلبات التسجيل
  const [clinicSubView, setClinicSubView] = useState("list");
  const [pharmacySubView, setPharmacySubView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  // التحكم في المودالات
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [disableReason, setDisableReason] = useState("");

  // 🗑️ أحدث الحالات المضافة لحذف المستخدم الفعلي مع مودال تأكيد
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  // بيانات طلبات العيادات
  const [clinicRequests, setClinicRequests] = useState([
    { id: "001", name: "عيادة النور الطبية", email: "contact@alshawa-rx.sa", phone: "059325591", owner: "د. أحمد الرشيدي", specialty: "الطب الباطني", date: "3/3/2026", address: "غزة - الرمال", status: "قيد المراجعة" },
    { id: "002", name: "عيادة الامل الطبية", email: "contact@alshawa-rx.sa", phone: "059325592", owner: "د. أسعد الوجيدي", specialty: "طب الأطفال", date: "3/3/2026", address: "غزة - النصر", status: "قيد المراجعة" },
    { id: "003", name: "عيادة الشفاء التخصصية", email: "shifa@Medlink.ps", phone: "059311223", owner: "د. رامي كمال", specialty: "القلب والأوعية", date: "4/3/2026", address: "غزة - الجلاء", status: "قيد المراجعة" },
    { id: "004", name: "عيادة القدس لطب الأسنان", email: "quds-dental@gmail.com", phone: "059944556", owner: "د. منى سعيد", specialty: "طب وجراحة الأسنان", date: "5/3/2026", address: "خانيونس - وسط البلد", status: "قيد المراجعة" },
    { id: "005", name: "مركز الحياة الطبي", email: "hayat@Medlink.ps", phone: "059299881", owner: "د. يوسف عمر", specialty: "الطب العام", date: "2/3/2026", address: "رفح - حي الأمل", status: "تمت الموافقة" },
  ]);

  // بيانات طلبات الصيدليات
  const [pharmacyRequests, setPharmacyRequests] = useState([
    { id: "001", name: "صيدلية عادل", email: "contact@aldawa-rx.sa", phone: "059325598", owner: "أحمد محمد", license: "123456", date: "3/3/2026", address: "غزة - الساحة - مقابل بلدية غزة", status: "قيد المراجعة" },
    { id: "002", name: "صيدلية صقر العين", email: "contact@aldawa-rx.sa", phone: "059325599", owner: "د. أحمد الوجيدي", license: "654321", date: "3/3/2026", address: "غزة - الجلاء", status: "قيد المراجعة" },
    { id: "003", name: "صيدلية الشفاء الحديثة", email: "shifa-ph@Medlink.ps", phone: "059877665", owner: "ص. هاني مسعود", license: "789123", date: "4/3/2026", address: "غزة - حي الصبرة", status: "قيد المراجعة" },
    { id: "004", name: "صيدلية غزة المركزية", email: "gaza-center@gmail.com", phone: "059911223", owner: "ص. مريم علي", license: "456789", date: "5/3/2026", address: "غزة - عمر المختار", status: "قيد المراجعة" },
    { id: "005", name: "صيدلية ابن سينا", email: "sina-ph@gmail.com", phone: "059544332", owner: "ص. خالد وليد", license: "321654", date: "1/3/2026", address: "شمال غزة - جباليا", status: "تمت الموافقة" },
  ]);

  // بيانات إدارة المستخدمين
  const [usersList, setUsersList] = useState([
    { id: 1, name: "محمد أحمد", email: "contact@alshawa-rx.sa", type: "دكتور", status: "مفعل" },
    { id: 2, name: "محمود حسن", email: "contact@alshawa-rx.sa", type: "عيادة", status: "مفعل" },
    { id: 3, name: "خالد محمد", email: "contact@alshawa-rx.sa", type: "صيدلية", status: "مفعل" },
    { id: 4, name: "إياد أحمد", email: "eyad.doctor@Medlink.ps", type: "دكتور", status: "مفعل" },
    { id: 5, name: "روان عيد", email: "rawan.clinic@Medlink.ps", type: "عيادة", status: "غير مفعل" },
    { id: 6, name: "فاطمة عمر", email: "fatima.ph@gmail.com", type: "صيدلية", status: "مفعل" },
    { id: 7, name: "عبد الله سعيد", email: "abdullah.doc@gmail.com", type: "دكتور", status: "غير مفعل" },
  ]);

  const activeClinics = clinicRequests.filter((r) => r.status === "قيد المراجعة" || r.status === "تمت الموافقة");
  const activePharmacies = pharmacyRequests.filter((r) => r.status === "قيد المراجعة" || r.status === "تمت الموافقة");

  const confirmApproval = () => {
    if (selectedItem.type === "clinic") {
      setClinicRequests(clinicRequests.map((req) => req.id === selectedItem.id ? { ...req, status: "تمت الموافقة" } : req));
      setSelectedItem({ ...selectedItem, status: "تمت الموافقة" });
    } else {
      setPharmacyRequests(pharmacyRequests.map((req) => req.id === selectedItem.id ? { ...req, status: "تمت الموافقة" } : req));
      setSelectedItem({ ...selectedItem, status: "تمت الموافقة" });
    }
    setShowApproveModal(false);
  };

  const confirmRejection = () => {
    if (!rejectReason.trim()) return;
    if (selectedItem.type === "clinic") {
      setClinicRequests(clinicRequests.filter((req) => req.id !== selectedItem.id));
      setClinicSubView("list");
    } else {
      setPharmacyRequests(pharmacyRequests.filter((req) => req.id !== selectedItem.id));
      setPharmacySubView("list");
    }
    setShowRejectModal(false);
    setRejectReason("");
  };

  // فتح شاشة التأكيد المنبثقة أولاً قبل الحذف
  const handleRequestDelete = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  // الحذف الفعلي عند الضغط على زر التأكيد
  const confirmDeleteUser = () => {
    setUsersList(usersList.filter((user) => user.id !== userIdToDelete));
    setShowDeleteModal(false);
    setUserIdToDelete(null);
  };

  const handleToggleStatusClick = (user) => {
    if (user.status === "مفعل") {
      setSelectedUser(user);
      setDisableReason("");
      setShowStatusModal(true);
    } else {
      setUsersList(usersList.map((u) => (u.id === user.id ? { ...u, status: "مفعل" } : u)));
    }
  };

  const handleConfirmDisable = () => {
    setUsersList(usersList.map((u) => u.id === selectedUser.id ? { ...u, status: "غير مفعل" } : u));
    setShowStatusModal(false);
  };

  return (
    <div className="admin-dashboard-layout" dir="rtl">
      {/* القائمة الجانبية (Sidebar) المحدثة وعريضة */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand-wrapper">
          <img src={logo} alt="Medlink" className="sidebar-logo-img" />
          <div className="admin-logo-zone">Medlink</div>
        </div>
        <nav className="admin-nav-menu">
          <button className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            <span className="nav-icon">📊</span> لوحة التحكم
          </button>
          <button className={`admin-nav-item ${activeTab === "clinics" ? "active" : ""}`} onClick={() => { setActiveTab("clinics"); setClinicSubView("list"); }}>
            <span className="nav-icon">🏥</span> قسم العيادات
          </button>
          <button className={`admin-nav-item ${activeTab === "pharmacies" ? "active" : ""}`} onClick={() => { setActiveTab("pharmacies"); setPharmacySubView("list"); }}>
            <span className="nav-icon">💊</span> قسم الصيدليات
          </button>
          <button className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <span className="nav-icon">👥</span> إدارة المستخدمين
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={() => onNavigate("login")}>
          تسجيل الخروج ←
        </button>
      </aside>

      {/* 🟢 الحاوية المرنة الإضافية لضمان تموضع الفوتر بالأسفل دائماً */}
      <div className="admin-layout-content-wrapper">
        <main className="admin-main-content">
          {activeTab === "dashboard" && (
            <div className="dashboard-stats-view">
              <h2 className="section-main-title">لوحة تحكم المسؤول</h2>
              <p className="section-sub-title">إحصائيات المنصة وإدارة المستخدمين</p>

              <div className="stats-cards-grid">
                <div className="stat-card"><h5>إجمالي المستخدمين</h5><div className="stat-number">1,248</div></div>
                <div className="stat-card"><h5>العيادات</h5><div className="stat-number">37</div></div>
                <div className="stat-card"><h5>الصيدليات</h5><div className="stat-number">62</div></div>
                <div className="stat-card"><h5>إجمالي المواعيد</h5><div className="stat-number">3,590</div></div>
              </div>

              <div className="chart-card-container">
                <div className="chart-mock-title">معدل الانضمام والمواعيد الأسبوعي (بيانات حقيقية)</div>
                <div className="real-svg-chart-wrapper">
                  <svg viewBox="0 0 500 150" className="embedded-svg-graph">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="4" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#e2e8f0" strokeDasharray="4" />
                    <path d="M0,150 L0,110 Q70,40 150,80 T300,30 T450,90 L500,100 L500,150 Z" fill="url(#chartGradient)" />
                    <path d="M0,110 Q70,40 150,80 T300,30 T450,90 L500,100" fill="none" stroke="#2563eb" strokeWidth="3" />
                    <circle cx="150" cy="80" r="4" fill="#2563eb" />
                    <circle cx="300" cy="30" r="4" fill="#2563eb" />
                    <circle cx="450" cy="90" r="4" fill="#2563eb" />
                  </svg>
                  <div className="chart-days-labels">
                    <span>السبت</span><span>الأحد</span><span>الإثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clinics" && (
            <div className="admin-section-wrapper">
              {activeClinics.filter((r) => r.status === "قيد المراجعة").length === 0 && clinicSubView === "list" ? (
                <div className="empty-state-container">
                  <div className="empty-box-icon">📦</div>
                  <h3>طلبات العيادات</h3>
                  <p>لا يوجد طلبات قيد الانتظار</p>
                </div>
              ) : clinicSubView === "list" ? (
                <>
                  <div className="section-header-row">
                    <div>
                      <h2 className="section-title-text">طلبات العيادات</h2>
                      <p className="section-desc-text">مراجعة وإدارة طلبات تسجيل العيادات الجديدة</p>
                    </div>
                  </div>
                  <div className="admin-table-card">
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>رقم الطلب</th><th>اسم العيادة</th><th>المالك</th><th>التخصص</th><th>التاريخ</th><th>الحالة</th><th>الإجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeClinics.map((req) => (
                          <tr key={req.id}>
                            <td>{req.id}</td>
                            <td className="font-bold">{req.name}</td>
                            <td>{req.owner}</td><td>{req.specialty}</td><td>{req.date}</td>
                            <td><span className={`status-pill ${req.status === "قيد المراجعة" ? "orange" : "green"}`}>{req.status}</span></td>
                            <td>
                              <button className="btn-table-action" onClick={() => { setSelectedItem({ ...req, type: "clinic" }); setClinicSubView("details"); }}>
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="details-view-container">
                  {selectedItem.status === "تمت الموافقة" && (
                    <div className="approval-top-banner">✔️ تمت الموافقة على هذه العيادة ومسجلة الآن على منصة Medlink</div>
                  )}
                  <div className="details-view-card">
                    <div className="details-header">تخصيص تفاصيل طلب العيادة <span className="status-badge-inline">{selectedItem.status}</span></div>
                    <div className="details-grid-layout">
                      <div className="details-item"><span className="label">اسم العيادة :</span><span className="value">{selectedItem.name}</span></div>
                      <div className="details-item"><span className="label">البريد الإلكتروني :</span><span className="value">{selectedItem.email}</span></div>
                      <div className="details-item"><span className="label">رقم الهاتف :</span><span className="value">{selectedItem.phone}</span></div>
                      <div className="details-item"><span className="label">تاريخ التقديم :</span><span className="value">{selectedItem.date}</span></div>
                      <div className="details-item"><span className="label">رقم الطلب :</span><span className="value">{selectedItem.id}</span></div>
                      <div className="details-item"><span className="label">المالك :</span><span className="value">{selectedItem.owner}</span></div>
                      <div className="details-item-full"><span className="label">العنوان :</span><span className="value">{selectedItem.address}</span></div>
                    </div>
                    <div className="details-actions-row">
                      {selectedItem.status === "قيد المراجعة" && (
                        <>
                          <button className="btn-approve-success" onClick={() => setShowApproveModal(true)}>قبول الطلب</button>
                          <button className="btn-reject-danger" onClick={() => setShowRejectModal(true)}>رفض الطلب</button>
                        </>
                      )}
                      <button className="btn-back-secondary" onClick={() => setClinicSubView("list")}>رجوع</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "pharmacies" && (
            <div className="admin-section-wrapper">
              {activePharmacies.filter((r) => r.status === "قيد المراجعة").length === 0 && pharmacySubView === "list" ? (
                <div className="empty-state-container">
                  <div className="empty-box-icon">📦</div>
                  <h3>طلبات الصيدليات</h3>
                  <p>لا يوجد طلبات قيد الانتظار</p>
                </div>
              ) : pharmacySubView === "list" ? (
                <>
                  <div className="section-header-row">
                    <div>
                      <h2 className="section-title-text">طلبات الصيدليات</h2>
                      <p className="section-desc-text">مراجعة وإدارة طلبات تسجيل الصيدليات الجديدة</p>
                    </div>
                  </div>
                  <div className="admin-table-card">
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>رقم الطلب</th><th>اسم الصيدلية</th><th>المالك</th><th>الترخيص</th><th>التاريخ</th><th>الحالة</th><th>الإجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activePharmacies.map((req) => (
                          <tr key={req.id}>
                            <td>{req.id}</td>
                            <td className="font-bold">{req.name}</td>
                            <td>{req.owner}</td><td>{req.license}</td><td>{req.date}</td>
                            <td><span className={`status-pill ${req.status === "قيد المراجعة" ? "orange" : "green"}`}>{req.status}</span></td>
                            <td>
                              <button className="btn-table-action" onClick={() => { setSelectedItem({ ...req, type: "pharmacy" }); setPharmacySubView("details"); }}>
                                عرض التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="details-view-container">
                  {selectedItem.status === "تمت الموافقة" && (
                    <div className="approval-top-banner">✔️ تمت الموافقة على هذه الصيدلية ومسجلة الآن على منصة Medlink</div>
                  )}
                  <div className="details-view-card">
                    <div className="details-header">تفاصيل طلبات الصيدلية <span className="status-badge-inline">{selectedItem.status}</span></div>
                    <div className="details-grid-layout">
                      <div className="details-item"><span className="label">اسم الصيدلية :</span><span className="value">{selectedItem.name}</span></div>
                      <div className="details-item"><span className="label">البريد الإلكتروني :</span><span className="value">{selectedItem.email}</span></div>
                      <div className="details-item"><span className="label">رقم الترخيص الطبي :</span><span className="value">{selectedItem.license}</span></div>
                      <div className="details-item"><span className="label">تاريخ التقديم :</span><span className="value">{selectedItem.date}</span></div>
                      <div className="details-item"><span className="label">رقم الهاتف :</span><span className="value">{selectedItem.phone}</span></div>
                      <div className="details-item"><span className="label">رقم الطلب :</span><span className="value">{selectedItem.id}</span></div>
                      <div className="details-item"><span className="label">المالك :</span><span className="value">{selectedItem.owner}</span></div>
                      <div className="details-item-full"><span className="label">العنوان الصيدلية :</span><span className="value">{selectedItem.address}</span></div>
                    </div>
                    <div className="details-actions-row">
                      {selectedItem.status === "قيد المراجعة" && (
                        <>
                          <button className="btn-approve-success" onClick={() => setShowApproveModal(true)}>قبول الطلب</button>
                          <button className="btn-reject-danger" onClick={() => setShowRejectModal(true)}>رفض الطلب</button>
                        </>
                      )}
                      <button className="btn-back-secondary" onClick={() => setPharmacySubView("list")}>رجوع</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-section-wrapper">
              <h2 className="section-title-text">إدارة المستخدمين</h2>
              <div className="user-search-filter-bar">
                <input type="text" placeholder="البحث عن اسم الشخص..." className="admin-search-input" />
              </div>
              <div className="admin-table-card">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>الاسم</th><th>البريد الإلكتروني</th><th>نوع الحساب</th><th>الحالة</th><th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr key={user.id}>
                        <td className="font-bold">{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.type}</td>
                        <td><span className={`status-pill ${user.status === "مفعل" ? "green" : "red"}`}>{user.status}</span></td>
                        <td>
                          <div className="user-actions-cell-layout">
                            <button className={`btn-action-toggle-status ${user.status === "مفعل" ? "disable-style" : "enable-style"}`} onClick={() => handleToggleStatusClick(user)}>
                              {user.status === "مفعل" ? "تعطيل" : "تفعيل"}
                            </button>
                            <button className="btn-action-delete-user" onClick={() => handleRequestDelete(user.id)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* الفوتر في الأسفل الهيكلي الصحيح */}
        <footer className="simple-figma-footer">
          <div className="footer-logo">Medlink</div>
          <p>جميع العيادات المدرجة معتمدة ونضمن منها جودة الخدمة الطبية © 2026</p>
        </footer>
      </div>

      {/* 🟢 مودال تأكيد الموافقة */}
      {showApproveModal && selectedItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="success-circle-icon">✓</div>
            <h3 className="modal-title">قبول طلب {selectedItem.name}</h3>
            <p className="modal-body-p">بعد تأكيد قبول هذا الطلب، سيتم تفعيل الحساب الخاص بهم وإرسال إشعار مباشرةً.</p>
            <div className="modal-buttons-row">
              <button className="btn-approve-success" onClick={confirmApproval}>الموافقة على الطلب</button>
              <button className="btn-cancel-grey" onClick={() => setShowApproveModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 مودال رفض الطلب */}
      {showRejectModal && selectedItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="danger-circle-icon">✕</div>
            <h3 className="modal-title">رفض طلب {selectedItem.name}</h3>
            <p className="modal-body-p">يرجى تقديم سبب الرفض، وسيتم مشاركته مع مقدم الطلب لإصلاحه.</p>
            <div className="modal-input-block">
              <textarea placeholder="سبب الرفض (إجباري)..." rows="3" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </div>
            <div className="modal-buttons-row">
              <button className="btn-confirm-disable-red" disabled={!rejectReason.trim()} onClick={confirmRejection}>رفض الطلب</button>
              <button className="btn-cancel-grey" onClick={() => setShowRejectModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 🟡 مودال تعطيل الحساب */}
      {showStatusModal && selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h3 className="modal-title">هل أنت متأكد من تعطيل هذا الحساب؟</h3>
            <p className="modal-target-username">الحساب المستهدف: {selectedUser.name}</p>
            <div className="modal-input-block">
              <textarea placeholder="اكتب سبب التعطيل الموثق هنا..." rows="3" value={disableReason} onChange={(e) => setDisableReason(e.target.value)} />
            </div>
            <div className="modal-buttons-row">
              <button className="btn-confirm-disable-red" onClick={handleConfirmDisable}>تأكيد التعطيل</button>
              <button className="btn-cancel-grey" onClick={() => setShowStatusModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ شاشة تأكيد الحذف الفعلي المتمركزة في المنتصف تماماً */}
      {showDeleteModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card delete-modal-style">
            <div className="danger-circle-icon">🗑️</div>
            <h3 className="modal-title">تأكيد حذف الحساب</h3>
            <p className="modal-body-p">هل أنت متأكد تماماً من رغبتك في حذف هذا المستخدم نهائياً من النظام؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="modal-buttons-row">
              <button className="btn-confirm-disable-red" onClick={confirmDeleteUser}>نعم، احذف الحساب</button>
              <button className="btn-cancel-grey" onClick={() => { setShowDeleteModal(false); setUserIdToDelete(null); }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;