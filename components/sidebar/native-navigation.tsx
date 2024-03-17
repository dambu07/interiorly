import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import Settings from "../settings/settings";
import { IconAccuracy, IconDashboard, IconSettings, IconTrash } from "../icons";
import Trash from "@/components/trash/trash";

interface NativeNavigationProps {
  myWorkspaceId: string;
  className?: string;
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
}) => {
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2 my-3">
        <li>
          <Link
            className="flex items-center gap-2 text-secondary-foreground font-semibold"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <IconDashboard className="w-4 h-4" />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li className="flex items-center gap-2 text-secondary-foreground font-semibold">
            <IconSettings />
            <span>Settings</span>
          </li>
        </Settings>

        <Trash>
          <li className="flex items-center gap-2 text-secondary-foreground font-semibold">
            <IconTrash />
            <span>Trash</span>
          </li>
        </Trash>
      </ul>
    </nav>
  );
};

export default NativeNavigation;
