import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Sprout, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPageContent: React.FC = () => {
  const { loginWithGoogleToken, loginWithEmail } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Official Google OAuth 2.0 Account Selection Hook
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoadingGoogle(true);
      try {
        await loginWithGoogleToken(tokenResponse.access_token);
      } catch (err: any) {
        console.error("Google authentication failed:", err);
        setErrorMsg("Failed to authenticate with Google UserInfo service.");
      } finally {
        setLoadingGoogle(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google OAuth error:", errorResponse);
      setErrorMsg("Google Sign-In popup was closed or encountered an OAuth error.");
      setLoadingGoogle(false);
    }
  });

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your Email ID.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }
    loginWithEmail(emailInput);
  };

  const handleQuickDemoAccount = (demoEmail: string, demoName: string) => {
    loginWithEmail(demoEmail, demoName);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-agri-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-agri-500/30">
            <Sprout className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">SmartCrop AI</h1>
            <p className="text-xs text-agri-300 font-semibold uppercase tracking-wider mt-1">
              Authentication Portal
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Sign in with your Google account or Email ID to unlock access to SmartCrop AI field recommendations and advisories.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-slate-800/90 border border-slate-700/90 p-8 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Official Google OAuth Sign In Button */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Google OAuth Authentication</label>
            <button
              type="button"
              disabled={loadingGoogle}
              onClick={() => {
                setErrorMsg('');
                googleLoginHandler();
              }}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-3 transition-all active:scale-98 disabled:opacity-50"
            >
              {loadingGoogle ? (
                <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="text-xs font-bold">Sign in with Google</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center pt-1">
              Opens the official Google Account Chooser screen
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Or Email Authentication</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* 2. Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-agri-500 transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-agri-500 transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-agri-500 to-emerald-600 hover:from-agri-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-agri-600/30 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Sign In with Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 3. Demo Accounts */}
          <div className="space-y-2 pt-2 border-t border-slate-700/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
              1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoAccount('gurpreet.singh@gmail.com', 'Gurpreet Singh')}
                className="p-2.5 bg-slate-900/80 hover:bg-agri-950 text-slate-200 rounded-xl border border-slate-700/80 hover:border-agri-500 text-left transition-colors"
              >
                <span className="block font-bold text-xs text-agri-300">Gurpreet Singh</span>
                <span className="block text-[10px] text-slate-400 truncate">gurpreet.singh@gmail.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoAccount('anita.verma@gmail.com', 'Anita Verma')}
                className="p-2.5 bg-slate-900/80 hover:bg-agri-950 text-slate-200 rounded-xl border border-slate-700/80 hover:border-agri-500 text-left transition-colors"
              >
                <span className="block font-bold text-xs text-agri-300">Anita Verma</span>
                <span className="block text-[10px] text-slate-400 truncate">anita.verma@gmail.com</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protected with Google Identity Services & SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  return <LoginPageContent />;
};
