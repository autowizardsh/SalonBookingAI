import { db } from "./db";
import { users, services, stylists, schedules, stylistServices, bookings } from "@shared/schema";
import { sql } from "drizzle-orm";

async function exportData() {
  console.log("🔄 Exporting data from development database...\n");

  try {
    // Fetch all data
    const allUsers = await db.select().from(users);
    const allServices = await db.select().from(services);
    const allStylists = await db.select().from(stylists);
    const allSchedules = await db.select().from(schedules);
    const allStylistServices = await db.select().from(stylistServices);
    const allBookings = await db.select().from(bookings);

    console.log("📊 Found:");
    console.log(`  - ${allUsers.length} users`);
    console.log(`  - ${allServices.length} services`);
    console.log(`  - ${allStylists.length} stylists`);
    console.log(`  - ${allSchedules.length} schedules`);
    console.log(`  - ${allStylistServices.length} stylist-service relationships`);
    console.log(`  - ${allBookings.length} bookings`);
    console.log("\n📝 SQL INSERT statements:\n");
    console.log("-- Copy and paste the following SQL into your production database\n");
    console.log("-- =====================================================");
    console.log("-- PRODUCTION DATABASE IMPORT");
    console.log("-- =====================================================\n");

    // Users
    if (allUsers.length > 0) {
      console.log("-- Users (including admin accounts)");
      for (const user of allUsers) {
        const values = [
          `'${user.id}'`,
          user.replit_auth_id ? `'${user.replit_auth_id}'` : "NULL",
          user.username ? `'${user.username}'` : "NULL",
          user.password_hash ? `'${user.password_hash}'` : "NULL",
          user.email ? `'${user.email}'` : "NULL",
          user.firstName ? `'${user.firstName}'` : "NULL",
          user.lastName ? `'${user.lastName}'` : "NULL",
          user.phone ? `'${user.phone}'` : "NULL",
          user.role ? `'${user.role}'` : "NULL",
          user.stylist_id ? `'${user.stylist_id}'` : "NULL",
          user.provider ? `'${user.provider}'` : "NULL",
        ].join(", ");
        console.log(`INSERT INTO users (id, replit_auth_id, username, password_hash, email, first_name, last_name, phone, role, stylist_id, provider) VALUES (${values});`);
      }
      console.log();
    }

    // Services
    if (allServices.length > 0) {
      console.log("-- Services");
      for (const service of allServices) {
        const description = service.description ? service.description.replace(/'/g, "''") : "";
        const values = [
          `'${service.id}'`,
          `'${service.name.replace(/'/g, "''")}'`,
          `'${description}'`,
          service.category ? `'${service.category}'` : "NULL",
          service.duration.toString(),
          service.price.toString(),
          service.image ? `'${service.image}'` : "NULL",
        ].join(", ");
        console.log(`INSERT INTO services (id, name, description, category, duration, price, image) VALUES (${values});`);
      }
      console.log();
    }

    // Stylists
    if (allStylists.length > 0) {
      console.log("-- Stylists");
      for (const stylist of allStylists) {
        const bio = stylist.bio ? stylist.bio.replace(/'/g, "''") : "";
        const values = [
          `'${stylist.id}'`,
          `'${stylist.name.replace(/'/g, "''")}'`,
          `'${bio}'`,
          stylist.specialization ? `'${stylist.specialization.replace(/'/g, "''")}'` : "NULL",
          stylist.yearsExperience?.toString() || "NULL",
          stylist.rating?.toString() || "NULL",
          stylist.image ? `'${stylist.image}'` : "NULL",
        ].join(", ");
        console.log(`INSERT INTO stylists (id, name, bio, specialization, years_experience, rating, image) VALUES (${values});`);
      }
      console.log();
    }

    // Schedules
    if (allSchedules.length > 0) {
      console.log("-- Schedules");
      for (const schedule of allSchedules) {
        const values = [
          `'${schedule.id}'`,
          `'${schedule.stylistId}'`,
          schedule.dayOfWeek.toString(),
          `'${schedule.startTime}'`,
          `'${schedule.endTime}'`,
          schedule.isAvailable ? "TRUE" : "FALSE",
        ].join(", ");
        console.log(`INSERT INTO schedules (id, stylist_id, day_of_week, start_time, end_time, is_available) VALUES (${values});`);
      }
      console.log();
    }

    // Stylist Services
    if (allStylistServices.length > 0) {
      console.log("-- Stylist-Service Relationships");
      for (const ss of allStylistServices) {
        const values = [
          `'${ss.id}'`,
          `'${ss.stylistId}'`,
          `'${ss.serviceId}'`,
        ].join(", ");
        console.log(`INSERT INTO stylist_services (id, stylist_id, service_id) VALUES (${values});`);
      }
      console.log();
    }

    // Bookings (optional, may want to skip these)
    if (allBookings.length > 0) {
      console.log("-- Bookings (you may want to skip these if they're test bookings)");
      for (const booking of allBookings) {
        const notes = booking.notes ? booking.notes.replace(/'/g, "''") : "";
        const values = [
          `'${booking.id}'`,
          `'${booking.userId}'`,
          `'${booking.serviceId}'`,
          `'${booking.stylistId}'`,
          `'${booking.date}'`,
          `'${booking.time}'`,
          `'${booking.status}'`,
          `'${booking.customerName.replace(/'/g, "''")}'`,
          booking.customerEmail ? `'${booking.customerEmail}'` : "NULL",
          booking.customerPhone ? `'${booking.customerPhone}'` : "NULL",
          notes ? `'${notes}'` : "NULL",
        ].join(", ");
        console.log(`INSERT INTO bookings (id, user_id, service_id, stylist_id, date, time, status, customer_name, customer_email, customer_phone, notes) VALUES (${values});`);
      }
      console.log();
    }

    console.log("-- =====================================================");
    console.log("-- END OF IMPORT");
    console.log("-- =====================================================\n");
    console.log("✅ Export complete! Copy the SQL statements above.");
    console.log("\n📋 Next steps:");
    console.log("1. Go to the Database pane in Replit");
    console.log("2. Switch to 'Production' database");
    console.log("3. Paste and run the SQL statements above");
    console.log("4. Your production database will now have all the data!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    process.exit(1);
  }
}

exportData();
