import React from 'react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Compass, LayoutDashboard, Calendar, FileCheck,
  Settings, Users, Building, BarChart2, Bell, LogOut,
  Map, MessageSquare, ChevronLeft, ChevronRight, Moon, Sun,
  Sliders, Landmark, School, Search, X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const roleColors: Record<UserRole, string> = {
    super_admin: 'border-rose-500/30 text-rose-500 bg-rose-500/10',
    admin: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
    staff: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/10',
    student: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
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
      { id: 'availability', label: 'Room Lookup', icon: Search },
      { id: 'exams', label: 'Exam Scheduling', icon: School },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Map', icon: Map },
      { id: 'maintenance', label: 'Maintenance', icon: Settings },
      { id: 'reports', label: 'Reports', icon: BarChart2 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
    staff: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'request', label: 'Request Classroom', icon: FileCheck },
      { id: 'availability', label: 'Room Lookup', icon: Search },
      { id: 'history', label: 'Booking History', icon: Calendar },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Map', icon: Map },
      { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'availability', label: 'Room Lookup', icon: Search },
      { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
      { id: 'navigation', label: 'Campus Navigation', icon: Map },
      { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ]
  };

  const activeMenu = menuItems[user.role] || [];

  const handleNavClick = (id: string) => {
    onChangeTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen glass-panel border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between shadow-2xl
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden select-none">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Compass className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-extrabold text-xs tracking-tight gradient-text leading-tight truncate">
                    AI Classroom
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Utilization Dashboard
                  </span>
                </div>
              )}
            </div>

            {/* Desktop collapse / Mobile close button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden md:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-3 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
            {activeMenu.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative select-none cursor-pointer
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/80 p-3 flex flex-col gap-2.5">
          {/* Theme Switcher */}
          <div className="flex items-center justify-between px-1">
            {!isCollapsed && (
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Theme Mode
              </span>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors
                ${isCollapsed ? 'mx-auto' : ''}
              `}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

          {/* User Profile Card */}
          <div 
            onClick={() => handleNavClick('profile')}
            className={`flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-2 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all select-none
              ${isCollapsed ? 'justify-center p-1 border-none' : ''}
            `}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden text-left min-w-0 flex-1">
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
            type="button"
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 py-2 rounded-xl border border-rose-200/50 dark:border-rose-900/40 transition-colors cursor-pointer
              ${isCollapsed ? 'px-0' : 'px-3'}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
