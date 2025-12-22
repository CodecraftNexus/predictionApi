"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOrigins = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const Env = zod_1.z.object({
    FORCE_SYNC: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(5000),
    TIMEZONE: zod_1.z.string().default("+05:30"),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string().min(32),
    ACCESS_TOKEN_EXPIRES_IN: zod_1.z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default("7d"),
    CORS_ORIGINS: zod_1.z.string().default("*"),
    base_Url: zod_1.z.string(),
    BCRYPT_ROUNDS: zod_1.z.coerce.number().min(8).max(14).default(12),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    planetHouseApiUrl: zod_1.z.string(),
    mahadashaApiUrl: zod_1.z.string(),
    antharDashaApiUrl: zod_1.z.string(),
    predictionApiUrl: zod_1.z.string(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    navamApi: zod_1.z.string(),
    astrologic: zod_1.z.string(),
    DB_SSL: zod_1.z.string(),
    PAYHERE_SANDBOX: zod_1.z.string(),
    PAYHERE_MERCHANT_SECRET: zod_1.z.string(),
    PAYHERE_MERCHANT_ID: zod_1.z.string(),
});
exports.env = Env.parse(process.env);
exports.corsOrigins = exports.env.CORS_ORIGINS.split(",").map((s) => s.trim());
