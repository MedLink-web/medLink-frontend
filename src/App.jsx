import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Stats from "./components/Stats";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import PatientRegisterForm from "./components/PatientRegisterForm";
import PatientDashboard from "./components/PatientDashboard";
import PatientProfile from "./components/PatientProfile";
import PatientLogin from "./components/PatientLogin";
import ClinicProfile from "./components/ClinicProfile";
import PharmacyRegisterForm from "./components/PharmacyRegisterForm";
import ClinicRegisterForm from "./components/ClinicRegister";
import ClinicAdminDashboard from "./components/ClinicAdminDashboard";
import DoctorsManagement from "./components/DoctorsManagement";
import AddDoctorForm from "./components/AddDoctorForm";
import PatientClinicsView from "./components/PatientClinicsView";
import ClinicAppointmentsView from "./components/ClinicAppointmentsView";

// استيراد شاشات استعادة كلمة المرور
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";
import ResetSuccess from "./components/ResetSuccess";

import ClinicDetailsView from "./components/ClinicDetailsView";
import ClinicAppointmentsView from "./components/ClinicAppointmentsView";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("patient-profile"); // الشاشة الافتراضية عند التشغيل
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState("forgot");

  // حالة (State) مشتركة لإدارة بانر النجاح الأخضر
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState(null);

  // قائمة الأطباء
  const [doctorsList, setDoctorsList] = useState([
    {
      id: 1,
      name: "د. خالد العمري",
      specialty: "طب أسنان",
      email: "khaled.omari@alnour.com",
      phone: "+966 50 111 2233",
      patients: 148,
      rating: 4.9,
      status: "نشط",
    },
    {
      id: 2,
      name: "د. سارة الأحمد",
      specialty: "تقويم الأسنان",
      email: "sara.ahmed@alnour.com",
      phone: "+966 50 222 3344",
      patients: 95,
      rating: 4.8,
      status: "نشط",
    },
    {
      id: 3,
      name: "د. محمد القحطاني",
      specialty: "جراحة الفم والوجه",
      email: "m.qahtani@alnour.com",
      phone: "+966 50 333 4455",
      patients: 210,
      rating: 5.0,
      status: "نشط",
    },
    {
      id: 4,
      name: "د. ريم الدوسري",
      specialty: "طب أسنان الأطفال",
      email: "reem.d@alnour.com",
      phone: "+966 50 444 5566",
      patients: 64,
      rating: 4.7,
      status: "غير نشط",
    },
    {
      id: 5,
      name: "د. فيصل السديري",
      specialty: "تركيبات وتجميل الأسنان",
      email: "faisal.s@alnour.com",
      phone: "+966 50 555 6677",
      patients: 117,
      rating: 4.9,
      status: "نشط",
    },
  ]);

  const handleAddNewDoctor = (newDoctor) => {
    // نضيف الطبيب الجديد للقائمة مباشرة
    setDoctorsList((prev) => [newDoctor, ...prev]);
    setCurrentView("doctors-management");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleDeleteDoctor = (id) => {
    setDoctorsList(doctorsList.filter((doc) => doc.id !== id));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <Navbar onRegisterClick={openModal} />
            <Hero onRegisterClick={openModal} />
            <Services />
            <Stats />
            <About />
            <HowItWorks />
            <Footer onNavigate={(targetView) => setCurrentView(targetView)} />
            <RegisterModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSelectPatient={() => {
                closeModal();
                setCurrentView("register-patient");
              }}
              onSelectClinic={() => {
                closeModal();
                setCurrentView("register-clinic");
              }}
              onSelectPharmacy={() => {
                closeModal();
                setCurrentView("register-pharmacy");
              }}
              onLoginClick={() => {
                closeModal();
                setCurrentView("login");
              }}
            />
          </>
        );

      case "register-clinic":
        return <ClinicRegisterForm onNavigate={(v) => setCurrentView(v)} />;

      case "register-pharmacy":
        return <PharmacyRegisterForm onNavigate={(v) => setCurrentView(v)} />;

      case "register-patient":
        return (
          <PatientRegisterForm
            onNavigate={(v) => setCurrentView(v)}
            onBackToHome={() => setCurrentView("home")}
            onRegisterSuccess={() => setCurrentView("dashboard")}
          />
        );

      case "dashboard":
        return (
          <PatientDashboard
            onLogout={() => setCurrentView("home")}
            onNavigate={(v) => setCurrentView(v)}
          />
        );

      case "patient-profile":
        return (
          <PatientProfile
            onNavigate={(targetView) => setCurrentView(targetView)}
          />
        );
      case "patient-clinics":
        return (
          <PatientClinicsView
            onNavigate={(v) => setCurrentView(v)}
            onSelectClinic={(id) => setSelectedClinicId(id)}
          />
        );
      case "admin-dashboard":
      case "admin-clinic-requests":
        return (
          <ClinicAdminDashboard
            onNavigate={(targetView) => setCurrentView(targetView)}
          />
        );

      case "clinic-profile":
        return (
          <ClinicProfile
            onNavigate={(targetView) => setCurrentView(targetView)}
          />
        );
      case "clinic-appointments":
        return (
          <ClinicAppointmentsView
            onBack={() => setCurrentView("clinic-profile")}
          />
        );

      case "doctors-management":
        return (
          <DoctorsManagement
            onNavigate={(v) => setCurrentView(v)}
            onDelete={(id) =>
              setDoctorsList((prev) => prev.filter((d) => d.id !== id))
            }
            showToast={showSuccessToast}
          />
        );

      case "add-doctor":
        return (
          <AddDoctorForm
            onNavigate={(v) => setCurrentView(v)}
            onSave={handleAddNewDoctor}
          />
        );

      case "login":
        return (
          <PatientLogin
            onNavigate={(targetView) => {
              if (targetView === "forgot-password") setForgotStep("forgot");
              setCurrentView(targetView);
            }}
            onLoginSuccess={(user) => {
              if (user.role === "admin") {
                setCurrentView("admin-clinic-requests");
              } else if (user.role === "clinic") {
                setCurrentView("clinic-profile");
              } else {
                setCurrentView("dashboard");
              }
            }}
          />
        );

      case "clinic-appointments":
        return (
          <ClinicAppointmentsView
            onBack={() => setCurrentView("clinic-details")} // للعودة عند الضغط على زر الرجوع
          />
        );
      case "clinic-details":
        return (
          <ClinicDetailsView
            clinicId={selectedClinicId}
            onBack={() => setCurrentView("patient-clinics")}
            onNavigate={(v) => setCurrentView(v)}
          />
        );
      case "forgot-password":
        if (forgotStep === "forgot") {
          return (
            <ForgotPassword
              onNavigate={(target) => {
                setForgotStep("forgot");
                setCurrentView(target);
              }}
              onNextStep={(next, email) => {
                setForgotEmail(email);
                setForgotStep(next);
              }}
            />
          );
        }
        if (forgotStep === "verify") {
          return (
            <VerifyCode
              email={forgotEmail}
              onNextStep={(next) => setForgotStep(next)}
            />
          );
        }
        if (forgotStep === "reset") {
          return <ResetPassword onNextStep={(next) => setForgotStep(next)} />;
        }
        if (forgotStep === "success") {
          return (
            <ResetSuccess
              onNavigate={(view) => {
                setForgotStep("forgot");
                setTimeout(() => setCurrentView(view), 0);
              }}
            />
          );
        }
        break;

      default:
        return (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            الصفحة غير موجودة
          </div>
        );
    }
  };

  return (
    <div className="app-container" dir="rtl">
      {renderView()}
    </div>
  );
}

export default App;
