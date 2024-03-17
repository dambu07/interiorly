"use client";
import { Subscription, workspace } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/provider/state-provider";
import { MAX_FOLDERS_FREE_PLAN } from "@/config/constants";

interface PlanUsageProps {
  foldersLength: number;
  subscription: Subscription | null;
}

const PlanUsage: React.FC<PlanUsageProps> = ({
  foldersLength,
  subscription,
}) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateFoldersLength = state.workspaces.find(
      (workspace: workspace) => workspace.id === workspaceId
    )?.folders.length;
    if (stateFoldersLength === undefined) return;
    setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);
  }, [state, workspaceId]);

  return (
    <article className="w-full flex flex-col items-center justify-center">
      {subscription?.status !== "active" && (
        <div
          className="flex 
          gap-2
          text-muted-foreground
          mb-2
          items-center
        "
        >
          <div
            className="flex 
        justify-between 
        w-full 
        items-center
        "
          >
            <div>💎 Free Plan&nbsp;</div>
            {usagePercentage.toFixed(0)}% / 100%
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} fill="bg-primary" className="h-1" />
      )}
    </article>
  );
};

export default PlanUsage;
