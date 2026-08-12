import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./DoctorsManagement.css";

const DoctorsManagement = ({ onNavigate, onDelete, showToast }) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // حالات الحذف
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // حالات التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [editData, setEditData] = useState({
    full_name: "",
    specialty: "",
    phone: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // ─── جلب الأطباء من API ───────────────────────
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/clinic/doctors", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDoctors(
          data.data.map((doc) => ({
            id: doc.id,
            name: doc.full_name,
            specialty: doc.specialty,
            email: doc.email,
            phone: doc.phone || "—",
            patients: 0,
            rating: 5.0,
            status: "نشط",
          })),
        );
      } else if (response.status === 401) {
        onNavigate && onNavigate("login");
      } else {
        setError("فشل تحميل بيانات الأطباء");
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── تصفية الأطباء ────────────────────────────
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.includes(searchTerm) || doc.specialty.includes(searchTerm),
  );

  // ─── الحذف ────────────────────────────────────
  const triggerDeleteConfirmation = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/clinic/doctors/${doctorToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        },
      );
      if (response.ok) {
        setDoctors(doctors.filter((d) => d.id !== doctorToDelete.id));
        if (onDelete) onDelete(doctorToDelete.id);
      }
    } catch {
      setError("فشل حذف الطبيب");
    } finally {
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
    }
  };

  // ─── التعديل ──────────────────────────────────
  const triggerEdit = (doctor) => {
    setDoctorToEdit(doctor);
    setEditData({
      full_name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone === "—" ? "" : doctor.phone,
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors({ ...editErrors, [name]: "" });
  };

  const confirmEdit = async () => {
    setIsSaving(true);
    setEditErrors({});
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/clinic/doctors/${doctorToEdit.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(editData),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // تحديث القائمة محلياً
        setDoctors(
          doctors.map((d) =>
            d.id === doctorToEdit.id
              ? {
                  ...d,
                  name: editData.full_name,
                  specialty: editData.specialty,
                  phone: editData.phone || "—",
                }
              : d,
          ),
        );
        setIsEditModalOpen(false);
        setDoctorToEdit(null);
      } else if (response.status === 422) {
        const backendErrors = {};
        Object.entries(data.errors).forEach(([field, messages]) => {
          backendErrors[field] = messages[0];
        });
        setEditErrors(backendErrors);
      } else {
        setEditErrors({ general: data.message || "حدث خطأ" });
      }
    } catch {
      setEditErrors({ general: "تعذر الاتصال بالسيرفر" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="clinic-dashboard-layout"
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "18px" }}>جاري تحميل بيانات الأطباء...</p>
      </div>
    );
  }

  return (
    <div className="clinic-dashboard-layout" dir="rtl">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="clinic-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 8.5C21 7.30653 20.5256 6.16227 19.6816 5.31836C18.8377 4.47445 17.6935 4 16.5 4C15.7202 4 15.1131 4.10999 14.5518 4.35449C13.984 4.60181 13.4 5.01407 12.707 5.70703C12.3165 6.09756 11.6835 6.09756 11.293 5.70703C10.6 5.01407 10.016 4.60181 9.44824 4.35449C8.88687 4.10999 8.27982 4 7.5 4C6.30653 4 5.16227 4.47445 4.31836 5.31836C3.47445 6.16227 3 7.30653 3 8.5C3 10.116 3.91951 11.4583 5.15039 12.7363L12 19.5859L18.2998 13.2861L18.8447 12.7354C20.0754 11.446 21 10.1064 21 8.5ZM23 8.5C23 11.2396 21.1925 13.2488 19.7061 14.7061L19.707 14.707L12.707 21.707C12.3165 22.0976 11.6835 22.0976 11.293 21.707L4.30469 14.7188L3.73047 14.1465C2.37747 12.749 1 10.9088 1 8.5C1 6.77609 1.68433 5.12231 2.90332 3.90332C4.12231 2.68433 5.77609 2 7.5 2C8.48018 2 9.37344 2.14001 10.2471 2.52051C10.8603 2.78761 11.4318 3.16121 12 3.6416C12.5682 3.16121 13.1397 2.78761 13.7529 2.52051C14.6266 2.14001 15.5198 2 16.5 2C18.2239 2 19.8777 2.68433 21.0967 3.90332C22.3157 5.12231 23 6.77609 23 8.5Z"
                fill="black"
              />
              <path
                d="M13.9368 7.50195C14.3591 7.47521 14.7525 7.71754 14.9192 8.10645L16.1595 11H20.7698L20.8723 11.0049C21.3766 11.0561 21.7698 11.4823 21.7698 12C21.7698 12.5177 21.3766 12.9439 20.8723 12.9951L20.7698 13H15.5003C15.1002 13 14.7389 12.7612 14.5813 12.3936L14.1888 11.4775L12.9612 15.7744C12.8456 16.1789 12.4893 16.4677 12.0696 16.4971C11.7025 16.5227 11.3558 16.3453 11.1604 16.043L11.0862 15.9062L9.77664 12.96C9.68799 12.9855 9.5953 13 9.50027 13H3.22C2.66772 13 2.22 12.5523 2.22 12C2.22 11.4477 2.66772 11 3.22 11H8.88211L9.10574 10.5527L9.17898 10.4297C9.36857 10.1566 9.68416 9.99231 10.0227 10C10.4095 10.0088 10.7561 10.2403 10.9134 10.5938L11.7942 12.5771L13.0384 8.22559L13.093 8.07812C13.2456 7.7499 13.5674 7.52537 13.9368 7.50195Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="brand-text-wrapper">
            <h3>عيادة النور الطبية</h3>
            <p>لوحة التحكم</p>
          </div>
        </div>
        <nav className="sidebar-menu-items">
          <p className="menu-section-title">القائمة الرئيسية</p>
          <button
            className="menu-item-btn"
            onClick={() => onNavigate("clinic-profile")}
          >
            <span className="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 9V5C8 4.44772 8.44772 4 9 4C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9Z"
                  fill="black"
                />
                <path
                  d="M8 10V14H10V10H8ZM12 14C12 15.1046 11.1046 16 10 16H8C6.89543 16 6 15.1046 6 14V10C6 8.89543 6.89543 8 8 8H10C11.1046 8 12 8.89543 12 10V14Z"
                  fill="black"
                />
                <path
                  d="M8 17V15C8 14.4477 8.44772 14 9 14C9.55228 14 10 14.4477 10 15V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17Z"
                  fill="black"
                />
                <path
                  d="M16 5V3C16 2.44772 16.4477 2 17 2C17.5523 2 18 2.44772 18 3V5C18 5.55228 17.5523 6 17 6C16.4477 6 16 5.55228 16 5Z"
                  fill="black"
                />
                <path
                  d="M16 6V12H18V6H16ZM20 12C20 13.1046 19.1046 14 18 14H16C14.8954 14 14 13.1046 14 12V6C14 4.89543 14.8954 4 16 4H18C19.1046 4 20 4.89543 20 6V12Z"
                  fill="black"
                />
                <path
                  d="M16 16V13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13V16C18 16.5523 17.5523 17 17 17C16.4477 17 16 16.5523 16 16Z"
                  fill="black"
                />
                <path
                  d="M2 19V3C2 2.44772 2.44772 2 3 2C3.55228 2 4 2.44772 4 3V19C4 19.2652 4.10543 19.5195 4.29297 19.707C4.48051 19.8946 4.73478 20 5 20H21C21.5523 20 22 20.4477 22 21C22 21.5523 21.5523 22 21 22H5C4.20435 22 3.44151 21.6837 2.87891 21.1211C2.3163 20.5585 2 19.7957 2 19Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            لوحة التحكم
          </button>
          <button
            className="menu-item-btn"
            onClick={() => onNavigate("doctors-management")}
          >
            <span className="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 21V19C15 18.2044 14.6837 17.4415 14.1211 16.8789C13.6289 16.3867 12.9835 16.0829 12.2969 16.0146L12 16H6C5.20435 16 4.44152 16.3163 3.87891 16.8789C3.3163 17.4415 3 18.2044 3 19V21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21V19C1 17.6739 1.52716 16.4025 2.46484 15.4648C3.40253 14.5272 4.67392 14 6 14H12L12.248 14.0059C13.4838 14.0672 14.6561 14.5858 15.5352 15.4648C16.4728 16.4025 17 17.6739 17 19V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21Z"
                  fill="black"
                />
                <path
                  d="M12 7C12 5.34315 10.6569 4 9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10C10.6569 10 12 8.65685 12 7ZM14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7Z"
                  fill="black"
                />
                <path
                  d="M18 14V8C18 7.44772 18.4477 7 19 7C19.5523 7 20 7.44772 20 8V14C20 14.5523 19.5523 15 19 15C18.4477 15 18 14.5523 18 14Z"
                  fill="black"
                />
                <path
                  d="M22 10C22.5523 10 23 10.4477 23 11C23 11.5523 22.5523 12 22 12H16C15.4477 12 15 11.5523 15 11C15 10.4477 15.4477 10 16 10H22Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            إدارة الأطباء
          </button>
          <button
            className="menu-item-btn"
            onClick={() => onNavigate("clinic-appointments")}
          >
            <span className="menu-icon">
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5V1C5 0.447715 5.44772 0 6 0C6.55228 0 7 0.447715 7 1V5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5Z"
                  fill="black"
                />
                <path
                  d="M13 5V1C13 0.447715 13.4477 0 14 0C14.5523 0 15 0.447715 15 1V5C15 5.55228 14.5523 6 14 6C13.4477 6 13 5.55228 13 5Z"
                  fill="black"
                />
                <path
                  d="M18 5C18 4.44772 17.5523 4 17 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V5ZM20 19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V5C0 3.34315 1.34315 2 3 2H17C18.6569 2 20 3.34315 20 5V19Z"
                  fill="black"
                />
                <path
                  d="M19 8C19.5523 8 20 8.44771 20 9C20 9.55229 19.5523 10 19 10H1C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8H19Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            المواعيد
          </button>
          <button className="menu-item-btn" onClick={() => onNavigate("")}>
            <span className="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.00346 6.99475C1.00351 6.60711 1.11604 6.22772 1.32768 5.90295C1.53743 5.58123 1.8357 5.32645 2.18608 5.16956L10.7554 1.27014L10.9029 1.20764C11.2518 1.07053 11.6237 0.99969 11.9996 0.999634C12.429 0.999634 12.8539 1.09195 13.2447 1.27014L21.8345 5.1803C22.1849 5.33718 22.4822 5.59098 22.6919 5.91272C22.9037 6.2375 23.0161 6.61682 23.0162 7.00452C23.0162 7.39238 22.9038 7.77237 22.6919 8.09729C22.482 8.41928 22.1833 8.67286 21.8326 8.82971L21.8335 8.83069L13.2544 12.7291L13.2554 12.7301C12.9133 12.8861 12.545 12.9757 12.1705 12.9957L12.0103 13.0006C11.6343 13.0006 11.2617 12.9298 10.9126 12.7926L10.7652 12.7301L2.1851 8.81995C1.83531 8.66301 1.53716 8.40883 1.32768 8.08752C1.11585 7.76261 1.00346 7.38262 1.00346 6.99475ZM3.01518 6.99963L11.5943 10.9098L11.6949 10.9489C11.7963 10.9826 11.9029 11.0006 12.0103 11.0006L12.1167 10.9948C12.2231 10.9833 12.3276 10.9544 12.4253 10.9098L21.0064 7.0094L21.0162 7.00452L21.0054 7.00061L12.4156 3.09045L12.4146 3.08948C12.2844 3.03019 12.1426 2.99963 11.9996 2.99963C11.8925 2.99968 11.7863 3.01684 11.6851 3.05042L11.5855 3.08948L11.5845 3.09045L3.00346 6.99475L3.01518 6.99963Z"
                  fill="black"
                />
                <path
                  d="M21.9922 11C22.5098 10.9959 22.9389 11.3859 22.9941 11.8896L23 11.9922L22.9961 12.1367C22.9743 12.4742 22.867 12.8019 22.6836 13.0879C22.4741 13.4144 22.1741 13.6729 21.8203 13.832L13.2441 17.7305L13.2422 17.7314C12.8535 17.9074 12.4315 17.998 12.0049 17.998C11.5782 17.998 11.1563 17.9074 10.7676 17.7314L10.7666 17.7305L2.16602 13.8203L2.16016 13.8174C1.813 13.6567 1.51909 13.3997 1.31348 13.0771C1.10795 12.7546 0.99906 12.3795 1.00001 11.9971L1.00587 11.8955C1.05825 11.3913 1.48511 10.9987 2.00294 11C2.55484 11.0016 3.00011 11.45 2.99903 12.0019L11.5918 15.9092C11.7213 15.9678 11.8628 15.998 12.0049 15.998C12.1467 15.998 12.2868 15.9675 12.416 15.9092L20.9961 12.0098L21 12.0078L21.0039 11.9053C21.0513 11.4008 21.4745 11.0041 21.9922 11Z"
                  fill="black"
                />
                <path
                  d="M21.9922 16C22.5098 15.9959 22.9389 16.3859 22.9941 16.8896L23 16.9922L22.9961 17.1367C22.9743 17.4742 22.867 17.8019 22.6836 18.0879C22.4741 18.4144 22.1741 18.6729 21.8203 18.832L13.2441 22.7305L13.2422 22.7314C12.8535 22.9074 12.4315 22.998 12.0049 22.998C11.5782 22.998 11.1563 22.9074 10.7676 22.7314L10.7666 22.7305L2.16602 18.8203L2.16016 18.8174C1.813 18.6567 1.51909 18.3997 1.31348 18.0771C1.10795 17.7546 0.99906 17.3795 1.00001 16.9971L1.00587 16.8955C1.05825 16.3913 1.48511 15.9987 2.00294 16C2.55484 16.0016 3.00011 16.45 2.99903 17.0019L11.5918 20.9092C11.7213 20.9678 11.8628 20.998 12.0049 20.998C12.1467 20.998 12.2868 20.9675 12.416 20.9092L20.9961 17.0098L21 17.0078L21.0039 16.9053C21.0513 16.4008 21.4745 16.0041 21.9922 16Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            السجلات الطبية
          </button>
          <button className="menu-item-btn active-tab-item">
            <span className="menu-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 21V18C13 17.7348 12.8946 17.4805 12.707 17.293C12.5429 17.1289 12.3276 17.0276 12.0986 17.0049L12 17C11.7348 17 11.4805 17.1055 11.293 17.293C11.1054 17.4805 11 17.7348 11 18V21C11 21.5523 10.5523 22 10 22C9.44771 22 9 21.5523 9 21V18C9 17.2044 9.3163 16.4415 9.87891 15.8789C10.4415 15.3163 11.2043 15 12 15L12.2969 15.0147C12.9835 15.0829 13.6289 15.3867 14.1211 15.8789C14.6837 16.4415 15 17.2044 15 18V21C15 21.5523 14.5523 22 14 22C13.4477 22 13 21.5523 13 21Z"
                  fill="black"
                />
                <path
                  d="M18.0098 11L18.1123 11.0049C18.6165 11.0561 19.0098 11.4823 19.0098 12C19.0098 12.5178 18.6165 12.9439 18.1123 12.9951L18.0098 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H18.0098Z"
                  fill="black"
                />
                <path
                  d="M18.0098 15L18.1123 15.0049C18.6165 15.0561 19.0098 15.4823 19.0098 16C19.0098 16.5178 18.6165 16.9439 18.1123 16.9951L18.0098 17H18C17.4477 17 17 16.5523 17 16C17 15.4477 17.4477 15 18 15H18.0098Z"
                  fill="black"
                />
                <path
                  d="M19 6.99976C18.3869 6.99967 17.7882 6.81215 17.2852 6.46167L12.5713 3.18042C12.4037 3.06361 12.2043 3.00088 12 3.00073C11.7958 3.00064 11.5954 3.06192 11.4277 3.17847L11.4287 3.17944L6.71484 6.45874L6.71582 6.45972C6.21298 6.8107 5.6142 6.9992 5.00098 6.99976H3V18.9998C3 19.2649 3.10552 19.5193 3.29297 19.7068C3.48051 19.8943 3.73478 19.9998 4 19.9998H20C20.2652 19.9998 20.5195 19.8943 20.707 19.7068C20.8945 19.5193 21 19.2649 21 18.9998V6.99976H19ZM23 18.9998C23 19.7954 22.6837 20.5592 22.1211 21.1218C21.5585 21.6842 20.7955 21.9998 20 21.9998H4C3.20452 21.9998 2.44148 21.6842 1.87891 21.1218C1.3163 20.5592 1 19.7954 1 18.9998V6.99976C1.00007 6.46942 1.21093 5.9607 1.58594 5.58569C1.961 5.21071 2.46963 4.99976 3 4.99976H4.99902C5.20335 4.99958 5.40274 4.93697 5.57031 4.82007L5.57129 4.81909L10.2861 1.53784L10.4785 1.4148C10.9387 1.14418 11.4644 1.0005 12.001 1.00073C12.6134 1.00108 13.2103 1.18985 13.7129 1.5398L13.7139 1.53882L18.4287 4.82007L18.5596 4.89819C18.696 4.96513 18.8467 4.99971 19 4.99976H21C21.5304 4.99976 22.039 5.21071 22.4141 5.58569C22.7891 5.9607 22.9999 6.46942 23 6.99976V18.9998Z"
                  fill="black"
                />
                <path
                  d="M6.00977 11L6.1123 11.0049C6.61655 11.0561 7.00977 11.4823 7.00977 12C7.00977 12.5178 6.61655 12.9439 6.1123 12.9951L6.00977 13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H6.00977Z"
                  fill="black"
                />
                <path
                  d="M6.00977 15L6.1123 15.0049C6.61655 15.0561 7.00977 15.4823 7.00977 16C7.00977 16.5178 6.61655 16.9439 6.1123 16.9951L6.00977 17H6C5.44772 17 5 16.5523 5 16C5 15.4477 5.44772 15 6 15H6.00977Z"
                  fill="black"
                />
                <path
                  d="M13 10C13 9.44774 12.5523 9.00003 12 9.00003C11.4477 9.00003 11 9.44774 11 10C11 10.5523 11.4477 11 12 11C12.5523 11 13 10.5523 13 10ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34317 10.3431 7.00003 12 7.00003C13.6569 7.00003 15 8.34317 15 10Z"
                  fill="black"
                />
              </svg>
            </span>{" "}
            ملف العيادة
          </button>
        </nav>

        <button
          className="sidebar-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            onNavigate("home");
          }}
        >
          <span className="logout-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.293 6.29297C15.6591 5.92685 16.2381 5.90426 16.6309 6.22461L16.707 6.29297L21.707 11.293C22.0976 11.6835 22.0976 12.3165 21.707 12.707L16.707 17.707C16.3165 18.0976 15.6835 18.0976 15.293 17.707C14.9024 17.3165 14.9024 16.6835 15.293 16.293L19.5859 12L15.293 7.70703L15.2246 7.63086C14.9043 7.23809 14.9269 6.65908 15.293 6.29297Z"
                fill="black"
              />
              <path
                d="M21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H21Z"
                fill="black"
              />
              <path
                d="M2 19V5C2 4.20435 2.3163 3.44152 2.87891 2.87891C3.44152 2.3163 4.20435 2 5 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H5C4.73478 4 4.4805 4.10543 4.29297 4.29297C4.10543 4.4805 4 4.73478 4 5V19C4 19.2652 4.10543 19.5195 4.29297 19.707C4.48051 19.8946 4.73478 20 5 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H5C4.20435 22 3.44151 21.6837 2.87891 21.1211C2.3163 20.5585 2 19.7957 2 19Z"
                fill="black"
              />
            </svg>
          </span>{" "}
          تسجيل الخروج
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="clinic-main-content">
        {showToast && (
          <div className="success-toast-banner-top">
            <span className="toast-text-message">تم إضافة الطبيب بنجاح</span>
            <div className="toast-check-circle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.293 5.29295C19.6835 4.90243 20.3165 4.90243 20.707 5.29295C21.0976 5.68348 21.0976 6.31649 20.707 6.70702L9.70704 17.707C9.31652 18.0975 8.6835 18.0975 8.29298 17.707L3.29298 12.707L3.22462 12.6308C2.90427 12.2381 2.92686 11.6591 3.29298 11.293C3.65909 10.9268 4.2381 10.9042 4.63087 11.2246L4.70704 11.293L9.00001 15.5859L19.293 5.29295Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        )}

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

        <div className="content-top-navigation-bar">
          <div className="breadcrumb-links">
            <span>لوحة التحكم</span> &gt;{" "}
            <span className="active-path">إدارة الأطباء</span>
          </div>
          <button
            className="edit-profile-action-btn"
            onClick={() => onNavigate("add-doctor")}
          >
            ➕ إضافة طبيب
          </button>
        </div>

        {/* إحصائيات */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>إجمالي الأطباء</h3>
            <h2>{doctors.length}</h2>
          </div>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>الأطباء النشطون</h3>
            <h2>{doctors.filter((d) => d.status === "نشط").length}</h2>
          </div>
          <div
            className="profile-details-view-card"
            style={{ flex: 1, textAlign: "center" }}
          >
            <h3>إجمالي المرضى</h3>
            <h2>0</h2>
          </div>
        </div>

        {/* بحث */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <input
            type="text"
            placeholder=" بحث بالاسم أو التخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #cbd5e0",
            }}
          />
        </div>

        {/* جدول */}
        <div
          className="profile-details-view-card"
          style={{ padding: "0", overflow: "hidden" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "right",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th style={{ padding: "16px" }}>الطبيب</th>
                <th style={{ padding: "16px" }}>التواصل</th>
                <th style={{ padding: "16px" }}>المرضى</th>
                <th style={{ padding: "16px" }}>التقييم</th>
                <th style={{ padding: "16px" }}>الحالة</th>
                <th style={{ padding: "16px" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#718096",
                    }}
                  >
                    لا يوجد أطباء حالياً
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr
                    key={doc.id}
                    style={{ borderBottom: "1px solid #edf2f7" }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: "700", color: "#2d3748" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#718096" }}>
                        {doc.specialty}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "13px",
                        color: "#4a5568",
                      }}
                    >
                      <div>{doc.email}</div>
                      <div style={{ color: "#a0aec0" }}>{doc.phone}</div>
                    </td>
                    <td style={{ padding: "16px" }}>{doc.patients}</td>
                    <td
                      style={{
                        padding: "16px",
                        color: "#dd6b20",
                        fontWeight: "700",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.2121 1.01465C12.3523 1.03426 12.4889 1.07365 12.6184 1.13086L12.8068 1.23047L12.9797 1.35449C13.0885 1.44522 13.184 1.5509 13.2639 1.66797L13.3713 1.85156L15.6818 6.53125L15.7492 6.64844C15.8234 6.76176 15.9174 6.86126 16.0275 6.94141C16.1745 7.04828 16.3458 7.11814 16.5256 7.14453L21.6906 7.90039C21.9025 7.93112 22.1034 8.00614 22.2834 8.11914L22.4562 8.24414L22.6086 8.39258C22.7034 8.49819 22.7827 8.61658 22.8449 8.74414L22.925 8.94141L22.9768 9.14844C23.0137 9.35762 23.0065 9.57349 22.9553 9.78125C22.8869 10.0582 22.7425 10.3106 22.5383 10.5098L22.5373 10.5107L18.802 14.1484C18.6718 14.2753 18.5741 14.4317 18.5178 14.6045C18.4616 14.7773 18.4482 14.9615 18.4787 15.1406L19.3596 20.2764L19.382 20.4893C19.3894 20.7025 19.3522 20.9159 19.2717 21.1152C19.1642 21.3811 18.9842 21.6118 18.7521 21.7803C18.5201 21.9487 18.2452 22.0485 17.9592 22.0684C17.6731 22.0882 17.3871 22.0273 17.134 21.8926L12.5207 19.4668C12.4001 19.4036 12.2694 19.363 12.135 19.3467L11.9992 19.3389C11.8178 19.3389 11.6384 19.3815 11.4777 19.4658L11.4787 19.4668L6.8625 21.8926L6.86347 21.8936C6.61046 22.0274 6.32478 22.0877 6.03926 22.0674C5.75385 22.047 5.47967 21.9475 5.24824 21.7793C5.01675 21.6109 4.83702 21.3806 4.72968 21.1152C4.64914 20.916 4.61205 20.7025 4.61933 20.4893L4.64082 20.2773L5.52168 15.1416L5.53633 15.0068C5.54294 14.8713 5.52478 14.7353 5.48261 14.6055C5.44043 14.4757 5.37522 14.3547 5.29023 14.249L5.19843 14.1484L1.46211 10.5117L1.46308 10.5107C1.25852 10.3121 1.11321 10.0609 1.04414 9.78418C0.974776 9.50616 0.984039 9.21396 1.07246 8.94141L1.15254 8.74316C1.24606 8.55129 1.3795 8.3805 1.54414 8.24219L1.71699 8.11621C1.83753 8.04084 1.96808 7.98271 2.10468 7.94336L2.31367 7.89844L7.4748 7.14453L7.60761 7.11621C7.73858 7.08062 7.86244 7.0216 7.97285 6.94141C8.11982 6.83462 8.23903 6.69411 8.31953 6.53125L10.6281 1.85254L10.6291 1.85156L10.7365 1.66797C10.8561 1.49267 11.011 1.34328 11.1926 1.23047L11.3811 1.13086C11.5753 1.04492 11.7862 1 12.0002 1L12.2121 1.01465ZM17.3898 20.624V20.6191L17.3879 20.6113L17.3898 20.624ZM18.0695 20.125L18.0744 20.127L18.0676 20.123L18.0695 20.125ZM5.92793 20.126L5.93086 20.125L5.93379 20.123C5.93189 20.124 5.92981 20.125 5.92793 20.126ZM10.1125 7.41602C9.88851 7.86934 9.55769 8.26235 9.14863 8.55957C8.73936 8.85685 8.26346 9.04923 7.76289 9.12207L7.76386 9.12305L3.5373 9.74023L6.59394 12.7158L6.72578 12.8516C7.02286 13.1783 7.24792 13.565 7.38496 13.9863C7.52197 14.4077 7.56683 14.853 7.51875 15.292L7.49238 15.4795L6.77168 19.6826L10.548 17.6973L10.718 17.6133C11.1201 17.4323 11.5568 17.3389 11.9992 17.3389L12.1887 17.3447C12.6289 17.3714 13.0596 17.4906 13.4514 17.6963L17.2287 19.6826L16.507 15.4795C16.4218 14.9807 16.4598 14.4676 16.6164 13.9863C16.773 13.5051 17.044 13.069 17.4064 12.7158L20.4602 9.74121L16.2355 9.12305C15.7358 9.04965 15.2603 8.85656 14.8518 8.55957C14.4431 8.2624 14.1127 7.86993 13.8889 7.41699L11.9992 3.5918L10.1125 7.41602Z"
                          fill="black"
                        />
                      </svg>
                      {doc.rating}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          backgroundColor:
                            doc.status === "نشط" ? "#c6f6d5" : "#fed7d7",
                          color: doc.status === "نشط" ? "#22543d" : "#742a2a",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td
                      style={{ padding: "16px", display: "flex", gap: "8px" }}
                    >
                      {/* زر التعديل */}
                      <button
                        onClick={() => triggerEdit(doc)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        title="تعديل"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.9999 19C21.5522 19 21.9999 19.4477 21.9999 20C21.9999 20.5523 21.5522 21 20.9999 21H11.9999C11.4476 21 10.9999 20.5523 10.9999 20C10.9999 19.4477 11.4476 19 11.9999 19H20.9999Z"
                            fill="black"
                          />
                          <path
                            d="M18.9999 5.12329C18.9999 4.82559 18.8813 4.53989 18.6708 4.32935C18.4867 4.1452 18.2451 4.03169 17.9882 4.0061L17.8769 4.00024C17.6163 4.00025 17.3647 4.09043 17.165 4.25415L17.0829 4.32935L5.07219 16.3401C4.98291 16.4293 4.91118 16.5345 4.86125 16.6497L4.81926 16.7668L4.23527 18.7629L6.23234 18.1809L6.35148 18.1379C6.46652 18.088 6.57186 18.0172 6.66105 17.928L18.6708 5.91724L18.745 5.83423C18.9087 5.63452 18.9998 5.38372 18.9999 5.12329ZM20.9999 5.12329C20.9998 5.89975 20.7101 6.6462 20.1913 7.21899L20.0849 7.3313L8.07512 19.342C7.76279 19.6544 7.38563 19.8929 6.9716 20.0422L6.79289 20.1008L3.92082 20.9387C3.66276 21.014 3.38923 21.0191 3.12883 20.9524C2.86841 20.8857 2.63047 20.7499 2.44035 20.5598C2.25022 20.3697 2.11451 20.1318 2.04777 19.8713C1.98108 19.611 1.9853 19.3374 2.06047 19.0793L2.89933 16.2073L2.95793 16.0276C3.10743 15.6141 3.34609 15.2379 3.65812 14.926L15.6689 2.91528L15.7812 2.80786C16.354 2.2893 17.1005 2.00025 17.8769 2.00024L18.0321 2.00415C18.8038 2.04253 19.536 2.36635 20.0849 2.91528C20.6704 3.5009 20.9999 4.29516 20.9999 5.12329Z"
                            fill="black"
                          />
                          <path
                            d="M14.2929 4.29295C14.659 3.92683 15.238 3.90424 15.6308 4.22459L15.7069 4.29295L18.7069 7.29295L18.7753 7.36912C19.0956 7.76189 19.073 8.34089 18.7069 8.70701C18.3408 9.07313 17.7618 9.09572 17.369 8.77537L17.2929 8.70701L14.2929 5.70701L14.2245 5.63084C13.9042 5.23806 13.9268 4.65906 14.2929 4.29295Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                      {/* زر الحذف */}
                      <button
                        onClick={() => triggerDeleteConfirmation(doc)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        title="حذف"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 5C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H21Z"
                            fill="black"
                          />
                          <path
                            d="M4 20V6C4 5.44772 4.44772 5 5 5C5.55228 5 6 5.44772 6 6V20C6 20.1748 6.09738 20.4333 6.33203 20.668C6.56669 20.9026 6.82523 21 7 21H17C17.1748 21 17.4333 20.9026 17.668 20.668C17.9026 20.4333 18 20.1748 18 20V6C18 5.44772 18.4477 5 19 5C19.5523 5 20 5.44772 20 6V20C20 20.8252 19.5974 21.5667 19.082 22.082C18.5667 22.5974 17.8252 23 17 23H7C6.17477 23 5.43331 22.5974 4.91797 22.082C4.40262 21.5667 4 20.8252 4 20Z"
                            fill="black"
                          />
                          <path
                            d="M15 6V4C15 3.82523 14.9026 3.56669 14.668 3.33203C14.4333 3.09738 14.1748 3 14 3H10C9.82523 3 9.56669 3.09738 9.33203 3.33203C9.09738 3.56669 9 3.82523 9 4V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V4C7 3.17477 7.40262 2.43331 7.91797 1.91797C8.43331 1.40262 9.17477 1 10 1H14C14.8252 1 15.5667 1.40262 16.082 1.91797C16.5974 2.43331 17 3.17477 17 4V6C17 6.55228 16.5523 7 16 7C15.4477 7 15 6.55228 15 6Z"
                            fill="black"
                          />
                          <path
                            d="M9 17V11C9 10.4477 9.44772 10 10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17Z"
                            fill="black"
                          />
                          <path
                            d="M13 17V11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── مودال الحذف ──────────────────────── */}
        {isDeleteModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "400px",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚠️</div>
              <h3 style={{ margin: "0 0 10px", color: "#2d3748" }}>
                تأكيد حذف الطبيب
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "14px",
                  marginBottom: "25px",
                }}
              >
                هل أنت متأكد من حذف <strong>{doctorToDelete?.name}</strong>؟
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: "#e53e3e",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDoctorToDelete(null);
                  }}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#4a5568",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── مودال التعديل ────────────────────── */}
        {isEditModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "12px",
                width: "460px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
              dir="rtl"
            >
              <h3 style={{ margin: "0 0 20px", color: "#2d3748" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9999 19C21.5522 19 21.9999 19.4477 21.9999 20C21.9999 20.5523 21.5522 21 20.9999 21H11.9999C11.4476 21 10.9999 20.5523 10.9999 20C10.9999 19.4477 11.4476 19 11.9999 19H20.9999Z"
                    fill="black"
                  />
                  <path
                    d="M18.9999 5.12329C18.9999 4.82559 18.8813 4.53989 18.6708 4.32935C18.4867 4.1452 18.2451 4.03169 17.9882 4.0061L17.8769 4.00024C17.6163 4.00025 17.3647 4.09043 17.165 4.25415L17.0829 4.32935L5.07219 16.3401C4.98291 16.4293 4.91118 16.5345 4.86125 16.6497L4.81926 16.7668L4.23527 18.7629L6.23234 18.1809L6.35148 18.1379C6.46652 18.088 6.57186 18.0172 6.66105 17.928L18.6708 5.91724L18.745 5.83423C18.9087 5.63452 18.9998 5.38372 18.9999 5.12329ZM20.9999 5.12329C20.9998 5.89975 20.7101 6.6462 20.1913 7.21899L20.0849 7.3313L8.07512 19.342C7.76279 19.6544 7.38563 19.8929 6.9716 20.0422L6.79289 20.1008L3.92082 20.9387C3.66276 21.014 3.38923 21.0191 3.12883 20.9524C2.86841 20.8857 2.63047 20.7499 2.44035 20.5598C2.25022 20.3697 2.11451 20.1318 2.04777 19.8713C1.98108 19.611 1.9853 19.3374 2.06047 19.0793L2.89933 16.2073L2.95793 16.0276C3.10743 15.6141 3.34609 15.2379 3.65812 14.926L15.6689 2.91528L15.7812 2.80786C16.354 2.2893 17.1005 2.00025 17.8769 2.00024L18.0321 2.00415C18.8038 2.04253 19.536 2.36635 20.0849 2.91528C20.6704 3.5009 20.9999 4.29516 20.9999 5.12329Z"
                    fill="black"
                  />
                  <path
                    d="M14.2929 4.29295C14.659 3.92683 15.238 3.90424 15.6308 4.22459L15.7069 4.29295L18.7069 7.29295L18.7753 7.36912C19.0956 7.76189 19.073 8.34089 18.7069 8.70701C18.3408 9.07313 17.7618 9.09572 17.369 8.77537L17.2929 8.70701L14.2929 5.70701L14.2245 5.63084C13.9042 5.23806 13.9268 4.65906 14.2929 4.29295Z"
                    fill="black"
                  />
                </svg>
                تعديل بيانات الطبيب
              </h3>

              {editErrors.general && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #fed7d7",
                    color: "#c53030",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  ⚠️ {editErrors.general}
                </div>
              )}

              {/* الاسم */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${editErrors.full_name ? "#e53e3e" : "#cbd5e0"}`,
                    boxSizing: "border-box",
                  }}
                />
                {editErrors.full_name && (
                  <p
                    style={{
                      color: "#e53e3e",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {editErrors.full_name}
                  </p>
                )}
              </div>

              {/* التخصص */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  التخصص
                </label>
                <select
                  name="specialty"
                  value={editData.specialty}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${editErrors.specialty ? "#e53e3e" : "#cbd5e0"}`,
                    boxSizing: "border-box",
                  }}
                >
                  <option value="تخصص الأطفال">تخصص الأطفال</option>
                  <option value="تخصص القلب">تخصص القلب</option>
                  <option value="طب أسنان">طب أسنان</option>
                  <option value="طب عام">طب عام</option>
                  <option value="جلدية">جلدية</option>
                  <option value="عظام">عظام</option>
                  <option value="نساء وتوليد">نساء وتوليد</option>
                  <option value="عيون">عيون</option>
                </select>
                {editErrors.specialty && (
                  <p
                    style={{
                      color: "#e53e3e",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {editErrors.specialty}
                  </p>
                )}
              </div>

              {/* الهاتف */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={confirmEdit}
                  disabled={isSaving}
                  style={{
                    backgroundColor: isSaving ? "#90cdf4" : "#3182ce",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaving ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setDoctorToEdit(null);
                  }}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#4a5568",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorsManagement;
