import { z } from "zod";

const MAX_FILE_SIZE = 5242880;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const OnboardingSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters" })
    .max(20, { message: "Display name cannot exceed 20 characters" }),
  fullName: z
    .string()
    .min(1, { message: "Your first name is required" })
    .max(100, { message: "Your name cannot exceed 100 characters" }),
  avatar: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  workspaceName: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters" }),
  workspaceEmoji: z.string().optional(),
  workspaceDescription: z.string().min(0).max(100, {
    message: "Workspace description cannot exceed 100 characters",
  }),
  workspaceLogo: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  workspaceBanner: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  workspaceBannerColor: z.string().optional(),
  workspaceType: z.union([
    z.literal("individual"),
    z.literal("team"),
    z.literal("organization"),
  ]),
});
