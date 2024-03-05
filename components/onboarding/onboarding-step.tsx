"use client";

import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { IconChevronLeft, IconSpinner } from "../icons";
import { Separator } from "../ui/separator";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import { toast } from "sonner";

interface OnboardingStepProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
  stepNumber: number;
  stepCount: number;
  title?: string;
  description?: string;
  component: React.ReactNode;
  submitButtonText?: string;
  onSubmit?: () => void;
  onComplete: (data: z.infer<typeof OnboardingSchema>) => void;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  skipable?: boolean;
}

export function OnboardingStep({
  form,
  stepNumber,
  stepCount,
  title,
  description,
  component,
  submitButtonText,
  onSubmit,
  onComplete,
  setCurrentPage,
  isLoading,
  skipable,
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
    <div className="flex flex-col w-full h-full">
      <div className="h-1/3 flex flex-col justify-end">
        <div className="text-2xl font-bold text-center text-secondary-foreground">
          Interiorly AI
        </div>
        <div className="relative mx-auto mt-16 mb-10 w-3/4">
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
                      onClick={() => !isLoading && setCurrentPage(index)}
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
      </div>
      <div className="flex flex-col space-y-7">
        <div className="flex flex-col text-center">
          {title && (
            <h2 className="text-4xl font-bold text-secondary-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg my-1">
              {description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center space-y-10">
          {component}
          <div className="w-full flex flex-col items-center justify-center space-y-5">
            <Button
              onClick={
                stepNumber < stepCount - 1
                  ? onSubmit || (() => setCurrentPage(stepNumber + 1))
                  : () => {
                      if (
                        form.formState.errors &&
                        Object.keys(form.formState.errors).length > 0
                      ) {
                        return toast("An error occurred", {
                          description: "Please try again later.",
                        });
                      }
                      form.handleSubmit(onComplete);
                    }
              }
              variant={"default"}
              className="w-3/4"
              disabled={isLoading}
            >
              {isLoading && (
                <IconSpinner className="w-5 h-5 mr-2 animate-spin" />
              )}
              {submitButtonText || "Continue"}
            </Button>
            <div className="flex  w-full items-center justify-center">
              {stepNumber > 0 && !isLoading && (
                <span
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "hover:cursor-pointer"
                  )}
                  onClick={() => setCurrentPage(stepNumber - 1)}
                >
                  <IconChevronLeft /> Go Back
                </span>
              )}
              {stepNumber < stepCount - 1 && !isLoading && skipable && (
                <Separator orientation="vertical" className="h-1/2 my-auto" />
              )}
              {skipable && !isLoading && (
                <span
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "hover:cursor-pointer"
                  )}
                  onClick={() => setCurrentPage(stepNumber + 1)}
                >
                  Skip Step <IconChevronLeft className="rotate-180" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
