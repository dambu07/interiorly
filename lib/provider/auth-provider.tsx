"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  actionLoginUser,
  actionRegisterUser,
  actionLoginUserOAuth,
  actionLoginUserMagicLink,
} from "@/lib/server-actions/auth";
import { isOAuthLink } from "@/lib/type-guards/auth";
import { AuthError, AuthResponse, OAuthResponse } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  UserAuthSchema,
  UserAuthSchemaMagicLink,
  UserRegisterSchema,
} from "@/lib/validations/auth";
import { z } from "zod";

type AuthContextType = {
  isLoading: boolean;
  handleLoginSubmit: (data: z.infer<typeof UserAuthSchema>) => void;
  handleRegisterSubmit: (data: z.infer<typeof UserRegisterSchema>) => void;
  handleMagicLinkSubmit: (
    data: z.infer<typeof UserAuthSchemaMagicLink>,
  ) => void;
  handleOAuthSubmit: (provider: "github" | "google" | "discord") => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  handleLoginSubmit: () => {},
  handleRegisterSubmit: () => {},
  handleMagicLinkSubmit: () => {},
  handleOAuthSubmit: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAuth = (response: AuthResponse | OAuthResponse) => {
    console.log(response);

    if (isOAuthLink(response)) {
      router.push(response.data.url as string);
    } else if (response.error !== null) {
      toast("An error occurred", {
        description: response.error.message || "Please try again later.",
      });
      setIsLoading(false);
    } else {
      toast("Signed In Successfully", {
        description: "You are now Signed in.",
      });

      const callbackUrl = searchParams.get("callbackUrl");
      router.replace(callbackUrl || DEFAULT_LOGIN_REDIRECT);
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (data: z.infer<typeof UserAuthSchema>) => {
    setIsLoading(true);
    const response = await actionLoginUser(data);
    handleAuth(response as AuthResponse);
  };

  const handleRegisterSubmit = async (
    data: z.infer<typeof UserRegisterSchema>,
  ) => {
    setIsLoading(true);
    const response = await actionRegisterUser(data);
    handleAuth(response as AuthResponse);
  };

  const handleOAuthSubmit = async (
    provider: "github" | "google" | "discord",
  ) => {
    setIsLoading(true);
    const callbackUrl = searchParams.get("callbackUrl");
    const response = await actionLoginUserOAuth({
      provider,
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    handleAuth(response as OAuthResponse);
  };

  const handleMagicLinkSubmit = async ({
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

  const handlePasswordReset = async (email: string) => {};

  useCallback(() => {
    console.log("search params changed", searchParams.toString());

    const error = searchParams.get("error");
    if (!error) return;

    const errorDescription = searchParams.get("error_description");

    toast("An error occurred", {
      description: errorDescription || "Please try again later.",
    });
  }, [searchParams]);

  const value = {
    isLoading,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleMagicLinkSubmit,
    handleOAuthSubmit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
