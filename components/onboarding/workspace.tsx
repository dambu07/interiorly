"use client";

import { AuthUser } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { CreateWorkspaceSchema } from "@/lib/validations/workspace";
import { z } from "zod";
import EmojiPicker from "@/components/emoji-picker";
import { User } from "@/lib/supabase/supabase.types";

interface WorkspaceOnboardingProps {
  user: User;
  subscription: {} | null;
}

const WorkspaceOnboarding: React.FC<WorkspaceOnboardingProps> = ({
  user,
  subscription,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState("💼");

  const form = useForm<z.infer<typeof CreateWorkspaceSchema>>({
    mode: "onChange",
    defaultValues: {
      logoUrl: "",
      name: "",
      description: `Welcome to ${user.displayName}'s workspace`,
    },
  });

  return (
    <div>
      <Card className="container flex flex-col items-center">
        <CardHeader>
          <CardTitle className="w-full text-center">
            You don&apos;t have a worksapce yet
          </CardTitle>
          <CardDescription className="w-full text-center">
            Create your first workspace to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="rounded-full w-16 border h-16 border-border flex items-center justify-center">
            <EmojiPicker getValue={(emoji: any) => setSelectedEmoji(emoji)}>
              <div className="w-full h-full m-auto">{selectedEmoji}</div>
            </EmojiPicker>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceOnboarding;
