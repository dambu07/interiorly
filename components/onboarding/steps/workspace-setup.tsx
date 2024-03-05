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
import { set, z } from "zod";
import Color from "color-thief-react";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface OnboardingStepWorkspaceSetupProps {
  displayName: string;
  collaborationType: "individual" | "team";
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepWorkspaceSetup({
  collaborationType,
  displayName,
  form,
}: OnboardingStepWorkspaceSetupProps) {
  const [length, setLength] = useState(0);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState<
    string | null
  >(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const backgroundColorRef = React.useRef<string | null>(null);
  const bannerContainerRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef(form);

  const bannerDropzone = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const pfpDropzone = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  useEffect(() => {
    const acceptedFiles = bannerDropzone.acceptedFiles;
    const fileRejections = bannerDropzone.fileRejections;

    if (acceptedFiles.length === 0 && fileRejections.length !== 0) {
      toast("Invalid File type", {
        description: "Please upload a valid image file",
      });
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formRef.current.setValue("workspaceBanner", file);

      file.arrayBuffer().then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        setCurrentBanner(`data:${file.type};base64,${base64}`);
      });
    }
  }, [bannerDropzone.acceptedFiles, bannerDropzone.fileRejections]);

  useEffect(() => {
    const acceptedFiles = pfpDropzone.acceptedFiles;
    const fileRejections = pfpDropzone.fileRejections;

    if (acceptedFiles.length === 0 && fileRejections.length !== 0) {
      toast("Invalid File type", {
        description: "Please upload a valid image file",
      });
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formRef.current.setValue("workspaceBanner", file);

      file.arrayBuffer().then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        setCurrentProfilePicture(`data:${file.type};base64,${base64}`);
      });
    }
  }, [pfpDropzone.acceptedFiles, pfpDropzone.fileRejections]);

  useEffect(() => {
    if (
      (titleRef.current && !titleRef.current.value) ||
      titleRef.current?.value === ""
    ) {
      titleRef.current.value = `${displayName}'s Workspace`;
      formRef.current.setValue("workspaceName", titleRef.current.value);
    }
    if (
      (descriptionRef.current && !descriptionRef.current.value) ||
      descriptionRef.current?.value === ""
    ) {
      descriptionRef.current.value = `Welcome to ${
        displayName.split(" ")[0]
      }'s Workspace! 🚀`;
      formRef.current.setValue(
        "workspaceDescription",
        descriptionRef.current.value
      );
    }
    setLength(descriptionRef.current?.value.length || 0);
  }, [displayName]);

  return (
    <div className="w-3/4 h-full relative">
      <Card className="flex flex-col">
        <div className="relative grid grid-rows-3 h-80">
          <div
            className="relative w-full h-full bg-ring rounded-t-md"
            ref={bannerContainerRef}
          >
            {currentBanner && (
              <Image
                src={currentBanner}
                alt="Workspace Banner"
                objectFit="cover"
                layout="fill"
                className="w-full h-full rounded-t-md bg-ring"
              />
            )}
            <div className="relative w-full h-full rounded-t-md group-hover:absolute group-hover:flex items-center justify-center hover:bg-black/50 hover:cursor-pointer">
              <div
                {...bannerDropzone.getRootProps({
                  className: "dropzone",
                })}
                className="w-full h-full absolute"
              >
                <input
                  {...bannerDropzone.getInputProps()}
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                />{" "}
                <span className="text-xs hidden group-hover:block text-white font-bold uppercase ">
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
                  <TooltipContent>
                    Exclusive to Pro plan or higher
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="absolute group -bottom-16 left-0 right-0 mx-auto w-24 h-24 font-medium flex items-center justify-center border-4 border-card rounded-full bg-ring">
              <div className="hidden group-hover:flex group-hover:absolute w-full h-full rounded-full hover:bg-black/50 hover:cursor-pointer">
                <div
                  {...pfpDropzone.getRootProps({
                    className: "dropzone",
                  })}
                  className="w-full h-full flex items-center justify-center"
                >
                  <input
                    {...pfpDropzone.getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                  <IconPen className="w-6 h-6" />
                </div>
              </div>
              <div className="m-auto">
                {currentProfilePicture && (
                  <Color src={currentProfilePicture} format="hex">
                    {({ data }) => {
                      bannerContainerRef.current &&
                        (bannerContainerRef.current.style.backgroundColor =
                          data as string);
                      return (
                        <Image
                          src={currentProfilePicture}
                          alt="Workspace Banner"
                          objectFit="cover"
                          layout="fill"
                          className="w-full h-full bg-ring rounded-full"
                        />
                      );
                    }}
                  </Color>
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
                      ref={titleRef}
                      value={titleRef.current?.value}
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
                        ref={descriptionRef}
                        spellCheck={false}
                        rows={2}
                        onChange={(e) => {
                          setLength(e.target.value.length);
                          form.setValue("workspaceName", e.target.value);
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
