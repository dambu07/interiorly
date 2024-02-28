import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col space-y-5">
        <span className="text-xl w-full text-center font-semibold">
          Interiorly
        </span>
        <div className="flex space-x-5">
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Sign-In
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Sign-Up
          </Link>
        </div>
      </div>
    </main>
  );
}
