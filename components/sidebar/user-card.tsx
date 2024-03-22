import React from "react";
import { Subscription } from "@/lib/supabase/supabase.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { IconSettings, IconUser } from "@/components/icons";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface UserCardProps {
  subscription: Subscription | null;
}

const UserCard: React.FC<UserCardProps> = async ({ subscription }) => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, user.id),
  });
  let avatarPath;
  if (!response) return;
  const avatarUrl = response.avatarUrl as string;

  return (
    <article
      className="hidden sm:flex justify-between items-center w-full bg-secondary-foreground/5 px-3 py-3 bottom-0
  "
    >
      <aside className="flex justify-center items-center gap-2">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            <IconUser />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-muted-foreground">
            {subscription?.status === "active" ? (
              <Badge>Pro Plan</Badge>
            ) : (
              <Badge>Free Plan</Badge>
            )}
          </span>
          <small className="w-full overflow-hidden overflow-ellipsis">
            {response.displayName || response.email}
          </small>
        </div>
      </aside>
      <div className="flex items-center justify-center">
        <ModeToggle ghost={true} />
        <Link href="/dashboard/settings">
          <IconSettings className="mr-3" />
        </Link>
      </div>
    </article>
  );
};

export default UserCard;
