"use client";

import { useAppState } from "@/lib/provider/state-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { use, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import PlanUsage from "@/components/sidebar/plan-usage";
import NativeNavigation from "@/components/sidebar/native-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import FoldersDropdownList from "@/components/sidebar/folders";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import UserCard from "@/components/sidebar/user-card";
import { findUser } from "@/lib/supabase/queries";

const SelectedWorkspace = () => {
  const { state, workspaceId } = useAppState();
  const { subscription, user } = useSupabaseUser();
  if (!workspaceId || !user) return null;

  const workspace = state.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );

  console.log(workspace);
  if (!workspace) return null;

  return (
    <>
      <div className="mx-4 flex flex-col">
        <Link
          href={`/dashboard/${workspace.id}`}
          onClick={() => {
            redirect(`/dashboard/${workspace.id}`);
          }}
          className="flex w-full items-center justify-center gap-1 space-x-3 py-7 text-center font-semibold"
        >
          <Avatar>
            <AvatarImage
              src={workspace.logoUrl ?? ""}
              alt={workspace.title}
              className="rounded-full border"
            />
            <AvatarFallback className="bg-primary/10">
              {getInitials(workspace.title)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg">
              {workspace.title}
            </p>
          </div>
        </Link>
        <PlanUsage
          foldersLength={workspace.folders.length}
          subscription={subscription}
        />
        <NativeNavigation myWorkspaceId={workspaceId} />
        <ScrollArea className="relative h-full overflow-hidden">
          <FoldersDropdownList
            workspaceFolders={workspace.folders}
            workspaceId={workspaceId}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default SelectedWorkspace;
