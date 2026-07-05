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
import ClinicDetailsView from "./components/ClinicDetailsView";
import ClinicAppointmentsView from "./components/ClinicAppointmentsView";

// استيراد شاشات استعادة كلمة المرور
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";
import ResetSuccess from "./components/ResetSuccess";

import "./App.css";

function App() {
    const [isModalOpen,      setIsModalOpen]      = useState(false);
    const [currentView,      setCurrentView]      = useState("home");
    const [forgotEmail,      setForgotEmail]      = useState("");
    const [forgotStep,       setForgotStep]       = useState("forgot");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);

    const [doctorsList, setDoctorsList] = useState([]);

    
    const handleAddNewDoctor = (newDoctor) => {
        setDoctorsList(prev => [newDoctor, ...prev]);
        setCurrentView("doctors-management");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
    };

    const openModal  = () => setIsModalOpen(true);
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
                        <Footer onNavigate={(v) => setCurrentView(v)} />
                        <RegisterModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onSelectPatient={() => { closeModal(); setCurrentView("register-patient"); }}
                            onSelectClinic={() =>  { closeModal(); setCurrentView("register-clinic");  }}
                            onSelectPharmacy={() => { closeModal(); setCurrentView("register-pharmacy"); }}
                            onLoginClick={() =>    { closeModal(); setCurrentView("login");            }}
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

            case "profile":
            case "patient-profile":
                return <PatientProfile onNavigate={(v) => setCurrentView(v)} />;

            case "patient-clinics":
                return (
                    <PatientClinicsView
                        onNavigate={(v) => setCurrentView(v)}
                        onSelectClinic={(id) => setSelectedClinicId(id)}
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

            case "clinic-appointments":
                return (
                    <ClinicAppointmentsView
                        onBack={() => setCurrentView("clinic-profile")}
                    />
                );

            case "admin-dashboard":
            case "admin-clinic-requests":
                return <ClinicAdminDashboard onNavigate={(v) => setCurrentView(v)} />;

            case "clinic-profile":
                return <ClinicProfile onNavigate={(v) => setCurrentView(v)} />;

            case "doctors-management":
                return (
                    <DoctorsManagement
                        onNavigate={(v) => setCurrentView(v)}
                        onDelete={(id) => setDoctorsList(prev => prev.filter(d => d.id !== id))}
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

            case "forgot-password":
                if (forgotStep === "forgot") {
                    return (
                        <ForgotPassword
                            onNavigate={(target) => { setForgotStep("forgot"); setCurrentView(target); }}
                            onNextStep={(next, email) => { setForgotEmail(email); setForgotStep(next); }}
                        />
                    );
                }
                if (forgotStep === "verify") {
                    return <VerifyCode email={forgotEmail} onNextStep={(next) => setForgotStep(next)} />;
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
                    <div style={{ textAlign:"center", marginTop:"50px" }}>
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
