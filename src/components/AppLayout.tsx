
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
      <div className="min-h-screen bg-background">
        <Header />
        {children}
      </div>
    );
  }

  // Show custom header when sidebar is visible (i.e., on any /subject/* route)
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SubjectSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4 text-foreground hover:text-muted-foreground border border-border hover:border-foreground nothing-button" />
                {/* Attendance Tracker clickable logo/text to return to home */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 focus:outline-none group"
                  aria-label="Go to Home"
                >
                  <div className="w-8 h-8 bg-foreground text-background border border-border flex items-center justify-center rounded-lg group-hover:bg-muted-foreground transition-all">
                    <span className="text-lg font-bold">📊</span>
                  </div>
                  <h1 className="text-foreground font-mono font-bold text-xl uppercase tracking-wider group-hover:text-muted-foreground transition-colors nothing-text heading">
                    Attendance Tracker
                  </h1>
                </button>
                {/* Extra Home button for clarity, especially on mobile */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="ml-4 p-1 bg-muted border border-border rounded-lg text-foreground hover:bg-foreground hover:text-background transition-colors duration-100 flex items-center group"
                  aria-label="Go to Home"
                  style={{ height: 36, width: 36 }}
                >
                  <Home className="w-5 h-5 mx-auto group-hover:text-background" />
                </button>
              </div>
              
              {/* Sign Out Button with Nothing styling */}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono uppercase tracking-wider border border-border hover:border-foreground px-4 py-2 nothing-button"
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
