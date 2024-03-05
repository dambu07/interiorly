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
import { findUserByEmail, updateDisplayName } from "@/lib/supabase/queries";
import { BASEURL, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthTokenResponse } from "@supabase/supabase-js";

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

  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${BASEURL}/sign-in?provider=Email&callbackUrl=${DEFAULT_LOGIN_REDIRECT}`,
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

export async function actionLogoutUser() {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signOut();

  return {
    error: {
      message: response.error?.message,
    },
  };
}

export async function actionExchangeCodeForSession(code: string) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.exchangeCodeForSession(code);

  return {
    data: response.data,
    error: {
      message: response.error?.message,
    },
  } as AuthTokenResponse;
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
      redirectTo: `${BASEURL}/sign-in?provider=${provider}&callbackUrl=${encodeURIComponent(
        callbackUrl || DEFAULT_LOGIN_REDIRECT
      )}`,
    },
  });

  return {
    data: response.data,
    error: {
      message: response.error?.message,
    },
  };
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

  return {
    data: response.data,
    error: {
      message: response.error?.message,
    },
  };
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
    },
  });

  return {
    data: response.data,
    error: {
      message: response.error?.message,
    },
  };
}
