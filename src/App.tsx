import MainLayout from "./layouts/MainLayout"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
    <Routes>
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard   />
          </MainLayout>
        }
      />
    </Routes>
  </Router>
  )
}

export default App
