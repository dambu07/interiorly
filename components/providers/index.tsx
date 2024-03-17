"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppStateProvider from "@/lib/provider/state-provider";
import { SupabaseUserProvider } from "@/lib/provider/supabase-user-provider";
import { SocketProvider } from "@/lib/provider/socket-provider";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <AppStateProvider>
          <SupabaseUserProvider>
            <SocketProvider>{children}</SocketProvider>
          </SupabaseUserProvider>
        </AppStateProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
}
