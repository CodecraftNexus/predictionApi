"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const latLngSchema = zod_1.z.union([
    zod_1.z.number(),
    zod_1.z.string().regex(/^-?\d*\.?\d+$/).transform(Number),
]);
exports.updateProfileSchema = zod_1.z.object({
    dateOfBirth: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .optional()
        .or(zod_1.z.literal("")),
    birthTime: zod_1.z
        .string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Invalid time (HH:MM or HH:MM:SS)")
        .optional()
        .or(zod_1.z.literal("")),
    latitude: latLngSchema
        .refine((val) => val >= -90 && val <= 90, "Latitude must be between -90 and 90")
        .optional(),
    longitude: latLngSchema
        .refine((val) => val >= -180 && val <= 180, "Longitude must be between -180 and 180")
        .optional(),
    birthLocation: zod_1.z.string().max(255).optional().or(zod_1.z.literal("")),
    gender: zod_1.z.enum(["Male", "Female", "Other", ""]).optional(),
    whatsappNumber: zod_1.z
        .string()
        .regex(/^[\+]?[0-9]{10,15}$/, "Invalid WhatsApp number")
        .optional()
        .or(zod_1.z.literal("")),
});
