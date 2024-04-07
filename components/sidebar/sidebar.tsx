import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import SidebarWorkspaces from "@/components/sidebar/workspaces";
import FoldersDropdownList from "@/components/sidebar/folders";
import PlanUsage from "@/components/sidebar/plan-usage";
import NativeNavigation from "@/components/sidebar/native-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectedWorkspace from "./selected-workspace";
import UserCard from "@/components/sidebar/user-card";

interface SidebarProps {
  params: {
    workspaceId: string;
  };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId,
  );

  console.log(subscriptionError, foldersError);

  if (subscriptionError) return redirect("/dashboard");
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside className="hidden w-full max-w-sm sm:flex">
      <SidebarWorkspaces
        privateWorkspaces={privateWorkspaces}
        collaboratingWorkspaces={collaboratingWorkspaces}
        sharedWorkspaces={sharedWorkspaces}
        defaultValue={privateWorkspaces[0]}
      />
      <div
        className={cn(
          "hidden w-full flex-1 shrink-0 !justify-between bg-secondary/25 sm:flex sm:flex-col md:gap-4",
          className,
        )}
      >
        <SelectedWorkspace />
        <UserCard subscription={subscriptionData} userId={user.id} />
      </div>
    </aside>
  );
};

export default Sidebar;
