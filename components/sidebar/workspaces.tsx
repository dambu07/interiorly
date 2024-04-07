"use client";

import { workspace } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { IconMessage, IconPlus } from "../icons";
import { Separator } from "@/components/ui/separator";
import { useAppState } from "@/lib/provider/state-provider";
import Link from "next/link";
import CustomDialogTrigger from "@/components/custom-dialog-trigger";
import WorkspaceCreator from "@/components/workspace-creator";
import { ModeToggle } from "../mode-toggle";

interface SidebarWorkspacesProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
}

const SidebarWorkspaces: React.FC<SidebarWorkspacesProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}) => {
  const { state, dispatch, workspaceId } = useAppState();
  const [selectedWorkspace, setSelectedWorkspace] = useState<
    workspace | undefined
  >(defaultValue);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces]);

  useEffect(() => {
    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultValue?.id,
    );
    if (findSelectedWorkspace) setSelectedWorkspace(findSelectedWorkspace);
  }, [state, defaultValue]);

  const workspaces = [
    ...sharedWorkspaces,
    ...privateWorkspaces,
    ...collaboratingWorkspaces,
  ];

  return (
    <div className="flex h-full flex-col items-center bg-secondary/10 text-secondary-foreground">
      <Avatar className="h-16 w-16 cursor-pointer p-2">
        <AvatarFallback className="bg-primary/10">
          <IconMessage className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <Separator className="my-2 h-0.5 w-8" />
      {workspaces.map((workspace) => (
        <Link key={workspace.id} href={`/dashboard/${workspace.id}`}>
          <Avatar className="h-16 w-16 cursor-pointer p-2">
            <AvatarImage
              src={workspace.logoUrl ?? ""}
              alt={workspace.title}
              className="rounded-full border"
            />
            <AvatarFallback className="bg-primary/10">
              {getInitials(workspace.title)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ))}
      <CustomDialogTrigger
        header="Create A Workspace"
        content={<WorkspaceCreator />}
        description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
      >
        <Avatar className="h-16 w-16 cursor-pointer rounded-full p-2">
          <AvatarFallback className="bg-primary/10">
            <IconPlus className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      </CustomDialogTrigger>
    </div>
  );
};

export default SidebarWorkspaces;
