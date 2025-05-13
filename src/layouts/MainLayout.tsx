import { useState } from "react";
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
    <>
      <MobileTopNav toggleSidebar={toggleSidebar} />
      {isSidebarOpen && <MobileSideBar closeSidebar={() => setSidebarOpen(false)} />}
      <div className="pt-[3.5rem] pb-[3.5rem]">{children}</div>
      <MobileBottomNav />
    </>
  ) : (
    <div className="flex h-screen">
      <DesktopSideBar />
      <div className="flex flex-col w-[80%]">
        <DesktopTopBar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        <DesktopBottomBar />
      </div>
    </div>
  );
}

export default MainLayout;
