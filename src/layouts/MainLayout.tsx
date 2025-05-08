import { useMediaQuery } from 'react-responsive';

import MobileBottomNav from "../components/MobileBottomNav";
import MobileSideBar from "../components/MobileSideBar";
import MobileTopNav from "../components/MobileTopNav";
import DesktopBottomBar from '../components/DesktopBottomBar';
import DesktopSideBar from '../components/DesktopSideBar';
import DesktopTopBar from '../components/DesktopTopBar';

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
      <>
        <DesktopTopBar />
        <div className="flex">
          <DesktopSideBar />
          <main className="flex-1 p-4">{children}</main>
        </div>
        <DesktopBottomBar />
      </>
    );
  }
  
  export default MainLayout;
  