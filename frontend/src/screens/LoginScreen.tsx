import React, { useState, useEffect } from 'react';
import { useAuth, getRoleFromEmail, type UserRole, MOCK_USERS } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Compass, Moon, Sun } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

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
      // Decode JWT payload
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
      
      // Detect role from email via environment mapping!
      const role = getRoleFromEmail(userEmail);
      
      // Log user in
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



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden text-left">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-3xl" />

      {/* Floating Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md flex flex-col gap-6 animate-scale-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl shadow-lg shadow-blue-500/10 border border-white/10 text-white">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            BIT SmartCampus
          </h2>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            Sign in to access classroom navigation and AI scheduler.
          </p>
        </div>

        <Card padding="lg" className="w-full shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-3.5">
            {/* Native Google Sign In Button Container */}
            <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]" />
            
            {/* Sandbox mock google log in */}
            <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Development Sandbox Bypass</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginWithUser(MOCK_USERS.staff)}
                className="py-1.5 px-3 bg-blue-550 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Login as Staff
              </button>
              <button
                onClick={() => loginWithUser(MOCK_USERS.admin)}
                className="py-1.5 px-3 bg-amber-550 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Login as Admin
              </button>
            </div>
            
          </div>
        </Card>


      </div>
    </div>
  );
};
