"use client";

import { IconUser } from "@/components/icons";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import Dropzone from "react-dropzone";

interface OnboardingStepProfileProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
  displayName: string;
  email: string;
  createdAt: string;
}

function OnboardingStepProfile({
  displayName,
  email,
}: OnboardingStepProfileProps) {
  const [length, setLength] = useState(0);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center hover:cursor-pointer">
        <Dropzone
          multiple={false}
          onDrop={async (acceptedFile) => {
            console.log("dropped");
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
              {...getRootProps()}
              className="border rounded-lg w-3/4 border-border h-56"
            >
              <div className="flex items-center justify-center h-full w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-background hover:bg-background/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IconUser className="h-6 w-6 text-zinc-500 mb-2" />
                    <p className="mb-2 text-sm text-zinc-700">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">PLACEHOLDER</p>
                  </div>

                  <input
                    {...getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default OnboardingStepProfile;
