"use client";

// TODO:
// - Add "Check Email" on Email Sign In if 2FA is enabled

import * as React from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  IconDiscord,
  IconGitHub,
  IconGoogle,
  IconMessage,
  IconSpinner,
} from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  actionExchangeCodeForSession,
  actionLoginUser,
  actionLoginUserMagicLink,
  actionLoginUserOAuth,
} from "@/lib/server-actions/auth";
import {
  UserAuthSchema,
  UserAuthSchemaMagicLink,
} from "@/lib/validations/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError, AuthResponse, OAuthResponse } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { MagicLinkDialog } from "./magic-link-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: AuthFormProps) {
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  const router = useRef(useRouter());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof UserAuthSchema>) {
    setIsLoading(true);
    const response = await actionLoginUser(data);
    handleAuth(response as AuthResponse);
  }

  const code_expired_message = "Email link is invalid or has expired";

  useEffect(() => {
    const { code, error_description, provider, callbackUrl, error } =
      Object.fromEntries(searchParamsRef.current.entries());

    setTimeout(() => {
      if (error) {
        if (error_description === code_expired_message) {
          toast("Invalid or Expired Link", {
            description: "Your link is either invalid or has expired.",
          });
          return;
        }

        toast("Error Signing-In", {
          description: error_description || "Please try again later.",
        });

        return;
      }
    }, 500);

    if (!code) return;

    setIsLoading(true);
    actionExchangeCodeForSession(code)
      .then((response) => {
        if (!response || !response.data) return;
        const session = response.data.session;
        if (session) {
          toast(`Signed In Successfully`, {
            description: `You are now Signed in with ${
              provider
                ? provider.charAt(0).toUpperCase() + provider.slice(1)
                : "OAuth"
            }`,
          });
          router.current.replace(callbackUrl || DEFAULT_LOGIN_REDIRECT);
        }
      })
      .catch((error) => {
        toast("An error occurred", {
          description: error.message || "Please try again later.",
        });
        setIsLoading(false);
      });
  }, []);

  async function onOAuthSubmit(provider: "github" | "google" | "discord") {
    setIsLoading(true);
    const callbackUrl = searchParamsRef.current?.get("callbackUrl");
    const response = await actionLoginUserOAuth({
      provider,
      callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
    handleAuth(response as OAuthResponse);
  }

  function isOAuthLink(
    response: AuthResponse | OAuthResponse
  ): response is OAuthResponse {
    if (!response || !response.data) return false;
    return (response as OAuthResponse).data.url !== undefined;
  }

  const onMagicLinkSubmit = async ({
    email,
  }: z.infer<typeof UserAuthSchemaMagicLink>) => {
    setIsLoading(true);
    const { error } = await actionLoginUserMagicLink({ email });
    if (error.message) {
      toast("An error occurred", {
        description: error.message,
      });
      setIsLoading(false);
    } else {
      toast("Magic Link Sent", {
        description: "Check your inbox for a sign-in link.",
      });
      setIsLoading(false);
    }
  };

  const handleAuth = (response: AuthResponse | OAuthResponse) => {
    if (isOAuthLink(response)) {
      router.current.push(response.data.url as string);
    } else if (response instanceof AuthError) {
      toast("An error occurred", {
        description: response.message || "Please try again later.",
      });
      setIsLoading(false);
    } else {
      toast("Signed In Successfully", {
        description: "You are now Signed in.",
      });
      const callbackUrl = searchParamsRef.current.get("callbackUrl");
      router.current.replace(callbackUrl || DEFAULT_LOGIN_REDIRECT);
    }
  };

  const form = useForm<z.infer<typeof UserAuthSchema>>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col align-middle space-y-5"
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="text-sm text-muted-foreground text-center">
            <Link
              href="/reset-password"
              className={cn(buttonVariants({ variant: "link" }), "pl-1")}
            >
              Forgot your password?
            </Link>
          </span>

          <Button
            type="submit"
            className="w-full m-auto border"
            disabled={isLoading}
          >
            Sign In with Email
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
      <Button className="w-full p-0" variant="none" disabled={isLoading}>
        <MagicLinkDialog onSubmit={onMagicLinkSubmit}>
          <div className="w-full">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full"
                  )}
                >
                  {isLoading ? (
                    <IconSpinner className="mr-2 animate-spin" />
                  ) : (
                    <IconMessage className="mr-2" />
                  )}{" "}
                  <span className="decoration-dotted underline">
                    Magic Link
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                We will send you a link to your email to sign in securely.
              </TooltipContent>
            </Tooltip>
          </div>
        </MagicLinkDialog>
      </Button>
      <div className="grid w-full grid-cols-3 gap-3">
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
