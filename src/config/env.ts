import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();


const Env = z.object({
  FORCE_SYNC: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  TIMEZONE: z.string().default("+05:30"),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  JWT_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGINS: z.string().default("*"),
  base_Url : z.string(),
  BCRYPT_ROUNDS: z.coerce.number().min(8).max(14).default(12),
  GOOGLE_CLIENT_ID : z.string(),
  planetHouseApiUrl : z.string(),
  mahadashaApiUrl : z.string(),
  antharDashaApiUrl : z.string(),
  predictionApiUrl : z.string(),
});

export const env = Env.parse(process.env);
export const corsOrigins : ReadonlyArray<string> = env.CORS_ORIGINS.split(",").map((s) => s.trim());

