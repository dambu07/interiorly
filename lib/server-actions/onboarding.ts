"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { OnboardingSchema } from "../validations/onboarding";
import {
  createWorkspace,
  updateAvatarUrl,
  updateDisplayName,
} from "../supabase/queries";
import { workspace } from "../supabase/supabase.types";
import { v4 } from "uuid";

export async function actionCompleteOnboarding(formData: FormData) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: "No user found" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = OnboardingSchema.parse(data);
  const { avatar, workspaceLogo, workspaceBanner, workspaceName } =
    validatedData;

  let workspaceLogoPath = null;
  let workspaceBannerPath = null;

  if (workspaceLogo) {
    try {
      const fileUUID = v4();
      const { data, error } = await supabase.storage
        .from("workspace-logos")
        .upload(`workspace-logo_${fileUUID}`, workspaceLogo, { upsert: true });

      if (error) throw new Error(error.message);

      const workspaceLogoURL = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(data.path).data.publicUrl;
      workspaceLogoPath = workspaceLogoURL;
    } catch (error) {
      console.log(error);
    }
  }

  if (workspaceBanner) {
    try {
      const fileUUID = v4();
      const { data, error } = await supabase.storage
        .from("workspace-banners")
        .upload(`workspace-banner_${fileUUID}`, workspaceBanner, {
          upsert: true,
        });

      if (error) throw new Error(error.message);

      const workspaceBannerURL = supabase.storage
        .from("workspace-banners")
        .getPublicUrl(data.path).data.publicUrl;
      workspaceBannerPath = workspaceBannerURL;
    } catch (error) {
      console.log(error);
    }
  }

  let workspaceData;

  try {
    const workspaceUUID = v4();
    console.log(
      workspaceUUID,
      workspaceName,
      workspaceLogoPath,
      workspaceBannerPath
    );
    const workspace: workspace = {
      data: null,
      createdAt: new Date().toISOString(),
      iconId: "💼",
      id: workspaceUUID,
      inTrash: "",
      title: workspaceName,
      logoUrl: workspaceLogoPath,
      bannerUrl: workspaceBannerPath,
      workspaceOwner: user.id,
    };

    const { data: _workspaceData, error: workspaceError } =
      await createWorkspace(workspace);

    console.log(_workspaceData, workspaceError);

    workspaceData = _workspaceData;

    if (workspaceError) throw new Error(workspaceError);
  } catch (error) {
    console.log(error);
  }

  let avatarPath;

  if (avatar) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`avatar_${user.id}`, avatar, { upsert: true });

    if (error) throw new Error(error.message);
    console.log(data);

    const avatarPathURL = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path).data.publicUrl;
    avatarPath = avatarPathURL;
  }

  if (avatarPath) {
    try {
      await updateAvatarUrl(user.id, avatarPath);
    } catch (error) {
      console.log(error);
    }
  }

  try {
    await updateDisplayName(user.id, validatedData.displayName);
  } catch (error) {
    console.log(error);
  }

  return { data: workspaceData };
}
