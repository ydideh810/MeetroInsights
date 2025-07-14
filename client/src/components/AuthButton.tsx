import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, logOut } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User, CreditCard, Settings, ExternalLink } from "lucide-react";

export default function AuthButton() {
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to MEETRO",
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
          <Button className="bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors">
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
          <DropdownMenuItem
            onClick={() => window.open('https://niddamhub.lemonsqueezy.com/buy/be00a64f-fe92-44a6-a654-d6187a4e864a', '_blank')}
            className="text-cyber-cyan hover:bg-cyber-orange hover:text-black cursor-pointer"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Refill Credits
            <ExternalLink className="w-3 h-3 ml-auto" />
          </DropdownMenuItem>
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
      className="bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors"
    >
      <LogIn className="w-4 h-4 mr-2" />
      {isSigningIn ? "SIGNING IN..." : "SIGN IN"}
    </Button>
  );
}