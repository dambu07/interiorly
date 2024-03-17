import { z } from "zod";

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe("Banner Image"),
});
