import { IconUser, IconUsers } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import {
  OnboardingWorkspaceCollaboration,
  WorkspaceCollaboration,
} from "@/types";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import * as Icons from "@/components/icons";

interface OnboardingStepCollaborationProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
  collaborationType: WorkspaceCollaboration;
  setCollaborationType: (type: WorkspaceCollaboration) => void;
}

const collaborationOptions: OnboardingWorkspaceCollaboration[] = [
  {
    collaborationType: "individual",
    icon: "IconUser",
    title: "For Myself",
    description: "Write better. Think more clearly. Stay organized.",
  },
  {
    collaborationType: "team",
    icon: "IconUsers",
    title: "With my team",
    description: "Stay in sync with your team and collaborate in real-time",
  },
];

function OnboardingStepCollaboration({
  form,
  collaborationType,
  setCollaborationType,
}: OnboardingStepCollaborationProps) {
  const handleCollaborationTypeChange = (type: WorkspaceCollaboration) => {
    setCollaborationType(type);
    form.setValue("workspaceType", type);
  };

  return (
    <div className="flex space-x-5">
      {collaborationOptions.map(
        ({ collaborationType: ct, title, description, icon }, index) => {
          const Icon = Icons[icon];
          return (
            <Card
              key={index}
              className={cn(
                "container flex flex-col h-full py-10 space-y-1 hover:cursor-pointer",
                ct === collaborationType && "border-primary text-primary"
              )}
              onClick={() => handleCollaborationTypeChange(ct)}
            >
              <Icon className="w-7 h-7" />
              <div className="text-xl font-bold">{title}</div>
              <span className="text-muted-foreground">{description}</span>
            </Card>
          );
        }
      )}
    </div>
  );
}

export default OnboardingStepCollaboration;
