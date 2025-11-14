import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, DollarSign, Calendar, Scissors, Sparkles, LogIn } from "lucide-react";
import { Link } from "wouter";
import type { Service, Stylist } from "@shared/schema";
import heroImage from "@assets/generated_images/Salon_hero_interior_shot_9deda2ec.png";
import hairCutImage from "@assets/generated_images/Hair_cutting_service_photo_375838fd.png";
import hairColorImage from "@assets/generated_images/Hair_coloring_service_photo_7be593a4.png";
import hairStylingImage from "@assets/generated_images/Hair_styling_service_photo_88f40a7b.png";
import blowoutImage from "@assets/generated_images/Blowout_service_photo_daadc6f8.png";
import treatmentImage from "@assets/generated_images/Hair_treatment_service_photo_76198029.png";
import stylist1Image from "@assets/generated_images/Stylist_portrait_one_4cd81cb2.png";
import stylist2Image from "@assets/generated_images/Stylist_portrait_two_1dcd8206.png";
import stylist3Image from "@assets/generated_images/Stylist_portrait_three_d44fe36e.png";
import testimonialImage from "@assets/generated_images/Happy_customer_testimonial_59f6039d.png";

const serviceImages: Record<string, string> = {
  "Haircut": hairCutImage,
  "Hair Coloring": hairColorImage,
  "Hair Styling": hairStylingImage,
  "Blowout": blowoutImage,
  "Treatment": treatmentImage,
};

const stylistImages = [stylist1Image, stylist2Image, stylist3Image];

export default function Landing() {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: stylists = [] } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
  });

  const featuredServices = services.slice(0, 6);
  const featuredStylists = stylists.slice(0, 3);

  const scrollToBooking = () => {
    const chatWidget = document.getElementById("chat-widget-trigger");
    if (chatWidget) {
      chatWidget.click();
    } else {
      window.location.href = "/book";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="text-xl font-serif font-semibold">Elegance Salon</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm hover-elevate px-3 py-2 rounded-md" data-testid="link-services">Services</a>
              <a href="#stylists" className="text-sm hover-elevate px-3 py-2 rounded-md" data-testid="link-stylists">Stylists</a>
              <a href="#testimonials" className="text-sm hover-elevate px-3 py-2 rounded-md" data-testid="link-testimonials">Testimonials</a>
              <Link href="/admin/login">
                <Button variant="ghost" size="sm" data-testid="button-admin-login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
              <Button onClick={scrollToBooking} data-testid="button-book-now-header">
                Book Now
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury salon interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm" data-testid="badge-ai-assistant">
              <Sparkles className="w-3 h-3 mr-1" />
              Book with AI Assistant
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-6 leading-tight" data-testid="text-hero-title">
              Discover Your Perfect Look
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl" data-testid="text-hero-description">
              Experience premium salon services with our expert stylists. Book instantly through our AI assistant or browse our services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={scrollToBooking}
                className="bg-primary hover:bg-primary text-primary-foreground shadow-xl"
                data-testid="button-book-with-ai"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Book with AI
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-background/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                data-testid="button-view-services"
              >
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4" data-testid="text-services-title">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-services-description">
              From precision cuts to stunning color transformations, our expert stylists deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, idx) => {
              const imageKey = Object.keys(serviceImages).find(key => service.name.includes(key)) || Object.keys(serviceImages)[idx % Object.keys(serviceImages).length];
              const serviceImage = serviceImages[imageKey];

              return (
                <Card key={service.id} className="overflow-hidden hover-elevate" data-testid={`card-service-${service.id}`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={serviceImage}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold" data-testid={`text-service-name-${service.id}`}>{service.name}</h3>
                        <Badge variant="secondary" data-testid={`badge-service-category-${service.id}`}>{service.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-service-description-${service.id}`}>
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span data-testid={`text-service-duration-${service.id}`}>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <DollarSign className="w-5 h-5" />
                        <span data-testid={`text-service-price-${service.id}`}>{service.price}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={scrollToBooking}
                      data-testid={`button-book-service-${service.id}`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-services">
                No services available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="stylists" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4" data-testid="text-stylists-title">
              Meet Our Stylists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-stylists-description">
              Talented professionals dedicated to bringing your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStylists.map((stylist, idx) => (
              <Card key={stylist.id} className="overflow-hidden hover-elevate" data-testid={`card-stylist-${stylist.id}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={stylistImages[idx % stylistImages.length]}
                    alt={stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1" data-testid={`text-stylist-name-${stylist.id}`}>{stylist.name}</h3>
                    <p className="text-sm text-primary font-medium" data-testid={`text-stylist-specialization-${stylist.id}`}>
                      {stylist.specialization}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-stylist-bio-${stylist.id}`}>
                    {stylist.bio}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: stylist.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground" data-testid={`text-stylist-experience-${stylist.id}`}>
                      {stylist.yearsExperience}+ years
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={scrollToBooking}
                    data-testid={`button-book-stylist-${stylist.id}`}
                  >
                    Book with {stylist.name.split(" ")[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {stylists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-stylists">
                Our stylists will be available soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4" data-testid="text-testimonials-title">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-testimonials-description">
              Join hundreds of satisfied clients who trust us with their beauty needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                service: "Hair Coloring",
                text: "Absolutely love my new color! The stylist listened to exactly what I wanted and delivered beyond my expectations.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                service: "Haircut & Styling",
                text: "Best haircut I've had in years. Professional service, great atmosphere, and the booking process was so easy!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                service: "Blowout",
                text: "The AI booking assistant made scheduling so convenient. My blowout looked amazing for days!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 hover-elevate" data-testid={`card-testimonial-${idx}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonialImage}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold" data-testid={`text-testimonial-name-${idx}`}>{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-service-${idx}`}>{testimonial.service}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground" data-testid={`text-testimonial-text-${idx}`}>"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4" data-testid="text-cta-title">
            Ready to Transform Your Look?
          </h2>
          <p className="text-lg mb-8 opacity-90" data-testid="text-cta-description">
            Book your appointment today and experience the difference
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToBooking}
            className="bg-white text-primary hover:bg-white/90 border-white"
            data-testid="button-cta-book"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Your Appointment
          </Button>
        </div>
      </section>

      <footer className="py-12 bg-card border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-5 h-5 text-primary" />
                <span className="font-serif font-semibold">Elegance Salon</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium beauty and styling services for the modern you
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-foreground">Haircuts</a></li>
                <li><a href="#services" className="hover:text-foreground">Color</a></li>
                <li><a href="#services" className="hover:text-foreground">Styling</a></li>
                <li><a href="#services" className="hover:text-foreground">Treatments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Monday - Saturday: 9AM - 7PM</li>
                <li>Sunday: 10AM - 5PM</li>
                <li>contact@elegancesalon.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Trust</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Licensed Professionals</Badge>
                <Badge variant="secondary">500+ Happy Clients</Badge>
                <Badge variant="secondary">4.9★ Average Rating</Badge>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Elegance Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
