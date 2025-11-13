import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from "openai";
import {
  insertServiceSchema,
  insertStylistSchema,
  insertBookingSchema,
  insertScheduleSchema,
} from "@shared/schema";

// Initialize OpenAI client using Replit AI Integrations
// This provides OpenAI-compatible API access without requiring your own API key
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth middleware helpers
  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    const user = req.user as any;
    if (!req.isAuthenticated || !req.isAuthenticated() || !user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      if (!dbUser || dbUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking authorization" });
    }
  };

  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      res.json(dbUser);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Services Routes
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/services", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validated);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/services/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validated);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/services/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stylists Routes
  app.get("/api/stylists", async (req: Request, res: Response) => {
    try {
      const stylists = await storage.getAllStylists();
      res.json(stylists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stylists/:id", async (req: Request, res: Response) => {
    try {
      const stylist = await storage.getStylist(req.params.id);
      if (!stylist) {
        return res.status(404).json({ message: "Stylist not found" });
      }
      res.json(stylist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/stylists", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = insertStylistSchema.parse(req.body);
      const stylist = await storage.createStylist(validated);
      res.status(201).json(stylist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/stylists/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = insertStylistSchema.partial().parse(req.body);
      const stylist = await storage.updateStylist(req.params.id, validated);
      if (!stylist) {
        return res.status(404).json({ message: "Stylist not found" });
      }
      res.json(stylist);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/stylists/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteStylist(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Schedules Routes
  app.get("/api/stylists/:id/schedules", async (req: Request, res: Response) => {
    try {
      const schedules = await storage.getStylistSchedules(req.params.id);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/schedules", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validated);
      res.status(201).json(schedule);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/schedules/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteSchedule(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Bookings Routes
  app.get("/api/bookings", requireAdmin, async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/bookings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      // Check if user owns the booking or is admin
      if (booking.userId !== userId && dbUser?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/bookings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      
      const validated = insertBookingSchema.parse({
        ...req.body,
        userId: userId,
        customerName: dbUser?.firstName && dbUser?.lastName
          ? `${dbUser.firstName} ${dbUser.lastName}`
          : dbUser?.firstName || "Customer",
        customerEmail: dbUser?.email,
      });

      // Check for conflicts
      const existingBookings = await storage.getStylistBookingsOnDate(
        validated.stylistId,
        validated.date
      );

      const newBookingTime = validated.time;
      const service = await storage.getService(validated.serviceId);
      const duration = service?.duration || 60;

      // Calculate end time for new booking
      const [hours, minutes] = newBookingTime.split(":").map(Number);
      const newStartMinutes = hours * 60 + minutes;
      const newEndMinutes = newStartMinutes + duration;

      // Check for conflicts
      for (const booking of existingBookings) {
        if (booking.status === "cancelled") continue;

        const bookingService = await storage.getService(booking.serviceId);
        const bookingDuration = bookingService?.duration || 60;
        const [bHours, bMinutes] = booking.time.split(":").map(Number);
        const bookingStartMinutes = bHours * 60 + bMinutes;
        const bookingEndMinutes = bookingStartMinutes + bookingDuration;

        // Check if times overlap
        if (
          (newStartMinutes >= bookingStartMinutes && newStartMinutes < bookingEndMinutes) ||
          (newEndMinutes > bookingStartMinutes && newEndMinutes <= bookingEndMinutes) ||
          (newStartMinutes <= bookingStartMinutes && newEndMinutes >= bookingEndMinutes)
        ) {
          return res.status(409).json({
            message: "This time slot is already booked. Please choose a different time.",
          });
        }
      }

      const booking = await storage.createBooking(validated);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/bookings/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteBooking(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Check availability endpoint
  app.post("/api/availability", async (req: Request, res: Response) => {
    try {
      const { stylistId, date, time, serviceId } = req.body;

      const existingBookings = await storage.getStylistBookingsOnDate(stylistId, date);
      const service = await storage.getService(serviceId);
      const duration = service?.duration || 60;

      const [hours, minutes] = time.split(":").map(Number);
      const newStartMinutes = hours * 60 + minutes;
      const newEndMinutes = newStartMinutes + duration;

      for (const booking of existingBookings) {
        if (booking.status === "cancelled") continue;

        const bookingService = await storage.getService(booking.serviceId);
        const bookingDuration = bookingService?.duration || 60;
        const [bHours, bMinutes] = booking.time.split(":").map(Number);
        const bookingStartMinutes = bHours * 60 + bMinutes;
        const bookingEndMinutes = bookingStartMinutes + bookingDuration;

        if (
          (newStartMinutes >= bookingStartMinutes && newStartMinutes < bookingEndMinutes) ||
          (newEndMinutes > bookingStartMinutes && newEndMinutes <= bookingEndMinutes) ||
          (newStartMinutes <= bookingStartMinutes && newEndMinutes >= bookingEndMinutes)
        ) {
          return res.json({ available: false });
        }
      }

      res.json({ available: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Customers Routes (Admin only)
  app.get("/api/customers", requireAdmin, async (req: Request, res: Response) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      // Get current data for context
      const services = await storage.getAllServices();
      const stylists = await storage.getAllStylists();

      // Build system context
      const systemContext = `You are a helpful AI assistant for Elegance Salon booking system. You can help customers:
1. Browse available services and their prices
2. Learn about our stylists
3. Check availability and book appointments
4. Answer questions about the salon

Current Services:
${services.map((s) => `- ${s.name} (${s.category}): $${s.price}, ${s.duration} minutes`).join("\n")}

Available Stylists:
${stylists.map((s) => `- ${s.name}: ${s.specialization} (${s.yearsExperience}+ years experience)`).join("\n")}

When helping with bookings, ask for:
1. Which service they want
2. Preferred stylist (or you can recommend one)
3. Preferred date and time

Be friendly, professional, and helpful. Keep responses concise but informative.`;

      const messages = [
        { role: "system", content: systemContext },
        ...history,
        { role: "user", content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using gpt-4o-mini for cost-effectiveness
        messages: messages as any,
        temperature: 0.7,
        max_completion_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

      res.json({ response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
