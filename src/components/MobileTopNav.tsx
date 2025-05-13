type MobileTopNavProps = {
  toggleSidebar: () => void;
};

function MobileTopNav({ toggleSidebar }: MobileTopNavProps) {
  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b flex items-center justify-between xl:hidden px-4 py-3 z-50">
      <button onClick={toggleSidebar} className="text-2xl font-bold text-gray-800">
        ☰
      </button>

      <button className="text-sm font-medium text-gray-800 hover:text-blue-500">
        Profile
      </button>
    </div>
  );
}

export default MobileTopNav;
