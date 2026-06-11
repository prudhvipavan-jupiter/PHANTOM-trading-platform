import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FuturisticBackground from './common/FuturisticBackground';
import IRIS from './IRIS/IRIS';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from './common/LoadingState';
import PlatformModeBanner from './PlatformModeBanner';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-black">
      <FuturisticBackground />
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative fixed inset-y-0 left-0 z-30`}>
        <Sidebar onLogout={logout} />
      </div>

      {/* Main Content */}
      <main className="w-full h-full relative z-10 flex-grow flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <PlatformModeBanner />

        <div className="flex-grow overflow-y-auto p-6">
          <Suspense fallback={<LoadingState type="neural" text="Loading P.H.A.N.T.O.M..." />}>
            <Outlet />
          </Suspense>
        </div>

        <IRIS />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Layout; 