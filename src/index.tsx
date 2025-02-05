import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

async function main() {
	const client = postgres(process.env.DATABASE_URL);
	const db = drizzle(client);
}
main();
