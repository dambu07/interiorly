import React from "react";
import { Button } from "@/components/ui/button";
import { MagicLinkDialog } from "@/components/auth/magic-link-dialog";
import TooltipComponent from "@/components/tooltip-component";
import { cn } from "@/lib/utils";
import {
  IconDiscord,
  IconGitHub,
  IconGoogle,
  IconMessage,
  IconSpinner,
} from "@/components/icons";
import { useAuth } from "@/lib/provider/auth-provider";

const OAuthSignIn = () => {
  const { isLoading, handleMagicLinkSubmit, handleOAuthSubmit } = useAuth();

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-t w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <TooltipComponent
        message="We will send you a link to your email to sign in securely"
        className="flex justify-center items-center w-full"
      >
        <MagicLinkDialog onSubmit={handleMagicLinkSubmit}>
          <Button
            className="my-3 p-0 w-full"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <IconSpinner className="mr-2 animate-spin" />
            ) : (
              <IconMessage className="mr-2" />
            )}{" "}
            <span className="underline decoration-dotted">Magic Link</span>
          </Button>
        </MagicLinkDialog>
      </TooltipComponent>
      <div className="gap-3 grid grid-cols-3 w-full">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => {
            handleOAuthSubmit("github");
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
            handleOAuthSubmit("google");
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
            handleOAuthSubmit("discord");
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
};

export default OAuthSignIn;
