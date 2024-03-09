import { IconPen, IconSecure, IconUser, IconUsers } from "@/components/icons";
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
import { MAX_FILE_SIZE_BYTES } from "@/config/upload";
import { handleFileUpload } from "@/lib/upload";
import { OnboardingSchema } from "@/lib/validations/onboarding";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ColorThief from "color-thief-react";

interface OnboardingStepWorkspaceSetupProps {
  form: UseFormReturn<z.infer<typeof OnboardingSchema>>;
}

function OnboardingStepWorkspaceSetup({
  form,
}: OnboardingStepWorkspaceSetupProps) {
  const {
    workspaceName,
    workspaceDescription,
    workspaceLogo,
    workspaceBanner,
    workspaceBannerColor,
    workspaceType,
  } = form.watch();

  return (
    <Card className="w-3/4">
      <div className="grid grid-rows-3 h-80">
        <div
          style={{ backgroundColor: workspaceBannerColor }}
          className="relative group w-full h-full rounded-t-md bg-ring"
        >
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles, rejectedFiles) =>
              handleFileUpload(acceptedFiles, rejectedFiles, () =>
                form.setValue("workspaceBanner", acceptedFiles[0])
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
            {({ getRootProps }) => (
              <div
                {...getRootProps()}
                className="w-full h-full flex items-center justify-center"
              >
                <div className="group">
                  {workspaceBanner && (
                    <Image
                      src={URL.createObjectURL(
                        new Blob([workspaceBanner], {
                          type: "image/png",
                        })
                      )}
                      alt="Avatar"
                      objectFit="cover"
                      layout="fill"
                      className="rounded-t-md"
                    />
                  )}
                  <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/30 dark:bg-black/50 rounded-t-md items-center justify-center cursor-pointer">
                    <span className="text-xs uppercase text-white font-semibold">
                      Change Banner
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Dropzone>
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
        <div className="relative flex flex-col pt-16 row-span-2">
          <div className="absolute group -top-10 left-0 right-0 mx-auto w-24 h-24 font-medium border-4 border-card rounded-full bg-ring">
            <Dropzone
              multiple={false}
              onDrop={(acceptedFiles, rejectedFiles) =>
                handleFileUpload(acceptedFiles, rejectedFiles, async () =>
                  form.setValue("workspaceLogo", acceptedFiles[0])
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
              {({ getRootProps }) => (
                <div
                  {...getRootProps()}
                  className="w-full h-full flex items-center justify-center rounded-full"
                >
                  <div className="group">
                    {workspaceLogo ? (
                      <>
                        {/* <ColorThief
                          src={URL.createObjectURL(workspaceLogo)}
                          format="hex"
                        >
                          {({ data }): React.ReactNode => {
                            console.log(data);
                            form.setValue(
                              "workspaceBannerColor",
                              data as string
                            );
                            return null;
                          }}
                        </ColorThief> */}
                        <Image
                          src={URL.createObjectURL(
                            new Blob([workspaceLogo], {
                              type: "image/png",
                            })
                          )}
                          alt="Avatar"
                          objectFit="contain"
                          layout="fill"
                          className="rounded-full"
                        />
                      </>
                    ) : workspaceType === "team" ? (
                      <IconUsers className="w-10 h-10 text-secondary-foreground" />
                    ) : (
                      <IconUser className="w-10 h-10 text-secondary-foreground" />
                    )}
                    <div className="hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/30 dark:bg-black/50 items-center justify-center rounded-full cursor-pointer">
                      <IconPen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>{" "}
          </div>
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
          <div className="absolute bottom-1.5 w-full flex justify-center gap-1">
            {workspaceBanner && (
              <div
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={() => form.setValue("workspaceBanner", null)}
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
                onClick={() => form.setValue("workspaceLogo", null)}
              >
                Remove Logo
              </div>
            )}
          </div>
        </div>
      </div>
      {workspaceType === "team" && (
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
  );
}

export default OnboardingStepWorkspaceSetup;
