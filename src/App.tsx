import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Income from "./pages/income";
import Register from "./pages/register";
import Outcome from "./pages/outcome";
import AIRecommender from "./pages/ai";

function App() {
  return (
    <Router>
      <Routes>
        // unprotected
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        // protected
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/income"
          element={
            <MainLayout>
              <Income />
            </MainLayout>
          }
        />
        <Route
          path="/outcome"
          element={
            <MainLayout>
              <Outcome />
            </MainLayout>
          }
        />
        <Route
          path="/aireccomender"
          element={
            <MainLayout>
              <AIRecommender />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
