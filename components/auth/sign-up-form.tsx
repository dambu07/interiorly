"use client";

import * as React from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn, evaluatePasswordStrength } from "@/lib/utils";
import { IconEyeClosed, IconEyeOpen, IconSpinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRegisterSchema } from "@/lib/validations/auth";
import {
  actionLoginUserOAuth,
  actionRegisterUser,
} from "@/lib/server-actions/auth";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "./password-strength-indicator";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Fahkwang } from "next/font/google";
import { AuthError, AuthResponse, OAuthResponse } from "@supabase/supabase-js";
import { PasswordStrengthEvaluationResult } from "@/types";
import OAuthSignIn from "./oauth-sign-in";
import { useAuth } from "@/lib/provider/auth-provider";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: AuthFormProps) {
  const { isLoading, handleRegisterSubmit } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmationPasswordVisible, setConfirmationPasswordVisible] =
    useState<boolean>(false);
  const [passwordStrengthIndicator, setPasswordStrengthIndicator] = useState(
    {} as PasswordStrengthEvaluationResult,
  );

  const form = useForm<z.infer<typeof UserRegisterSchema>>({
    resolver: zodResolver(UserRegisterSchema),
    defaultValues: {
      email: "",
    },
  });

  const handlePasswordStrength = (e: { target: { value: string } }) => {
    const password = e.target.value;
    form.setValue("password", password);
    setPasswordStrengthIndicator(evaluatePasswordStrength(password));
  };

  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterSubmit)}
          className="flex-col space-y-8 align-middle"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="example@interiorly.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex w-full">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      ref={inputRef}
                      onChange={handlePasswordStrength}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="top-1/2 right-2 absolute bg-transparent p-1 rounded-xl h-6 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            setPasswordVisible(!passwordVisible);
                          }}
                        >
                          {passwordVisible ? (
                            <IconEyeClosed className="text-muted-foreground" />
                          ) : (
                            <IconEyeOpen className="text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {passwordVisible ? "Hide" : "Show"} Password
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {passwordVisible ? "Hide" : "Show"} Password
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex w-full">
                    <Input
                      type={confirmationPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="top-1/2 right-2 absolute bg-transparent p-1 rounded-xl h-6 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmationPasswordVisible(
                              !confirmationPasswordVisible,
                            );
                          }}
                        >
                          {confirmationPasswordVisible ? (
                            <IconEyeClosed className="text-muted-foreground" />
                          ) : (
                            <IconEyeOpen className="text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {confirmationPasswordVisible ? "Hide" : "Show"}{" "}
                            Password
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {confirmationPasswordVisible ? "Hide" : "Show"} Password
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PasswordStrengthIndicator
            criteria={passwordStrengthIndicator.criteria}
            strengthPercentage={passwordStrengthIndicator.strengthPercentage}
          />
          <Button type="submit" className="m-auto border w-full">
            Sign Up with Email
            {isLoading && <IconSpinner className="ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
      <OAuthSignIn />
    </div>
  );
}
