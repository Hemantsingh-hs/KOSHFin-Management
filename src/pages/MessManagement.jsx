import React, { useState } from 'react';
import { Utensils, Users, Check, Clock, Calendar, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MessManagement() {
  const { messMenu } = useApp();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const activeDayPlan = messMenu.days.find((d) => d.day === selectedDay) || messMenu.days[0];

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Header (Jira Standard Style) */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#0052CC]" />
          <span>Mess & Meal Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Plan weekly menus, track daily meal attendance, and manage food preferences.
        </p>
      </div>

      {/* Attendance Stats Cards (Jira Standard: text-xl, uppercase 11px label, p-3.5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Breakfast Attendance</p>
          <p className="text-xl font-bold text-[#0052CC] mt-1">{messMenu.todayAttendance.breakfast}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">7:30 AM - 9:30 AM</p>
        </div>

        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lunch Attendance</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{messMenu.todayAttendance.lunch}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">12:30 PM - 2:30 PM</p>
        </div>

        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Evening Snacks</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{messMenu.todayAttendance.snacks}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">5:00 PM - 6:30 PM</p>
        </div>

        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dinner Attendance</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{messMenu.todayAttendance.dinner}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">8:00 PM - 10:00 PM</p>
        </div>
      </div>

      {/* Weekly Menu Planner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-[#0052CC]" />
            <span>Weekly Mess Menu</span>
          </h3>

          {/* Days Selector */}
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-0.5 rounded-md">
            {messMenu.days.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                  selectedDay === d.day
                    ? 'bg-[#0052CC] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Breakfast */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
              Breakfast (7:30 - 9:30 AM)
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">{activeDayPlan.breakfast}</p>
            <p className="text-[11px] text-slate-500">Pure Ghee / Fresh dairy + hot beverage</p>
          </div>

          {/* Lunch */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
              Lunch (12:30 - 2:30 PM)
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">{activeDayPlan.lunch}</p>
            <p className="text-[11px] text-slate-500">Unlimited rice, rotis, curd and salad</p>
          </div>

          {/* Dinner */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0052CC] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
              Dinner (8:00 - 10:00 PM)
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">{activeDayPlan.dinner}</p>
            <p className="text-[11px] text-slate-500">Special seasonal desserts on weekends</p>
          </div>
        </div>
      </div>
    </div>
  );
}
