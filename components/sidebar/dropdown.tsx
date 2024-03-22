"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import clsx from "clsx";
import { createFile, updateFile, updateFolder } from "@/lib/supabase/queries";
import { PlusIcon, Trash } from "lucide-react";
import { File, Folder, workspace } from "@/lib/supabase/supabase.types";
import { v4 } from "uuid";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { useAppState } from "@/lib/provider/state-provider";
import EmojiPicker from "@/components/emoji-picker";
import TooltipComponent from "@/components/tooltip-component";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const { workspaceId, state, dispatch } = useAppState();
  const { user } = useSupabaseUser();
  const [isEditing, setIsEditing] = useState<string>("");

  const handleDoubleClick = (id: string) => {
    setIsEditing(id);
  };

  const folderTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fid = id.split("folder");
    if (fid.length === 1) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { title: e.target.value },
          folderId: fid[0],
          workspaceId,
        },
      });
    }
  };

  const fileTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fid = id.split("folder");
    if (fid.length === 2 && fid[1]) {
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          file: { title: e.target.value },
          folderId: id,
          workspaceId,
          fileId: fid[1],
        },
      });
    }
  };

  const moveFolderToTrash = async (folderId: string) => {
    if (!user?.email || !workspaceId) return;
    dispatch({
      type: "UPDATE_FOLDER",
      payload: {
        folder: { inTrash: `Deleted by ${user?.email}` },
        folderId,
        workspaceId,
      },
    });
    const { data, error } = await updateFolder(
      { inTrash: `Deleted by ${user?.email}` },
      folderId
    );
    if (error) {
      toast("Error", {
        description: "Could not move the folder to trash",
      });
    } else {
      toast("Success", {
        description: "Moved folder to trash",
      });
    }
  };

  const moveFileToTrash = async (fileId: string) => {
    if (!user?.email || !workspaceId) return;
    dispatch({
      type: "UPDATE_FILE",
      payload: {
        file: { inTrash: `Deleted by ${user?.email}` },
        folderId: id,
        workspaceId,
        fileId,
      },
    });
    const { data, error } = await updateFile(
      { inTrash: `Deleted by ${user?.email}` },
      fileId
    );
    if (error) {
      toast("Error", {
        description: "Could not move the folder to trash",
      });
    } else {
      toast("Success", {
        description: "Moved folder to trash",
      });
    }
  };

  const addNewFile = async () => {
    if (!workspaceId) return;
    const newFile: File = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: "Untitled",
      iconId: "📄",
      id: v4(),
      workspaceId,
      bannerUrl: "",
    };
    dispatch({
      type: "ADD_FILE",
      payload: { file: newFile, folderId: id, workspaceId },
    });
    const { data, error } = await createFile(newFile);
    if (error) {
      toast("Error", {
        description: "Could not create a file",
      });
    } else {
      toast("Success", {
        description: "File created.",
      });
    }
  };

  const workspace = state.workspaces.find((w) => w.id === workspaceId);
  if (!workspace) return null;

  return (
    <AccordionItem value={id} className="border-none">
      <AccordionTrigger id={listType} className="hover:no-underline">
        <div className="flex gap-4 w-full justify-start hover:justify-between overflow-hidden group/folder">
          <div className="flex">
            <div className="relative">{iconId}</div>
            <input
              type="text"
              value={title}
              className={cn(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                isEditing === id
                  ? "bg-muted cursor-text"
                  : "bg-transparent cursor-pointer"
              )}
              readOnly={!(isEditing === id)}
              onDoubleClick={() => handleDoubleClick(id)}
              onChange={folderTitleChange}
            />
          </div>
          <div className="hidden group-hover/folder:flex">
            <TooltipComponent message="Delete Folder">
              <Trash
                onClick={() => moveFolderToTrash(id)}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {!(isEditing === id) && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="ml-5 flex flex-col cursor-pointer">
        {workspace.folders
          .find((f) => f.id === id)
          ?.files.map((file: File) => {
            return (
              <div
                className="flex hover:justify-between w-full group/file"
                key={file.id}
              >
                <div className="flex">
                  <div className="relative">{iconId}</div>
                  <input
                    type="text"
                    value={file.title}
                    className={cn(
                      "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                      isEditing === file.id
                        ? "bg-muted cursor-text"
                        : "bg-transparent cursor-pointer"
                    )}
                    readOnly={!(isEditing === file.id)}
                    onDoubleClick={() => handleDoubleClick(file.id)}
                    onChange={fileTitleChange}
                  />
                </div>
                <div className="hidden group-hover/file:flex justify-end">
                  <TooltipComponent message="Delete Folder">
                    <Trash
                      onClick={() => moveFileToTrash(file.id)}
                      size={15}
                      className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                    />
                  </TooltipComponent>
                </div>
              </div>
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Dropdown;
