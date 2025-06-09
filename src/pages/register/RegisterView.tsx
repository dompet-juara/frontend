import React, { useState, useEffect } from 'react';
import { useAuthPresenter } from '../../presenters/authPresenter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axiosInstance from "../../utils/axiosInstance"; // Untuk memanggil backend Hapi.js

const RegisterPage: React.FC = () => {
  const { handleRegister, error, loading, setError } = useAuthPresenter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    const success = await handleRegister({ name, username, email, password });
    if (success) {
      alert('Registration successful! Please log in.');
      navigate('/login');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google Sign-up Data Success:", credentialResponse);
    if (credentialResponse.credential) { // ID Token
      try {
        const response = await axiosInstance.post('/auth/google-signin-data', {
          idToken: credentialResponse.credential,
        });
        const { email: googleEmail, name: googleName } = response.data;
        
        // Pre-fill the registration form
        setName(googleName || "");
        setEmail(googleEmail || "");
        // Anda bisa menyarankan username berdasarkan email atau nama
        if (googleEmail) {
            setUsername(googleEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''));
        } else if (googleName) {
            setUsername(googleName.replace(/\s+/g, '').toLowerCase());
        }
        alert(`Data Google diterima: Email ${googleEmail}, Nama ${googleName}. Silakan lengkapi username dan password Anda.`);

      } catch (apiError: any) {
        console.error("Error sending Google token to backend:", apiError);
        setError(apiError.response?.data?.message || "Failed to process Google sign-in data with backend.");
      }
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-up Data Failed");
    setError("Google Sign-In failed. Please try again or use standard registration.");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Register</h2>
        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-md mb-4">{error}</p>}
        
        <div className="my-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="rectangular"
            theme="outline"
            size="large"
            logo_alignment="left" // text="signup_with" // atau text="continue_with"
          />
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">Or register with email</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your full name" />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Choose a username" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Create a password (min. 6 characters)" />
          </div>
          <div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-blue-300">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
         <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Login here
            </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;