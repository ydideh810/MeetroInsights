import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Database, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to MEETRO",
        description: "Authentication successful",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(formData.email, formData.password);
      toast({
        title: "Welcome back",
        description: "Successfully signed in",
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName);
      toast({
        title: "Account created",
        description: "Welcome to MEETRO! Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(formData.email);
      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-cyber-orange mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-cyber-orange mb-2">MEETRO INITIALIZING</h2>
          <p className="text-cyber-cyan">Authenticating user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cyber-dark-panel border-2 border-cyber-orange">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-cyber-orange" />
            </div>
            <CardTitle className="text-3xl font-bold text-cyber-orange cyber-glow">
              MEETRO ACCESS
            </CardTitle>
            <CardDescription className="text-cyber-cyan">
              NERV SECURITY CLEARANCE REQUIRED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-cyber-cyan mb-4">
              <p>This is a restricted SHINRAI system.</p>
              <p>Authentication required to access meeting recovery protocols.</p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cyber-panel">
                <TabsTrigger value="signin" className="text-cyber-cyan data-[state=active]:bg-cyber-orange data-[state=active]:text-black">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-cyber-cyan data-[state=active]:bg-cyber-orange data-[state=active]:text-black">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cyber-cyan">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-cyber-cyan">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-cyber-cyan hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-cyber-orange text-black hover:bg-orange-600 font-bold"
                  >
                    {isLoading ? "Authenticating..." : "Sign In"}
                  </Button>
                </form>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePasswordReset}
                  className="w-full text-cyber-cyan hover:bg-cyber-orange hover:text-black"
                  disabled={isLoading}
                >
                  Forgot Password?
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-cyber-cyan">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="pl-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-cyber-cyan">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="email-signup"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-cyber-cyan">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="password-signup"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-cyber-cyan hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-cyber-cyan">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyber-cyan" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 bg-cyber-panel border-cyber-orange text-cyber-cyan"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-cyber-orange text-black hover:bg-orange-600 font-bold"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-cyber-orange" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cyber-dark-panel px-2 text-cyber-cyan">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black font-bold py-3"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? "Authenticating..." : "Google"}
            </Button>

            <div className="text-xs text-cyber-cyan opacity-75 text-center">
              <p>CLASSIFIED • TOKYO-3 • NERV</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}