"use client";

import React, { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { User } from "@/lib/supabase/supabase.types";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import type { OnboardingStep as OnboardinStepType } from "@/types";
import { Form } from "../ui/form";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OnboardingStepCollaboration from "./steps/collaboration";
import OnboardingStepFinish from "./steps/finish";
import OnboardingStepAvatar from "./steps/profile";
import OnboardingStepAccount from "./steps/account";
import OnboardingStepProfile from "./steps/profile";
import OnboardingStepWorkspaceSetup from "./steps/workspace-setup";
import { actionUpdateProfile } from "@/lib/server-actions/settings";
import { actionCompleteOnboarding } from "@/lib/server-actions/onboarding";

interface OnboardingProps {
  user: User;
  subscription: {} | null;
}

export default function Onboarding({ user, subscription }: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [collaborationType, setCollaborationType] = useState<
    "individual" | "team"
  >("individual");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {},
  });

  const onboardingComplete = async (data: z.infer<typeof OnboardingSchema>) => {
    setIsLoading(true);
    await actionCompleteOnboarding(data);
    setIsLoading(false);
  };

  const validateFormFields = async (
    form: UseFormReturn<z.infer<typeof OnboardingSchema>>,
    ...fields: (keyof z.infer<typeof OnboardingSchema>)[]
  ) =>
    (
      await Promise.all(
        fields.map((field) => form.trigger(field, { shouldFocus: true }))
      )
    ).every((fieldResult) => fieldResult);

  const onboardingSteps: OnboardinStepType[] = [
    {
      title: "Welcome, First things first...",
      description:
        "Personalize your experience. You can always change your appearance later.",
      component: <OnboardingStepAccount form={form} />,
      submitButtonText: "Create Profile",
      onSubmit: () =>
        validateFormFields(form, "fullName", "displayName").then(
          (isValid) => isValid && setCurrentPage(currentPage + 1)
        ),
    },
    {
      title: "Create an Avatar",
      description:
        "Choose an avatar that represents you. You can always change it later.",
      component: (
        <OnboardingStepProfile
          form={form}
          displayName={form.getValues("displayName")}
          email={user.email as string}
          createdAt={user.updatedAt as string}
        />
      ),
      submitButtonText: "Upload Avatar",
      skipable: true,
    },
    {
      title: "How are you planning to use Interiorly?",
      description: "We'll streamline your setup experience accordingly. ",
      component: (
        <OnboardingStepCollaboration
          form={form}
          collaborationType={collaborationType}
          setCollaborationType={setCollaborationType}
        />
      ),
    },
    {
      title: "Set up your workspace",
      description: `Create your first workspace ${
        collaborationType === "team" ? "and invite your team" : ""
      } to get started.\nYou can always create another workspace later.`,
      component: (
        <OnboardingStepWorkspaceSetup
          collaborationType={collaborationType}
          displayName={form.getValues("displayName")}
          form={form}
        />
      ),
    },
    {
      component: (
        <OnboardingStepFinish
          displayName={form.getValues("displayName")}
          isLoading={isLoading}
        />
      ),
      submitButtonText: "Go to Dashboard",
    },
  ];

  const currentStep = onboardingSteps[currentPage];

  return (
    <div className="w-full h-full flex items-center justify-center max-w-3xl container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onboardingComplete)}
          className="relative w-full h-full"
        >
          <OnboardingStep
            form={form}
            title={currentStep.title}
            description={currentStep.description}
            component={currentStep.component}
            stepNumber={currentPage}
            stepCount={onboardingSteps.length}
            submitButtonText={currentStep.submitButtonText}
            onSubmit={currentStep.onSubmit}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
            skipable={currentStep.skipable}
            onComplete={onboardingComplete}
          />
        </form>
      </Form>
      {/* <ModeToggle /> */}
    </div>
  );
}
