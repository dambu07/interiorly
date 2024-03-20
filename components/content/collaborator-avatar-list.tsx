import { User } from "@/lib/supabase/supabase.types";
import React from "react";
import TooltipComponent from "../tooltip-component";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

interface CollaboratorAvatarListProps {
  collaborators: User[];
}

const CollaboratorAvatarList = ({
  collaborators,
}: CollaboratorAvatarListProps) => {
  return (
    <div className="flex items-center justify-center h-10">
      {collaborators?.map((collaborator) => (
        <TooltipComponent
          message={collaborator.email as string}
          key={collaborator.id}
        >
          <Avatar className="-ml-3 bg-background border-2 flex items-center justify-center border-white h-8 w-8 rounded-full">
            <AvatarImage
              src={collaborator.avatarUrl ? collaborator.avatarUrl : ""}
              className="rounded-full"
            />
            <AvatarFallback>
              {getInitials(collaborator.email as string)}
            </AvatarFallback>
          </Avatar>
        </TooltipComponent>
      ))}
    </div>
  );
};

export default CollaboratorAvatarList;
