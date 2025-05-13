import { Link } from "react-router-dom";

import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommenderIcon from "../assets/icons/ai-recommender.svg";
import logoutIcon from "../assets/icons/logout.svg";

function DesktopSideBar() {
  return (
    <div className="h-screen w-[20%] bg-primary flex flex-col p-8">
      <div className="flex items-center space-x-8 mb-24">
        <div className="w-20 h-20 rounded-full bg-gray-400 shrink-0" />
        <div
          className="font-bold text-white text-2xl truncate w-full"
          title="Username"
        >
          Username SangatPanjangSekali
        </div>
      </div>

      <div className="flex flex-col space-y-6 text-white font-bold flex-grow">
        <Link
          to="/dashboard"
          className="flex items-center hover:bg-[oklch(0.38_0.0761_194.77)] p-6 rounded text-lg"
        >
          <img src={dashboardIcon} alt="Dashboard" className="w-8 h-8 mr-6" />
          Dashboard
        </Link>

        <Link
          to="/income"
          className="flex items-center hover:bg-[oklch(0.38_0.0761_194.77)] p-6 rounded text-lg"
        >
          <img src={incomeIcon} alt="Income" className="w-8 h-8 mr-6" />
          Income
        </Link>

        <Link
          to="/outcome"
          className="flex items-center hover:bg-[oklch(0.38_0.0761_194.77)] p-6 rounded text-lg"
        >
          <img src={outcomeIcon} alt="Outcome" className="w-8 h-8 mr-6" />
          Outcome
        </Link>

        <Link
          to="/aireccomender"
          className="flex items-center hover:bg-[oklch(0.38_0.0761_194.77)] p-6 rounded text-lg"
        >
          <img
            src={aiRecommenderIcon}
            alt="AI Recommender"
            className="w-8 h-8 mr-6"
          />
          AI Recommender
        </Link>
      </div>

      <Link
        to="/logout"
        className="flex items-center bg-[oklch(0.42_0.0761_194.77)] hover:bg-[oklch(0.38_0.0761_194.77)] p-6 rounded text-red-100 font-bold text-lg"
      >
        <img src={logoutIcon} alt="Logout" className="w-8 h-8 mr-6" />
        Logout
      </Link>
    </div>
  );
}

export default DesktopSideBar;
