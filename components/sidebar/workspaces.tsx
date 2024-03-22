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
  const { state, dispatch } = useAppState();
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
      (workspace) => workspace.id === defaultValue?.id
    );
    if (findSelectedWorkspace) setSelectedWorkspace(findSelectedWorkspace);
  }, [state, defaultValue]);

  const workspaces = [
    ...sharedWorkspaces,
    ...privateWorkspaces,
    ...collaboratingWorkspaces,
  ];

  return (
    <div className="flex flex-col items-center h-full bg-secondary-foreground/5 text-secondary-foreground">
      <Avatar className="w-16 h-16 p-2 cursor-pointer">
        <AvatarFallback className="bg-primary/10">
          <IconMessage className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <Separator className="w-8 h-0.5 my-2" />
      {workspaces.map((workspace) => (
        <Link key={workspace.id} href={`/dashboard/${workspace.id}`}>
          <Avatar className="w-16 h-16 p-2 cursor-pointer">
            <AvatarImage
              src={workspace.logoUrl ?? ""}
              alt={workspace.title}
              className="rounded-full border "
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
        <Avatar className="w-16 h-16 p-2 cursor-pointer rounded-full">
          <AvatarFallback className="bg-primary/10">
            <IconPlus className="w-3 h-3" />
          </AvatarFallback>
        </Avatar>
      </CustomDialogTrigger>
    </div>
  );
};

export default SidebarWorkspaces;
