"use client";

import { AtSign, Loader, LogOut, User } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";

export function UserAvatarDropdown() {
  const session = useSession();
  const { logoutStatus, logoutUser } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <UserAvatar
            userName={session.data?.user.name}
            imgUrl={session.data?.user.image}
          />
          <span className="sr-only">User dropdown settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <AtSign />
          {session.data?.user.email
            ? session.data?.user.email
            : "unknown email"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User />
          {session.data?.user.name ? session.data?.user.name : "unknown user"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={logoutStatus === "loading"}
          onClick={async () => await logoutUser()}
        >
          {logoutStatus === "loading" ? (
            <Loader className="animate-spin" />
          ) : (
            <LogOut />
          )}
          {logoutStatus === "loading" ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserAvatar({
  userName,
  imgUrl,
}: {
  userName?: string | null;
  imgUrl?: string | null;
}) {
  return (
    <Avatar className="rounded-none h-full w-full bg-primary text-primary-foreground">
      <AvatarImage
        src={imgUrl ? imgUrl : undefined}
        alt={userName ? userName : "user"}
      />
      <AvatarFallback className="">
        {userName ? userName[0].toUpperCase() : "?"}
      </AvatarFallback>
    </Avatar>
  );
}

function useLogout() {
  const [logoutStatus, setlogoutStatus] = React.useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const logoutUser = async () => {
    try {
      setlogoutStatus("loading");
      await signOut();
      setlogoutStatus("success");
      toast.success("Logged out", {
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast.error("Failed to Log out", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while logging you out",
      });
      setlogoutStatus("error");
    }
  };

  return { logoutStatus, logoutUser };
}
