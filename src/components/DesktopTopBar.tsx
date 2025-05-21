import { useLocation } from 'react-router-dom';

function DesktopTopBar() {
  const location = useLocation();
  let pageTitle = "Dashboard";

  if (location.pathname.includes("/income")) pageTitle = "Income Management";
  else if (location.pathname.includes("/outcome")) pageTitle = "Outcome Management";
  else if (location.pathname.includes("/aireccomender")) pageTitle = "AI Recommender";
  else if (location.pathname.includes("/dashboard")) pageTitle = "Dashboard / Laporan";


  return (
    <div className="w-full h-16 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between px-6">
      <span className=""></span>

      <div className="text-gray-700 font-medium text-lg">
        {pageTitle}
      </div>
    </div>
  );
}

export default DesktopTopBar;