import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AIAssistantModal } from '../common/AIAssistantModal';

export const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-app text-theme-primary transition-colors relative overflow-hidden">
      {/* Immersive ambient glowing aura in background */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar onOpenAIAssistant={() => setIsAIAssistantOpen(true)} />
        </div>

        {/* Mobile Slide-over Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[80vw] h-full bg-surface shadow-2xl animate-in slide-in-from-left">
              <Sidebar
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                onOpenAIAssistant={() => {
                  setIsMobileSidebarOpen(false);
                  setIsAIAssistantOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};
