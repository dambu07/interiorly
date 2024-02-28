import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/migrations/schema";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.log("🔴 No database URL");
}

const client = postgres(DATABASE_URL as string);
const db = drizzle(client, { schema });

export default db;
