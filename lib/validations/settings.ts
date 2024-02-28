import { z } from "zod";

export const UserProfileSchema = z.object({
  displayName: z.string().optional(),
  avatar: z.any().optional(),
});
