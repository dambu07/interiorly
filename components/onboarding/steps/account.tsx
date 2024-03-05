import { IconHelp, IconMessage } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface OnboardingStepAccountProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepAccount({ form }: OnboardingStepAccountProps) {
  return (
    <div className="w-3/4 flex flex-col items-center">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="my-5 w-full">
            <FormControl>
              <div className="relative flex flex-col w-full space-y-2">
                <Label htmlFor="fullName" className="text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <Input placeholder="John Doe" className="w-full" {...field} />
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl p-1 h-6 bg-transparent">
                        <IconHelp className="mr-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Your name will not be visible to others in workspaces.
                      This is only used for billing purposes.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="displayName"
        render={({ field }) => (
          <FormItem className="my-5 w-full">
            <FormControl>
              <div className="relative flex flex-col w-full space-y-2">
                <Label htmlFor="displayName" className="text-sm">
                  Display Name
                </Label>
                <div className="relative">
                  <Input placeholder="John" className="w-full" {...field} />
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl p-1 h-6 bg-transparent">
                        <IconHelp className="mr-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      This is the name that will be visible to others in your
                      workspaces. You can always change this later.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default OnboardingStepAccount;
