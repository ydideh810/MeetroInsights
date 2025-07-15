import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redeemLicenseKeySchema, type RedeemLicenseKeyRequest } from "@shared/schema";
import { Key, Gift } from "lucide-react";

interface LicenseKeyRedemptionProps {
  onSuccess?: () => void;
}

export default function LicenseKeyRedemption({ onSuccess }: LicenseKeyRedemptionProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RedeemLicenseKeyRequest>({
    resolver: zodResolver(redeemLicenseKeySchema),
  });

  const redeemMutation = useMutation({
    mutationFn: async (data: RedeemLicenseKeyRequest) => {
      const response = await apiRequest("/api/redeem-license-key", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "License Key Redeemed!",
        description: `${data.message} You received ${data.credits} credits.`,
      });
      
      // Invalidate user query to refresh credits
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      setOpen(false);
      reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("License key redemption error:", error);
      toast({
        title: "Redemption Failed",
        description: error.error || error.message || "Failed to redeem license key. Please check your key and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RedeemLicenseKeyRequest) => {
    redeemMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors">
          <Gift className="w-4 h-4 mr-2" />
          Redeem License Key
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cyber-dark-panel border-cyber-orange text-cyber-cyan">
        <DialogHeader>
          <DialogTitle className="text-cyber-orange font-tourney">
            <Key className="w-5 h-5 inline mr-2" />
            Redeem License Key
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key" className="text-cyber-cyan font-tourney">
              License Key
            </Label>
            <Input
              id="key"
              placeholder="213473B2-CB4E-484F-914D-376C0510445B"
              className="bg-cyber-bg border-cyber-border text-cyber-cyan placeholder:text-cyber-cyan/50 focus:border-cyber-orange font-tourney"
              {...register("key")}
            />
            {errors.key && (
              <p className="text-red-400 text-sm font-tourney">{errors.key.message}</p>
            )}
          </div>

          <div className="text-xs text-cyber-cyan/70 font-tourney">
            • Each license key provides 10 additional credits
            • Keys can only be redeemed once
            • Keys are case-insensitive
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-cyber-border text-cyber-cyan hover:bg-cyber-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={redeemMutation.isPending}
              className="flex-1 bg-cyber-orange text-black hover:bg-cyber-orange/90"
            >
              {redeemMutation.isPending ? "Redeeming..." : "Redeem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}