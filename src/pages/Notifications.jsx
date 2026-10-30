import React from 'react';
import { Bell, Check, Trash2, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const { notifications, setNotifications, markNotificationRead } = useApp();

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Real-time updates on rent collections, tenant messages, and property alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100">
        {notifications.map((n) => {
          const icon =
            n.type === 'alert' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            ) : n.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : n.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            ) : (
              <Info className="w-5 h-5 text-indigo-600" />
            );

          const bgIcon =
            n.type === 'alert'
              ? 'bg-rose-50'
              : n.type === 'success'
              ? 'bg-emerald-50'
              : n.type === 'warning'
              ? 'bg-amber-50'
              : 'bg-indigo-50';

          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                n.read ? 'bg-white hover:bg-slate-50/70' : 'bg-indigo-50/30 hover:bg-indigo-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${bgIcon}`}>
                {icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm ${n.read ? 'font-semibold text-slate-900' : 'font-extrabold text-slate-900'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#5243C2] shrink-0 self-center" />
              )}
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="p-16 text-center text-slate-400 text-sm">
            You're all caught up! No active notifications.
          </div>
        )}
      </div>
    </div>
  );
}
