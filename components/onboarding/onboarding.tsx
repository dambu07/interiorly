"use client";

import { AuthUser } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { CreateWorkspaceSchema } from "@/lib/validations/workspace";
import { set, typeToFlattenedError, z } from "zod";
import EmojiPicker from "@/components/emoji-picker";
import { User } from "@/lib/supabase/supabase.types";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import type { OnboardingStep as OnboardinStepType } from "@/types";
import { Button } from "../ui/button";

interface OnboardingProps {
  user: User;
  subscription: {} | null;
}

export default function Onboarding({ user, subscription }: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const onboardingSteps: OnboardinStepType[] = [
    {
      title: "Create a workspace",
      description: "Create a workspace to get started",
      component: <div>Component 1</div>,
      onSubmit: () => setCurrentPage(currentPage + 1),
    },
    {
      title: "Invite your team",
      description: "Invite your team to collaborate",
      component: <div>Component 2</div>,
      onSubmit: () => setCurrentPage(currentPage + 1),
    },
    {
      title: "Start collaborating",
      description: "Start collaborating with your team",
      component: <div>Component 3</div>,
      onSubmit: () => setCurrentPage(currentPage + 1),
    },
    {
      title: "Get help",
      description: "Get help from our support team",
      component: <div>Component 4</div>,
      onSubmit: () => setCurrentPage(0),
    },
  ];

  const currentStep = onboardingSteps[currentPage];

  return (
    <div className="border border-blue-500 w-full h-full">
      <div>
        <OnboardingStep
          title={currentStep.title}
          description={currentStep.description}
          component={currentStep.component}
          stepNumber={currentPage}
          stepCount={onboardingSteps.length}
          user={user}
          onSubmit={currentStep.onSubmit}
        />
      </div>
    </div>
  );
}
