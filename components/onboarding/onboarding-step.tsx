"use client";

import { AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
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
import { z } from "zod";
import EmojiPicker from "@/components/emoji-picker";
import { User } from "@/lib/supabase/supabase.types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface OnboardingStepProps {
  user: User;
  stepNumber: number;
  stepCount: number;
  title: string;
  description: string;
  component: React.ReactNode;
  onSubmit: () => void;
}

export function OnboardingStep({
  user,
  stepNumber,
  stepCount,
  title,
  description,
  component,
  onSubmit,
}: OnboardingStepProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const p = Math.floor((stepNumber / (stepCount - 1)) * 100);

    setProgress(p + 0.5 * p);
  }, [stepNumber, stepCount]);

  return (
    <div className="flex flex-col space-y-10 rounded-md w-full container max-w-2xl my-20 border">
      <div className="text-2xl font-semibold text-center">Interiorly AI</div>
      <div className="relative w-full mx-auto border">
        <Progress
          value={progress}
          fill="bg-primary"
          className="absolute left-0 top-4 h-0.5 w-full bg-secondary"
        />
        <ul className="relative flex w-full justify-between">
          {[...Array(stepCount)].map((_, index) => (
            <li className="text-left" key={index}>
              <div>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white",
                    index <= stepNumber ? "bg-primary" : "bg-secondary"
                  )}
                >
                  {index + 1}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col text-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <p
          className="text-muted-foreground
        "
        >
          {description}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center space-y-5">
        {component}
        <Button
          onClick={onSubmit}
          variant={"default"}
          className="w-full max-w-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
