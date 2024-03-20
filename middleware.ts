import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  route_synonyms,
} from "@/routes";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const requestPath = nextUrl.pathname;

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Request path", requestPath);

  const isLoggedIn = user !== null;
  const isApiAuthRoute = requestPath.startsWith(apiAuthPrefix);

  if (route_synonyms[requestPath]) {
    return Response.redirect(new URL(route_synonyms[requestPath], nextUrl));
  }

  const isPublicRoute = publicRoutes.includes(requestPath);
  const isAuthRoute = authRoutes.includes(requestPath);
  const isApiRoute = requestPath.startsWith("/api");

  if (isApiAuthRoute || isApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = requestPath;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    return Response.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
