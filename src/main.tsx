import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "832760647324-jmvjoo9hn4rbp98b03hqmhvfgrdvjc86.apps.googleusercontent.com";

if (GOOGLE_CLIENT_ID === "832760647324-jmvjoo9hn4rbp98b03hqmhvfgrdvjc86.apps.googleusercontent.com") {
    console.warn("Google Client ID is not set. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
);