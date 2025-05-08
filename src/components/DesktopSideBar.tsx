function DesktopSideBar() {
  return (
    <div className="h-screen w-[20%] bg-gray-100 grid grid-rows-10 p-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-400" />
        <div className="font-semibold text-gray-800">Username</div>
      </div>

      <div></div>

      <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded">
        Dashboard
      </div>
      <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded">
        Income
      </div>
      <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded">
        Outcome
      </div>
      <div className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded">
        AI Recommender
      </div>

      <div className="row-start-10 flex items-center cursor-pointer hover:bg-red-200 p-2 rounded text-red-600 font-semibold">
        Logout
      </div>
    </div>
  );
}

export default DesktopSideBar;
