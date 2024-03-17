import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { findUser, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import db from "@/lib/supabase/db";
import Onboarding from "@/components/onboarding/onboarding";
import { notFound, redirect } from "next/navigation";

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

  console.log(workspace, workspace?.workspaceOwner, authUser.id);

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
