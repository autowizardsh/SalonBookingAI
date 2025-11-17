import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";

// This script seeds the production database with initial data
// Run it with: PROD_DATABASE_URL=your-production-url tsx server/seed-production.ts

async function seedProduction() {
  const productionDbUrl = process.env.PROD_DATABASE_URL;
  
  if (!productionDbUrl) {
    console.error("❌ Error: PROD_DATABASE_URL environment variable is required");
    console.log("\nUsage:");
    console.log("1. Go to Database pane in Replit");
    console.log("2. Click on Production Database");
    console.log("3. Copy the connection string (DATABASE_URL)");
    console.log("4. Run: PROD_DATABASE_URL='paste-url-here' tsx server/seed-production.ts");
    process.exit(1);
  }

  console.log("🔄 Connecting to production database...\n");

  const sql = neon(productionDbUrl);
  const db = drizzle(sql, { schema });

  try {
    // Insert Users
    console.log("📝 Inserting users...");
    await db.insert(schema.users).values([
      {
        id: '401950fd-455b-473d-9387-aab6edfe85ec',
        username: 'admin',
        password_hash: '$2b$10$wZR0OF0HnU4tCx8ADlw0M..LhctHKO.Tu4UAnbjTFXj4qjsQjwXyC',
        email: 'admin@salon.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        provider: 'local'
      },
      {
        id: '9e9f5558-e1e5-48cf-a549-a0d80a410d99',
        username: 'emma',
        password_hash: '$2b$10$Y7tzop2aBujzwPCSYzIRg.iWmevM9L4g2noCytMYOfKzEDwrgxRvi',
        email: 'emma@salon.com',
        firstName: 'Emma',
        lastName: 'Rodriguez',
        role: 'stylist',
        stylist_id: '2ad50aef-0970-47c3-bcbd-a6207a892bff',
        provider: 'local'
      },
      {
        id: 'cebfe12c-2e20-49b0-9108-4c69b4d5858e',
        username: 'sophia',
        password_hash: '$2b$10$KGhyOKCLzcJBJeRpZiB1qe2VHlmqDoKQFOOZ45GMqmZsPM8BB6/sC',
        email: 'sophia@salon.com',
        firstName: 'Sophia',
        lastName: 'Chen',
        role: 'stylist',
        stylist_id: 'd3b4d006-6490-447d-be49-7a79ea49c975',
        provider: 'local'
      },
      {
        id: '3b143cc9-0b48-40c6-a399-c03be94be596',
        username: 'isabella',
        password_hash: '$2b$10$COQ1f6W0OA0a96FMe8Br0Ote8FZG1hDKgyZrWyhq5IxSFZrNIQ8/O',
        email: 'isabella@salon.com',
        firstName: 'Isabella',
        lastName: 'Martinez',
        role: 'stylist',
        stylist_id: 'ede1b989-9980-4485-a80c-4a308eb1a899',
        provider: 'local'
      }
    ]).onConflictDoNothing();
    console.log("✅ Users inserted");

    // Insert Services
    console.log("📝 Inserting services...");
    await db.insert(schema.services).values([
      {
        id: 'c200e8a9-7637-402f-8ba3-b64ad640420e',
        name: 'Classic Haircut',
        description: 'A timeless cut tailored to your face shape and personal style',
        category: 'Haircut',
        duration: 45,
        price: 65
      },
      {
        id: '74be2588-70d5-4731-a9d8-1f85c01e93b3',
        name: 'Color & Highlights',
        description: 'Full color service or expertly placed highlights for dimension',
        category: 'Color',
        duration: 120,
        price: 150
      },
      {
        id: 'd2f9b6b5-803a-4c02-a44c-aa692aa35d10',
        name: 'Balayage',
        description: 'Hand-painted highlights for a natural, sun-kissed look',
        category: 'Color',
        duration: 180,
        price: 200
      },
      {
        id: '7fbc98a7-7695-4358-a8e9-82ac9cae5c36',
        name: 'Keratin Treatment',
        description: 'Smoothing treatment that reduces frizz and adds shine',
        category: 'Treatment',
        duration: 150,
        price: 250
      },
      {
        id: '0c200e24-35ca-47b0-8afe-56f63bb75566',
        name: 'Blowout & Style',
        description: 'Professional blowout for smooth, voluminous hair',
        category: 'Styling',
        duration: 60,
        price: 55
      },
      {
        id: 'bfe883c4-4a5c-470d-b65a-620168141ecd',
        name: 'Bridal Updo',
        description: 'Elegant updo styling for your special day',
        category: 'Special',
        duration: 90,
        price: 120
      }
    ]).onConflictDoNothing();
    console.log("✅ Services inserted");

    // Insert Stylists
    console.log("📝 Inserting stylists...");
    await db.insert(schema.stylists).values([
      {
        id: '2ad50aef-0970-47c3-bcbd-a6207a892bff',
        name: 'Emma Rodriguez',
        bio: 'Master stylist with a passion for creating personalized looks that enhance natural beauty',
        specialization: 'Color & Highlights',
        yearsExperience: 8,
        rating: 5
      },
      {
        id: 'd3b4d006-6490-447d-be49-7a79ea49c975',
        name: 'Sophia Chen',
        bio: 'Precision cutting specialist known for modern, sophisticated styles',
        specialization: 'Precision Cuts',
        yearsExperience: 6,
        rating: 5
      },
      {
        id: 'ede1b989-9980-4485-a80c-4a308eb1a899',
        name: 'Isabella Martinez',
        bio: 'Wedding and special event styling expert with an eye for elegant updos',
        specialization: 'Bridal & Events',
        yearsExperience: 10,
        rating: 5
      },
      {
        id: 'cbbf87a2-26ac-432f-aa93-b46568545557',
        name: 'Olivia Thompson',
        bio: 'Texture and treatment specialist focusing on hair health',
        specialization: 'Treatments',
        yearsExperience: 7,
        rating: 5
      }
    ]).onConflictDoNothing();
    console.log("✅ Stylists inserted");

    // Insert Schedules
    console.log("📝 Inserting schedules...");
    const schedules = [
      // Emma: Mon-Sat 9am-5pm
      ...Array.from({ length: 6 }, (_, i) => ({
        stylistId: '2ad50aef-0970-47c3-bcbd-a6207a892bff',
        dayOfWeek: i + 1,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true
      })),
      // Sophia: Mon-Sat 9am-7pm
      ...Array.from({ length: 6 }, (_, i) => ({
        stylistId: 'd3b4d006-6490-447d-be49-7a79ea49c975',
        dayOfWeek: i + 1,
        startTime: '09:00',
        endTime: '19:00',
        isAvailable: true
      })),
      // Isabella: Tue-Sat 10am-6pm
      ...Array.from({ length: 5 }, (_, i) => ({
        stylistId: 'ede1b989-9980-4485-a80c-4a308eb1a899',
        dayOfWeek: i + 2,
        startTime: '10:00',
        endTime: '18:00',
        isAvailable: true
      })),
      // Olivia: Mon-Fri 9am-5pm
      ...Array.from({ length: 5 }, (_, i) => ({
        stylistId: 'cbbf87a2-26ac-432f-aa93-b46568545557',
        dayOfWeek: i + 1,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true
      }))
    ];
    await db.insert(schema.schedules).values(schedules).onConflictDoNothing();
    console.log("✅ Schedules inserted");

    // Insert Stylist-Service relationships
    console.log("📝 Inserting stylist-service relationships...");
    await db.insert(schema.stylistServices).values([
      { stylistId: '2ad50aef-0970-47c3-bcbd-a6207a892bff', serviceId: '74be2588-70d5-4731-a9d8-1f85c01e93b3' },
      { stylistId: '2ad50aef-0970-47c3-bcbd-a6207a892bff', serviceId: 'd2f9b6b5-803a-4c02-a44c-aa692aa35d10' },
      { stylistId: 'd3b4d006-6490-447d-be49-7a79ea49c975', serviceId: 'd2f9b6b5-803a-4c02-a44c-aa692aa35d10' },
      { stylistId: 'd3b4d006-6490-447d-be49-7a79ea49c975', serviceId: 'c200e8a9-7637-402f-8ba3-b64ad640420e' },
      { stylistId: 'd3b4d006-6490-447d-be49-7a79ea49c975', serviceId: '0c200e24-35ca-47b0-8afe-56f63bb75566' },
      { stylistId: 'ede1b989-9980-4485-a80c-4a308eb1a899', serviceId: 'bfe883c4-4a5c-470d-b65a-620168141ecd' },
      { stylistId: 'ede1b989-9980-4485-a80c-4a308eb1a899', serviceId: '0c200e24-35ca-47b0-8afe-56f63bb75566' },
      { stylistId: 'cbbf87a2-26ac-432f-aa93-b46568545557', serviceId: '7fbc98a7-7695-4358-a8e9-82ac9cae5c36' },
      { stylistId: 'cbbf87a2-26ac-432f-aa93-b46568545557', serviceId: '0c200e24-35ca-47b0-8afe-56f63bb75566' }
    ]).onConflictDoNothing();
    console.log("✅ Stylist-service relationships inserted");

    console.log("\n🎉 Production database seeded successfully!");
    console.log("\n✅ Your production app now has:");
    console.log("   - Admin account (admin/admin)");
    console.log("   - 3 Stylist accounts (emma/emma, sophia/sophia, isabella/isabella)");
    console.log("   - 6 Services");
    console.log("   - 4 Stylists");
    console.log("   - 22 Schedules");
    console.log("   - 9 Stylist-service relationships");

  } catch (error: any) {
    console.error("\n❌ Error seeding database:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

seedProduction();
