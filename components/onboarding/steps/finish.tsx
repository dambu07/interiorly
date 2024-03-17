import { IconCheck, IconClose, IconSpinner } from "@/components/icons";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface OnboardingStepFinishProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepFinish({ form }: OnboardingStepFinishProps) {
  const isLoading = form.formState.isSubmitting;
  const isSubmittedSuccessfully = form.formState.isSubmitSuccessful;
  const { displayName } = form.watch();

  return (
    <div className="w-3/4 flex flex-col justify-center items-center text-center">
      {isLoading ? (
        <>
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <IconSpinner className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
          <h2 className="text-4xl font-bold text-secondary-foreground mt-10">
            Almost there!
          </h2>
          <span className="text-muted-foreground text-lg">
            We are currently setting everything up for you, this might take a
            few seconds.
          </span>
        </>
      ) : isSubmittedSuccessfully ? (
        <>
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-secondary-foreground mt-10">
            Congratulations, {displayName}!
          </h2>
          <span className="text-muted-foreground text-lg my-3">
            You&apos;ve completed Signing-Up. You are all set and ready to go!
            <br />
            Press the button below to get started with{" "}
            <span className="font-semibold text-secondary-foreground">
              Interiorly AI
            </span>
          </span>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <IconClose className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-foreground mt-10">
            Oops! Something went wrong
          </h2>
          <span className="text-muted-foreground text-lg my-3">
            We ran into an issue while setting up your account.
          </span>
        </>
      )}
    </div>
  );
}

export default OnboardingStepFinish;
