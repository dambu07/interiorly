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
import { IconCheck, IconClose, IconHelp, IconUser, IconUsers } from "../icons";
import { Card } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
      title: "Welcome, First things first...",
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
        }+
      },
    },
    {
      title: "Choose a plan that's right for you",
      description: "You can always change your plan later.",
      component: (
        <div className="text-center relative my-5">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="my-3 text-center font-display text-3xl font-bold">
                Hobby
              </h3>
              <p className="text-gray-500">
                For small side projects <br />
                No credit card required
              </p>
              <p className="my-5 font-display text-6xl font-semibold">$0</p>
              <p className="text-gray-500 mb-3">per month</p>
              <div className="flex h-20 items-center justify-center border-b border-t border-border bg-transparent">
                <div className="flex items-center space-x-1">
                  <p>50 generations/mo included</p>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="cursor-default ml-1.5">
                      <IconHelp className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      How many images you can generate
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <ul className="my-10 space-y-5 px-8">
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconClose className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconClose className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconClose className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
              </ul>
            </Card>
            <Card className="p-5 border-primary relative">
              <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                Recommended
              </div>
              <h3 className="my-3 text-center font-display text-3xl font-bold">
                Pro
              </h3>
              <p className="text-gray-500">
                For individuals and small teams looking to get more done
              </p>
              <p className="my-5 font-display text-6xl font-semibold">$19</p>
              <p className="text-gray-500 mb-3">per month</p>
              <div className="flex h-20 items-center justify-center border-b border-t border-border bg-transparent">
                <div className="flex items-center space-x-1">
                  <p>Unlimited generations included</p>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="cursor-default ml-1.5">
                      <IconHelp className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      How many images you can generate
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <ul className="my-10 space-y-5 px-8">
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
                <li className="flex space-x-5">
                  <div className="flex-shrink-0">
                    <IconCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-muted-foreground">Placeholder</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ),
      onSubmit: () => setCurrentPage(currentPage + 1),
    },
    {
      title: "How are you planning to use Interiorly?",
      description: "We'll streamline your setup experience accordingly. ",
      component: (
        <div className="flex space-x-5">
          <Card className="container flex flex-col h-full py-10 space-y-1 hover:cursor-pointer border-primary">
            <IconUser className="w-8 h-8 text-primary" />
            <div className="text-xl font-bold">For Myself</div>
            <span className="text-muted-foreground">
              Write better. Think more clearly. Stay organized.
            </span>
          </Card>
          <Card className="container flex flex-col h-full py-10 space-y-1 hover:cursor-pointer">
            <IconUsers className="w-8 h-8" />
            <div className="text-xl font-bold">With my team</div>
            <span className="text-muted-foreground">
              Stay in sync with your team and collaborate in real-time
            </span>
          </Card>
        </div>
      ),
      onSubmit: () => setCurrentPage(currentPage + 1),
    },
    {
      title: "",
      description: "",
      component: (
        <div className="w-3/4 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-secondary-foreground mt-10">
            Congratulations, {form.getValues("displayName")}!
          </h2>
          <span className="text-muted-foreground text-lg">
            You are all set, you can start using Interiorly AI now.
          </span>
        </div>
      ),
      onSubmit: () => setCurrentPage(0),
      submitButtonText: "Go to Dashboard",
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
