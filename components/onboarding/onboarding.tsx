"use client";

import React, { useRef, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { User } from "@/lib/supabase/supabase.types";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import type { OnboardingStep as OnboardinStepType } from "@/types";
import { Form } from "@/components/ui/form";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OnboardingStepCollaboration from "@/components/onboarding/steps/collaboration";
import OnboardingStepFinish from "@/components/onboarding/steps/finish";
import OnboardingStepAccount from "@/components/onboarding/steps/account";
import OnboardingStepProfile from "@/components/onboarding/steps/avatar";
import OnboardingStepWorkspaceSetup from "@/components/onboarding/steps/workspace-setup";
import { actionCompleteOnboarding } from "@/lib/server-actions/onboarding";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface OnboardingProps {
  user: User;
  subscription: {} | null;
}

export default function Onboarding({ user, subscription }: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const textboxRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {},
  });

  const { workspaceType, avatar } = form.watch();

  const onboardingComplete = async (data: z.infer<typeof OnboardingSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await actionCompleteOnboarding(formData);
    console.log(response, form.formState.isSubmitSuccessful);
  };

  const validateFormFields = async (
    form: UseFormReturn<z.infer<typeof OnboardingSchema>>,
    ...fields: (keyof z.infer<typeof OnboardingSchema>)[]
  ) =>
    (
      await Promise.all(
        fields.map((field) => form.trigger(field, { shouldFocus: true })),
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
        validateFormFields(form, "fullName", "displayName").then((isValid) => {
          const displayName = form.getValues("displayName");
          form.setValue("workspaceType", "individual");
          form.setValue("workspaceName", `${displayName}'s Workspace`);
          form.setValue(
            "workspaceDescription",
            `Welcome to ${
              displayName
                ? displayName.includes(" ")
                  ? displayName.split(" ")[0]
                  : displayName
                : "Someone"
            }'s Workspace 🚀`,
          );
          if (isValid) {
            setCurrentPage(currentPage + 1);
          }
        }),
    },
    {
      title: "Upload an Avatar",
      description:
        "Choose an avatar that represents you. You can always change it later.",
      component: <OnboardingStepProfile form={form} />,
      submitButtonText: "Upload Avatar",
      submitButtonDisabled: !avatar,
      skipable: true,
    },
    // {
    //   title: "How are you planning to use Interiorly?",
    //   description: "We'll streamline your setup experience accordingly. ",
    //   component: <OnboardingStepCollaboration form={form} />,
    // },
    // {
    //   title: "Set up your workspace",
    //   description: `Create your first workspace ${
    //     workspaceType === "team" ? "and invite your team" : ""
    //   } to get started.`,
    //   component: <OnboardingStepWorkspaceSetup form={form} />,
    // },
    {
      component: <OnboardingStepFinish form={form} />,
      submitButtonText: "Go to Dashboard",
      onSubmit: () => revalidatePath("/dashboard"),
    },
  ];

  const currentStep = onboardingSteps[currentPage];

  return (
    <div className="flex justify-center items-center w-full max-w-3xl h-full container">
      <Form {...form}>
        <form
          className="relative w-full h-full"
          onSubmit={form.handleSubmit(onboardingComplete)}
        >
          <OnboardingStep
            form={form}
            title={currentStep.title}
            description={currentStep.description}
            component={currentStep.component}
            stepNumber={currentPage}
            stepCount={onboardingSteps.length}
            submitButtonText={currentStep.submitButtonText}
            submitButtonDisabled={currentStep.submitButtonDisabled}
            onSubmit={currentStep.onSubmit}
            setCurrentPage={setCurrentPage}
            skippable={currentStep.skipable}
            onComplete={onboardingComplete}
          />
        </form>
      </Form>
    </div>
  );
}
