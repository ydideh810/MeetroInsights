import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <ProtectedRoute>
        <Router />
      </ProtectedRoute>
    </TooltipProvider>
  );
}

export default App;
