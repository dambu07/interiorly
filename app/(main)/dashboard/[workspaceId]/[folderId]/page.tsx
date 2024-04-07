export const dynamic = "force-dynamic";

import { getFolderDetails } from "@/lib/supabase/queries";
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";

const Folder = async ({ params }: { params: { folderId: string } }) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace: any, { eq }: { eq: any }) =>
      eq(workspace.workspaceOwner, user.id),
  });

  if (!workspace) return redirect("/dashboard");
  const { data, error } = await getFolderDetails(params.folderId);
  if (error !== null) return redirect(`/dashboard/${workspace.id}`);

  if (data)
    return redirect(
      `/dashboard/${workspace.id}/${params.folderId}/${data[0].id}`,
    );
  else return redirect("/dashboard");
};

export default Folder;
