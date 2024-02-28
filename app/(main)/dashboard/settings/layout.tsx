import { SettingsNav } from "@/components/settings-nav";
import db from "@/lib/supabase/db";
import React from "react";

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] my-20">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SettingsNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
