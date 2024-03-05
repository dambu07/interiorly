import { IconUser, IconUsers } from "@/components/icons";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface OnboardingStepCollaborationProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
  collaborationType: "individual" | "team";
  setCollaborationType: (type: "individual" | "team") => void;
}

function OnboardingStepCollaboration({
  form,
  collaborationType,
  setCollaborationType,
}: OnboardingStepCollaborationProps) {
  const handleCollaborationTypeChange = (type: "individual" | "team") => {
    setCollaborationType(type);
    form.setValue("workspaceType", type);
  };

  return (
    <div className="flex space-x-5">
      <Card
        className={cn(
          "container flex flex-col h-full py-10 space-y-1 hover:cursor-pointer",
          collaborationType === "individual" && "border-primary text-primary"
        )}
        onClick={() => handleCollaborationTypeChange("individual")}
      >
        <IconUser className="w-8 h-8" />
        <div className="text-xl font-bold text-secondary-foreground">
          For Myself
        </div>
        <span className="text-muted-foreground">
          Write better. Think more clearly. Stay organized.
        </span>
      </Card>
      <Card
        className={cn(
          "container flex flex-col h-full py-10 space-y-1 hover:cursor-pointer",
          collaborationType === "team" && "border-primary text-primary"
        )}
        onClick={() => handleCollaborationTypeChange("team")}
      >
        <IconUsers className="w-8 h-8" />
        <div className="text-xl font-bold text-secondary-foreground">
          With my team
        </div>
        <span className="text-muted-foreground">
          Stay in sync with your team and collaborate in real-time
        </span>
      </Card>
    </div>
  );
}

export default OnboardingStepCollaboration;
