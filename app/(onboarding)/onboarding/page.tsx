// import React from "react";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// // import db from "@/lib/supabase/db";
// import { redirect } from "next/navigation";

// async function DashboardPage() {
//   const supabase = createServerComponentClient({ cookies });
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return;
//   // const workspace = await db.query.workspaces.findFirst({
//   //   where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
//   // });

//   // const subscription = await db.query.subscriptions.findFirst({
//   //   where: (subscription, { eq }) => eq(subscription.userId, user.id),
//   // });

//   //   if (!subscription) return;

//   if (!workspace)
//     return (
//       <div className="bg-background h-screen flex justify-center items-center">
//         {/* <WorkspaceOnboarding user={user} subscription={"active"} /> */}
//       </div>
//     );

//   redirect(`/dashboard/${workspace.id}`);

//   return <div>DashboardPage</div>;
// }

// export default DashboardPage;
