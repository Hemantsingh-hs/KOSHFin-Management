import { useState } from "react";
import { Search, Plus, Bell, ChevronDown } from "lucide-react";
import Sidebar from "../pages/SideBar";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import Property from "../pages/Property";
import Rooms from "../pages/Rooms";
import Tenants from "../pages/Tenants";
import RentReminders from "../pages/RentReminders";
import MessManagement from "../pages/MessManagement";
import MessReports from "../pages/MessReports";
import Reports from "../pages/Reports";
import AIAssistant from "../pages/AIAssistant";
import Notifications from "../pages/Notifications";
import Setting from "../pages/Setting";
import GlobalAddModal from "../components/common/GlobalAddModal";
import { useApp } from "../context/AppContext";

const pageComponents = {
  Dashboard: Dashboard,
  Transactions: Transactions,
  Income: Income,
  Expenses: Expenses,
  "PG / Property": Property,
  Rooms: Rooms,
  Tenants: Tenants,
  "Rent & Reminders": RentReminders,
  "Mess Management": MessManagement,
  "Mess Reports": MessReports,
  "Reports & Analytics": Reports,
  "AI Assistant": AIAssistant,
  Notifications: Notifications,
  Settings: Setting,
};

export default function OwnerLayout() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { user, notifications, setIsAddModalOpen, setAddModalType } = useApp();

  const ActivePage = pageComponents[activeTab] || Dashboard;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenAddModal = (type) => {
    setAddModalType(type);
    setIsAddModalOpen(true);
    setShowAddMenu(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#0f172a]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 z-20 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
            {activeTab}
          </h2>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Box */}
            <div className="relative w-44 sm:w-64 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] text-[13px] text-[#0f172a] rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* + Add Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center space-x-1.5 bg-[#5243C2] hover:bg-indigo-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handleOpenAddModal('transaction')}
                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#0f172a] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>+ New Transaction</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddModal('property')}
                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#0f172a] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>+ New Property</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddModal('room')}
                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#0f172a] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>+ New Room</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Rooms');
                      setShowAddMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#0f172a] hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Assign Tenant</span>
                    <span className="text-[10px] text-[#0052CC] bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Rooms</span>
                  </button>
                </div>
              )}
            </div>

            {/* Top Notification Bell */}
            <button
              onClick={() => setActiveTab('Notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Top User Badge AR */}
            <button
              onClick={() => setActiveTab('Settings')}
              className="w-9 h-9 rounded-xl bg-[#5243C2] hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition"
              title="Profile & Settings"
            >
              {user.initials || "AR"}
            </button>
          </div>
        </header>

        {/* Dynamic Page Content with max-w-[1400px] */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-7 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto text-[#0f172a]">
            <ActivePage setPage={setActiveTab} />
          </div>
        </main>
      </div>

      {/* Global Add Record Modal */}
      <GlobalAddModal />
    </div>
  );
}
