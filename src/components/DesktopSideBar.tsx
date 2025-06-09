import { NavLink } from "react-router-dom";
import { useAuthPresenter } from "../presenters/authPresenter";

import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommenderIcon from "../assets/icons/ai-recommender.svg";
import logoutIcon from "../assets/icons/logout.svg";
import profileIcon from "../assets/icons/profile.svg";
import { useAuth } from "../contexts/AuthContext";

function DesktopSideBar() {
  const { user } = useAuth();
  const { handleLogout: presenterLogout } = useAuthPresenter();

  const handleLogoutClick = async () => {
    await presenterLogout();
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center p-4 rounded-lg text-lg transition-all duration-200 ${
      isActive
        ? "bg-[oklch(0.42_0.0761_194.77)] text-white shadow-md"
        : "text-gray-200 hover:bg-[oklch(0.40_0.0761_194.77)] hover:text-white"
    } active:scale-95`;


  return (
    <div className="h-screen w-[20%] min-w-[280px] bg-primary flex flex-col p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-10 pt-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 text-primary flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || user.username || "Avatar"} className="w-full h-full object-cover" />
          ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <div
            className="font-bold text-white text-xl truncate"
            title={user?.name || user?.username || "User"}
          >
            {user?.name || user?.username || "User"}
          </div>
          <div className="text-sm text-gray-300 truncate" title={user?.email || "No email"}>
            {user?.email || "No email"}
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-3 text-white font-medium flex-grow">
        <NavLink to="/dashboard" className={navLinkClasses}>
          <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6 mr-4" />
          Dashboard
        </NavLink>
        <NavLink to="/income" className={navLinkClasses}>
          <img src={incomeIcon} alt="Income" className="w-6 h-6 mr-4" />
          Income
        </NavLink>
        <NavLink to="/outcome" className={navLinkClasses}>
          <img src={outcomeIcon} alt="Outcome" className="w-6 h-6 mr-4" />
          Outcome
        </NavLink>
        <NavLink to="/aireccomender" className={navLinkClasses}>
          <img
            src={aiRecommenderIcon}
            alt="AI Recommender"
            className="w-6 h-6 mr-4"
          />
          AI Recommender
        </NavLink>
        <NavLink to="/profile" className={navLinkClasses}>
          <img src={profileIcon} alt="Profile" className="w-6 h-6 mr-4" />
          My Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogoutClick}
        className="flex items-center bg-[oklch(0.40_0.0761_194.77)] hover:bg-[oklch(0.38_0.0761_194.77)] active:scale-95 transition-all duration-200 p-4 rounded-lg text-red-100 font-bold text-lg w-full text-left mt-auto"
      >
        <img src={logoutIcon} alt="Logout" className="w-6 h-6 mr-4" />
        Logout
      </button>
    </div>
  );
}

export default DesktopSideBar;