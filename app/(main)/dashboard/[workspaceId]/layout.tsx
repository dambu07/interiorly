import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: any;
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  params,
}) => {
  return (
    <div className="flex overflow-hidden w-screen h-screen">
      <Sidebar params={params} />
      <div className="border border-l-1 relative">{children}</div>
    </div>
  );
};

export default WorkspaceLayout;
