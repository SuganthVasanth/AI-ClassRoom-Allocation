import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './components/Toast';

// Screens imports
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
import { AvailabilityScreen } from './screens/AvailabilityScreen';

// Constants imports
import { INITIAL_REQUESTS, MOCK_NOTIFICATIONS, CLASSROOMS } from './constants/mockData';
import type { SystemNotification, BookingRequest } from './types';
import { Bell, Menu, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { api } from './services/api';

function MainApp() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Synchronize component state with URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'dashboard';
      setCurrentTab(hash);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    window.location.hash = `#/${tab}`;
    setIsMobileOpen(false);
  };

  // Global Mock States
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(MOCK_NOTIFICATIONS);
  const [rooms, setRooms] = useState(CLASSROOMS);

  // Fetch bookings from backend initially and poll every 3 seconds for updates
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const backendRequests = await api.getBookings();
        setRequests((prev) => {
          const isSame = JSON.stringify(prev) === JSON.stringify(backendRequests);
          return isSame ? prev : backendRequests;
        });
      } catch (err) {
        console.error("Failed to fetch bookings from backend:", err);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <LoginScreen />;
  }

  // State modifiers
  const handleAddRequest = async (newReq: BookingRequest) => {
    try {
      await api.createBookingRequest(newReq);
    } catch (err) {
      console.error("Failed to save booking request:", err);
      showToast("Backend connection issue, request saved locally only.", "warning");
    }

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

  const handleCancelRequest = async (id: string) => {
    try {
      await api.updateBookingStatus(id, 'rejected');
    } catch (err) {
      console.error("Failed to cancel request on backend:", err);
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await api.updateBookingStatus(id, 'approved');
    } catch (err) {
      console.error("Failed to approve request on backend:", err);
    }

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
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

  const handleRejectRequest = async (id: string) => {
    try {
      await api.updateBookingStatus(id, 'rejected');
    } catch (err) {
      console.error("Failed to reject request on backend:", err);
    }

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

  const handleAutoDraft = (bldId: string, str: number, sub: string) => {
    handleTabChange('request');
    showToast('AI smart parameters copied to form! Form draft ready.', 'success');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumbs = () => {
    const parent = user.role.replace('_', ' ').toUpperCase();
    const sub = currentTab.replace('_', ' ').toUpperCase();
    return { parent, sub };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 transition-colors duration-200 flex font-sans">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Body Content Shell */}
      <main
        className={`flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-300
          ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}
        `}
      >
        {/* Glassmorphic Top Header Bar */}
        <header className="sticky top-0 z-30 w-full glass-header bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          {/* Menu Trigger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 truncate text-xs font-semibold text-slate-400 dark:text-slate-500 select-none">
              <span className="hidden sm:inline font-bold text-slate-600 dark:text-slate-400">{breadcrumbs.parent}</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline text-slate-300 dark:text-slate-600" />
              <span className="gradient-text font-extrabold uppercase tracking-wide truncate">{breadcrumbs.sub}</span>
            </div>
          </div>

          {/* Header Action Buttons & User Badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* AI Assistant Button */}
            {(user.role === 'staff' || user.role === 'student') && (
              <button
                type="button"
                onClick={() => handleTabChange('ai')}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="Consult AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => handleTabChange('notifications')}
              className="relative p-2.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Profile Capsule */}
            <div 
              onClick={() => handleTabChange('profile')}
              className="flex items-center gap-2 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/90 rounded-xl py-1.5 px-2.5 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-xs select-none"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-indigo-500/30"
              />
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 hidden md:inline truncate max-w-[110px]">
                {user.name.split(' ')[0]}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 hidden sm:inline" />
            </div>
          </div>
        </header>

        {/* Scrollable Container Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
          
          {/* Super Admin Routing */}
          {user.role === 'super_admin' && [
            'institution', 'departments', 'buildings', 'classrooms', 'users', 'ai_settings'
          ].includes(currentTab) && (
            <SuperAdminScreens subTab={currentTab} />
          )}

          {/* Admin Routing */}
          {user.role === 'admin' && [
            'approvals', 'maintenance', 'exams'
          ].includes(currentTab) && (
            <AdminScreens
              subTab={currentTab}
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onToggleMaintenance={handleToggleMaintenance}
            />
          )}

          {/* Global Tab Routers */}
          {currentTab === 'dashboard' && (
            <Dashboard
              requests={requests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onChangeTab={handleTabChange}
            />
          )}

          {currentTab === 'availability' && (
            <AvailabilityScreen />
          )}

          {currentTab === 'request' && (
            <RequestScreen onAddRequest={handleAddRequest} />
          )}

          {currentTab === 'history' && (
            <BookingHistoryScreen onCancelRequest={handleCancelRequest} />
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
