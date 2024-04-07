export const dynamic = "force-dynamic";

import QuillEditor from "@/components/content/quill-editor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({ params }: { params: { workspaceId: string } }) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);
  console.log(data, error);
  if (error || !data.length) redirect("/dashboard");
  return (
    <div className="relative w-full border bg-secondary/40">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
};

export default Workspace;
