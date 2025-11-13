import { db } from "./db";
import { services, stylists, users } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create an admin user
  const adminEmail = "admin@elegance.com";
  const existingAdmin = await db.select().from(users).limit(1);
  
  if (existingAdmin.length === 0) {
    console.log("Creating admin user placeholder (will be replaced by actual user on first login)...");
  }

  // Seed services
  const sampleServices = [
    {
      name: "Classic Haircut",
      description: "A timeless cut tailored to your face shape and personal style",
      category: "Haircut",
      duration: 45,
      price: 65,
      imageUrl: "",
    },
    {
      name: "Color & Highlights",
      description: "Full color service or expertly placed highlights for dimension",
      category: "Color",
      duration: 120,
      price: 150,
      imageUrl: "",
    },
    {
      name: "Balayage",
      description: "Hand-painted highlights for a natural, sun-kissed look",
      category: "Color",
      duration: 180,
      price: 200,
      imageUrl: "",
    },
    {
      name: "Keratin Treatment",
      description: "Smoothing treatment that reduces frizz and adds shine",
      category: "Treatment",
      duration: 150,
      price: 250,
      imageUrl: "",
    },
    {
      name: "Blowout & Style",
      description: "Professional blowout for smooth, voluminous hair",
      category: "Styling",
      duration: 60,
      price: 55,
      imageUrl: "",
    },
    {
      name: "Bridal Updo",
      description: "Elegant updo styling for your special day",
      category: "Special",
      duration: 90,
      price: 120,
      imageUrl: "",
    },
  ];

  console.log("Seeding services...");
  for (const service of sampleServices) {
    await db.insert(services).values(service).onConflictDoNothing();
  }

  // Seed stylists
  const sampleStylists = [
    {
      name: "Emma Rodriguez",
      bio: "Passionate about creating personalized looks that enhance natural beauty. Specializing in modern cuts and vibrant color transformations.",
      specialization: "Color & Highlights",
      yearsExperience: 8,
      imageUrl: "",
      rating: 5,
    },
    {
      name: "Sophia Chen",
      bio: "Expert in precision cuts and balayage techniques. Committed to making every client feel confident and beautiful.",
      specialization: "Balayage & Cuts",
      yearsExperience: 12,
      imageUrl: "",
      rating: 5,
    },
    {
      name: "Isabella Martinez",
      bio: "Specializes in bridal styling and special occasion looks. Creating magical moments through beautiful hair.",
      specialization: "Bridal & Events",
      yearsExperience: 10,
      imageUrl: "",
      rating: 5,
    },
    {
      name: "Olivia Thompson",
      bio: "Master stylist with a passion for keratin treatments and hair health. Your hair's wellness is my priority.",
      specialization: "Treatments & Care",
      yearsExperience: 15,
      imageUrl: "",
      rating: 5,
    },
  ];

  console.log("Seeding stylists...");
  for (const stylist of sampleStylists) {
    await db.insert(stylists).values(stylist).onConflictDoNothing();
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
