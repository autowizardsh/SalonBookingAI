import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, getRequestUserId } from "./replitAuth";
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
    // Check if authentication function exists and user is authenticated
    if (typeof req.isAuthenticated !== "function" || !req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
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
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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

  // Guest booking endpoint - allows unauthenticated bookings with customer info
  app.post("/api/bookings/guest", async (req: Request, res: Response) => {
    try {
      const { customerName, customerEmail, customerPhone, serviceId, stylistId, date, time, notes } = req.body;

      // Validate required fields
      if (!customerName || !customerEmail || !serviceId || !stylistId || !date || !time) {
        return res.status(400).json({ 
          message: "Missing required fields: customerName, customerEmail, serviceId, stylistId, date, time" 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Get service details
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(400).json({ message: "Service not found" });
      }

      // Check availability
      const duration = service.duration || 60;
      const [hours, minutes] = time.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + duration;

      // Validate stylist offers this service
      const offersService = await storage.stylistOffersService(stylistId, serviceId);
      if (!offersService) {
        return res.status(400).json({ message: "This stylist does not offer the selected service" });
      }

      // Check stylist schedule
      const schedules = await storage.getStylistSchedules(stylistId);
      // Parse date in UTC to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const requestDate = new Date(Date.UTC(year, month - 1, day));
      const dayIndex = requestDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const daySchedule = schedules.find(s => parseInt(s.dayOfWeek, 10) === dayIndex && s.isAvailable);
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (!daySchedule) {
        return res.status(400).json({ message: `Stylist is not available on ${dayNames[dayIndex]}s` });
      }

      const [schedStartHour, schedStartMin] = daySchedule.startTime.split(":").map(Number);
      const [schedEndHour, schedEndMin] = daySchedule.endTime.split(":").map(Number);
      const schedStartMinutes = schedStartHour * 60 + schedStartMin;
      const schedEndMinutes = schedEndHour * 60 + schedEndMin;

      if (startMinutes < schedStartMinutes || endMinutes > schedEndMinutes) {
        return res.status(400).json({ 
          message: `Stylist works ${daySchedule.startTime} - ${daySchedule.endTime} on ${dayNames[dayIndex]}s` 
        });
      }

      // Check for booking conflicts
      const existingBookings = await storage.getStylistBookingsOnDate(stylistId, date);
      for (const booking of existingBookings) {
        if (booking.status === "cancelled") continue;

        const bookingService = await storage.getService(booking.serviceId);
        const bookingDuration = bookingService?.duration || 60;
        const [bHours, bMinutes] = booking.time.split(":").map(Number);
        const bookingStartMinutes = bHours * 60 + bMinutes;
        const bookingEndMinutes = bookingStartMinutes + bookingDuration;

        if (
          (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
          (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
          (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
        ) {
          return res.status(409).json({ message: "This time slot is already booked" });
        }
      }

      // Create or get guest user
      const guestUser = await storage.upsertUser({
        email: customerEmail,
        firstName: customerName.split(' ')[0],
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        role: 'customer',
        provider: 'guest',
      });

      // Create booking
      const booking = await storage.createBooking({
        userId: guestUser.id,
        serviceId,
        stylistId,
        date,
        time,
        status: 'pending',
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        notes: notes || null,
      });

      res.status(201).json({ 
        success: true, 
        booking,
        message: `Booking confirmed for ${customerName} on ${date} at ${time}` 
      });
    } catch (error: any) {
      console.error("Guest booking error:", error);
      res.status(500).json({ message: error.message || "Failed to create booking" });
    }
  });

  app.post("/api/bookings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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

  // Check availability endpoint - validates against both schedules and existing bookings
  app.post("/api/availability", async (req: Request, res: Response) => {
    try {
      const { stylistId, date, time, serviceId } = req.body;

      // Get service duration
      const service = await storage.getService(serviceId);
      const duration = service?.duration || 60;

      // Parse requested time
      const [hours, minutes] = time.split(":").map(Number);
      const newStartMinutes = hours * 60 + minutes;
      const newEndMinutes = newStartMinutes + duration;

      // Validate stylist offers this service
      const offersService = await storage.stylistOffersService(stylistId, serviceId);
      if (!offersService) {
        return res.json({ 
          available: false, 
          reason: "This stylist does not offer the selected service" 
        });
      }

      // Check against stylist schedule (working hours)
      const schedules = await storage.getStylistSchedules(stylistId);
      // Parse date in UTC to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const requestDate = new Date(Date.UTC(year, month - 1, day));
      const dayIndex = requestDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daySchedule = schedules.find(s => parseInt(s.dayOfWeek, 10) === dayIndex && s.isAvailable);
      if (!daySchedule) {
        return res.json({ 
          available: false, 
          reason: `Stylist is not available on ${dayNames[dayIndex]}s` 
        });
      }

      // Check if requested time is within working hours
      const [schedStartHour, schedStartMin] = daySchedule.startTime.split(":").map(Number);
      const [schedEndHour, schedEndMin] = daySchedule.endTime.split(":").map(Number);
      const schedStartMinutes = schedStartHour * 60 + schedStartMin;
      const schedEndMinutes = schedEndHour * 60 + schedEndMin;

      if (newStartMinutes < schedStartMinutes || newEndMinutes > schedEndMinutes) {
        return res.json({ 
          available: false, 
          reason: `Stylist works ${daySchedule.startTime} - ${daySchedule.endTime} on ${dayNames[dayIndex]}s` 
        });
      }

      // Check against existing bookings
      const existingBookings = await storage.getStylistBookingsOnDate(stylistId, date);

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
          return res.json({ 
            available: false, 
            reason: "This time slot is already booked" 
          });
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

  // Stylist Portal Routes
  app.get("/api/stylist/bookings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const dbUser = await storage.getUser(userId);
      
      if (!dbUser || !dbUser.stylistId) {
        return res.status(403).json({ message: "Not a stylist account" });
      }

      const bookings = await storage.getStylistBookings(dbUser.stylistId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stylist/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const dbUser = await storage.getUser(userId);
      
      if (!dbUser || !dbUser.stylistId) {
        return res.status(403).json({ message: "Not a stylist account" });
      }

      const stylist = await storage.getStylist(dbUser.stylistId);
      if (!stylist) {
        return res.status(404).json({ message: "Stylist profile not found" });
      }

      res.json(stylist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stylist/schedules", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getRequestUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const dbUser = await storage.getUser(userId);
      
      if (!dbUser || !dbUser.stylistId) {
        return res.status(403).json({ message: "Not a stylist account" });
      }

      const schedules = await storage.getStylistSchedules(dbUser.stylistId);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Chat endpoint - Available to all users (no auth required)
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      // Get current data for context
      const services = await storage.getAllServices();
      const stylists = await storage.getAllStylists();

      // Get current date/time for context
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

      // Build system context with step-by-step booking guidance
      const systemContext = `You are a helpful AI booking assistant for Elegance Salon. Your goal is to guide customers through a step-by-step booking process.

TODAY'S DATE & TIME:
- Current date: ${today} (${dayOfWeek})
- Current time: ${currentTime}

IMPORTANT: Users will speak naturally! They'll say things like:
- "tomorrow" (means ${today} + 1 day)
- "next Friday" (calculate the next Friday from ${today})
- "this Thursday" (calculate the upcoming Thursday)
- "2pm" or "2:30" (convert to 14:00 or 14:30 in 24-hour format)
- "in the morning" (suggest 9am-12pm)
- "afternoon" (suggest 1pm-5pm)

YOU must convert these natural expressions into proper YYYY-MM-DD dates and HH:MM times.
NEVER ask users to format dates - you do the conversion!

BOOKING PROCESS (follow in order):
1. COLLECT SERVICE: Ask which service they want
2. COLLECT STYLIST: Ask which stylist they prefer (or recommend based on service)
3. COLLECT DATE: Ask "When would you like your appointment?" (accept natural language like "tomorrow", "Friday", etc.)
4. COLLECT TIME: Ask "What time works best?" (accept "2pm", "morning", "afternoon", etc.)
5. CHECK AVAILABILITY: IMMEDIATELY call check_availability function (with converted YYYY-MM-DD and HH:MM)
6. If available: COLLECT CONTACT INFO (full name, email, phone number)
7. If unavailable: Suggest alternative times and repeat from step 4
8. Once you have contact info + confirmed availability: IMMEDIATELY call create_booking function
9. After successful booking: Provide confirmation with all booking details

CRITICAL RULES:
- MUST call check_availability as soon as you have service, stylist, date, time
- MUST call create_booking as soon as you have contact info + confirmed availability
- Do NOT ask for contact info before checking availability
- Do NOT ask to "confirm availability again" after already checking it
- Once availability is confirmed and contact info collected, CREATE THE BOOKING immediately
- Be conversational but efficient - avoid unnecessary back-and-forth
- ALWAYS convert natural language dates/times to proper formats before calling functions

Current Services:
${services.map((s) => `- ${s.name} (ID: ${s.id}): $${s.price}, ${s.duration} minutes - ${s.description}`).join("\n")}

Available Stylists:
${stylists.map((s) => `- ${s.name} (ID: ${s.id}): ${s.specialization}, ${s.yearsExperience}+ years exp`).join("\n")}

Be friendly, helpful, and guide them smoothly through the booking!`;

      const messages = [
        { role: "system", content: systemContext },
        ...history,
        { role: "user", content: message },
      ];

      // Define functions the AI can call
      const functions = [
        {
          name: "check_availability",
          description: "Check if a stylist is available at a specific date and time for a service",
          parameters: {
            type: "object",
            properties: {
              stylistId: { type: "string", description: "The stylist ID" },
              serviceId: { type: "string", description: "The service ID" },
              date: { type: "string", description: "Date in YYYY-MM-DD format" },
              time: { type: "string", description: "Time in HH:MM 24-hour format" },
            },
            required: ["stylistId", "serviceId", "date", "time"],
          },
        },
        {
          name: "create_booking",
          description: "Create a confirmed booking after collecting all required information and verifying availability",
          parameters: {
            type: "object",
            properties: {
              customerName: { type: "string", description: "Customer's full name" },
              customerEmail: { type: "string", description: "Customer's email address" },
              customerPhone: { type: "string", description: "Customer's phone number" },
              serviceId: { type: "string", description: "The service ID" },
              stylistId: { type: "string", description: "The stylist ID" },
              date: { type: "string", description: "Date in YYYY-MM-DD format" },
              time: { type: "string", description: "Time in HH:MM 24-hour format" },
              notes: { type: "string", description: "Optional booking notes" },
            },
            required: ["customerName", "customerEmail", "serviceId", "stylistId", "date", "time"],
          },
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages as any,
        temperature: 0.7,
        max_completion_tokens: 500,
        functions: functions as any,
        function_call: "auto",
      });

      const responseMessage = completion.choices[0]?.message;

      // Check if AI wants to call a function
      if (responseMessage?.function_call) {
        const functionName = responseMessage.function_call.name;
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);

        console.log(`[AI FUNCTION CALL] ${functionName}:`, JSON.stringify(functionArgs, null, 2));

        let functionResult: any = {};

        if (functionName === "check_availability") {
          // Call availability endpoint
          const availResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(functionArgs),
          });
          functionResult = await availResponse.json();
          console.log(`[AVAILABILITY RESULT]:`, JSON.stringify(functionResult, null, 2));
        } else if (functionName === "create_booking") {
          // Call guest booking endpoint
          console.log(`[CREATING BOOKING]:`, JSON.stringify(functionArgs, null, 2));
          const bookingResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/bookings/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(functionArgs),
          });
          functionResult = await bookingResponse.json();
          console.log(`[BOOKING RESULT]:`, JSON.stringify(functionResult, null, 2));
        }

        // Send function result back to AI for final response
        const secondCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            ...messages,
            responseMessage,
            {
              role: "function",
              name: functionName,
              content: JSON.stringify(functionResult),
            },
          ] as any,
          temperature: 0.7,
          max_completion_tokens: 500,
        });

        const finalResponse = secondCompletion.choices[0]?.message?.content || "Booking processed!";
        res.json({ response: finalResponse });
      } else {
        // No function call, just return the response
        const response = responseMessage?.content || "I'm sorry, I couldn't process that.";
        res.json({ response });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
