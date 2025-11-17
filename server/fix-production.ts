import { neon } from "@neondatabase/serverless";

const prodUrl = process.env.PROD_DATABASE_URL;

if (!prodUrl) {
  console.error("PROD_DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(prodUrl);

async function fixSchema() {
  console.log("🔧 Fixing production database schema...");
  
  try {
    // Ensure pgcrypto extension is enabled for gen_random_uuid()
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    console.log("✅ pgcrypto extension enabled");
    
    console.log("✅ Production database ready!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}

fixSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
