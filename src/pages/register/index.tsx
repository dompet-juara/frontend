import React, { useState } from 'react';
import { useAuthPresenter } from '../../presenters/authPresenter';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { handleRegister, error, loading, setError } = useAuthPresenter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await handleRegister({ name, username, email, password });
    if (success) {
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
         <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">
              Login here
            </button>
        </p>
      </div>
    </div>
  );
};

export default Register;