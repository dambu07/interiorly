import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";
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
    params.workspaceId
  );

  if (subscriptionError || foldersError) return redirect("/dashboard");
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside className="hidden sm:flex max-w-sm w-full">
      <SidebarWorkspaces
        privateWorkspaces={privateWorkspaces}
        collaboratingWorkspaces={collaboratingWorkspaces}
        sharedWorkspaces={sharedWorkspaces}
        defaultValue={privateWorkspaces[0]}
      />
      <div
        className={cn(
          "hidden sm:flex sm:flex-col w-full shrink-0 md:gap-4 !justify-between flex-1",
          className
        )}
      >
        <div className="flex flex-col mx-4">
          <SelectedWorkspace defaultValue={privateWorkspaces[0]} />
          <PlanUsage
            foldersLength={workspaceFolderData?.length || 0}
            subscription={subscriptionData}
          />
          <NativeNavigation myWorkspaceId={params.workspaceId} />
          <ScrollArea
            className="overflow-hidden relative
          h-full 
        "
          >
            <FoldersDropdownList
              workspaceFolders={workspaceFolderData || []}
              workspaceId={params.workspaceId}
            />
          </ScrollArea>
        </div>
        <UserCard subscription={subscriptionData} />
      </div>
    </aside>
  );
};

export default Sidebar;
