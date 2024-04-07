"use client";

import * as React from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { IconSpinner } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAuthSchema } from "@/lib/validations/auth";
import Link from "next/link";
import OAuthSignIn from "./oauth-sign-in";
import { useAuth } from "@/lib/provider/auth-provider";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: AuthFormProps) {
  const { isLoading, handleLoginSubmit } = useAuth();

  const form = useForm<z.infer<typeof UserAuthSchema>>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginSubmit)}
          className="flex-col space-y-5 align-middle"
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
          <span className="text-center text-muted-foreground text-sm">
            <Link
              href="/reset-password"
              className={cn(buttonVariants({ variant: "link" }), "pl-1")}
            >
              Forgot your password?
            </Link>
          </span>

          <Button
            type="submit"
            className="m-auto border w-full"
            disabled={isLoading}
          >
            Sign In with Email
            {isLoading && <IconSpinner className="ml-2 animate-spin" />}
          </Button>
        </form>
        <OAuthSignIn />
      </Form>
    </div>
  );
}
