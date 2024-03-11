import { z } from "zod";
export const OnboardingSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters" })
    .max(20, { message: "Display name cannot exceed 20 characters" }),
  fullName: z
    .string()
    .min(1, { message: "Your first name is required" })
    .max(100, { message: "Your name cannot exceed 100 characters" }),
  avatar: z.any(),
  workspaceName: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters" }),
  workspaceEmoji: z.string().optional(),
  workspaceDescription: z.string().min(0).max(100, {
    message: "Workspace description cannot exceed 100 characters",
  }),
  workspaceLogo: z.any(),
  workspaceBanner: z.any(),
  workspaceBannerColor: z.string().optional(),
  workspaceType: z.union([
    z.literal("individual"),
    z.literal("team"),
    z.literal("organization"),
  ]),
});
