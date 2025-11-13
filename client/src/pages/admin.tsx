import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminStylists } from "@/components/admin/admin-stylists";
import { AdminBookings } from "@/components/admin/admin-bookings";
import { AdminCustomers } from "@/components/admin/admin-customers";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-2 h-16 px-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-lg font-semibold" data-testid="text-admin-header">
              Admin Dashboard
            </h1>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/20">
            <Switch>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/services" component={AdminServices} />
              <Route path="/admin/stylists" component={AdminStylists} />
              <Route path="/admin/bookings" component={AdminBookings} />
              <Route path="/admin/customers" component={AdminCustomers} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
