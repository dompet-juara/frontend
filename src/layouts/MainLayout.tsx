import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

import MobileBottomNav from "../components/MobileBottomNav";
import MobileSideBar from "../components/MobileSideBar";
import MobileTopNav from "../components/MobileTopNav";
import DesktopBottomBar from "../components/DesktopBottomBar";
import DesktopSideBar from "../components/DesktopSideBar";
import DesktopTopBar from "../components/DesktopTopBar";

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return isMobile ? (
    <div className="flex flex-col min-h-screen">
      <MobileTopNav toggleSidebar={toggleSidebar} />
      {isSidebarOpen && <MobileSideBar closeSidebar={() => setSidebarOpen(false)} />}
      <main className={`flex-1 pt-[3.5rem] pb-[3.5rem] bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {children}
      </main>
      <MobileBottomNav />
    </div>
  ) : (
    <div className="flex h-screen bg-gray-100">
      <DesktopSideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DesktopTopBar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            {children}
        </main>
        <DesktopBottomBar />
      </div>
    </div>
  );
}

export default MainLayout;