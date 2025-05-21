import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommenderIcon from "../assets/icons/ai-recommender.svg";
import logoutIcon from "../assets/icons/logout.svg";


type MobileSideBarProps = {
  closeSidebar: () => void;
};

function MobileSideBar({ closeSidebar }: MobileSideBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleLinkClick = () => {
    closeSidebar();
  };
  
  const handleLogout = () => {
    logout();
    closeSidebar();
  };


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
        <div className="w-16 h-16 rounded-full bg-gray-400 shrink-0 flex items-center justify-center text-gray-800 text-2xl font-bold">
           {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div
          className="font-bold text-gray-900 text-lg truncate w-full"
          title={user?.username || "User"}
        >
          {user?.name || "User"}
        </div>
      </div>

      <nav className="flex flex-col space-y-2 p-4">
        <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center p-3 rounded hover:bg-gray-100 text-gray-700">
          <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6 mr-3" /> Dashboard
        </Link>
        <Link to="/income" onClick={handleLinkClick} className="flex items-center p-3 rounded hover:bg-gray-100 text-gray-700">
          <img src={incomeIcon} alt="Income" className="w-6 h-6 mr-3" /> Income
        </Link>
        <Link to="/outcome" onClick={handleLinkClick} className="flex items-center p-3 rounded hover:bg-gray-100 text-gray-700">
          <img src={outcomeIcon} alt="Outcome" className="w-6 h-6 mr-3" /> Outcome
        </Link>
        <Link to="/aireccomender" onClick={handleLinkClick} className="flex items-center p-3 rounded hover:bg-gray-100 text-gray-700">
          <img src={aiRecommenderIcon} alt="AI Recommender" className="w-6 h-6 mr-3" /> AI Recommender
        </Link>
        <hr className="my-4"/>
        <button onClick={handleLogout} className="flex items-center p-3 rounded hover:bg-gray-100 text-red-600 w-full text-left">
          <img src={logoutIcon} alt="Logout" className="w-6 h-6 mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
}

export default MobileSideBar;