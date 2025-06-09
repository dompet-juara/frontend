import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ReactNode } from "react";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/login/LoginView";
import IncomePage from "./pages/income/IncomeView";
import RegisterPage from "./pages/register/RegisterView";
import OutcomePage from "./pages/outcome/OutcomeView";
import AIRecommenderPage from "./pages/ai/AIRecommenderView";
import ProfilePage from "./pages/profile/ProfileView";
import ChatbotFloating from "./components/ChatbotFloating";
import { useAuth } from "./contexts/AuthContext";
import DashboardPage from "./pages/dashboard/dashboardView";

const ProtectedOrGuestRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading application...
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading application...
      </div>
    );
  }

  if (!isAuthenticated || isGuest) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
        <h2 className="text-xl font-semibold mb-3">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You need to be logged in to access this page.
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }
  return children;
};

function App() {
  const { isAuthenticated, isGuest } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedOrGuestRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedOrGuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedOrGuestRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedOrGuestRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedOrGuestRoute>
              <MainLayout>
                <IncomePage />
              </MainLayout>
            </ProtectedOrGuestRoute>
          }
        />
        <Route
          path="/outcome"
          element={
            <ProtectedOrGuestRoute>
              <MainLayout>
                <OutcomePage />
              </MainLayout>
            </ProtectedOrGuestRoute>
          }
        />
        <Route
          path="/aireccomender"
          element={
            <ProtectedOrGuestRoute>
              <MainLayout>
                <AIRecommenderPage />
              </MainLayout>
            </ProtectedOrGuestRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {isAuthenticated && !isGuest && <ChatbotFloating />}
    </>
  );
}

export default App;