import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Clock, DollarSign, User, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import type { Service, Stylist, Schedule } from "@shared/schema";
import { format } from "date-fns";

export default function Booking() {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStylist, setSelectedStylist] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedStylistData = stylists.find(s => s.id === selectedStylist);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  const handleBooking = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
  };

  const isFormComplete = selectedDate && selectedService && selectedStylist && selectedTime;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold mb-2" data-testid="text-booking-title">
                Book Your Appointment
              </h1>
              <p className="text-muted-foreground" data-testid="text-booking-subtitle">
                Choose your service, stylist, and preferred time
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/"} data-testid="button-back-home">
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="card-select-service">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  Select a Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer hover-elevate active-elevate-2 ${
                        selectedService === service.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedService(service.id)}
                      data-testid={`card-service-option-${service.id}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold" data-testid={`text-service-name-${service.id}`}>{service.name}</h3>
                          {selectedService === service.id && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-select-stylist">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  Choose Your Stylist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stylists.map((stylist) => (
                    <Card
                      key={stylist.id}
                      className={`cursor-pointer hover-elevate active-elevate-2 ${
                        selectedStylist === stylist.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setSelectedStylist(stylist.id)}
                      data-testid={`card-stylist-option-${stylist.id}`}
                    >
                      <CardContent className="p-4 space-y-2 text-center">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm" data-testid={`text-stylist-name-${stylist.id}`}>
                            {stylist.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {stylist.specialization}
                          </p>
                        </div>
                        {selectedStylist === stylist.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-select-datetime">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  Pick Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border"
                    data-testid="calendar-date-picker"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <h4 className="font-semibold mb-4">Available Time Slots</h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                          data-testid={`button-time-${time.replace(":", "")}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4" data-testid="card-booking-summary">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServiceData ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Service</p>
                    <p className="font-semibold" data-testid="text-summary-service">{selectedServiceData.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedServiceData.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${selectedServiceData.price}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No service selected</p>
                )}

                <Separator />

                {selectedStylistData ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Stylist</p>
                    <p className="font-semibold" data-testid="text-summary-stylist">{selectedStylistData.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedStylistData.specialization}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No stylist selected</p>
                )}

                <Separator />

                {selectedDate && selectedTime ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                    <p className="font-semibold flex items-center gap-2" data-testid="text-summary-datetime">
                      <CalendarIcon className="w-4 h-4" />
                      {format(selectedDate, "MMM d, yyyy")} at {selectedTime}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No date/time selected</p>
                )}

                <Separator />

                <div className="pt-2">
                  <div className="flex items-center justify-between text-lg font-semibold mb-4">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-summary-total">
                      ${selectedServiceData?.price || 0}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!isFormComplete}
                    onClick={handleBooking}
                    data-testid="button-confirm-booking"
                  >
                    Confirm Booking
                  </Button>

                  {!isAuthenticated && isFormComplete && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      You'll be asked to log in to complete your booking
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
