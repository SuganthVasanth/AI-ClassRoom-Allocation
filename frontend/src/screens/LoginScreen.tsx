import React, { useState } from 'react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Compass, KeyRound, Mail, Moon, Sun } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      
      // Determine role from mock email
      if (email.includes('superadmin')) {
        login('super_admin');
        showToast('Logged in as Super Admin!', 'success');
      } else if (email.includes('admin')) {
        login('admin');
        showToast('Logged in as Admin!', 'success');
      } else if (email.includes('staff')) {
        login('staff');
        showToast('Logged in as Staff!', 'success');
      } else if (email.includes('student') || email.includes('dharun')) {
        login('student');
        showToast('Logged in as Student!', 'success');
      } else {
        // Fallback default
        login('student');
        showToast('Logged in successfully!', 'success');
      }
    }, 800);
  };

  const autoFillAndLogin = (role: UserRole) => {
    const emails: Record<UserRole, string> = {
      super_admin: 'superadmin@bit.edu',
      admin: 'admin.allocations@bit.edu',
      staff: 'amit.sharma@bit.edu',
      student: 'dharun.cs24@bit.edu'
    };

    setEmail(emails[role]);
    setPassword('password123');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      login(role);
      showToast(`Logged in as ${role.replace('_', ' ').toUpperCase()}!`, 'success');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-3xl" />

      {/* Floating Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
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
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access classroom navigation and AI scheduler.
          </p>
        </div>

        <Card padding="lg" className="w-full shadow-md bg-white dark:bg-slate-900">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="e.g. amit.sharma@bit.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between mt-1 text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-transparent"
                />
                Remember me
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); showToast('Reset email sent (Simulated)', 'info'); }}
                className="font-semibold text-primary hover:text-primary-hover hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-sm mt-3"
            >
              Sign In
            </Button>
          </form>
        </Card>

        {/* Quick Review Access */}
        <Card padding="md" className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
            Quick Sandbox Access (Roles)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => autoFillAndLogin('super_admin')}
              className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-750 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-all text-left shadow-sm flex flex-col"
            >
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Super Admin</span>
              <span className="truncate">Dr. Rajesh Kumar</span>
            </button>
            <button
              onClick={() => autoFillAndLogin('admin')}
              className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-750 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-all text-left shadow-sm flex flex-col"
            >
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Admin</span>
              <span className="truncate">Sarah Jenkins</span>
            </button>
            <button
              onClick={() => autoFillAndLogin('staff')}
              className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-750 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-all text-left shadow-sm flex flex-col"
            >
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Staff</span>
              <span className="truncate">Prof. Amit Sharma</span>
            </button>
            <button
              onClick={() => autoFillAndLogin('student')}
              className="px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-750 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 transition-all text-left shadow-sm flex flex-col"
            >
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Student</span>
              <span className="truncate">Dharun S.</span>
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
};
