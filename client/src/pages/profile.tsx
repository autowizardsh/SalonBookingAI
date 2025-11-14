import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Mail, Phone, MapPin, Edit2, Scissors } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import type { Booking, Service, Stylist } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");

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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getBookingDetails = (booking: Booking) => {
    const service = services.find(s => s.id === booking.serviceId);
    const stylist = stylists.find(s => s.id === booking.stylistId);
    return { service, stylist };
  };

  const upcomingBookings = bookings.filter(b => 
    (b.status === "confirmed" || b.status === "pending") && 
    !isPast(parseISO(`${b.date}T${b.time}`))
  ).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const pastBookings = bookings.filter(b => 
    b.status === "completed" || 
    (b.status === "confirmed" && isPast(parseISO(`${b.date}T${b.time}`)))
  ).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const cancelledBookings = bookings.filter(b => b.status === "cancelled")
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600" data-testid={`badge-status-confirmed`}>Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary" data-testid={`badge-status-pending`}>Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600" data-testid={`badge-status-completed`}>Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" data-testid={`badge-status-cancelled`}>Cancelled</Badge>;
      default:
        return <Badge variant="outline" data-testid={`badge-status-${status}`}>{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const { service, stylist } = getBookingDetails(booking);
    
    return (
      <Card className="hover-elevate" data-testid={`card-booking-${booking.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1" data-testid={`text-service-${booking.id}`}>
                {service?.name || "Unknown Service"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Booking ID: {booking.id.slice(0, 8)}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-date-${booking.id}`}>
                {format(parseISO(booking.date), "EEEE, MMMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-time-${booking.id}`}>{booking.time}</span>
              <span className="text-muted-foreground">({service?.duration || 0} min)</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-stylist-${booking.id}`}>{stylist?.name || "Unknown Stylist"}</span>
            </div>

            {service && (
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-muted-foreground">Price:</span>
                <span className="text-primary" data-testid={`text-price-${booking.id}`}>${service.price}</span>
              </div>
            )}

            {booking.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Notes:</p>
                <p className="text-sm mt-1" data-testid={`text-notes-${booking.id}`}>{booking.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = "/"}
                data-testid="button-back-home"
              >
                <Scissors className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-serif font-semibold mb-1" data-testid="text-profile-title">
                  My Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your account and view your booking history
                </p>
              </div>
            </div>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                onClick={() => window.location.href = "/admin"}
                data-testid="button-admin-dashboard"
              >
                Admin Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid="text-account-info">Account Information</span>
                  <Button variant="ghost" size="icon" data-testid="button-edit-profile">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold" data-testid="text-user-name">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <Badge variant="secondary" data-testid="badge-user-role">
                      {user?.role === "admin" ? "Administrator" : "Customer"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span data-testid="text-user-email">{user?.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span data-testid="text-member-since">
                      Member since {user?.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "N/A"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary" data-testid="text-total-bookings">
                      {bookings.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary" data-testid="text-upcoming-count">
                      {upcomingBookings.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle data-testid="text-quick-actions">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/book"}
                  data-testid="button-new-booking"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/"}
                  data-testid="button-view-services"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  View Services
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-booking-history">Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming" data-testid="tab-upcoming">
                      Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" data-testid="tab-past">
                      Past ({pastBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" data-testid="tab-cancelled">
                      Cancelled ({cancelledBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-upcoming">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No upcoming bookings</p>
                        <Button
                          className="mt-4"
                          onClick={() => window.location.href = "/book"}
                          data-testid="button-book-now"
                        >
                          Book Now
                        </Button>
                      </div>
                    ) : (
                      upcomingBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4 mt-6">
                    {pastBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-past">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No past bookings</p>
                      </div>
                    ) : (
                      pastBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="cancelled" className="space-y-4 mt-6">
                    {cancelledBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-cancelled">
                        <p className="text-muted-foreground">No cancelled bookings</p>
                      </div>
                    ) : (
                      cancelledBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
