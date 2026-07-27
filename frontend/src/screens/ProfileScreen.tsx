import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { User, Mail, Shield, Check, Globe, HelpCircle, Lock, Landmark, Award } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [language, setLanguage] = useState('en');
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Profile configuration saved (Simulated)', 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, set display preferences, and configure notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar & Basic Specs */}
        <div className="flex flex-col gap-5 col-span-1">
          <Card padding="md" className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
            </div>

            <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-4">
              {user.name}
            </h3>
            <p className="text-xs text-slate-550 mt-0.5">{user.email}</p>
            
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>{user.role.replace('_', ' ')}</span>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-slate-800/80 my-4 pt-4 flex flex-col gap-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Landmark className="w-4.5 h-4.5 text-slate-400" />
                <span>Dept: {user.department || 'General Administration'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-slate-400" />
                <span>BIT Campus Employee ID: #BIT-88402</span>
              </div>
            </div>

            <Button variant="danger" size="sm" className="w-full mt-2" onClick={logout}>
              Sign Out
            </Button>
          </Card>

          <Card padding="sm" className="bg-slate-50 dark:bg-slate-900/30">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-205 flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-slate-455" /> System About</h4>
            <div className="text-[10px] text-slate-500 leading-relaxed mt-2 flex flex-col gap-1">
              <span>Client Version: v1.2.0-web</span>
              <span>Developer Workspace: BIT Campus Pro</span>
              <span>Platform Engine: React v19.2 + Tailwind CSS v4.3</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed form & preferences */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Profile settings */}
          <Card header={
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Personal Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="text-xs font-semibold">
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          }>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profileName"
                  label="Full Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={!isEditing}
                  leftIcon={<User className="w-4 h-4" />}
                />
                <Input
                  id="profileEmail"
                  label="Email Address"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  disabled={!isEditing}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              {isEditing && (
                <Button type="submit" variant="primary" size="sm" className="self-end" icon={<Check className="w-4 h-4" />}>
                  Save Profile Changes
                </Button>
              )}
            </form>
          </Card>

          {/* Preferences */}
          <Card header={<h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Workspace Preferences</h3>}>
            <div className="flex flex-col gap-5 text-sm">
              {/* Theme Settings toggling */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Color Workspace Mode</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">Toggle default appearance between dark slate and light grids.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={toggleTheme} className="font-bold text-xs uppercase tracking-wide">
                  Toggle Mode
                </Button>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

              {/* Language Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">System Language</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">Choose layout display locale format.</p>
                </div>
                <div className="w-48 self-start sm:self-center">
                  <Dropdown
                    id="language"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); showToast('Locale changed.', 'success'); }}
                    options={[
                      { value: 'en', label: 'English (US)' },
                      { value: 'ta', label: 'தமிழ் (Tamil)' },
                      { value: 'hi', label: 'हिन्दी (Hindi)' },
                      { value: 'es', label: 'Español' }
                    ]}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

              {/* Security parameters simulation */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Security Credentials</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-0.5">Configure authentication PIN and update security passwords.</p>
                </div>
                <Button variant="outline" size="sm" icon={<Lock className="w-4 h-4" />} onClick={() => showToast('Redirecting to reset portal (Simulated)', 'info')}>
                  Manage Credentials
                </Button>
              </div>

            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};
