import { NavLink } from "react-router-dom";
import { useAuthPresenter } from "../presenters/authPresenter";
import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommenderIcon from "../assets/icons/ai-recommender.svg";
import logoutIcon from "../assets/icons/logout.svg";
import profileIcon from "../assets/icons/profile.svg";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from 'react';

type MobileSideBarProps = {
  closeSidebar: () => void;
};

function MobileSideBar({ closeSidebar }: MobileSideBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const { handleLogout: presenterLogout } = useAuthPresenter();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleLinkClick = () => {
    closeSidebar();
  };
  
  const handleLogoutClick = async () => {
    await presenterLogout();
    closeSidebar();
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center p-3 rounded-md text-gray-700 font-medium transition-colors ${
      isActive 
        ? "bg-blue-100 text-blue-700"
        : "hover:bg-gray-100"
    }`;


  return (
    <div
      className={`fixed inset-0 z-[999] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={closeSidebar}
          className="text-3xl font-bold text-gray-700 hover:text-gray-900 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="flex items-center space-x-4 px-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-md overflow-hidden">
           {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || user.username || "Avatar"} className="w-full h-full object-cover" />
           ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')
           )}
        </div>
        <div className="flex flex-col overflow-hidden">
            <div
              className="font-bold text-gray-900 text-lg truncate"
              title={user?.name || user?.username || "User"}
            >
              {user?.name || user?.username || "User"}
            </div>
            <div className="text-sm text-gray-500 truncate" title={user?.email || "No email"}>
                {user?.email || "No email"}
            </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-1 p-4">
        <NavLink to="/dashboard" onClick={handleLinkClick} className={navLinkClasses}>
          <img src={dashboardIcon} alt="Dashboard" className="w-5 h-5 mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/income" onClick={handleLinkClick} className={navLinkClasses}>
          <img src={incomeIcon} alt="Income" className="w-5 h-5 mr-3" /> Income
        </NavLink>
        <NavLink to="/outcome" onClick={handleLinkClick} className={navLinkClasses}>
          <img src={outcomeIcon} alt="Outcome" className="w-5 h-5 mr-3" /> Outcome
        </NavLink>
        <NavLink to="/aireccomender" onClick={handleLinkClick} className={navLinkClasses}>
          <img src={aiRecommenderIcon} alt="AI Recommender" className="w-5 h-5 mr-3" /> AI Recommender
        </NavLink>
        <NavLink to="/profile" onClick={handleLinkClick} className={navLinkClasses}>
          <img src={profileIcon} alt="Profile" className="w-5 h-5 mr-3" /> My Profile
        </NavLink>
        <hr className="my-3 border-gray-200"/>
        <button onClick={handleLogoutClick} className="flex items-center p-3 rounded-md hover:bg-red-50 text-red-600 font-medium w-full text-left transition-colors">
          <img src={logoutIcon} alt="Logout" className="w-5 h-5 mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
}

export default MobileSideBar;