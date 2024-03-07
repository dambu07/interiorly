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
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface OnboardingStepWorkspaceSetupProps {
  displayName: string;
  collaborationType: "individual" | "team";
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
      formRef.current.setValue("workspaceBanner", file);
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
      formRef.current.setValue("workspaceLogo", file);
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
          <div className="relative w-full h-full bg-ring rounded-t-md">
            <div>
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
            </div>
            <div
              {...workspaceBannerDropzone.getRootProps({
                className: "dropzone",
              })}
              className="absolute group-hover:flex w-full h-full rounded-t-md items-center justify-center hover:bg-black/30  dark:hover:bg-black/50 hover:cursor-pointer"
            >
              <input
                {...workspaceBannerDropzone.getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />{" "}
              <span className="w-full h-full items-center justify-center text-xs font-semibold uppercase text-gray-100 ">
                Change Banner
              </span>
            </div>
            <div className="absolute top-1.5 right-1.5">
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div>
                    <IconSecure className="w-3 h-3 hover:cursor-pointer" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Exclusive to Pro plan or higher</TooltipContent>
              </Tooltip>
            </div>
            <div className="absolute group -bottom-16 left-0 right-0 mx-auto w-24 h-24 font-medium flex items-center justify-center border-4 border-card rounded-full bg-ring">
              <div className="hidden group-hover:flex group-hover:absolute w-full h-full rounded-full hover:bg-black/50 hover:cursor-pointer">
                <div
                  {...workspaceLogoDropzone.getRootProps({
                    className: "dropzone",
                  })}
                  className="w-full h-full flex items-center justify-center"
                >
                  <input
                    {...workspaceLogoDropzone.getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                  <IconPen className="w-6 h-6" />
                </div>
              </div>
              <div className="m-auto">
                {workspaceLogo && (
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
                )}
                {collaborationType === "individual" ? (
                  <IconUser className="w-10 h-10" />
                ) : (
                  <IconUsers className="w-10 h-10" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-20">
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem className="w-full">
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspaceDescription"
              render={({ field }) => (
                <FormItem className="w-ful">
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
                </FormItem>
              )}
            />
            <span className="absolute bottom-1 right-1.5 text-muted">
              {150 - length}
            </span>
          </div>
          <Button
            className="absolute bottom-0"
            onClick={() => formRef.current.setValue("workspaceBanner", null)}
          >
            Remove Banner + Logo
          </Button>
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
