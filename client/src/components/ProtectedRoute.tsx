import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

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
            <div className="text-center text-sm text-cyber-cyan">
              <p>This is a restricted MAGI system.</p>
              <p>Authentication required to access meeting recovery protocols.</p>
            </div>
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-cyber-orange text-black hover:bg-orange-600 font-bold py-3"
            >
              <Shield className="w-4 h-4 mr-2" />
              AUTHENTICATE WITH GOOGLE
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