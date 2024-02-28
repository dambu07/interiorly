import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Your workspace name must have at least 3 characters" }),
  description: z.string(),
  iconId: z.string(),
  logoUrl: z.string(),
  bannerUrl: z.string(),
});
