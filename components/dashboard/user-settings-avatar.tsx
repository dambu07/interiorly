"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { UserProfileSchema } from "@/lib/validations/settings";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  actionUpdateAvatar,
  actionUpdateProfile,
} from "@/lib/server-actions/settings";
import { User } from "@/lib/supabase/supabase.types";
import { IconSpinner } from "../icons";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

type FormData = z.infer<typeof UserProfileSchema>;

export function UserAvatarForm({
  user,
  className,
  ...props
}: UserNameFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {},
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    console.log(event);
    console.log(event.currentTarget);

    console.log(formData.get("avatar"));

    const { error } = await actionUpdateAvatar(formData);

    setIsSaving(false);

    if (error) {
      return toast("Something went wrong.", {
        description: "Your avatar was not updated. Please try again.",
      });
    }

    toast("Avatar changed.", {
      description: `You have successfully updated your avatar.`,
    });

    router.refresh();
  }

  return (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Upload a new avatar to change your profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <Label className="sr-only" htmlFor="avatar">
                Avatar{" "}
              </Label>
              <Input
                type="file"
                id="avatar"
                name="avatar"
                className="w-[400px]"
              />
              {errors?.displayName && (
                <p className="px-1 text-xs text-red-600">
                  {errors.displayName.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            <span>Save</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
