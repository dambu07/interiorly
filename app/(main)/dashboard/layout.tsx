import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <div className="relative flex border border-l-[1px] w-full overflow-scroll bored-red-500">
        <Sidebar params={params} />
        <MobileSidebar>
          <Sidebar
            params={params}
            className="inline-block sm:hidden w-screen"
          />
        </MobileSidebar>
        {children}
      </div>
    </main>
  );
};

export default Layout;
