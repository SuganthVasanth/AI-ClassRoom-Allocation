import React from 'react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import {
  Compass, LayoutDashboard, Calendar, FileCheck, HelpCircle,
  Settings, Users, Building, BarChart2, Bell, LogOut,
  Map, MessageSquare, ChevronLeft, ChevronRight, Moon, Sun, ShieldAlert,
  Sliders, Landmark, School
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  if (!user) return null;

  // Configuration for roles
  const roleColors: Record<UserRole, string> = {
    super_admin: 'border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/20',
    admin: 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    staff: 'border-primary text-primary bg-blue-50 dark:bg-blue-950/20',
    student: 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/20',
  };

  const menuItems = {
    super_admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'institution', label: 'Institution', icon: Landmark },
      { id: 'departments', label: 'Departments', icon: School },
      { id: 'buildings', label: 'Buildings', icon: Building },
      { id: 'classrooms', label: 'Classrooms', icon: School },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'navigation', label: 'Campus Map', icon: Map },
      { id: 'ai_settings', label: 'AI Settings', icon: Sliders },
      { id: 'reports', label: 'Reports', icon: BarChart2 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'approvals', label: 'Approvals', icon: FileCheck },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Map', icon: Map },
      { id: 'maintenance', label: 'Maintenance', icon: Settings },
      { id: 'reports', label: 'Reports', icon: BarChart2 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
    staff: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'request', label: 'Request Classroom', icon: FileCheck },
      { id: 'history', label: 'Booking History', icon: Calendar },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Map', icon: Map },
      { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Navigation', icon: Map },
      { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ]
  };

  const activeMenu = menuItems[user.role] || [];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as UserRole;
    switchRole(nextRole);
    onChangeTab('dashboard');
    showToast(`Switched workspace sandbox to ${nextRole.replace('_', ' ').toUpperCase()}`, 'info');
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between
        ${isCollapsed ? 'w-20 -translate-x-full md:translate-x-0' : 'w-64 translate-x-0'}
      `}
    >
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden select-none">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-primary to-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <Compass className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white leading-none">
                  BIT SmartCampus
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  V1.2.0-Alpha
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dynamic Sandbox Role Switcher */}
        {!isCollapsed && (
          <div className="mx-4 my-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              <span>Workspace Role</span>
            </div>
            <select
              value={user.role}
              onChange={handleRoleChange}
              className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="super_admin">Super Admin Mode</option>
              <option value="admin">Admin Mode</option>
              <option value="staff">Staff Mode</option>
              <option value="student">Student Mode</option>
            </select>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="px-3 flex flex-col gap-1.5 mt-2">
          {activeMenu.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-blue-50/50 dark:bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-primary' : ''}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-900 dark:bg-slate-850 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-40">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex flex-col gap-3">
        {/* Toggle Theme / Profile */}
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
              ${isCollapsed ? 'mx-auto' : ''}
            `}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* User Card */}
        <div 
          onClick={() => onChangeTab('profile')}
          className={`flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800/80 p-2 cursor-pointer hover:bg-slate-55 dark:hover:bg-slate-800/30 transition-all
            ${isCollapsed ? 'justify-center p-1 border-none' : ''}
          `}
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-105 dark:ring-slate-800"
          />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                {user.name}
              </span>
              <span className={`inline-block border text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 w-max leading-none truncate ${roleColors[user.role]}`}>
                {user.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 py-2 rounded-xl border border-rose-100 dark:border-rose-900/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
