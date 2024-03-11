"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { OnboardingSchema } from "../validations/onboarding";
import { completeOnboarding, createWorkspace } from "../supabase/queries";
import { v4 } from "uuid";
import { workspace } from "../supabase/supabase.types";

export async function actionCompleteOnboarding(formData: FormData) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { error: "No user found" };

  const data = Object.fromEntries(formData.entries());
  const validatedData = OnboardingSchema.parse(data);
  const {
    avatar,
    workspaceLogo,
    workspaceBanner,
    workspaceName,
    workspaceDescription,
  } = validatedData;

  console.log(validatedData);

  if (avatar) {
    await supabase.storage.from("avatars").upload(user.id, avatar, {
      upsert: true,
    });
  }

  let workspaceLogoPath = null;
  let workspaceBannerPath = null;

  if (workspaceLogo) {
    const fileUUID = v4();
    try {
      const { data, error } = await supabase.storage
        .from("workspace-logos")
        .upload(`workspaceLogo_${fileUUID}`, workspaceLogo, { upsert: true });

      if (error) throw new Error(error.message);
      workspaceLogoPath = data.path;
    } catch (error) {
      console.error(error);
    }
  }

  if (workspaceBanner) {
    const fileUUID = v4();
    try {
      const { data, error } = await supabase.storage
        .from("workspace-banner")
        .upload(`workspaceBanner_${fileUUID}`, workspaceBanner, {
          upsert: true,
        });

      if (error) throw new Error(error.message);
      workspaceBannerPath = data.path;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const workspaceUUID = v4();
    const workspace: workspace = {
      data: null,
      createdAt: new Date().toISOString(),
      iconId: "💼",
      id: workspaceUUID,
      inTrash: "",
      title: workspaceName,
      logoUrl: workspaceLogo ? workspaceLogoPath : null,
      bannerUrl: workspaceBanner ? workspaceBannerPath : null,
      workspaceOwner: user.id,
    };

    const { data, error } = await createWorkspace(workspace);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(error);
  }

  let avatarPath;

  if (avatar) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`avatar_${user.id}`, avatar, { upsert: true });

      if (error) throw new Error(error.message);
      avatarPath = data.path;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const { error } = await completeOnboarding(
      user.id,
      validatedData,
      avatarPath
    );
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(error);
  }
}
