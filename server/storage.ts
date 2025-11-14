import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users,
  services,
  stylists,
  schedules,
  bookings,
  stylistServices,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Stylist,
  type InsertStylist,
  type Schedule,
  type InsertSchedule,
  type Booking,
  type InsertBooking,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined>;
  getAllCustomers(): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  getUserByStylistId(stylistId: string): Promise<User | undefined>;

  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<void>;

  // Stylists
  getAllStylists(): Promise<Stylist[]>;
  getStylist(id: string): Promise<Stylist | undefined>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  updateStylist(id: string, stylist: Partial<InsertStylist>): Promise<Stylist | undefined>;
  deleteStylist(id: string): Promise<void>;

  // Schedules
  getStylistSchedules(stylistId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  deleteSchedule(id: string): Promise<void>;

  // Bookings
  getAllBookings(): Promise<Booking[]>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getStylistBookings(stylistId: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<void>;
  getStylistBookingsOnDate(stylistId: string, date: string): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existing = user.email ? await this.getUserByEmail(user.email) : undefined;
    
    if (existing) {
      const [updated] = await db
        .update(users)
        .set({
          ...user,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getAllCustomers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "customer"));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getUserByStylistId(stylistId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.stylistId, stylistId));
    return result[0];
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getService(id: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Stylists
  async getAllStylists(): Promise<Stylist[]> {
    return await db.select().from(stylists);
  }

  async getStylist(id: string): Promise<Stylist | undefined> {
    const result = await db.select().from(stylists).where(eq(stylists.id, id));
    return result[0];
  }

  async createStylist(stylist: InsertStylist): Promise<Stylist> {
    const [created] = await db.insert(stylists).values(stylist).returning();
    return created;
  }

  async updateStylist(id: string, stylist: Partial<InsertStylist>): Promise<Stylist | undefined> {
    const [updated] = await db
      .update(stylists)
      .set(stylist)
      .where(eq(stylists.id, id))
      .returning();
    return updated;
  }

  async deleteStylist(id: string): Promise<void> {
    await db.delete(stylists).where(eq(stylists.id, id));
  }

  // Schedules
  async getStylistSchedules(stylistId: string): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.stylistId, stylistId));
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [created] = await db.insert(schedules).values(schedule).returning();
    return created;
  }

  async deleteSchedule(id: string): Promise<void> {
    await db.delete(schedules).where(eq(schedules.id, id));
  }

  // Bookings
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getStylistBookings(stylistId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.stylistId, stylistId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updated;
  }

  async deleteBooking(id: string): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  async getStylistBookingsOnDate(stylistId: string, date: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.stylistId, stylistId),
          eq(bookings.date, date)
        )
      );
  }
}

export const storage = new DatabaseStorage();
