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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthContext: Initializing...");
    setIsLoading(true);

    const initializeAuth = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const guestQueryParam = queryParams.get('guest') === 'true';
      const storedIsGuest = localStorage.getItem('isGuestMode') === 'true';
      const storedToken = localStorage.getItem('authToken');
      const storedUserJson = localStorage.getItem('authUser');

      if (guestQueryParam) {
        console.log("AuthContext: Initializing as Guest via query param.");
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
      } else if (storedToken && storedUserJson) {
        console.log("AuthContext: Initializing as Authenticated User.");
        try {
          const parsedUser: UserData = JSON.parse(storedUserJson);
          setAccessToken(storedToken);
          setUser(parsedUser);
          setIsGuest(false);
          if (axiosInstance.defaults.headers.common) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          }
        } catch (error) {
          console.error("AuthContext: Failed to parse stored user data, logging out.", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authUser');
          localStorage.removeItem('isGuestMode');
          setAccessToken(null);
          setUser(null);
          setIsGuest(false);
        }
      } else if (storedIsGuest) {
        console.log("AuthContext: Initializing as Guest via localStorage.");
        setAccessToken(null);
        setUser(null);
        setIsGuest(true);
      } else {
        console.log("AuthContext: No session, not guest.");
        setAccessToken(null);
        setUser(null);
        setIsGuest(false);
      }
      setIsLoading(false);
      console.log("AuthContext: Initialization complete.", {
        newAccessToken: accessToken,
        newUser: user,
        newIsGuest: isGuest,
      });
    };

    initializeAuth();
  }, []);

  const login = (newAccessToken: string, newRefreshToken: string, userData: UserData) => {
    console.log("AuthContext: Logging in user:", userData.username);
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
    setIsLoading(false);
    navigate('/dashboard');
  };

  const logout = () => {
    console.log("AuthContext: Logging out.");
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
    setIsLoading(false);
    navigate('/login');
  };

  const enterGuestMode = () => {
    console.log("AuthContext: Entering Guest Mode.");
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
    setIsLoading(false);
    
    const targetPath = (location.pathname === '/login' || location.pathname === '/register') 
                       ? '/dashboard' 
                       : location.pathname;
    if (location.pathname !== targetPath || location.search) {
        navigate(targetPath, { replace: true });
    }
  };

  const updateUserContext = (updatedUserData: Partial<UserData>) => {
    setUser(prevUser => {
        if (prevUser) {
            const newUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem('authUser', JSON.stringify(newUser));
            console.log("AuthContext: User context updated:", newUser);
            return newUser;
        }
        return null;
    });
  };

  const isAuthenticatedCalculated = !!accessToken && !!user && !isGuest;

  useEffect(() => {
    console.log("AuthContext State Change:", {
      accessToken,
      user,
      isGuest,
      isLoading,
      isAuthenticated: isAuthenticatedCalculated,
      currentLocation: location.pathname + location.search
    });
  }, [accessToken, user, isGuest, isLoading, isAuthenticatedCalculated, location]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: isAuthenticatedCalculated,
      isGuest,
      user,
      accessToken,
      login,
      logout,
      enterGuestMode,
      isLoading,
      updateUserContext
    }}>
      {!isLoading ? children : <div>Loading Application State...</div>}
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