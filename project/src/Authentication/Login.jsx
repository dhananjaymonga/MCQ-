import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const LoginForm = ({ switchToSignup, switchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize navigate function

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        { email, password },
        { withCredentials: true } // Required for cookies
      );

      alert('Login successful');

      // Optional: Fetch logged-in user using the cookie
      const userRes = await axios.get('http://localhost:5000/auth/me', {
        withCredentials: true, // Include cookie
      });

      console.log('User:', userRes.data); // You can now access user info like name/email

      // After successful login, navigate to the home page
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Login</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-center mt-3">
          <button
            className="text-purple-600 hover:underline"
            onClick={switchToForgotPassword}
          >
            Forgot Password?
          </button>
        </p>
        <button
          className="text-sm text-purple-600 hover:underline"
          onClick={switchToSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
