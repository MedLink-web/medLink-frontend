import React, { useState } from "react";
import LandingPageView from "./components/LandingPageView";
import RoleSelectionView from "./components/RoleSelectionView";
import RegisterView from "./components/RegisterView";
import SuccessView from "./components/SuccessView";
import UserLogin from "./components/UserLogin";
import ClinicProfile from "./components/ClinicProfile";
import DoctorsManagement from "./components/DoctorsManagement";
import ClinicAppointments from "./components/ClinicAppointments";
import ClinicRegister from "./components/ClinicRegister";
import PatientsManagement from "./components/PatientsManagement";
import PatientDashboard from "./components/PatientDashboard";
import ClinicBooking from "./components/ClinicBooking";
import ClinicsList from "./components/ClinicsList";
import ClinicDetailsView from "./components/ClinicDetailsView";
import PatientAppointments from "./components/PatientAppointments";
import PatientPrescriptions from "./components/PatientPrescriptions";
import PatientProfile from "./components/PatientProfile";
import PharmacyRegister from "./components/PharmacyRegister";
import PharmacyDashboard from "./components/PharmacyDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PatientPharmaciesView from "./components/PatientPharmaciesView";
import AddDoctor from "./components/AddDoctorForm";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState(null);

  const handleNavigate = (screenName, data = null) => {
    console.log(`الانتقال إلى الشاشة: ${screenName}`);
    setCurrentScreen(screenName);

    if (data && data.selectedPrescriptionId) {
      setSelectedPrescriptionId(data.selectedPrescriptionId);
    } else {
      setSelectedPrescriptionId(null);
    }

    if (data && data.clinicId) {
      setSelectedClinicId(data.clinicId);
    }
  };

  const handleLoginSuccess = (userData) => {
    console.log("تم تسجيل الدخول بنجاح، بيانات المستخدم:", userData);

    if (userData?.role === "admin") {
      handleNavigate("admin-dashboard");
    } else if (userData?.role === "clinic") {
      handleNavigate("clinic-profile");
    } else if (userData?.role === "doctor") {
      handleNavigate("doctor-dashboard");
    } else if (userData?.role === "pharmacy") {
      handleNavigate("pharmacy-dashboard");
    } else if (userData?.role === "patient") {
      handleNavigate("patient-dashboard");
    }
  };

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
        return <ClinicRegister onNavigate={handleNavigate} />;

      case "clinic-register":
        return (
          <ClinicRegister
            onRegistrationSuccess={() => handleNavigate("success-clinic")}
          />
        );

      case "success-clinic":
        return (
          <SuccessView
            role="clinic"
            onNavigate={() => handleNavigate("clinic-profile")}
          />
        );

      case "register-pharmacy":
        return <PharmacyRegister onNavigate={handleNavigate} />;
      case "success-pharmacy":
        return <SuccessView role="pharmacy" onNavigate={handleNavigate} />;

      case "login":
        return (
          <UserLogin
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case "clinic-profile":
        return <ClinicProfile onNavigate={handleNavigate} />;
      case "doctors-management":
        return <DoctorsManagement onNavigate={handleNavigate} />;

      case "add-doctor":
        return <AddDoctor onNavigate={handleNavigate} />;

      case "clinic-appointments":
        return (
          <ClinicAppointments
            onNavigate={handleNavigate}
            onBack={() => handleNavigate("clinic-profile")}
          />
        );

      case "patients-management":
        return <PatientsManagement onNavigate={handleNavigate} />;

      case "patient-dashboard":
        return <PatientDashboard onNavigate={handleNavigate} />;

      case "clinics-list":
        return <ClinicsList onNavigate={handleNavigate} />;

      case "clinic-details":
        return (
          <ClinicDetailsView
            onNavigate={handleNavigate}
            clinicId={selectedClinicId}
            onBack={() => handleNavigate("clinics-list")}
          />
        );

      case "clinic-booking":
        return (
          <ClinicBooking
            onNavigate={handleNavigate}
            clinicId={selectedClinicId}
          />
        );

      case "appointments":
        return <PatientAppointments onNavigate={handleNavigate} />;

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

  return <div className="app-container">{renderScreen()}</div>;
};

export default App;
