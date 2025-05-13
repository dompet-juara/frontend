import { Link } from "react-router-dom";
import dashboardIcon from "../assets/icons/dashboard.svg";
import incomeIcon from "../assets/icons/income.svg";
import outcomeIcon from "../assets/icons/outcome.svg";
import aiRecommendationIcon from "../assets/icons/ai-recommender.svg";

function MobileBottomNav() {
  return (
    <section className="fixed bottom-0 left-0 w-full bg-primary flex justify-between xl:hidden h-[10vh] z-50">
      <Link
        to="/dashboard"
        className="flex-1 flex flex-col items-center justify-center text-sm text-white hover:bg-[oklch(0.38_0.0761_194.77)]"
      >
        <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6 mb-1" />
        Dashboard
      </Link>

      <Link
        to="/income"
        className="flex-1 flex flex-col items-center justify-center text-sm text-white hover:bg-[oklch(0.38_0.0761_194.77)]"
      >
        <img src={incomeIcon} alt="Income" className="w-6 h-6 mb-1" />
        Income
      </Link>

      <Link
        to="/outcome"
        className="flex-1 flex flex-col items-center justify-center text-sm text-white hover:bg-[oklch(0.38_0.0761_194.77)]"
      >
        <img src={outcomeIcon} alt="Outcome" className="w-6 h-6 mb-1" />
        Outcome
      </Link>

      <Link
        to="/aireccomender"
        className="flex-1 flex flex-col items-center justify-center text-sm text-white hover:bg-[oklch(0.38_0.0761_194.77)]"
      >
        <img src={aiRecommendationIcon} alt="AI" className="w-6 h-6 mb-1" />
        AI
      </Link>
    </section>
  );
}

export default MobileBottomNav;
