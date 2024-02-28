import { z } from "zod";

export const UserRegisterSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email" }),
    displayName: z
      .string()
      .min(3, { message: "Display name must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password cannot exceed 32 characters" }),
    passwordConfirmation: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, { message: "Password cannot exceed 32 characters" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })
  .refine((data) => data.password.length > 8, {
    message: "Password must be at least 8 characters",
  });

export const UserAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserLogoutSchema = z.object({
  redirectTo: z.string().optional(),
});

export const UserAuthSchemaMagicLink = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const UserOAuthSchema = z.object({
  provider: z.union([
    z.literal("github"),
    z.literal("google"),
    z.literal("discord"),
  ]),
  callbackUrl: z.string().optional(),
});
