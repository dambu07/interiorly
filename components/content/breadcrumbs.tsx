"use client";

import React, { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useAppState } from "@/lib/provider/state-provider";
import { usePathname } from "next/navigation";
import { BreadcrumbItem } from "@nextui-org/react";
import { BreadCrumb } from "@/types";

const Breadcrumbs = () => {
  const { state, workspaceId } = useAppState();
  const pathname = usePathname();

  const breadCrumbs = useMemo(() => {
    if (!pathname || !state.workspaces || !workspaceId) return;

    const pathnameParts = pathname.split("/").filter((p) => p);

    const workspace = state.workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return;

    const indexBreadcrumb: BreadCrumb = {
      title: `${workspace.iconId} ${workspace.title}`,
      href: `/dashboard/${workspace.id}`,
    };

    console.log("🟢 pathname", pathnameParts);

    const folder = workspace.folders.find((f) => f.id === pathnameParts[2]);
    if (!folder) return [indexBreadcrumb];

    const folderBreadcrumb: BreadCrumb = {
      title: `${folder.iconId} ${folder.title}`,
      href: `/dashboard/${workspace.id}/${folder.id}`,
    };

    const file = folder.files.find((f) => f.id === pathnameParts[3]);
    if (!file) return [indexBreadcrumb, folderBreadcrumb];

    const fileBreadcrumb: BreadCrumb = {
      title: `${file.iconId} ${file.title}`,
      href: `/dashboard/${workspace.id}/${folder.id}/${file.id}`,
    };

    return [indexBreadcrumb, folderBreadcrumb, fileBreadcrumb];
  }, [state, pathname, workspaceId]);

  if (!breadCrumbs) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs.map((breadcrumb, index) => {
          return index < breadCrumbs.length - 1 ? (
            <>
              <BreadcrumbItem href={breadcrumb.href}>
                {breadcrumb.title}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
