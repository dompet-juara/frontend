import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { UserData } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: UserData | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string, userData: UserData) => void;
  logout: () => void;
  enterGuestMode: () => void;
  isLoading: boolean;
  updateUserContext: (updatedUserData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('guest') === 'true' || localStorage.getItem('isGuestMode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('guest') === 'true' && !isGuest) {
        setIsGuest(true);
        localStorage.setItem('isGuestMode', 'true');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        setAccessToken(null);
        setUser(null);
        if (axiosInstance.defaults.headers.common) {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }
  }, [location.search, isGuest, navigate]);

  useEffect(() => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        setAccessToken(storedToken);
        setUser(parsedUser);
        if (axiosInstance.defaults.headers.common) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        setAccessToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, [isGuest]);

  const login = (newAccessToken: string, newRefreshToken: string, userData: UserData) => {
    localStorage.setItem('authToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.removeItem('isGuestMode');
    setAccessToken(newAccessToken);
    setUser(userData);
    setIsGuest(false);
    if (axiosInstance.defaults.headers.common) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    }
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('isGuestMode');
    setAccessToken(null);
    setUser(null);
    setIsGuest(false);
    if (axiosInstance.defaults.headers.common) {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
    navigate('/login');
  };

  const enterGuestMode = () => {
    localStorage.setItem('isGuestMode', 'true');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    setAccessToken(null);
    setUser(null);
    setIsGuest(true);
    if (axiosInstance.defaults.headers.common) {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
    const currentPath = location.pathname === '/login' || location.pathname === '/register' ? '/dashboard' : location.pathname;
    navigate(currentPath, { replace: true });
  };

  const updateUserContext = (updatedUserData: Partial<UserData>) => {
    setUser(prevUser => {
        if (prevUser) {
            const newUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem('authUser', JSON.stringify(newUser));
            return newUser;
        }
        return null;
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!accessToken && !!user && !isGuest,
      isGuest,
      user,
      accessToken,
      login,
      logout,
      enterGuestMode,
      isLoading,
      updateUserContext
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};