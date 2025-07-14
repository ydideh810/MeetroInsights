import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingScreen from "@/components/ui/loading-screen";

export default function LoadingDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demos = [
    {
      id: "magi",
      title: "MAGI System",
      description: "Hexagonal MAGI core synchronization with rotating elements",
      message: "SYNCHRONIZING MAGI CORES",
      variant: "magi" as const,
    },
    {
      id: "neural",
      title: "Neural Network",
      description: "Neural pathway visualization with connected nodes",
      message: "ESTABLISHING NEURAL PATHWAYS",
      variant: "neural" as const,
    },
    {
      id: "data",
      title: "Data Processing",
      description: "Data stream visualization with scan line effects",
      message: "PROCESSING DATA STREAMS",
      variant: "data" as const,
    },
    {
      id: "quantum",
      title: "Quantum Field",
      description: "Quantum particle simulation with field stabilization",
      message: "QUANTUM FIELD STABILIZATION",
      variant: "quantum" as const,
    },
  ];

  const handleDemo = (demoId: string) => {
    setActiveDemo(demoId);
    setTimeout(() => setActiveDemo(null), 5000); // Auto-close after 5 seconds
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyber-orange cyber-glow mb-2">
          LOADING SCREEN SHOWCASE
        </h2>
        <p className="text-cyber-cyan">
          Retro-futuristic loading animations for the cyberpunk experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demos.map((demo) => (
          <Card key={demo.id} className="bg-cyber-panel border-cyber-orange">
            <CardHeader>
              <CardTitle className="text-cyber-orange">{demo.title}</CardTitle>
              <CardDescription className="text-cyber-cyan">
                {demo.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleDemo(demo.id)}
                className="w-full bg-cyber-orange text-black hover:bg-orange-600 font-bold"
                disabled={activeDemo === demo.id}
              >
                {activeDemo === demo.id ? "LOADING..." : `DEMO ${demo.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Demo */}
      {activeDemo && (
        <LoadingScreen
          variant={demos.find(d => d.id === activeDemo)?.variant || "magi"}
          message={demos.find(d => d.id === activeDemo)?.message || "LOADING..."}
        />
      )}
    </div>
  );
}