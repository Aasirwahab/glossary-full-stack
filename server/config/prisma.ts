import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;
// Append connection pool params if not already present
const pooledUrl = connectionString.includes("pgbouncer=true")
    ? connectionString
    : `${connectionString}${connectionString.includes("?") ? "&" : "?"}pgbouncer=true&connection_limit=20&pool_timeout=30`;

const adapter = new PrismaNeon({
    connectionString: pooledUrl,
});

export const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
