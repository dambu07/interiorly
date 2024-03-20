import { useAppState } from "@/lib/provider/state-provider";
import {
  deleteFile,
  deleteFolder,
  updateFile,
  updateFolder,
} from "@/lib/supabase/queries";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const TrashIndicator = () => {
  const router = useRouter();
  const { workspaceId, folderId, fileId, state, dispatch } = useAppState();
  const workspace = state.workspaces.find(
    (workspace) => workspace.id === workspaceId
  );
  if (!workspace || !workspace.inTrash) return null;

  const restoreFileHandler = async () => {
    if (fileId && folderId && workspaceId) {
      dispatch({
        type: "UPDATE_FILE",
        payload: { file: { inTrash: "" }, fileId, folderId, workspaceId },
      });
      await updateFile({ inTrash: "" }, fileId);
    } else if (folderId && workspaceId) {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: { inTrash: "" }, folderId, workspaceId },
      });
      await updateFolder({ inTrash: "" }, folderId);
    }
  };

  const deleteFileHandler = async () => {
    if (fileId && folderId && workspaceId) {
      dispatch({
        type: "DELETE_FILE",
        payload: { fileId, folderId, workspaceId },
      });
      await deleteFile(fileId);
      router.replace(`/dashboard/${workspaceId}`);
    } else if (folderId && workspaceId) {
      dispatch({
        type: "DELETE_FOLDER",
        payload: { folderId, workspaceId },
      });
      await deleteFolder(folderId);
      router.replace(`/dashboard/${workspaceId}`);
    }
  };

  return (
    <article
      className="py-2 
        bg-[#EB5757] 
        flex  
        md:flex-row 
        flex-col 
        justify-center 
        items-center 
        gap-4 
        flex-wrap"
    >
      <div
        className="flex 
          flex-col 
          md:flex-row 
          gap-2 
          justify-center 
          items-center"
      >
        <span className="text-white">This Item is in the trash.</span>
        <Button
          size="sm"
          variant="outline"
          className="bg-transparent
              border-white
              text-white
              hover:bg-white
              hover:text-[#EB5757]
              "
          onClick={restoreFileHandler}
        >
          Restore
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="bg-transparent
              border-white
              text-white
              hover:bg-white
              hover:text-[#EB5757]
              "
          onClick={deleteFileHandler}
        >
          Delete
        </Button>
      </div>
      <span className="text-sm text-white">Trash</span>
    </article>
  );
};

export default TrashIndicator;
