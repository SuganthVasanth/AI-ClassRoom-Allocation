import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { SystemNotification } from '../types';
import { Bell, BellOff, CheckCheck, Circle, Info, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { useToast } from '../components/Toast';

interface NotificationsScreenProps {
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotification
}) => {
  const { showToast } = useToast();

  const handleMarkAllRead = () => {
    onMarkAllRead();
    showToast('All notifications marked as read.', 'success');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Grouping notifications by timing
  const todayNotifs = notifications.filter(n => n.timestamp.toLowerCase().includes('today') || n.timestamp.toLowerCase().includes('hour'));
  const yesterdayNotifs = notifications.filter(n => n.timestamp.toLowerCase().includes('yesterday'));
  const earlierNotifs = notifications.filter(n => !n.timestamp.toLowerCase().includes('today') && !n.timestamp.toLowerCase().includes('hour') && !n.timestamp.toLowerCase().includes('yesterday'));

  const renderGroup = (title: string, list: SystemNotification[]) => {
    if (list.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
          {title}
        </h3>
        <div className="flex flex-col gap-3">
          {list.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && onMarkRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 text-left cursor-pointer
                ${notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-70'
                  : 'bg-blue-50/20 dark:bg-primary/5 border-primary/20 shadow-sm'
                }
              `}
            >
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-250">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <Circle className="w-2 h-2 fill-primary stroke-none animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1">{notif.timestamp}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearNotification(notif.id);
                  showToast('Notification cleared.', 'info');
                }}
                className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review status updates, classroom allocations warnings, and system alarms.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={<CheckCheck className="w-4 h-4" />}
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <BellOff className="w-12 h-12 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-sm">Inbox Zero! No notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {renderGroup('Today', todayNotifs)}
          {renderGroup('Yesterday', yesterdayNotifs)}
          {renderGroup('Earlier', earlierNotifs)}
        </div>
      )}
    </div>
  );
};
