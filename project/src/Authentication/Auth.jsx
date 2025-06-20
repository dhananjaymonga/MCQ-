import React, { useState } from 'react';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import Login from './Login';
import Signup from "./Singup";
import ForgotPassword from "./Frogget"; // (create this file separately)
import Navbar from '../components/layout/Header';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4 w-full">

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="h-10 w-10 text-purple-600" />
          <h1 className="text-3xl font-bold text-purple-600 ml-2">
            PCMB with Malika
          </h1>
        </div>

        <div className="flex mb-8">
          <button
            className={`flex-1 py-3 text-center ${
              view === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            } rounded-l-lg transition-colors duration-200`}
            onClick={() => setView('login')}
          >
            <div className="flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              view === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            } rounded-r-lg transition-colors duration-200`}
            onClick={() => setView('signup')}
          >
            <div className="flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </div>
          </button>
        </div>

        {/* Render based on view */}
        {view === 'login' && (
          <Login
            switchToSignup={() => setView('signup')}
            switchToForgotPassword={() => setView('forgot')}
          />
        )}
        {view === 'signup' && <Signup switchToLogin={() => setView('login')} />}
        {view === 'forgot' && (
          <ForgotPassword switchToLogin={() => setView('login')} />
        )}
      </div>
    </div>
    </>
  );
}

export default App;
