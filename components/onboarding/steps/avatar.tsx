"use client";

import { IconPen, IconUser } from "@/components/icons";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { MAX_FILE_SIZE_BYTES } from "@/config/upload";
import { toast } from "sonner";
import { handleFileUpload } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface OnboardingStepProfileProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepProfile({ form }: OnboardingStepProfileProps) {
  const { avatar } = form.watch();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles, rejectedFiles) =>
            handleFileUpload(acceptedFiles, rejectedFiles, () =>
              form.setValue("avatar", acceptedFiles[0])
            )
          }
          maxSize={MAX_FILE_SIZE_BYTES}
          accept={{
            "image/png": [],
            "image/jpg": [],
            "image/jpeg": [],
            "image/gif": [],
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={cn(
                "relative rounded-lg w-3/4 border-border h-56 flex items-center justify-center",
                !avatar && "border cursor-pointer"
              )}
            >
              {!avatar ? (
                <div className="flex items-center justify-center h-full w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-background hover:bg-background/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <IconUser className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="mb-2 text-sm text-secondary-foreground font-bold">
                        <span className="font-normal">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground text-center">
                        Upload a PNG, JPG or GIF under 10MB.
                        <br /> Images should be at least 128x128.
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="group relative h-full aspect-square">
                  <Image
                    src={URL.createObjectURL(
                      new Blob([avatar], {
                        type: "image/png",
                      })
                    )}
                    alt="Avatar"
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                  />
                  <div className="hidden group-hover:flex absolute top-0 w-full h-full items-center justify-center bg-black/30  dark:bg-black/50 cursor-pointer rounded-full">
                    <IconPen className="w-10 h-10 text-gray-100" />
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        {avatar && (
          <span
            className="mt-5 text-sm text-muted-foreground cursor-pointer"
            onClick={() => form.setValue("avatar", null)}
          >
            Remove Avatar
          </span>
        )}
      </div>
    </div>
  );
}

export default OnboardingStepProfile;
