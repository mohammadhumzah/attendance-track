
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { trackUserSignup } from '@/utils/supabaseUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Track signup when a new user is created
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if this is a new user by looking at created_at timestamp
          const userCreatedAt = new Date(session.user.created_at);
          const now = new Date();
          const timeDiff = now.getTime() - userCreatedAt.getTime();
          const isNewUser = timeDiff < 60000; // Less than 1 minute ago
          
          if (isNewUser) {
            // Email signup method since Google is removed
            setTimeout(() => {
              trackUserSignup('email');
            }, 0);
          }
        }
      }
    );

    // Get initial session
    console.log('Getting initial session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session result:', { session, error });
      if (error) {
        console.error('Error getting initial session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Error in getSession:', err);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('Starting signup process for:', email);
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      console.log('Sign up result:', { data, error });
      setLoading(false);
      return { error };
    } catch (err) {
      console.error('Sign up catch error:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Starting signin process for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in result:', { data, error });
      setLoading(false);
      return { error };
    } catch (err) {
      console.error('Sign in catch error:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Starting signout...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Signed out successfully');
      }
    } catch (err) {
      console.error('Sign out catch error:', err);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
