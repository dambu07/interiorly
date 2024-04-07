import React from "react";
import { Subscription, User } from "@/lib/supabase/supabase.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { IconSettings, IconUser } from "@/components/icons";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { findUser } from "@/lib/supabase/queries";

interface UserCardProps {
  subscription: Subscription | null;
  userId: string;
}

const UserCard: React.FC<UserCardProps> = async ({ subscription, userId }) => {
  const user = await findUser(userId);
  console.log(user, userId);
  if (!user) return null;
  const avatarUrl = user.avatarUrl as string;

  return (
    <article className="bottom-0 hidden w-full items-center justify-between bg-secondary/20 px-3 py-3 sm:flex">
      <aside className="flex items-center justify-center gap-2">
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
            {user.displayName || user.email}
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
