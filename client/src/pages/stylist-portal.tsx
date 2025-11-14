import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Mail, Star, Scissors, Phone } from "lucide-react";
import { format, isPast, parseISO, isFuture } from "date-fns";
import type { Booking, Service, Stylist, Schedule } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function StylistPortal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: stylistProfile } = useQuery<Stylist>({
    queryKey: ["/api/stylist/profile"],
    enabled: isAuthenticated,
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/stylist/bookings"],
    enabled: isAuthenticated,
  });

  const { data: schedules = [] } = useQuery<Schedule[]>({
    queryKey: ["/api/stylist/schedules"],
    enabled: isAuthenticated,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!stylistProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Scissors className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Not a Stylist Account</h2>
            <p className="text-muted-foreground mb-4">
              Your account is not linked to a stylist profile. Please contact an administrator.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || "Unknown Service";
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const upcomingBookings = bookings.filter(b => 
    (b.status === "confirmed" || b.status === "pending") && 
    isFuture(parseISO(`${b.date}T${b.time}`))
  ).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const todaysBookings = bookings.filter(b => {
    return b.status === "confirmed" && b.date === todayStr;
  }).sort((a, b) => a.time.localeCompare(b.time));

  const pastBookings = bookings.filter(b => 
    b.status === "completed" || 
    (b.status === "confirmed" && isPast(parseISO(`${b.date}T${b.time}`)))
  ).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600" data-testid="badge-status-confirmed">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary" data-testid="badge-status-pending">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600" data-testid="badge-status-completed">Completed</Badge>;
      default:
        return <Badge variant="outline" data-testid={`badge-status-${status}`}>{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const service = services.find(s => s.id === booking.serviceId);
    
    return (
      <Card className="hover-elevate" data-testid={`card-booking-${booking.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1" data-testid={`text-service-${booking.id}`}>
                {service?.name || "Unknown Service"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {booking.customerName || "Customer"}
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

            {booking.customerEmail && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span data-testid={`text-email-${booking.id}`}>{booking.customerEmail}</span>
              </div>
            )}

            {booking.customerPhone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span data-testid={`text-phone-${booking.id}`}>{booking.customerPhone}</span>
              </div>
            )}

            {service && (
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-muted-foreground">Service Price:</span>
                <span className="text-primary" data-testid={`text-price-${booking.id}`}>${service.price}</span>
              </div>
            )}

            {booking.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Customer Notes:</p>
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
                <h1 className="text-3xl font-serif font-semibold mb-1" data-testid="text-portal-title">
                  Stylist Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your appointments and schedule
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-stylist-profile">Stylist Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg" data-testid="text-stylist-name">
                      {stylistProfile.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span data-testid="text-rating">{stylistProfile.rating}/5</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Specialization</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-specialization">
                      {stylistProfile.specialization || "General Stylist"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Experience</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-experience">
                      {stylistProfile.yearsExperience}+ years
                    </p>
                  </div>

                  {stylistProfile.bio && (
                    <div>
                      <p className="text-sm font-medium mb-1">Bio</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-bio">
                        {stylistProfile.bio}
                      </p>
                    </div>
                  )}
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
                <CardTitle data-testid="text-schedule-title">My Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md" data-testid={`schedule-${schedule.id}`}>
                      <span className="text-sm font-medium">{getDayName(schedule.dayOfWeek)}</span>
                      <span className="text-sm text-muted-foreground">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No schedule set
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-appointments-title">My Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming" data-testid="tab-upcoming">
                      Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="today" data-testid="tab-today">
                      Today ({todaysBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" data-testid="tab-past">
                      Past ({pastBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-upcoming">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No upcoming appointments</p>
                      </div>
                    ) : (
                      upcomingBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="today" className="space-y-4 mt-6">
                    {todaysBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-today">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No appointments today</p>
                      </div>
                    ) : (
                      todaysBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4 mt-6">
                    {pastBookings.length === 0 ? (
                      <div className="text-center py-12" data-testid="text-no-past">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No past appointments</p>
                      </div>
                    ) : (
                      pastBookings.map(booking => (
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
