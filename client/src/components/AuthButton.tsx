import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, logOut } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User, CreditCard, Settings, ExternalLink, Gift, Copy, Download, FileText } from "lucide-react";
import LicenseKeyRedemption from "./LicenseKeyRedemption";
import ExportButton from "./ExportButton";
import { MeetingAnalysis } from "@shared/schema";

interface AuthButtonProps {
  analysis?: MeetingAnalysis | null;
}

export default function AuthButton({ analysis }: AuthButtonProps) {
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to NEURAKEI",
        description: "Authentication successful",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Button disabled className="bg-cyber-panel border-cyber-orange text-cyber-cyan">
        <User className="w-4 h-4 mr-2" />
        LOADING...
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors micro-hover scale-click button-glow">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
              <AvatarFallback className="bg-cyber-orange text-black text-xs">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {user.displayName || user.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-cyber-dark-panel border-cyber-orange w-56">
          {/* Export Options */}
          {analysis && (
            <>
              <div className="px-2 py-1 text-xs text-cyber-cyan font-mono border-b border-cyber-border">
                EXPORT OPTIONS
              </div>
              <div className="p-2 space-y-1">
                <ExportButton type="copy" analysis={analysis} variant="menu" />
                <ExportButton type="download" analysis={analysis} variant="menu" />
                <ExportButton type="notion" analysis={analysis} variant="menu" />
              </div>
              <DropdownMenuSeparator className="bg-cyber-border" />
            </>
          )}
          
          <DropdownMenuItem
            onClick={() => window.open('https://payhip.com/b/dAc53', '_blank')}
            className="text-cyber-cyan hover:bg-cyber-orange hover:text-black cursor-pointer"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Refill Credits
            <ExternalLink className="w-3 h-3 ml-auto" />
          </DropdownMenuItem>
          <div className="px-2 py-1">
            <LicenseKeyRedemption />
          </div>
          <DropdownMenuItem
            disabled
            className="text-cyber-cyan opacity-50 cursor-not-allowed"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
            <span className="ml-auto text-xs">Soon</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-cyber-border" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-cyber-cyan hover:bg-cyber-orange hover:text-black cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors micro-hover scale-click button-glow cyber-ripple"
    >
      <LogIn className="w-4 h-4 mr-2" />
      {isSigningIn ? "SIGNING IN..." : "SIGN IN"}
    </Button>
  );
}