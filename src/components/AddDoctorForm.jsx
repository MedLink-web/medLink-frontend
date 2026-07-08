import React, { useState } from "react";
import "./AddDoctorForm.css";
import "./ClinicProfile";
const AddDoctor = ({ onNavigate, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "تخصص الأطفال",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/api/clinic/doctors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          specialty: formData.specialty,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // نمرر البيانات للـ parent عشان يحدث القائمة
        if (onSave) onSave(data.data);
        onNavigate && onNavigate("doctors-management");
      } else if (response.status === 422) {
        const backendErrors = {};
        Object.entries(data.errors).forEach(([field, messages]) => {
          const fieldMap = {
            full_name: "name",
            email: "email",
            specialty: "specialty",
            password: "password",
          };
          backendErrors[fieldMap[field] || field] = messages[0];
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: data.message || "حدث خطأ، حاول مرة أخرى" });
      }
    } catch {
      setErrors({ general: "تعذر الاتصال بالسيرفر" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-layout-root" dir="rtl">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="global-app-sidebar">
        <div className="sidebar-header-profile">
          <div className="avatar-box">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 10V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10Z"
                fill="black"
              />
              <path
                d="M14 13C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44771 15 9 14.5523 9 14C9 13.4477 9.44771 13 10 13H14Z"
                fill="black"
              />
              <path
                d="M14 17C14.5523 17 15 17.4477 15 18C15 18.5523 14.5523 19 14 19H10C9.44771 19 9 18.5523 9 18C9 17.4477 9.44771 17 10 17H14Z"
                fill="black"
              />
              <path
                d="M14 7C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H10C9.44771 9 9 8.55228 9 8C9 7.44772 9.44771 7 10 7H14Z"
                fill="black"
              />
              <path
                d="M1 20V11C1 10.2044 1.3163 9.44151 1.87891 8.87891C2.44151 8.3163 3.20435 8 4 8H6C6.55228 8 7 8.44772 7 9C7 9.55229 6.55228 10 6 10H4C3.73478 10 3.48051 10.1054 3.29297 10.293C3.10543 10.4805 3 10.7348 3 11V20C3 20.2652 3.10543 20.5195 3.29297 20.707C3.48051 20.8946 3.73478 21 4 21H20C20.2652 21 20.5195 20.8946 20.707 20.707C20.8946 20.5195 21 20.2652 21 20V14C21 13.7348 20.8946 13.4805 20.707 13.293C20.5195 13.1054 20.2652 13 20 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H20C20.7957 11 21.5585 11.3163 22.1211 11.8789C22.6837 12.4415 23 13.2043 23 14V20C23 20.7957 22.6837 21.5585 22.1211 22.1211C21.5585 22.6837 20.7957 23 20 23H4C3.20435 23 2.44151 22.6837 1.87891 22.1211C1.3163 21.5585 1 20.7957 1 20Z"
                fill="black"
              />
              <path
                d="M17 22V4C17 3.73478 16.8946 3.48051 16.707 3.29297C16.5195 3.10543 16.2652 3 16 3H8C7.73478 3 7.4805 3.10543 7.29297 3.29297C7.10543 3.4805 7 3.73478 7 4V22C7 22.5523 6.55228 23 6 23C5.44772 23 5 22.5523 5 22V4C5 3.20435 5.3163 2.44152 5.87891 1.87891C6.44152 1.3163 7.20435 1 8 1H16C16.7956 1 17.5585 1.3163 18.1211 1.87891C18.6837 2.44151 19 3.20435 19 4V22C19 22.5523 18.5523 23 18 23C17.4477 23 17 22.5523 17 22Z"
                fill="black"
              />
            </svg>
          </div>
          <div>
            <h4>عيادة النور الطبية</h4>
            <p>لوحة إضافة الطبيب</p>
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
          className="sidebar-footer-logout"
          onClick={() => onNavigate("doctors-management")}
        >
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
          إلغاء والعودة
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="dashboard-main-body">
        <div className="top-view-header">
          <div className="breadcrumb-trail">
            <span>لوحة التحكم</span> &gt; <span>إدارة الأطباء</span> &gt;
            <span className="current-path">إضافة طبيب</span>
          </div>
        </div>

        <div className="form-card-container">
          <div className="form-instruction-banner">
            إنشاء حساب جديد للطبيب وإضافته تلقائياً إلى قائمة أطباء العيادة.
          </div>

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

          <form onSubmit={handleSubmit} className="doctor-creation-form">
            {/* الاسم */}
            <div className="form-input-group">
              <label>
                الاسم الكامل للطبيب<span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="أدخل الاسم الرباعي للطبيب"
                value={formData.name}
                onChange={handleChange}
                style={{ borderColor: errors.name ? "#e53e3e" : "" }}
              />
              {errors.name && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div className="form-input-group">
              <label>
                البريد الإلكتروني<span className="required-star">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="khaled.omari@alnour.com"
                value={formData.email}
                onChange={handleChange}
                style={{ borderColor: errors.email ? "#e53e3e" : "" }}
              />
              {errors.email && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* التخصص */}
            <div className="form-input-group">
              <label>
                التخصص الطبي<span className="required-star">*</span>
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="styled-form-select"
                style={{ borderColor: errors.specialty ? "#e53e3e" : "" }}
              >
                <option value="">اختار التخصص</option>
                <option value="تخصص الأطفال">تخصص الأطفال</option>
                <option value="تخصص القلب">تخصص القلب</option>
                <option value="طب أسنان">طب أسنان</option>
                <option value="طب عام">طب عام</option>
                <option value="جلدية">جلدية</option>
                <option value="عظام">عظام</option>
                <option value="نساء وتوليد">نساء وتوليد</option>
                <option value="عيون">عيون</option>
                <option value="أنف وأذن وحنجرة">أنف وأذن وحنجرة</option>
              </select>
              {errors.specialty && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.specialty}
                </p>
              )}
            </div>

            {/* رقم الهاتف */}
            <div className="form-input-group">
              <label>
                رقم الهاتف<span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+966 50 000 0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* كلمة المرور */}
            <div className="form-input-group">
              <label>
                كلمة المرور<span className="required-star">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ borderColor: errors.password ? "#e53e3e" : "" }}
              />
              {errors.password && (
                <p
                  style={{
                    color: "#e53e3e",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* أزرار */}
            <div className="form-action-buttons-row">
              <button
                type="submit"
                className="form-submit-blue-btn"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <span className="plus-icon-symbol">➕</span>
                {isLoading ? "جاري الإضافة..." : "إضافة طبيب"}
              </button>
              <button
                type="button"
                className="form-cancel-gray-btn"
                onClick={() => onNavigate("doctors-management")}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddDoctor;
