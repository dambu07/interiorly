"use client";

import { useAppState } from "@/lib/provider/state-provider";
import { workspace } from "@/lib/supabase/supabase.types";
import { int } from "drizzle-orm/mysql-core";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

interface SelectedWorkspaceProps {
  defaultValue: workspace;
}

const SelectedWorkspace = ({ defaultValue }: SelectedWorkspaceProps) => {
  const { state } = useAppState();

  const workspace = state.workspaces.find(
    (workspace) => workspace.id === defaultValue.id
  );

  if (!workspace) return null;

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        redirect(`/dashboard/${workspace.id}`);
      }}
      className="flex items-center justify-center py-5 gap-3 font-semibold w-full "
    >
      {workspace.logoUrl && (
        <Image
          src={workspace.logoUrl}
          alt="workspace logo"
          width={32}
          height={32}
          objectFit="cover"
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        <p
          className="text-lg 
        w-[170px] 
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
