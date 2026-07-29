import React, { useState, useEffect } from 'react';
import { useAuth, getRoleFromEmail, type UserRole, MOCK_USERS } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Compass, Moon, Sun, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleSignIn = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        const google = (window as any).google;
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock-id',
          callback: handleGoogleLoginSuccess
        });
        google.accounts.id.renderButton(
          document.getElementById('googleSignInBtn'),
          { theme: 'outline', size: 'large', width: '380', logo_alignment: 'left' }
        );
      }
    };

    initGoogleSignIn();
    const interval = setInterval(() => {
      if ((window as any).google) {
        initGoogleSignIn();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleLoginSuccess = (response: any) => {
    try {
      const credential = response.credential;
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      const userEmail = payload.email;
      const userName = payload.name;
      const userPicture = payload.picture;
      
      const role = getRoleFromEmail(userEmail);
      
      loginWithUser({
        id: `goog-${payload.sub || Date.now()}`,
        name: userName,
        email: userEmail,
        role: role,
        department: role === 'staff' ? 'Computer Science & Engineering' : (role === 'admin' ? 'Campus Administration' : (role === 'super_admin' ? 'Campus Operations' : 'Information Technology')),
        avatarUrl: userPicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      });
      
      showToast(`Logged in with Google as ${role.replace('_', ' ').toUpperCase()}!`, 'success');
    } catch (err: any) {
      console.error("Google login parsing failed:", err);
      showToast("Google login authentication failed.", "error");
    }
  };

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const detectedRole = getRoleFromEmail(email);
      let userObj = MOCK_USERS[detectedRole as keyof typeof MOCK_USERS] || MOCK_USERS.staff;
      
      userObj = {
        ...userObj,
        email: email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase()
      };

      loginWithUser(userObj);
      showToast(`Welcome back, ${userObj.name}!`, 'success');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden text-left">
      {/* Background radial gradient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
      >
        {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
      </button>

      <div className="w-full max-w-md flex flex-col gap-6 animate-scale-in relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/20 border border-white/20 text-white">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Classroom Utilization Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bannari Amman Institute of Technology Central Scheduling Portal
            </p>
          </div>
        </div>

        {/* Main Glassmorphic Login Card */}
        <Card padding="lg" className="w-full shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <form onSubmit={handleEmailPasswordSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bitsathy.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => showToast('Password reset link dispatched to your registered email.', 'info')}
                className="text-primary hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="gradient"
              loading={loading}
              className="py-3 text-xs font-bold rounded-xl mt-1 shadow-lg shadow-indigo-500/20"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">or authenticate with</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          {/* Google OAuth Render Button */}
          <div className="flex flex-col gap-3">
            <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]" />

            {/* Sandbox Quick Access Roles */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                Demo Role Quick Switcher
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => loginWithUser(MOCK_USERS.super_admin)}
                  className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-[11px] transition-colors border border-rose-500/20"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => loginWithUser(MOCK_USERS.admin)}
                  className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-[11px] transition-colors border border-emerald-500/20"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => loginWithUser(MOCK_USERS.staff)}
                  className="py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-[11px] transition-colors border border-indigo-500/20"
                >
                  Faculty
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 text-center font-medium">
          Protected by BIT Single Sign-On (SSO) & OAuth 2.0 Security Framework.
        </p>

      </div>
    </div>
  );
};
