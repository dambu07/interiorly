import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "@/lib/supabase/db";

const migrateDb = async () => {
  try {
    console.log("🟠 Migrating client");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("🟢 Successfully Migrated");
  } catch (error) {
    console.log("🔴 Error Migrating client", error);
  }
};
migrateDb();
