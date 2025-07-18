import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cyber-bg">
      <Card className="w-full max-w-md mx-4 bg-cyber-panel border-cyber-orange">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-cyber-orange" />
            <h1 className="text-2xl font-bold text-cyber-orange">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-cyber-cyan">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
