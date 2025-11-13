import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Scissors, DollarSign, Clock, TrendingUp } from "lucide-react";
import type { Booking, Service, Stylist, User } from "@shared/schema";
import { format } from "date-fns";

export function AdminDashboard() {
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const { data: customers = [] } = useQuery<User[]>({
    queryKey: ["/api/customers"],
  });

  const todayBookings = bookings.filter(
    (b) => b.date === format(new Date(), "yyyy-MM-dd")
  );

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, booking) => {
      const service = services.find((s) => s.id === booking.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const upcomingBookings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const stats = [
    {
      title: "Today's Bookings",
      value: todayBookings.length,
      icon: Calendar,
      description: `${confirmedBookings.length} confirmed, ${pendingBookings.length} pending`,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      description: "From confirmed bookings",
      color: "text-green-600",
    },
    {
      title: "Active Stylists",
      value: stylists.length,
      icon: Users,
      description: `${services.length} services offered`,
      color: "text-purple-600",
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: TrendingUp,
      description: "Registered users",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-semibold mb-2" data-testid="text-dashboard-title">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
          Monitor your salon's performance and activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover-elevate" data-testid={`card-stat-${idx}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-value-${idx}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-upcoming-bookings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const service = services.find((s) => s.id === booking.serviceId);
                  const stylist = stylists.find((s) => s.id === booking.stylistId);

                  return (
                    <div
                      key={booking.id}
                      className="flex items-start justify-between p-3 rounded-md border hover-elevate"
                      data-testid={`booking-item-${booking.id}`}
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{booking.customerName || "Customer"}</p>
                        <p className="text-xs text-muted-foreground">
                          {service?.name} with {stylist?.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(booking.date), "MMM d")} at {booking.time}
                        </div>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming bookings
              </p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-quick-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm font-medium">Total Bookings</span>
              <span className="text-lg font-bold">{bookings.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm font-medium">Pending Approval</span>
              <Badge variant="secondary">{pendingBookings.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm font-medium">Confirmed Today</span>
              <Badge>{confirmedBookings.filter((b) => b.date === format(new Date(), "yyyy-MM-dd")).length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm font-medium">Services Available</span>
              <span className="text-lg font-bold">{services.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
