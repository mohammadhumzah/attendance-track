
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SubjectSidebar } from '@/components/SubjectSidebar';
import Header from '@/components/Header';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const AppLayout = ({ children, showSidebar = false }: AppLayoutProps) => {
  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <Header />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SubjectSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center border-b-4 border-slate-700 bg-slate-900 px-4">
              <SidebarTrigger className="mr-4 text-emerald-400 hover:text-emerald-300 border-2 border-emerald-600 hover:border-emerald-500 pixel-button" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center pixel-icon">
                  <span className="text-slate-900 text-lg font-bold">📊</span>
                </div>
                <h1 className="text-emerald-400 font-mono font-bold text-xl uppercase tracking-wider">
                  Attendance Tracker
                </h1>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
