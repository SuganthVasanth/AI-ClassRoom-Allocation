import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth, type UserRole } from './contexts/AuthContext';
import { ToastProvider, useToast } from './components/Toast';

// Screens imports
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { RequestScreen } from './screens/RequestScreen';
import { TimetableScreen } from './screens/TimetableScreen';
import { NavigationScreen } from './screens/NavigationScreen';
import { AIScreen } from './screens/AIScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SuperAdminScreens } from './screens/SuperAdminScreens';
import { AdminScreens } from './screens/AdminScreens';
import { BookingHistoryScreen } from './screens/BookingHistoryScreen';

// Constants imports
import { INITIAL_REQUESTS, MOCK_NOTIFICATIONS, CLASSROOMS } from './constants/mockData';
import type { SystemNotification, BookingRequest } from './types';
import { Bell, Menu, User, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Mock States
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(MOCK_NOTIFICATIONS);
  const [rooms, setRooms] = useState(CLASSROOMS);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  // State modifiers
  const handleAddRequest = (newReq: BookingRequest) => {
    setRequests((prev) => [newReq, ...prev]);

    // Create a mock pending notification
    const newNotif: SystemNotification = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Allocation Request Submitted',
      message: `Your booking request for "${newReq.subject}" is pending verification.`,
      type: 'info',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCancelRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleApproveRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          // Success notification
          const newNotif: SystemNotification = {
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            title: 'Request Approved!',
            message: `Admin approved request for "${r.subject}". Room ${r.allocatedClassroomName || 'RAM-301'} allocated.`,
            type: 'success',
            read: false,
            timestamp: 'Just now'
          };
          setNotifications((notifs) => [newNotif, ...notifs]);
          return { ...r, status: 'approved' };
        }
        return r;
      })
    );
  };

  const handleRejectRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newNotif: SystemNotification = {
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            title: 'Allocation Declined',
            message: `Request for "${r.subject}" declined by administrator.`,
            type: 'error',
            read: false,
            timestamp: 'Just now'
          };
          setNotifications((notifs) => [newNotif, ...notifs]);
          return { ...r, status: 'rejected' };
        }
        return r;
      })
    );
  };

  const handleToggleMaintenance = (roomId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.id === roomId) {
          const nextStatus = r.status === 'maintenance' ? 'available' : 'maintenance';
          
          // Create logs notification
          const newNotif: SystemNotification = {
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            title: 'Classroom Status Change',
            message: `${r.name.split(' (')[0]} set to ${nextStatus.toUpperCase()}`,
            type: nextStatus === 'maintenance' ? 'warning' : 'success',
            read: false,
            timestamp: 'Just now'
          };
          setNotifications((prev) => [newNotif, ...prev]);
          showToast(`${r.name.split(' (')[0]} is now ${nextStatus}`, 'info');

          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper autofill for AI assistant request draft
  const handleAutoDraft = (bldId: string, str: number, sub: string) => {
    setCurrentTab('request');
    showToast('AI smart parameters copied to form! Form draft ready.', 'success');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const parent = user.role.replace('_', ' ').toUpperCase() + ' WORKSPACE';
    const sub = currentTab.replace('_', ' ').toUpperCase();
    return `${parent} / ${sub}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 flex">
      {/* Sidebar Layout */}
      <Sidebar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Body Shell */}
      <main
        className={`flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-300
          ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}
        `}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
          {/* Breadcrumb / Menu triggers */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 select-none tracking-wider">
              {getBreadcrumbs()}
            </span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            
            {/* AI Assistant Quick Indicator (Staff/Student only) */}
            {(user.role === 'staff' || user.role === 'student') && (
              <button
                onClick={() => setCurrentTab('ai')}
                className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all flex items-center gap-1.5 text-xs font-bold animate-pulse"
                title="Consult AI assistant"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="hidden sm:inline">Consult AI</span>
              </button>
            )}

            {/* Notifications Alert Bell */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="relative p-2 bg-slate-50 hover:bg-slate-105 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Visual Badge */}
            <div 
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 rounded-xl py-1 px-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors select-none"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:inline truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </div>

          </div>
        </header>

        {/* Scrollable Content Pane */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Super Admin specific menus router */}
          {user.role === 'super_admin' && [
            'institution', 'departments', 'buildings', 'classrooms', 'users', 'ai_settings'
          ].includes(currentTab) && (
            <SuperAdminScreens subTab={currentTab} />
          )}

          {/* Admin specific menus router */}
          {user.role === 'admin' && [
            'approvals', 'maintenance'
          ].includes(currentTab) && (
            <AdminScreens
              subTab={currentTab}
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onToggleMaintenance={handleToggleMaintenance}
            />
          )}

          {/* Global Screens Switcher */}
          {currentTab === 'dashboard' && (
            <Dashboard
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onChangeTab={setCurrentTab}
            />
          )}

          {currentTab === 'request' && (
            <RequestScreen onAddRequest={handleAddRequest} />
          )}

          {currentTab === 'history' && (
            <BookingHistoryScreen requests={requests} onCancelRequest={handleCancelRequest} />
          )}

          {currentTab === 'timetable' && (
            <TimetableScreen />
          )}

          {currentTab === 'navigation' && (
            <NavigationScreen />
          )}

          {currentTab === 'ai' && (
            <AIScreen onAutoDraftRequest={handleAutoDraft} />
          )}

          {currentTab === 'reports' && (
            <ReportsScreen />
          )}

          {currentTab === 'notifications' && (
            <NotificationsScreen
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onClearNotification={handleClearNotification}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen />
          )}

        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
