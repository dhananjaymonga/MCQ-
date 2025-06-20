import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('enterEmail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Track OTP sent state

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/auth/forgot-password/send-otp', { email });
      alert('OTP sent to your email!');
      setOtpSent(true); // Mark OTP as sent
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
      await axios.post('http://localhost:5000/auth/forgot-password/send-otp', { email });
      alert('OTP resent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/auth/forgot-password/verify-otp', {
        email,
        otp,
        newPassword: password, // ✅ match backend field name
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Reset Password</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {step === 'resetPassword' && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {/* Resend OTP Button */}
          {!loading && otpSent && (
            <button
              onClick={resendOtp}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition mt-3"
            >
              Resend OTP
            </button>
          )}
        </>
      )}

      <button
        onClick={step === 'enterEmail' ? sendOtp : handleReset}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
      >
        {loading
          ? 'Processing...'
          : step === 'enterEmail'
          ? 'Send OTP'
          : 'Reset Password'}
      </button>

      <p className="text-sm mt-4 text-center">
        Remembered your password?{' '}
        <button className="text-purple-600 hover:underline" onClick={switchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
