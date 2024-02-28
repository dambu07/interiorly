"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserAuthSchemaMagicLink } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

interface MagicLinkDialogProps {
  onSubmit: (data: z.infer<typeof UserAuthSchemaMagicLink>) => void;
  children: React.ReactNode;
}

export function MagicLinkDialog({ onSubmit, children }: MagicLinkDialogProps) {
  const form = useForm<z.infer<typeof UserAuthSchemaMagicLink>>({
    resolver: zodResolver(UserAuthSchemaMagicLink),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Magic Link Sign-In</DialogTitle>
          <DialogDescription>
            Enter your email to sign in via a magic link.
            <br />
            We will send you a link to sign in securely.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@interiorly.dev" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send Link</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
