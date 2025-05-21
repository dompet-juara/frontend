import { useState } from "react";
import { useAuthPresenter } from "../../presenters/authPresenter";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { handleLogin, error, loading, setError } = useAuthPresenter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await handleLogin({ identifier, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
            Need an account?{' '}
            <button onClick={() => navigate('/register')} className="text-blue-500 hover:underline">
              Register here
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;