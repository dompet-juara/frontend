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
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return isMobile ? (
    <>
      <MobileTopNav />
      <MobileSideBar />
      <div className="pt-[3.5rem] pb-[3.5rem]">{children}</div>
      <MobileBottomNav />
    </>
  ) : (
    <div className="flex h-screen">
      {/* Sidebar 20% */}
      <DesktopSideBar />

      {/* Main Area 80% */}
      <div className="flex flex-col w-[80%]">
        <DesktopTopBar />

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>

        <DesktopBottomBar />
      </div>
    </div>
  );
}

export default MainLayout;
