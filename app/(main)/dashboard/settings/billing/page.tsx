"use client";

import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useSubscriptionModal } from "@/lib/provider/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import Link from "next/link";

export default function BillingPage() {
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);
  const { setOpen, open } = useSubscriptionModal();
  const { user, subscription } = useSupabaseUser();

  console.log(user);
  console.log(open);

  const redirectToCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const res: Response = await fetch("/api/create-portal-link", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
      });

      const { url } = await res.json();
      if (!url) throw new Error("No portal link found");

      redirect(url);
    } catch (error) {
      console.log(error);
      toast("Error creating portal link", {
        description: "Please try again later.",
      });
      setLoadingPortal(false);
    }
    setLoadingPortal(false);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Mange your Plan and Billing settings."
      />
      <div className="grid gap-10">
        {subscription?.status === "active" ? (
          <div>
            <Button
              type="button"
              size="sm"
              variant={"secondary"}
              className="text-sm"
              onClick={redirectToCustomerPortal}
            >
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div>
            <Link
              href={"https://buy.stripe.com/test_9AQbJt7fufVqamQdQR"}
              className={buttonVariants({ variant: "outline" })}
            >
              Upgrade to Pro Plan
            </Link>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
