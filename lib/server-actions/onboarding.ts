"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { OnboardingSchema } from "../validations/onboarding";
import db from "../supabase/db";

export async function actionCompleteOnboarding(
  data: z.infer<typeof OnboardingSchema>
) {
  console.log(data);

  //   const supabase = createRouteHandlerClient({ cookies });
  //   const user = (await supabase.auth.getUser()).data.user;
  //   if (!user) return { error: "No user found" };
}
