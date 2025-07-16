
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  if (!user) return null;

  const getDisplayName = () => {
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-black rounded-xl">
            <span className="text-white text-lg">📊</span>
          </div>
          <h1 className="text-xl font-medium text-black nothing-text heading">
            Attendance Tracker
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gray-100 text-gray-900 text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900 hidden sm:inline nothing-text">
              {getDisplayName()}
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleSignOut}
            className="nothing-button text-sm flex items-center gap-2"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
