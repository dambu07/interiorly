import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/migrations/schema";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.log("🔴 No database URL");
  process.exit(1);
}

declare module global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient;

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    global.postgresSqlClient = postgres(DATABASE_URL, {
      max: 3,
      prepare: false,
    });
  }
  postgresSqlClient = global.postgresSqlClient;
} else {
  postgresSqlClient = postgres(DATABASE_URL, { max: 3, prepare: false });
}

const db = drizzle(postgresSqlClient, { schema });
export default db;
