import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, UserPlus, LogIn, Linkedin } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit - signup attempt for:', email);
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Calling signUp function...');
      const { error } = await signUp(email, password);

      if (error) {
        console.error('Signup error received:', error);
        
        let errorMessage = "An error occurred during sign up";
        
        if (error.message) {
          if (error.message.includes('User already registered')) {
            errorMessage = "This email is already registered. Please try signing in instead.";
          } else if (error.message.includes('Invalid email')) {
            errorMessage = "Please enter a valid email address.";
          } else if (error.message.includes('Password')) {
            errorMessage = "Password must be at least 6 characters long.";
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "Account created!",
          description: "Please check your email for a confirmation link.",
        });
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Signup catch error:', err);
      toast({
        title: "Connection error",
        description: "Unable to connect to authentication service. Please check your internet connection.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit - signin attempt for:', email);
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Calling signIn function...');
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Signin error received:', error);
        
        let errorMessage = "An error occurred during sign in";
        
        if (error.message) {
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = "Please check your email and click the confirmation link before signing in.";
          } else if (error.message.includes('Too many requests')) {
            errorMessage = "Too many sign in attempts. Please wait a moment and try again.";
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Signin successful');
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      }
    } catch (err) {
      console.error('Signin catch error:', err);
      toast({
        title: "Connection error",
        description: "Unable to connect to authentication service. Please check your internet connection.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md nothing-card nothing-glow">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground rounded-xl mb-6">
              <span className="text-background text-xl">📊</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2 nothing-text heading">
              Attendance Tracker
            </h1>
            <p className="text-muted-foreground text-sm nothing-text">
              Simple. Clean. Effective.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-lg">
              <TabsTrigger 
                value="signin" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 nothing-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 nothing-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full nothing-button primary"
                  disabled={loading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <a
                      href="https://www.linkedin.com/in/mohammadhumzah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm nothing-text"
                    >
                      <Linkedin className="w-4 h-4" />
                      Contact me
                    </a>
                  </div>
                  <p className="text-muted-foreground text-xs nothing-text">
                    Built by Mohammad Humzah
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 nothing-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (min 6 characters)"
                      className="pl-10 nothing-input"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full nothing-button primary"
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center">
                  <a
                    href="https://www.linkedin.com/in/mohammadhumzah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm nothing-text"
                  >
                    <Linkedin className="w-4 h-4" />
                    Contact me
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
