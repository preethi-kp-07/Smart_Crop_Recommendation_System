import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendPage } from './pages/RecommendPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CropExplorerPage } from './pages/CropExplorerPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1086054178335-e6a6n3b137d6lq8p8j68r64l48r64l48.apps.googleusercontent.com';

export function MainPortal() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');

  // Strict Protected Routes: If user is not authenticated, render ONLY the Authentication Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'recommend':
        return <RecommendPage setActiveTab={setActiveTab} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'explorer':
        return <CropExplorerPage />;
      case 'history':
        return <HistoryPage setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderActivePage()}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <MainPortal />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
