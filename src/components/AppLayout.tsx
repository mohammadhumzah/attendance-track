
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SubjectSidebar } from '@/components/SubjectSidebar';
import Header from '@/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const AppLayout = ({ children, showSidebar = false }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <Header />
        {children}
      </div>
    );
  }

  // Show custom header when sidebar is visible (i.e., on any /subject/* route)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SubjectSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between border-b-4 border-slate-700 bg-slate-900 px-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4 text-emerald-400 hover:text-emerald-300 border-2 border-emerald-600 hover:border-emerald-500 pixel-button" />
                {/* Attendance Tracker clickable logo/text to return to home */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 focus:outline-none group"
                  aria-label="Go to Home"
                >
                  <div className="w-8 h-8 bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center pixel-icon group-hover:bg-emerald-300 transition-all">
                    <span className="text-slate-900 text-lg font-bold">📊</span>
                  </div>
                  <h1 className="text-emerald-400 font-mono font-bold text-xl uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                    Attendance Tracker
                  </h1>
                </button>
                {/* Extra Home button for clarity, especially on mobile */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="ml-4 p-1 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 transition-colors duration-100 flex items-center group"
                  aria-label="Go to Home"
                  style={{ height: 36, width: 36 }}
                >
                  <Home className="w-5 h-5 mx-auto group-hover:text-slate-900" />
                </button>
              </div>
              
              {/* Sign Out Button with GitHub/LinkedIn styling */}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-mono uppercase tracking-wider border-2 border-slate-600 hover:border-emerald-600 px-4 py-2 pixel-button"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
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
