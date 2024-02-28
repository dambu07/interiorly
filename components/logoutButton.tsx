"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { actionLogoutUser } from "@/lib/server-actions/auth";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function LogoutButton() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Logout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You will be logged out of your account and redirected to the landing
            page.
          </DialogDescription>
          <DialogFooter>
            <Button
              type="submit"
              variant="default"
              className="mt-5"
              onClick={() => {
                actionLogoutUser();
                router.replace("/");
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutButton;
