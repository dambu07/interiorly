import { SignInForm } from "@/components/auth/sign-in-form";
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <SignInForm />
      </div>{" "}
      <span className="text-sm text-muted-foreground py-3">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "link" }), "p-1")}
        >
          Sign Up
        </Link>
      </span>
      <div className="absolute bottom-3 text-sm text-muted-foreground">
        By continuing, you agree to Interiorly&apos;s{" "}
        <Link href={"/terms"}>Terms of Service</Link> and{" "}
        <Link href={"/privacy-policy"}>Privacy Policy</Link>, and to receive
        periodic emails with updates.
      </div>
    </div>
  );
}
