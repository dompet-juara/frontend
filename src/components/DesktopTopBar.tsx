import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DesktopTopBar() {
  const location = useLocation();
  const { user, isGuest } = useAuth();
  let pageTitle = "Dashboard";

  if (location.pathname.includes("/income")) pageTitle = "Income Management";
  else if (location.pathname.includes("/outcome")) pageTitle = "Outcome Management";
  else if (location.pathname.includes("/aireccomender")) pageTitle = "AI Financial Recommender";
  else if (location.pathname.includes("/dashboard")) pageTitle = "Financial Dashboard";


  return (
    <div className="w-full h-16 bg-white shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06),0_4px_5px_0_rgba(0,0,0,0.04)] flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="text-gray-700 font-semibold text-xl">
        {pageTitle}
        {isGuest && <span className="ml-2 text-sm font-normal text-orange-500">(Guest Mode - Dummy Data)</span>}
      </div>
      
      <div className="flex items-center space-x-4">
        {isGuest ? (
            <>
                <Link to="/login" className="text-sm text-blue-600 hover:underline font-medium">Login</Link>
                <Link to="/register" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium">Register</Link>
            </>
        ) : (
            <>
                <span className="text-sm text-gray-600">Hello, {user?.name || user?.username}</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                </div>
            </>
        )}
      </div>
    </div>
  );
}

export default DesktopTopBar;