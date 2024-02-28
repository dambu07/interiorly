import { SignUpForm } from "@/components/auth/sign-up-form";
import { IconChevronLeft, IconHTL } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <IconChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <IconHTL className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Interiorly
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to set up your account
          </p>
        </div>
        <SignUpForm />
      </div>{" "}
      <span className="text-sm text-muted-foreground py-3">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: "link" }), "p-1")}
        >
          Sign In
        </Link>
      </span>
    </div>
  );
}
