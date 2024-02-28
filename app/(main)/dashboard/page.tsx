import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { buttonVariants } from "@/components/ui/button";
import { findUser, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import LogoutButton from "@/components/logoutButton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import db from "@/lib/supabase/db";
import WorkspaceOnboarding from "@/components/onboarding/workspace";
import { ModeToggle } from "@/components/mode-toggle";
import Onboarding from "@/components/onboarding/onboarding";

async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();
  if (error || !authUser) return notFound();

  const user = await findUser(authUser.id);
  if (!user) return notFound();

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, authUser.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  if (!workspace)
    return (
      <div
        className="bg-background
        h-screen
        w-screen
        flex
        flex-col
        gap-5
        justify-center
        items-center
  "
      >
        <Onboarding user={user} subscription={subscription} />
      </div>
    );

  return redirect(`/dashboard/${workspace.id}`);
}

export default DashboardPage;
