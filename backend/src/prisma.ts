import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const rawDatabaseUrl = process.env.DATABASE_URL;

if (!rawDatabaseUrl) {
	throw new Error("DATABASE_URL is not set");
}

const dbUrl = new URL(rawDatabaseUrl);
const sslMode = dbUrl.searchParams.get("sslmode");

// Keep the current strict TLS behavior explicit to avoid pg v9 semantic changes.
if (!sslMode || sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
	dbUrl.searchParams.set("sslmode", "verify-full");
}

const connectionString = dbUrl.toString();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };