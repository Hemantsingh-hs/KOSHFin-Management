import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Building2,
  DoorOpen,
  Users,
  BellRing,
  UtensilsCrossed,
  BarChart3,
  Bot,
  Bell,
  Settings,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ activeTab = 'Dashboard', setActiveTab }) {
  const navigate = useNavigate();
  const { user, notifications } = useApp();

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 220) newWidth = 220;
      if (newWidth > 380) newWidth = 380;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Transactions', icon: ArrowLeftRight },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { name: 'Income', icon: TrendingUp },
        { name: 'Expenses', icon: TrendingDown },
      ],
    },
    {
      title: 'PROPERTY & MESS',
      items: [
        { name: 'PG / Property', icon: Building2 },
        { name: 'Tenants', icon: Users },
        { name: 'Rent & Reminders', icon: BellRing },
        { name: 'Mess Management', icon: UtensilsCrossed },
        { name: 'Mess Reports', icon: BarChart3 },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { name: 'Reports & Analytics', icon: BarChart3 },
        { name: 'AI Assistant', icon: Bot },
      ],
    },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate('/login');
    }
  };

  return (
    <aside
      style={{ width: `${sidebarWidth}px` }}
      className="bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none h-screen relative transition-all"
    >
      {/* Top Logo & Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {/* Brand Logo (Matches Figma FinTracker) */}
        <div
          onClick={() => setActiveTab && setActiveTab('Dashboard')}
          className="flex items-center space-x-3 px-2 mb-6 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5243C2] flex items-center justify-center text-white shadow-sm">
            <LayoutGrid className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            FinTracker
          </span>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab && setActiveTab(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#F0EEFE] text-[#5243C2] font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#5243C2]' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {/* Active Purple Dot Indicator (Exact Figma) */}
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5243C2]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Menu & Profile Card */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-1.5">
        {/* Notifications */}
        <button
          onClick={() => setActiveTab && setActiveTab('Notifications')}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors cursor-pointer ${
            activeTab === 'Notifications'
              ? 'bg-[#F0EEFE] text-[#5243C2] font-semibold'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bell className={`w-4 h-4 ${activeTab === 'Notifications' ? 'text-[#5243C2]' : 'text-slate-400'}`} />
            <span className="font-medium">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab && setActiveTab('Settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors cursor-pointer ${
            activeTab === 'Settings'
              ? 'bg-[#F0EEFE] text-[#5243C2] font-semibold'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === 'Settings' ? 'text-[#5243C2]' : 'text-slate-400'}`} />
          <span className="font-medium">Settings</span>
        </button>

        {/* User Account Card (Matches Figma: Arjun Rao arjun@example.com) */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#5243C2] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {user.initials || 'AR'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              title="Log out"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 transition-colors ml-1 p-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-slate-300/50 active:bg-[#5243C2]/50 transition-colors z-50"
        onMouseDown={() => setIsResizing(true)}
      />
    </aside>
  );
}