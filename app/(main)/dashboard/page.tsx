import React from "react";
import Onboarding from "@/components/onboarding/onboarding";
import { notFound, redirect } from "next/navigation";
import { useAppState } from "@/lib/provider/state-provider";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { workspace } from "@/lib/supabase/supabase.types";
import db from "@/lib/supabase/db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getUserSubscriptionStatus } from "@/lib/supabase/queries";

async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const workspace = await db.query.workspaces.findFirst({
    //@ts-ignore
    where: (workspace: workspace, { eq }: { eq: any }) =>
      eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

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
