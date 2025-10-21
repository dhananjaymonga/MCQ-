// components/SignupForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';

const SignupForm = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('enterEmail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/send-otp', { email });
      alert('OTP sent to your email!');
      setStep('verifyOtp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
        name,
        email,
        password,
        otp,
      });
      alert('Signup successful!');
      switchToLogin(); // Redirect to login form
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">Signup</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {step === 'verifyOtp' && (
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={step === 'verifyOtp'}
        />
      </div>

      {step === 'verifyOtp' && (
        <>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </>
      )}

      <button
        type="button"
        onClick={step === 'enterEmail' ? sendOtp : handleSignup}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        {loading
          ? 'Processing...'
          : step === 'enterEmail'
          ? 'Send OTP'
          : 'Verify & Signup'}
      </button>

      <p className="text-center text-sm text-gray-600">
        By signing up, you agree to our{' '}
        <a href="#" className="text-purple-600 hover:text-purple-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-purple-600 hover:text-purple-500">
          Privacy Policy
        </a>
      </p>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          className="text-purple-600 hover:underline"
          onClick={switchToLogin}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default SignupForm;