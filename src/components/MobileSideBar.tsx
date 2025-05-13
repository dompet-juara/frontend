import { useEffect, useState } from "react";

type MobileSideBarProps = {
  closeSidebar: () => void;
};

function MobileSideBar({ closeSidebar }: MobileSideBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={closeSidebar}
          className="text-3xl font-bold text-gray-800"
        >
          ×
        </button>
      </div>

      <div className="flex items-center space-x-4 px-6 mb-12">
        <div className="w-16 h-16 rounded-full bg-gray-400 shrink-0" />
        <div
          className="font-bold text-gray-900 text-lg truncate w-full"
          title="Username"
        >
          Username SangatPanjangSekali
        </div>
      </div>

    </div>
  );
}

export default MobileSideBar;
