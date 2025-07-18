import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CreditDisplay() {
  const { user } = useAuth();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["/api/user"],
    enabled: !!user,
  });

  const handleBuyCredits = () => {
    window.open("https://payhip.com/b/dAc53", "_blank");
  };

  if (isLoading || !userInfo?.user) {
    return (
      <Badge variant="outline" className="text-cyan-400 border-cyan-400/20">
        Loading...
      </Badge>
    );
  }

  const credits = userInfo.user.credits;
  const isLowCredits = credits <= 2;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isLowCredits ? "destructive" : "outline"}
        className={`pulse-glow ${isLowCredits ? 
          "text-red-400 border-red-400/20 bg-red-400/10" : 
          "text-cyan-400 border-cyan-400/20"
        }`}
      >
        {credits} Credits
      </Badge>
      <Button
        size="sm"
        variant="outline"
        onClick={handleBuyCredits}
        className={`text-xs micro-hover scale-click button-glow cyber-ripple ${isLowCredits ? 
          "text-orange-400 border-orange-400/20 hover:bg-orange-400/10" :
          "text-cyan-400 border-cyan-400/20 hover:bg-cyan-400/10"
        }`}
      >
        {isLowCredits ? "Buy More" : "Add Credits"}
        <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
}