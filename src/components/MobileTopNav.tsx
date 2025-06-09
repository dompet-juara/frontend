import { useAuth } from "../contexts/AuthContext";

type MobileTopNavProps = {
  toggleSidebar: () => void;
};

function MobileTopNav({ toggleSidebar }: MobileTopNavProps) {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 flex items-center justify-between xl:hidden px-4 py-3 z-50 h-[3.5rem] shadow-sm">
      <button onClick={toggleSidebar} className="text-2xl font-bold text-gray-700 hover:text-blue-600 transition-colors">
        ☰
      </button>

      <div className="text-lg font-semibold text-primary">Dompet Juara</div>

      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold overflow-hidden">
        {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')
        )}
      </div>
    </div>
  );
}

export default MobileTopNav;