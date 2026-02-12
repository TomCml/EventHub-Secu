import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg"
import { getEnvVariable } from "../../utility/utils";

const pool = new Pool({
    connectionString: getEnvVariable("DATABASE_URL")
})

export const prisma = new PrismaClient({
    adapter: new PrismaPg(pool)
});

//Merci Bocar
