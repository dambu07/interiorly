"use client";

import {
  IconPen,
  IconPlus,
  IconSecure,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import { WorkspaceCollaboration } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface OnboardingStepWorkspaceSetupProps {
  displayName: string;
  collaborationType: WorkspaceCollaboration;
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepWorkspaceSetup({
  collaborationType,
  form,
}: OnboardingStepWorkspaceSetupProps) {
  const [length, setLength] = useState(0);
  const formRef = React.useRef(form);

  const workspaceBannerDropzone = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const workspaceLogoDropzone = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  useEffect(() => {
    console.log("called banner");

    const acceptedFiles = workspaceBannerDropzone.acceptedFiles;
    const fileRejections = workspaceBannerDropzone.fileRejections;

    if (acceptedFiles.length === 0 && fileRejections.length !== 0) {
      toast("Invalid File type", {
        description: "Please upload a valid image file",
      });
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formRef.current.setValue("workspaceBanner", file as File);
    }
  }, [
    workspaceBannerDropzone.acceptedFiles,
    workspaceBannerDropzone.fileRejections,
  ]);

  useEffect(() => {
    console.log("called logo");

    const acceptedFiles = workspaceLogoDropzone.acceptedFiles;
    const fileRejections = workspaceLogoDropzone.fileRejections;

    if (acceptedFiles.length === 0 && fileRejections.length !== 0) {
      toast("Invalid File type", {
        description: "Please upload a valid image file",
      });
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formRef.current.setValue("workspaceLogo", file as File);
    }
  }, [
    workspaceLogoDropzone.acceptedFiles,
    workspaceLogoDropzone.fileRejections,
  ]);

  const {
    workspaceName,
    workspaceDescription,
    workspaceLogo,
    workspaceBanner,
  } = formRef.current.watch();

  return (
    <div className="w-3/4 h-full relative">
      <Card className="flex flex-col">
        <div className="relative grid grid-rows-3 h-80">
          <div className="group relative w-full h-full bg-ring rounded-t-md">
            {workspaceBanner && (
              <Image
                src={URL.createObjectURL(
                  new Blob([workspaceBanner as File], { type: "image/png" })
                )}
                alt="Workspace Banner"
                objectFit="cover"
                layout="fill"
                className="w-full h-full rounded-t-md bg-ring"
              />
            )}
            <div
              {...workspaceBannerDropzone.getRootProps({
                className: "dropzone",
              })}
              className="hidden group-hover:flex absolute w-full h-full rounded-t-md items-center justify-center bg-black/30  dark:bg-black/50 cursor-pointer"
            >
              <input
                {...workspaceBannerDropzone.getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />{" "}
              <span className="text-xs font-bold text-gray-100 uppercase ">
                Change Banner
              </span>
            </div>
            <div className="absolute top-1.5 right-1.5">
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div>
                    <IconSecure className="w-3 h-3 hover:cursor-pointer text-gray-100" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Exclusive to Pro plan or higher</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="absolute group top-16 left-0 right-0 mx-auto w-24 h-24 font-medium border-4 border-card rounded-full bg-ring">
            <div className="w-full h-full bg-ring rounded-full flex items-center justify-center">
              {workspaceLogo ? (
                <Image
                  src={URL.createObjectURL(
                    new Blob([workspaceLogo as File], {
                      type: "image/png",
                    })
                  )}
                  alt="Workspace Banner"
                  objectFit="cover"
                  layout="fill"
                  className="w-full h-full bg-ring rounded-full"
                />
              ) : collaborationType === "individual" ? (
                <IconUser className="w-10 h-10" />
              ) : (
                <IconUsers className="w-10 h-10" />
              )}
            </div>
            <div
              {...workspaceLogoDropzone.getRootProps({
                className: "dropzone",
              })}
              className="hidden group-hover:flex absolute top-0 w-full h-full items-center justify-center bg-black/30  dark:bg-black/50 cursor-pointer rounded-full"
            >
              <input
                {...workspaceLogoDropzone.getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />{" "}
              <IconPen className="w-7 h-7 text-gray-100" />
            </div>
          </div>
          <div className="flex flex-col mt-20">
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem className="w-full text-center">
                  <FormControl>
                    <Input
                      className="text-2xl font-semibold flex text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-card border-none"
                      placeholder="Workspace Name"
                      value={workspaceName}
                      onChange={(e) =>
                        form.setValue("workspaceName", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspaceDescription"
              render={({ field }) => (
                <FormItem className="w-full text-center">
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        className="border-none resize-none bg-card text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground"
                        placeholder="Workspace Description"
                        maxLength={150}
                        spellCheck={false}
                        rows={2}
                        value={workspaceDescription}
                        onChange={(e) => {
                          setLength(e.target.value.length);
                          form.setValue("workspaceDescription", e.target.value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="absolute bottom-1 right-1.5 text-muted">
              {150 - length}
            </span>
          </div>
          <div className="absolute bottom-1.5 w-full flex justify-center gap-1">
            {workspaceBanner && (
              <div
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={() =>
                  formRef.current.setValue("workspaceBanner", null)
                }
              >
                Remove Banner
              </div>
            )}
            {workspaceBanner && workspaceLogo && (
              <div className="h-5 flex items-center justify-end">
                <Separator orientation="vertical" className="h-3 w-0.5" />
              </div>
            )}
            {workspaceLogo && (
              <div
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={() => formRef.current.setValue("workspaceLogo", null)}
              >
                Remove Logo
              </div>
            )}
          </div>
        </div>
        {collaborationType === "team" && (
          <div className="my-3 w-full">
            <div className="flex items-center justify-center">
              <Button variant={"outline"}>
                <IconUser className="w-3 h-3 mr-2" />
                You have not invited anyone yet
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default OnboardingStepWorkspaceSetup;
