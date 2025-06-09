import React, { useState, useEffect } from "react";
import { useAuthPresenter } from "../../presenters/authPresenter";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axiosInstance from "../../utils/axiosInstance";

const LoginPage: React.FC = () => {
  const { handleLogin, error, loading, setError } = useAuthPresenter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isGuest, enterGuestMode } = useAuth();

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isGuest, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await handleLogin({ identifier, password });
  };

  const handleGuestMode = () => {
    enterGuestMode();
  };
  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    if (credentialResponse.credential) { 
      try {
        const response = await axiosInstance.post('/auth/google-signin-data', {
          idToken: credentialResponse.credential,
        });
        const { email, name } = response.data;
        setIdentifier(email || "");
        alert(`Data Google diterima: Email ${email}, Nama ${name}. Silakan masukkan password Anda jika sudah terdaftar, atau lengkapi form di halaman registrasi.`);
      } catch (apiError: any) {
        console.error("Error sending Google token to backend:", apiError);
        setError(apiError.response?.data?.message || "Failed to process Google sign-in data with backend.");
      }
    }
  };
  const handleGoogleError = () => {
    console.error("Google Login Failed");
    setError("Google Sign-In failed. Please try again or use standard login.");
  };


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">Welcome!</h2>
        <p className="text-center text-gray-500 mb-6">Login to manage your finances or try as a guest.</p>
        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-md mb-4">{error}</p>}
        
        <div className="my-4 flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} onError={handleGoogleError}
            useOneTap shape="rectangular" theme="outline" size="large"
          />
        </div>
        
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
            <input
              id="identifier" type="text"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter username or email" value={identifier}
              onChange={(e) => setIdentifier(e.target.value)} required autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter password" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
            <button 
                onClick={handleGuestMode}
                className="w-full py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
                Try as Guest
            </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
            Need an account?{' '}
            <button onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Register here
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;