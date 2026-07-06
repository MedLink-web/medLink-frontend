import React, { useState } from "react";
import LandingPageView from "./components/LandingPageView";
import RoleSelectionView from "./components/RoleSelectionView";
import RegisterView from "./components/RegisterView";
import SuccessView from "./components/SuccessView";
import UserLogin from "./components/UserLogin";
import ClinicProfile from "./components/ClinicProfile"; // 🌟 استيراد شاشة ملف العيادة الجديدة
import DoctorsManagement from "./components/DoctorsManagement";
import ClinicAppointments from "./components/ClinicAppointments";
import ClinicRegister from "./components/ClinicRegister"; // استيراد شاشة تقديم طلب العيادة الجديدة
import PatientsManagement from "./components/PatientsManagement";
import PatientDashboard from "./components/PatientDashboard";
import ClinicBooking from "./components/ClinicBooking"; // 🌟 استيراد شاشة حجز المواعيد الجديدة
import ClinicsList from "./components/ClinicsList";
import ClinicDetailsView from "./components/ClinicDetailsView";
import PatientAppointments from "./components/PatientAppointments";
import PatientPrescriptions from "./components/PatientPrescriptions";
import PatientProfile from "./components/PatientProfile"; // 🌟 استيراد شاشة الملف الشخصي للمريض الجديدة
import PharmacyRegister from "./components/PharmacyRegister"; // 🌟 استيراد شاشة تسجيل طلب الصيدلية الجديدة
import PharmacyDashboard from "./components/PharmacyDashboard"; // 1. استيراد لوحة تحكم الصيدلية الجديدة
import DoctorDashboard from "./components/DoctorDashboard"; // 1. استيراد المكون الجديد من مساره
import AdminDashboard from "./components/AdminDashboard";

import PatientPharmaciesView from "./components/PatientPharmaciesView";

const App = () => {
  // الحفاظ على الحالة المسؤولة عن إدارة التنقل
  const [currentScreen, setCurrentScreen] = useState("patient-dashboard"); // 🌟 تعيين شاشة ملف العيادة كالشاشة الافتراضية عند بدء التطبيق
  
  // 🛠️ إضافة State مخصص لحفظ معرف الوصفة الممرر من شاشة الطبيب
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

  // دالة التعامل مع التنقل (تحديثها لتستقبل بيانات إضافية data)
  const handleNavigate = (screenName, data = null) => {
    console.log(`الانتقال إلى الشاشة: ${screenName}`);
    setCurrentScreen(screenName);

    // 🛠️ إذا وُجد معرّف وصفة طبية ممرر، نقوم بحفظه، وإلا نقوم بتصفيره
    if (data && data.selectedPrescriptionId) {
      setSelectedPrescriptionId(data.selectedPrescriptionId);
    } else {
      setSelectedPrescriptionId(null);
    }
  };

  // 🌟 تحديث الدالة لتوجه العيادة تلقائياً إلى صفحتها بعد نجاح تسجيل الدخول
  const handleLoginSuccess = (userData) => {
    console.log("تم تسجيل الدخول بنجاح، بيانات المستخدم:", userData);

    // 🌟 التوجيه الصحيح والآمن لكل دور (Role) بعد تسجيل الدخول الناجح
    if (userData?.role === "admin") {
      handleNavigate("admin-dashboard");
    } else if (userData?.role === "clinic") {
      handleNavigate("clinic-profile");
    } else if (userData?.role === "doctor") {
      // توجيه الطبيب إلى لوحة التحكم الخاصة به داخل العيادة
      handleNavigate("doctor-dashboard");
    } else if (userData?.role === "pharmacy") {
      // توجيه الصيدلية إلى لوحة تحكم الصيدلية لإدارة وصرف الأدوية
      handleNavigate("pharmacy-dashboard");
    } else if (userData?.role === "patient") {
      handleNavigate("prescriptions");
    }
  };

  // عرض الشاشة المناسبة بناءً على قيمة الـ state الحالي
  const renderScreen = () => {
    switch (currentScreen) {

      case "landing":
        return <LandingPageView onNavigate={handleNavigate} />;

      case "role-selection":
        return <RoleSelectionView onNavigate={handleNavigate} />;

      case "register-patient":
        return <RegisterView role="patient" onNavigate={handleNavigate} />;
      case "success-patient":
        return <SuccessView role="patient" onNavigate={handleNavigate} />;

      case "register-clinic":
        return <RegisterView role="clinic" onNavigate={handleNavigate} />;

      // 🌟 المسار المخصص لشاشة "تسجيل طلب عيادة" الجديدة المأخوذة من Figma
      case "clinic-register":
        return (
          <ClinicRegister
            onRegistrationSuccess={() => handleNavigate("success-clinic")}
          />
        );

      case "success-clinic":
        // 🌟 عند الضغط على زر "الدخول" بصفحة نجاح العيادة، يتم توجيهها لملف العيادة
        return (
          <SuccessView
            role="clinic"
            onNavigate={() => handleNavigate("clinic-profile")}
          />
        );

      case "register-pharmacy":
        return <RegisterView role="pharmacy" onNavigate={handleNavigate} />;
      case "success-pharmacy":
        return <SuccessView role="pharmacy" onNavigate={handleNavigate} />;

      case "login":
        return (
          <UserLogin
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      // 🌟 إضافة حالة عرض شاشة ملف العيادة الجديدة وتمرير دالة التنقل لها
      case "clinic-profile":
        return <ClinicProfile onNavigate={handleNavigate} />;
      case "doctors-management":
        return <DoctorsManagement onNavigate={handleNavigate} />;

      case "clinic-appointments":
        return <ClinicAppointments onNavigate={handleNavigate} />;

      case "patients-management":
        return <PatientsManagement onNavigate={handleNavigate} />;

      case "patient-dashboard":
        return <PatientDashboard onNavigate={handleNavigate} />;
      // لتظهر أولاً عند الضغط من الهيدر
      case "clinics-list":
        return <ClinicsList onNavigate={handleNavigate} />;

      // لتظهر ثانياً عند اختيار كرت عيادة
      case "clinic-details":
        return <ClinicDetailsView onNavigate={handleNavigate} />;
      // 🟦 الشاشة الجديدة المتفاعلة لحجز المواعيد 🟦
      case "clinic-booking":
        return <ClinicBooking onNavigate={handleNavigate} />;

      case "appointments":
        return <PatientAppointments onNavigate={handleNavigate} />;

      // 🛠️ تمرير الـ selectedPrescriptionId المستلم إلى شاشة الوصفات بنجاح
      case "prescriptions":
        return (
          <PatientPrescriptions 
            onNavigate={handleNavigate} 
            selectedPrescriptionId={selectedPrescriptionId} 
          />
        );

      case "profile":
        return <PatientProfile onNavigate={handleNavigate} />;

      case "pharmacy-register":
        return <PharmacyRegister onNavigate={handleNavigate} />;

      case "pharmacy-dashboard":
        // 2. عرض لوحة التحكم الكاملة التي تحتوي على (مخزن الأدوية والملف الشخصي)
        return <PharmacyDashboard onNavigate={handleNavigate} />;

      case "doctor-dashboard":
        return <DoctorDashboard onNavigate={handleNavigate} />;

      case "admin-dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;

      case "patient-pharmacies":
        return <PatientPharmaciesView onNavigate={handleNavigate} />;

      default:
        return <LandingPageView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-container">
      {/* استدعاء دالة العرض الشاملة لتعرض الشاشة الحالية ديناميكياً وبشكل سليم */}
      {renderScreen()}
    </div>
  );
};

export default App;