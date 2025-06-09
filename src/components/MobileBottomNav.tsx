import { NavLink } from "react-router-dom";
import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommendationIcon from "../assets/icons/ai-recommender.svg";

function MobileBottomNav() {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex-1 flex flex-col items-center justify-center text-xs py-2 transition-all duration-200 ${
      isActive 
        ? "bg-[oklch(0.42_0.0761_194.77)] text-white scale-105" // Active state
        : "text-gray-300 hover:bg-[oklch(0.40_0.0761_194.77)] hover:text-white" // Default and hover
    } active:scale-95`;

  return (
    <section className="fixed bottom-0 left-0 w-full bg-primary flex justify-around xl:hidden h-[3.5rem] z-50 shadow-top">
      <NavLink to="/dashboard" className={navLinkClasses}>
        <img src={dashboardIcon} alt="Dashboard" className="w-5 h-5 mb-0.5" />
        Dashboard
      </NavLink>
      <NavLink to="/income" className={navLinkClasses}>
        <img src={incomeIcon} alt="Income" className="w-5 h-5 mb-0.5" />
        Income
      </NavLink>
      <NavLink to="/outcome" className={navLinkClasses}>
        <img src={outcomeIcon} alt="Outcome" className="w-5 h-5 mb-0.5" />
        Outcome
      </NavLink>
      <NavLink to="/aireccomender" className={navLinkClasses}>
        <img src={aiRecommendationIcon} alt="AI" className="w-5 h-5 mb-0.5" />
        AI
      </NavLink>
    </section>
  );
}


export default MobileBottomNav;