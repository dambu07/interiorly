"use server";

import { z } from "zod";
import { UserProfileSchema } from "../validations/settings";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { updateAvatarUrl, updateDisplayName } from "../supabase/queries";
import { User } from "../supabase/supabase.types";

export async function actionUpdateProfile(
  user: User,
  { displayName, avatar }: z.infer<typeof UserProfileSchema>
) {
  const response = await updateDisplayName(user.id, displayName as string);
  return response;
}

export async function actionUpdateAvatar(data: FormData) {
  const avatar: File | null = data.get("avatar") as unknown as File;
  if (!avatar) return { error: "No avatar uploaded" };

  const supabase = createRouteHandlerClient({ cookies });
  const user = (await supabase.auth.getUser()).data.user;

  const response = await supabase.storage
    .from("avatars")
    .upload(`${user?.id}-avatar.png`, avatar, {
      cacheControl: "3600",
      upsert: true,
    });

  const _publicUrl = await supabase.storage
    .from("avatars")
    .getPublicUrl(`${user?.id}-avatar.png`);
  const publicUrl = _publicUrl.data.publicUrl;

  if (!publicUrl || !user?.id) return { error: "No public url or user id" };

  try {
    await updateAvatarUrl(user.id, publicUrl);
  } catch (err) {
    console.log(err);
  }

  return response;
}
