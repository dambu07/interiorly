"use client";

import { File, Folder, workspace } from "@/lib/supabase/supabase.types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "quill/dist/quill.snow.css";
import {
  deleteFile,
  deleteFolder,
  findUser,
  getFileDetails,
  getFolderDetails,
  getWorkspaceDetails,
  updateFile,
  updateFolder,
  updateWorkspace,
} from "@/lib/supabase/queries";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { XCircleIcon } from "lucide-react";
import { useAppState } from "@/lib/provider/state-provider";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "@/components/emoji-picker";
import BannerUpload from "@/components/banner-upload/banner-upload";
import Breadcrumbs from "./breadcrumbs";
import TrashIndicator from "./trash-indicator";
import { Separator } from "../ui/separator";
import { IconClose } from "../icons";
import { getInitials } from "@/lib/utils";

interface QuillEditorProps {
  dirDetails: File | Folder | workspace;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}
var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  dirType,
  fileId,
}) => {
  const supabase = createClientComponentClient();
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const { user } = useSupabaseUser();
  const router = useRouter();
  const socket = null;
  const pathname = usePathname();
  const [quill, setQuill] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<
    { id: string; email: string; avatarUrl: string }[]
  >([]);
  const [deletingBanner, setDeletingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localCursors, setLocalCursors] = useState<any>([]);

  const details = useMemo(() => {
    let selectedDir;
    if (dirType === "file") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === fileId);
    }
    if (dirType === "folder") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId);
    }
    if (dirType === "workspace") {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === fileId
      );
    }

    if (selectedDir) {
      return selectedDir;
    }

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as workspace | Folder | File;
  }, [state, workspaceId, folderId]);

  //
  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const Quill = (await import("quill")).default;
      const QuillCursors = (await import("quill-cursors")).default;
      Quill.register("modules/cursors", QuillCursors);
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
        },
      });
      setQuill(q);
    }
  }, []);

  const iconOnChange = async (icon: string) => {
    if (!fileId) return;
    if (dirType === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { iconId: icon }, workspaceId: fileId },
      });
      await updateWorkspace({ iconId: icon }, fileId);
    }
    if (dirType === "folder") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { iconId: icon },
          workspaceId,
          folderId: fileId,
        },
      });
      await updateFolder({ iconId: icon }, fileId);
    }
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;

      dispatch({
        type: "UPDATE_FILE",
        payload: { file: { iconId: icon }, workspaceId, folderId, fileId },
      });
      await updateFile({ iconId: icon }, fileId);
    }
  };

  const deleteBanner = async () => {
    if (!fileId) return;
    setDeletingBanner(true);
    if (dirType === "file") {
      if (!folderId || !workspaceId) return;
      dispatch({
        type: "UPDATE_FILE",
        payload: { file: { bannerUrl: "" }, fileId, folderId, workspaceId },
      });
      await supabase.storage.from("file-banners").remove([`banner-${fileId}`]);
      await updateFile({ bannerUrl: "" }, fileId);
    }
    if (dirType === "folder") {
      if (!workspaceId) return;
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: { bannerUrl: "" }, folderId: fileId, workspaceId },
      });
      await supabase.storage.from("file-banners").remove([`banner-${fileId}`]);
      await updateFolder({ bannerUrl: "" }, fileId);
    }
    if (dirType === "workspace") {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          workspace: { bannerUrl: "" },
          workspaceId: fileId,
        },
      });
      await supabase.storage.from("file-banners").remove([`banner-${fileId}`]);
      await updateWorkspace({ bannerUrl: "" }, fileId);
    }
    setDeletingBanner(false);
  };

  useEffect(() => {
    if (!fileId) return;
    let selectedDir;
    const fetchInformation = async () => {
      if (dirType === "file") {
        const { data: selectedDir, error } = await getFileDetails(fileId);
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }

        if (!selectedDir[0]) {
          if (!workspaceId) return;
          return router.replace(`/dashboard/${workspaceId}`);
        }
        if (!workspaceId || quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_FILE",
          payload: {
            file: { data: selectedDir[0].data },
            fileId,
            folderId: selectedDir[0].folderId,
            workspaceId,
          },
        });
      }
      if (dirType === "folder") {
        const { data: selectedDir, error } = await getFolderDetails(fileId);
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }

        if (!selectedDir[0]) {
          router.replace(`/dashboard/${workspaceId}`);
        }
        if (quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_FOLDER",
          payload: {
            folderId: fileId,
            folder: { data: selectedDir[0].data },
            workspaceId: selectedDir[0].workspaceId,
          },
        });
      }
      if (dirType === "workspace") {
        const { data: selectedDir, error } = await getWorkspaceDetails(fileId);
        if (error || !selectedDir) {
          return router.replace("/dashboard");
        }
        if (!selectedDir[0] || quill === null) return;
        if (!selectedDir[0].data) return;
        quill.setContents(JSON.parse(selectedDir[0].data || ""));
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            workspace: { data: selectedDir[0].data },
            workspaceId: fileId,
          },
        });
      }
    };
    fetchInformation();
  }, [fileId, workspaceId, quill, dirType]);

  useEffect(() => {
    if (quill === null || socket === null || !fileId || !localCursors.length)
      return;
    const socketHandler = (range: any, roomId: string, cursorId: string) => {
      if (roomId === fileId) {
        const cursorToMove = localCursors.find(
          (c: any) => c.cursors()?.[0].id === cursorId
        );
        if (cursorToMove) {
          cursorToMove.moveCursor(cursorId, range);
        }
      }
    };
    socket.on("receive-cursor-move", socketHandler);
    return () => {
      socket.off("receive-cursor-move", socketHandler);
    };
  }, [quill, socket, fileId, localCursors]);

  //rooms
  useEffect(() => {
    if (socket === null || quill === null || !fileId) return;
    socket.emit("create-room", fileId);
  }, [socket, quill, fileId]);

  //Send quill changes to all clients
  useEffect(() => {
    if (quill === null || socket === null || !fileId || !user) return;

    const selectionChangeHandler = (cursorId: string) => {
      return (range: any, oldRange: any, source: any) => {
        if (source === "user" && cursorId) {
          socket.emit("send-cursor-move", range, fileId, cursorId);
        }
      };
    };
    const quillHandler = (delta: any, oldDelta: any, source: any) => {
      console.log("hello");

      if (source !== "user") return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      console.log("got here");

      setSaving(true);
      const contents = quill.getContents();
      const quillLength = quill.getLength();
      saveTimerRef.current = setTimeout(async () => {
        if (contents && quillLength !== 1 && fileId) {
          if (dirType == "workspace") {
            dispatch({
              type: "UPDATE_WORKSPACE",
              payload: {
                workspace: { data: JSON.stringify(contents) },
                workspaceId: fileId,
              },
            });
            await updateWorkspace({ data: JSON.stringify(contents) }, fileId);
          }
          if (dirType == "folder") {
            if (!workspaceId) return;
            dispatch({
              type: "UPDATE_FOLDER",
              payload: {
                folder: { data: JSON.stringify(contents) },
                workspaceId,
                folderId: fileId,
              },
            });
            await updateFolder({ data: JSON.stringify(contents) }, fileId);
          }
          if (dirType == "file") {
            if (!workspaceId || !folderId) return;
            dispatch({
              type: "UPDATE_FILE",
              payload: {
                file: { data: JSON.stringify(contents) },
                workspaceId,
                folderId: folderId,
                fileId,
              },
            });
            await updateFile({ data: JSON.stringify(contents) }, fileId);
          }
        }
        setSaving(false);
      }, 850);
      socket.emit("send-changes", delta, fileId);
    };
    quill.on("text-change", quillHandler);
    quill.on("selection-change", selectionChangeHandler(user.id));

    return () => {
      quill.off("text-change", quillHandler);
      quill.off("selection-change", selectionChangeHandler);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [quill, socket, fileId, user, details, folderId, workspaceId, dispatch]);

  useEffect(() => {
    if (quill === null || socket === null) return;
    const socketHandler = (deltas: any, id: string) => {
      console.log("received changes");

      if (id === fileId) {
        quill.updateContents(deltas);
      }
    };
    socket.on("receive-changes", socketHandler);

    return () => {
      socket.off("receive-changes", socketHandler);
    };
  }, [quill, socket, fileId]);

  useEffect(() => {
    if (!fileId || quill === null) return;
    const room = supabase.channel(fileId);
    const subscription = room
      .on("presence", { event: "sync" }, () => {
        const newState = room.presenceState();
        const newCollaborators = Object.values(newState).flat() as any;
        setCollaborators(newCollaborators);
        if (user) {
          const allCursors: any = [];
          newCollaborators.forEach(
            (collaborator: { id: string; email: string; avatar: string }) => {
              if (collaborator.id !== user.id) {
                const userCursor = quill.getModule("cursors");
                userCursor.createCursor(
                  collaborator.id,
                  collaborator.email.split("@")[0],
                  `#${Math.random().toString(16).slice(2, 8)}`
                );
                allCursors.push(userCursor);
              }
            }
          );
          setLocalCursors(allCursors);
        }
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !user) return;
        const response = await findUser(user.id);
        if (!response) return;

        room.track({
          id: user.id,
          email: user.email?.split("@")[0],
          avatarUrl: response.avatarUrl
            ? supabase.storage.from("avatars").getPublicUrl(response.avatarUrl)
                .data.publicUrl
            : "",
        });
      });
    return () => {
      supabase.removeChannel(room);
    };
  }, [fileId, quill, supabase, user]);

  return (
    <>
      <TrashIndicator />
      <div className="relative">
        <div
          className="flex 
        flex-col-reverse 
        sm:flex-row 
        sm:justify-between 
        justify-center 
        sm:items-center 
        sm:p-2 
        p-8"
        >
          <Breadcrumbs />
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-10">
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="-ml-3 bg-primary/10 border-2 flex items-center justify-centerborder-white h-8 w-8 rounded-full">
                        <AvatarImage
                          src={
                            collaborator.avatarUrl ? collaborator.avatarUrl : ""
                          }
                          className="rounded-full"
                        />
                        <AvatarFallback>
                          {getInitials(collaborator.email)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{collaborator.email}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {saving ? (
              <Badge
                variant="secondary"
                className="bg-orange-600 top-4
                text-white
                right-4
                z-50
                "
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-emerald-600 
                top-4
              text-white
              right-4
              z-50
              "
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {details.bannerUrl && (
        <div className="relative w-full h-[200px]">
          <Image
            key={details.bannerUrl}
            src={details.bannerUrl}
            fill
            className="w-full md:h-48 h-20 object-cover"
            alt="Banner Image"
          />
        </div>
      )}
      <div className="flex flex-col container justify-center items-center">
        <div className="w-full self-center max-w-3xl flex flex-col my-8">
          <div className="relative text-6xl h-20 w-20 hover:bg-muted rounded-xl flex items-center justify-center">
            <EmojiPicker getValue={iconOnChange}>
              <div className="w-full h-full flex items-center justify-center">
                {details.iconId}
              </div>
            </EmojiPicker>
          </div>
          <div className="flex items-center space-x-3">
            <BannerUpload
              id={details.id}
              dirType={dirType}
              className="text-sm text-muted-foreground hover:text-card-foreground transition-all"
            >
              {details.bannerUrl ? "Update Banner" : "Add Banner"}
            </BannerUpload>
            {details.bannerUrl && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <Button
                  disabled={deletingBanner}
                  onClick={deleteBanner}
                  variant="ghost"
                  className="hover:bg-background flex items-center space-x-1.5 text-sm text-muted-foreground p-0"
                >
                  <span className="whitespace-nowrap font-normal">
                    Remove Banner
                  </span>
                  <XCircleIcon className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
          <span
            className="
            text-muted-foreground
            text-3xl
            font-bold
            h-9
          "
          >
            {details.title}
          </span>
          <span className="text-muted-foreground text-sm">
            {dirType.toUpperCase()}
          </span>
        </div>
        <div id="container" className="max-w-[800px]" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
