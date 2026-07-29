import React, { useEffect } from 'react';
import { useAuth, getRoleFromEmail } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Compass, Moon, Sun } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Initialize Google Identity Services
  useEffect(() => {
    let intervalId: any = null;

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
        return true;
      }
      return false;
    };

    const loaded = initGoogleSignIn();
    if (!loaded) {
      intervalId = setInterval(() => {
        if (initGoogleSignIn()) {
          clearInterval(intervalId);
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
        <Card padding="lg" className="w-full shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center py-10">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Sign in to your account
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Authenticate securely using your institution email
              </p>
            </div>
            
            {/* Google OAuth Render Button */}
            <div id="googleSignInBtn" className="w-full flex justify-center min-h-[44px]" />

            {/* Developer Mock Sign-in for easy testing */}
            <div className="w-full border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">
                Developer Mock Sign-in
              </span>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    loginWithUser({
                      id: 'usr-3',
                      name: 'Prof. Amit Sharma',
                      email: 'suganthvasanth84@gmail.com',
                      role: 'staff',
                      department: 'Computer Science & Engineering',
                      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                    });
                    showToast('Logged in as Faculty!', 'success');
                  }}
                  className="py-1.5 px-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl font-bold text-[11px] border border-indigo-100/50 dark:border-indigo-900/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  Faculty Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginWithUser({
                      id: 'usr-2',
                      name: 'Sarah Jenkins',
                      email: 'rsuganth98@gmail.com',
                      role: 'admin',
                      department: 'Campus Administration',
                      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
                    });
                    showToast('Logged in as Admin!', 'success');
                  }}
                  className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 rounded-xl font-bold text-[11px] border border-emerald-100/50 dark:border-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 transition-colors"
                >
                  Admin Portal
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
