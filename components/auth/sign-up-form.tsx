"use client";

import * as React from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn, evaluatePasswordStrength } from "@/lib/utils";
import {
  IconAccuracy,
  IconDiscord,
  IconEyeClosed,
  IconEyeOpen,
  IconGitHub,
  IconGoogle,
  IconHelp,
  IconSpinner,
} from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
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

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmationPasswordVisible, setConfirmationPasswordVisible] =
    useState<boolean>(false);
  const [passwordStrengthIndicator, setPasswordStrengthIndicator] = useState(
    {} as PasswordStrengthEvaluationResult
  );

  async function onSubmit(data: z.infer<typeof UserRegisterSchema>) {
    setIsLoading(true);
    const response = await actionRegisterUser(data);
    handleAuth(response as AuthResponse);
  }

  async function onOAuthSubmit(provider: "github" | "google" | "discord") {
    setIsLoading(true);
    const response = await actionLoginUserOAuth({ provider });
    handleAuth(response as OAuthResponse);
  }

  const form = useForm<z.infer<typeof UserRegisterSchema>>({
    resolver: zodResolver(UserRegisterSchema),
    defaultValues: {
      email: "",
    },
  });

  function isOAuthLink(
    response: AuthResponse | OAuthResponse
  ): response is OAuthResponse {
    return (response as OAuthResponse).data.url !== undefined;
  }

  const handleAuth = (response: AuthResponse | OAuthResponse) => {
    if (isOAuthLink(response)) {
      router.push(response.data.url as string);
    } else if (response instanceof AuthError) {
      toast("An error occurred", {
        description: response.message || "Please try again later.",
      });
      setIsLoading(false);
    } else {
      toast("Registerd Successfully", {
        description: "You will be redirected shortly.",
      });
      router.replace(DEFAULT_LOGIN_REDIRECT);
    }
  };

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
          onSubmit={form.handleSubmit(onSubmit)}
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
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl p-1 h-6 bg-transparent"
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
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl p-1 h-6 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmationPasswordVisible(
                              !confirmationPasswordVisible
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
          <Button type="submit" className="w-full m-auto border">
            Sign Up with Email
            {isLoading && <IconSpinner className="ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => {
            onOAuthSubmit("github");
          }}
        >
          {isLoading ? (
            <IconSpinner className="mr-2 animate-spin" />
          ) : (
            <IconGitHub className="mr-2" />
          )}{" "}
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => {
            onOAuthSubmit("google");
          }}
        >
          {isLoading ? (
            <IconSpinner className="mr-2 animate-spin" />
          ) : (
            <IconGoogle className="mr-2" />
          )}{" "}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => {
            onOAuthSubmit("discord");
          }}
        >
          {isLoading ? (
            <IconSpinner className="mr-2 animate-spin" />
          ) : (
            <IconDiscord className="mr-2" />
          )}{" "}
          Discord
        </Button>
      </div>
    </div>
  );
}
