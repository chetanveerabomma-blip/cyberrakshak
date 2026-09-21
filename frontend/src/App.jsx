import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CyberBackground from './components/CyberBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistantDrawer from './components/AiAssistantDrawer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import CaseListPage from './pages/CaseListPage';
import CaseDetailPage from './pages/CaseDetailPage';
import UrlScannerPage from './pages/UrlScannerPage';
import TrackCasePage from './pages/TrackCasePage';
import AwarenessPage from './pages/AwarenessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function MainApp() {
  const { user, isStaff } = useAuth();
  const [activeTab, setActiveTab] = useState(user ? 'dashboard' : 'landing');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'register':
        return <RegisterPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return user ? <DashboardPage setActiveTab={setActiveTab} setSelectedCaseId={setSelectedCaseId} /> : <LoginPage setActiveTab={setActiveTab} />;
      case 'report':
        return user ? <ReportIncidentPage setActiveTab={setActiveTab} setSelectedCaseId={setSelectedCaseId} /> : <LoginPage setActiveTab={setActiveTab} />;
      case 'cases':
        return user ? <CaseListPage setActiveTab={setActiveTab} setSelectedCaseId={setSelectedCaseId} /> : <LoginPage setActiveTab={setActiveTab} />;
      case 'case-detail':
        return <CaseDetailPage caseId={selectedCaseId} setActiveTab={setActiveTab} />;
      case 'url-scanner':
        return <UrlScannerPage />;
      case 'track-case':
        return <TrackCasePage setSelectedCaseId={setSelectedCaseId} setActiveTab={setActiveTab} />;
      case 'awareness':
        return <AwarenessPage />;
      case 'admin':
        return isStaff ? <AdminDashboardPage setSelectedCaseId={setSelectedCaseId} setActiveTab={setActiveTab} /> : <LandingPage setActiveTab={setActiveTab} />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#070B14]">
      <CyberBackground />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
      <AiAssistantDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
