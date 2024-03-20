import { notFound, redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserNameForm } from "@/components/dashboard/user-settings-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { findUser } from "@/lib/supabase/queries";
import { UserAvatarForm } from "@/components/dashboard/user-settings-avatar";

export const metadata = {
  title: "Settings - Account",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase.auth.getUser();
  if (!data || error) return notFound();

  const user = await findUser(data.user.id);
  if (!user) return notFound();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm user={user} />
        <UserAvatarForm user={user} />
      </div>
    </DashboardShell>
  );
}
