import { z } from "zod";

export const OnboardingSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters" }),
  fullName: z
    .string()
    .min(1, { message: "Please enter your full name" })
    .max(100, { message: "Your name cannot exceed 100 characters" }),
  workspaceName: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters" }),
  workspaceEmoji: z.string().min(1, { message: "Please select an emoji" }),
  workspaceDescription: z.string().min(0).max(100, {
    message: "Workspace description cannot exceed 100 characters",
  }),
  workspaceType: z.union([
    z.literal("personal"),
    z.literal("team"),
    z.literal("organization"),
  ]),
});
