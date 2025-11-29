// schemas/profileSchemas.ts
import { z } from "zod";

const latLngSchema = z.union([
  z.number(),
  z.string().regex(/^-?\d*\.?\d+$/).transform(Number), // "8.0438335" → 8.0438335
]);

export const updateProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),

  birthTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Invalid time (HH:MM or HH:MM:SS)")
    .optional()
    .or(z.literal("")),

  latitude: latLngSchema
    .refine((val) => val >= -90 && val <= 90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: latLngSchema
    .refine((val) => val >= -180 && val <= 180, "Longitude must be between -180 and 180")
    .optional(),

  birthLocation: z.string().max(255).optional().or(z.literal("")),

  gender: z.enum(["Male", "Female", "Other", ""]).optional(),

  whatsappNumber: z
    .string()
    .regex(/^[\+]?[0-9]{10,15}$/, "Invalid WhatsApp number")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;