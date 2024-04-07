/**
 * Array of publicly accessible routes.
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * Array of routes used for authentication.
 * These routes will redirect to /dashboard if the user is already logged in.
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/**
 * Prefix for API routes used for authentication.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const route_synonyms: { [key: string]: string } = {
  "/login": "/sign-in",
  "/register": "/sign-up",
  "/forgot-password": "/reset-password",
  "/fpw": "/reset-password",
  "/logon": "/sign-in",
  "/signin": "/sign-in",
  "/signup": "/sign-up",
  "/reset": "/reset-password",
};

export const BASEURL =
  process.env.NODE_ENV === "production"
    ? "https://interiorly.vercel.app"
    : "http://localhost:3000";
