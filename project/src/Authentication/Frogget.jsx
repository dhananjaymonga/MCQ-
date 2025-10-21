import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, KeyRound } from 'lucide-react';

const ForgotPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('enterEmail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password/send-otp', { email });
      alert('OTP sent to your email!');
      setStep('resetPassword');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password/send-otp', { email });
      alert('OTP resent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password/verify-otp', {
        email,
        otp,
        newPassword: password,
      });
      alert('Password reset successful!');
      switchToLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={step === 'resetPassword'}
        />
      </div>

      {step === 'resetPassword' && (
        <>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="button"
            onClick={resendOtp}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </>
      )}

      <button
        type="button"
        onClick={step === 'enterEmail' ? sendOtp : handleReset}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        {loading
          ? 'Processing...'
          : step === 'enterEmail'
          ? 'Send OTP'
          : 'Reset Password'}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Remembered your password?{' '}
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

export default ForgotPasswordForm;