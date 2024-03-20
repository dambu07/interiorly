"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, postData } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Price, ProductWirhPrice } from "@/lib/supabase/supabase.types";
import { getStripe } from "@/lib/stripe/stripe-client";
import { IconSpinner } from "./icons";
import { toast } from "sonner";
import { useSubscriptionModal } from "@/lib/provider/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";

interface SubscriptionModalProps {
  products: ProductWirhPrice[];
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ products }) => {
  const { open, setOpen } = useSubscriptionModal();
  const { subscription } = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseUser();

  console.log(user);
  console.log(subscription);
  console.log(products);

  const onClickContinue = async (price: Price) => {
    try {
      console.log("clicked");

      setIsLoading(true);
      if (!user) {
        toast("Already on a paid plan");
        setIsLoading(false);
        return;
      }
      if (subscription) {
        toast("Already on a paid plan!");
        setIsLoading(false);
        return;
      }
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      console.log("Getting Checkout for stripe");
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast("Oops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {subscription?.status === "active" ? (
        <DialogContent>Already on a paid plan!</DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to a Pro Plan</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            To access Pro features you need to have a paid plan.
          </DialogDescription>
          {products.length
            ? products.map((product) => (
                <div
                  className="
                  flex
                  justify-between
                  items-center
                  "
                  key={product.id}
                >
                  {product.prices?.map((price) => (
                    <React.Fragment key={price.id}>
                      <b className="text-3xl text-foreground">
                        {formatPrice(price)} / <small>{price.interval}</small>
                      </b>
                      <Button
                        onClick={() => onClickContinue(price)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <IconSpinner className="animate-spin" />
                        ) : (
                          "Upgrade ✨"
                        )}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              ))
            : "No Products Found!"}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SubscriptionModal;
