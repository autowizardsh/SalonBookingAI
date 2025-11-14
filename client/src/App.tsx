import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/chat-widget";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Booking from "@/pages/booking";
import Admin from "@/pages/admin";
import Profile from "@/pages/profile";
import StylistPortal from "@/pages/stylist-portal";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/admin/:rest*" component={Admin} />
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/book" component={Booking} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/book" component={Booking} />
          <Route path="/profile" component={Profile} />
          <Route path="/stylist" component={StylistPortal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
