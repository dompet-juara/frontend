import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardView from "./pages/dashboard/dashboardView";
import LoginView from "./pages/login";
import IncomeView from "./pages/income/incomeView";
import RegisterView from "./pages/register";
import OutcomeView from "./pages/outcome/outcomeView";
import AIRecommenderView from "./pages/ai/AIRecommenderView";
import { useAuth } from "./contexts/AuthContext";
import React from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <MainLayout>
              <IncomeView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/outcome"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OutcomeView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/aireccomender"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIRecommenderView />
            </MainLayout>
          </ProtectedRoute>
        }
      />
       <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;