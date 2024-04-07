"use server";

import z from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  UserRegisterSchema,
  UserAuthSchema,
  UserOAuthSchema,
  UserAuthSchemaMagicLink,
} from "@/lib/validations/auth";
import { findUserByEmail } from "@/lib/supabase/queries";

export async function actionLoginUserMagicLink({
  email,
}: z.infer<typeof UserAuthSchemaMagicLink>) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = await findUserByEmail(email);
  if (!user) {
    return {
      error: {
        message: "An account with this email does not exist.",
      },
    };
  }

  console.log("Signing in", process.env.NEXT_PUBLIC_SITE_URL);

  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  console.log(response.error);

  if (response.error?.status === 429) {
    return {
      error: {
        message: "Too many requests. Please try again later.",
      },
    };
  }

  return {
    data: response.data,
    error: {
      message: response.error?.message,
    },
  };
}

export async function actionSendPasswordResetEmail(email: string) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  console.log(response);

  return response;
}

export async function actionLogoutUser() {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signOut();

  return response;
}

export async function actionExchangeCodeForSession<AuthTokenResponse>(
  code: string,
) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.exchangeCodeForSession(code);

  return response;
}

export async function actionLoginUserOAuth({
  provider,
  callbackUrl,
}: z.infer<typeof UserOAuthSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  console.log(callbackUrl);

  const response = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  return response;
}

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof UserAuthSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
}

export async function actionRegisterUser({
  email,
  password,
}: z.infer<typeof UserRegisterSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = await findUserByEmail(email);

  if (user)
    return {
      error: {
        message: "An account with this email already exists.",
      },
    };

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  return response;
}
