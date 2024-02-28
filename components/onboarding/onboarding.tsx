"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/lib/supabase/supabase.types";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import type { OnboardingStep as OnboardinStepType } from "@/types";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { z } from "zod";

interface OnboardingProps {
  user: User;
  subscription: {} | null;
}

export default function Onboarding({ user, subscription }: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {},
  });

  const onboardingSteps: OnboardinStepType[] = [
    {
      title: "Welcome! First things first...",
      description:
        "Personalize your experience. You can always change your appearance later.",
      component: (
        <div className="w-3/4 flex flex-col">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="my-5">
                <FormControl>
                  <div className="flex flex-col space-y-3">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      placeholder="John Doe"
                      className="w-full"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Your name will not be visible to others in workspaces.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="my-5">
                <FormControl>
                  <div className="flex flex-col space-y-3">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input placeholder="John" className="w-full" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  Your display name is how you will appear to others in
                  workspaces.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      submitButtonText: "Create Profile",
      onSubmit: async () => {
        const displayNameValid = await form.trigger("displayName");
        const fullNameValid = await form.trigger("fullName");

        if (displayNameValid && fullNameValid) {
          return setCurrentPage(currentPage + 1);
        }

        if (!displayNameValid) {
          form.setError("fullName", {
            type: "manual",
            message: "Invalid Full Name",
          });
        }

        if (!displayNameValid) {
          form.setError("displayName", {
            type: "manual",
            message: "Invalid Display Name",
          });
        }
      },
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

  async function onSubmit(data: z.infer<typeof OnboardingSchema>) {
    console.log(data);
  }
  return (
    <div className=" w-full h-full">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-col space-y-8 align-middle"
          >
            <OnboardingStep
              title={currentStep.title}
              description={currentStep.description}
              component={currentStep.component}
              stepNumber={currentPage}
              stepCount={onboardingSteps.length}
              user={user}
              submitButtonText={currentStep.submitButtonText}
              onSubmit={currentStep.onSubmit}
              setCurrentPage={setCurrentPage}
            />
          </form>
        </Form>

        <ModeToggle />
      </div>
    </div>
  );
}
