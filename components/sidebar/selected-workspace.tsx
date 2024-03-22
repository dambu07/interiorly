"use client";

import { useAppState } from "@/lib/provider/state-provider";
import { workspace } from "@/lib/supabase/supabase.types";
import { int } from "drizzle-orm/mysql-core";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

interface SelectedWorkspaceProps {
  defaultValue: workspace;
}

const SelectedWorkspace = ({ defaultValue }: SelectedWorkspaceProps) => {
  const { state, workspaceId } = useAppState();

  const workspace = state.workspaces.find(
    (workspace) => workspace.id === workspaceId
  );

  if (!workspace) return null;

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        redirect(`/dashboard/${workspace.id}`);
      }}
      className="flex items-center text-center justify-center py-7 gap-1 font-semibold w-full space-x-3"
    >
      <Avatar>
        <AvatarImage
          src={workspace.logoUrl ?? ""}
          alt={workspace.title}
          className="rounded-full border "
        />
        <AvatarFallback className="bg-primary/10">
          {getInitials(workspace.title)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p
          className="text-lg 
        overflow-hidden 
        overflow-ellipsis 
        whitespace-nowrap"
        >
          {workspace.title}
        </p>
      </div>
    </Link>
  );
};

export default SelectedWorkspace;
