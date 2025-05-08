import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Router>
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard   />
          </MainLayout>
        }
      />
       <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard   />
          </MainLayout>
        }
      />
       <Route
        path="/login"
        element={
          <Login />
        }
      />
             <Route
        path="/register"
        element={
          <Register />
        }
      />
    </Routes>
  </Router>
  )
}

export default App
