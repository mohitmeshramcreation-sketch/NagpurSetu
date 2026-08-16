import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  Archive,
  Volume2
} from 'lucide-react';
import { StorageService, subscribeToStorage } from '../services/storage';
import { NotificationItem } from '../types';

interface NotificationsScreenProps {
  navigate: (route: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const refresh = () => setNotifications(StorageService.getNotifications());
    refresh();
    const unsub = subscribeToStorage(refresh);
    return () => unsub();
  }, []);

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
  };

  const handleNotificationClick = (item: NotificationItem) => {
    StorageService.markNotificationAsRead(item.id);
    setNotifications(StorageService.getNotifications());
    if (item.actionUrl) {
      navigate(item.actionUrl);
    } else if (item.caseId) {
      navigate(`/cases/${item.caseId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="notifications-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-extrabold">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live alerts regarding your civic complaints and municipal zone updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`border rounded-2xl p-5 transition-all cursor-pointer flex items-start gap-4 ${
                  isUnread
                    ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
                id={`notification-${item.id}`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'sla_warning'
                      ? 'bg-red-100 text-red-700'
                      : item.type === 'resolved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.type === 'officer_assigned'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.type === 'sla_warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : item.type === 'resolved' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : item.type === 'officer_assigned' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm ${
                        isUnread ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-800'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.message}
                  </p>

                  {item.caseId && (
                    <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#0B1E38]">
                      <span>View Case #{item.caseId}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <div className="text-sm font-bold">No notifications right now</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
