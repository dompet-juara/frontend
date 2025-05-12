import React, { useState } from 'react';
import { useAuthPresenter } from '../../presenters/authPresenter';

const Register = () => {
  const { handleRegister, error, loading } = useAuthPresenter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ name, username, email, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
