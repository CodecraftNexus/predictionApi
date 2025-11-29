import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string({ message: "Name is required" })
    .trim()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),

  username: z
    .string({ message: "Username is required" })
    .trim()
    .nonempty("Username is required")
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be 20 characters or less" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Only letters, numbers, underscore and hyphen are allowed",
    }),

  email: z
    .string({ message: "Email is required" })
    .trim()
    .nonempty("Email is required")
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string({ message: "Password is required" })
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
  Terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type RegisterRequestBody = z.infer<typeof registerSchema>;

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = registerSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    return res.status(400).json({
      success: false,
      error: "Validation failed",
    });
  }
};
