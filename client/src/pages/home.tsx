import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Badge as BadgeIcon, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Booking, Service, Stylist } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/user/bookings"],
    enabled: isAuthenticated,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const upcomingBookings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const pastBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold mb-2" data-testid="text-home-title">
                Welcome back, {user?.firstName || "Customer"}!
              </h1>
              <p className="text-muted-foreground">
                Manage your appointments and discover new services
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Button variant="outline" onClick={() => window.location.href = "/admin"} data-testid="button-admin-dashboard">
                  Admin Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.href = "/api/logout"} data-testid="button-logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="card-upcoming-bookings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const service = services.find((s) => s.id === booking.serviceId);
                      const stylist = stylists.find((s) => s.id === booking.stylistId);

                      return (
                        <Card key={booking.id} className="hover-elevate" data-testid={`booking-${booking.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">{service?.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  with {stylist?.name}
                                </p>
                              </div>
                              <Badge
                                variant={booking.status === "confirmed" ? "default" : "secondary"}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(booking.date), "EEEE, MMM d, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                    <Button onClick={() => window.location.href = "/book"} data-testid="button-book-appointment">
                      Book an Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {pastBookings.length > 0 && (
              <Card data-testid="card-past-bookings">
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pastBookings.slice(0, 3).map((booking) => {
                      const service = services.find((s) => s.id === booking.serviceId);
                      const stylist = stylists.find((s) => s.id === booking.stylistId);

                      return (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div>
                            <p className="font-medium text-sm">{service?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(booking.date), "MMM d, yyyy")} with {stylist?.name}
                            </p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => window.location.href = "/book"} data-testid="button-new-booking">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = "/"}>
                  View Services
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="text-lg font-bold">{bookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upcoming</span>
                  <Badge>{upcomingBookings.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <Badge variant="outline">{pastBookings.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
