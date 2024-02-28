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
  submitButtonText?: string;
  onSubmit: () => void;
  setCurrentPage: (page: number) => void;
}

export function OnboardingStep({
  user,
  stepNumber,
  stepCount,
  title,
  description,
  component,
  submitButtonText,
  onSubmit,
  setCurrentPage,
}: OnboardingStepProps) {
  const [progress, setProgress] = useState(0);
  const [highestProgress, setHighestProgress] = useState(0);

  useEffect(() => {
    const p = Math.floor((stepNumber / (stepCount - 1)) * 100);
    setHighestProgress(
      stepNumber > highestProgress ? stepNumber : highestProgress
    );
    setProgress(p);
  }, [stepNumber, stepCount, highestProgress]);

  return (
    <div className="flex flex-col space-y-16 rounded-md w-full container max-w-2xl my-20">
      <div className="text-2xl font-bold text-center text-secondary-foreground">
        Interiorly AI
      </div>
      <div className="relative mx-auto w-3/4">
        <Progress
          value={progress}
          fill="bg-primary"
          className="absolute left-0 top-5 h-[1.25px] w-full bg-secondary"
        />
        <ul className="relative flex w-full justify-between">
          {[...Array(stepCount)].map((_, index) => (
            <li className="text-left" key={index}>
              <div>
                {index < stepNumber ? (
                  <Button
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-semibold ",
                      index <= stepNumber
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "bg-secondary"
                    )}
                    onClick={() => setCurrentPage(index)}
                  >
                    {index + 1}
                  </Button>
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-semibold ",
                      index <= stepNumber
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {index + 1}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col text-center">
          <h2 className="text-4xl font-bold text-secondary-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-10">
          {component}
          <Button onClick={onSubmit} variant={"default"} className="w-3/4">
            {submitButtonText || "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
