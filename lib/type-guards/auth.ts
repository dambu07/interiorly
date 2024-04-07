import { AuthResponse, OAuthResponse } from "@supabase/supabase-js";

export function isOAuthLink(
  response: AuthResponse | OAuthResponse
): response is OAuthResponse {
  if (!response || !response.data) return false;
  return (response as OAuthResponse).data.url !== undefined;
}
