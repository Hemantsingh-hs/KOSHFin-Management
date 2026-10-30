import React, { useState } from 'react';
import { Bot, Sparkles, Send, User, Lightbulb, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AIAssistant() {
  const { user, summary, properties, tenants } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.displayName || user?.name || 'Owner'}! I'm your KoshFin AI Financial Advisor. I'm connected to your live MongoDB database with ${properties.length} properties, ${summary.occupiedRooms || 0} occupied rooms, and current monthly inflow of ₹${Number(summary.monthlyIncome || 0).toLocaleString('en-IN')}. How can I assist your portfolio today?`,
    },
  ]);

  const quickPrompts = [
    'Analyze my current cash flow',
    'Which property has vacancy?',
    'Draft a polite rent reminder message',
    'Tips to save on utility bills',
  ];

  const handleSend = (text) => {
    const q = text || inputQuery;
    if (!q.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response based on real live data
    setTimeout(() => {
      let aiReply = '';
      const lower = q.toLowerCase();

      if (lower.includes('cash flow') || lower.includes('income') || lower.includes('financial')) {
        aiReply = `📊 **Live Cash Flow Breakdown from MongoDB:**\n• Total Income: ₹${Number(summary.monthlyIncome || 0).toLocaleString('en-IN')}\n• Operating Expenses: ₹${Number(summary.monthlyExpenses || 0).toLocaleString('en-IN')}\n• Net Available Savings: ₹${Number(summary.monthlySavings || 0).toLocaleString('en-IN')}\n• Pending Rent Collection: ₹${Number(summary.pendingRentTotal || 0).toLocaleString('en-IN')}\n\n💡 **Insight:** You have ${properties.length} active properties with a collection rate of ${summary.monthlyIncome + summary.pendingRentTotal > 0 ? Math.round((summary.monthlyIncome / (summary.monthlyIncome + summary.pendingRentTotal)) * 100) : 0}%.`;
      } else if (lower.includes('vacancy') || lower.includes('property') || lower.includes('pg') || lower.includes('room')) {
        aiReply = `🏠 **Live Vacancy Analysis:**\n• Total Properties: ${properties.length}\n• Total Capacity: ${summary.totalRooms || 0} rooms\n• Currently Occupied: ${summary.occupiedRooms || 0} rooms (${summary.occupancyRate || 0}% occupancy)\n• Currently Vacant: ${summary.vacantRooms || 0} rooms\n\n🚀 **Recommendation:** Add room types and assign tenants to vacant rooms to maximize monthly rent collection.`;
      } else if (lower.includes('reminder') || lower.includes('draft') || lower.includes('whatsapp')) {
        aiReply = `📱 **Drafted WhatsApp Reminder:**\n\n"Hi [Tenant Name], gentle reminder from KoshFin that your room rent of ₹[Amount] is due. You can pay via UPI to 'koshfin@okhdfcbank'. Please share the screenshot once done. Have a great day!"`;
      } else if (lower.includes('utility') || lower.includes('bills') || lower.includes('save')) {
        aiReply = `⚡ **3 Actionable Ways to Save Costs:**\n1. **Sub-metering:** Install digital sub-meters for AC rooms to charge exact power consumption.\n2. **LED & Motion Sensors:** Install motion sensors in corridors and dining halls.\n3. **Scheduled Reminders:** Enable automated WhatsApp rent reminders 3 days before due dates to prevent collection delays.`;
      } else {
        aiReply = `I've analyzed your database for "${q}". You currently manage ${properties.length} properties and ${tenants.length} tenants. Would you like me to analyze rent collection schedules or review upcoming dues?`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#5243C2] text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>AI Financial & Property Assistant</span>
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Instant portfolio analysis, rent optimization, and automated messaging advice.
        </p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#5243C2] text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AR
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-[#F8FAFC] border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-[#5243C2] hover:text-[#5243C2] transition whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI anything about your properties, expenses, or tenants..."
            className="flex-1 px-4 py-3 bg-[#F8FAFC] rounded-2xl border border-slate-200 focus:outline-none focus:border-[#5243C2] focus:bg-white transition text-sm text-slate-800"
          />
          <button
            type="submit"
            className="p-3 rounded-2xl bg-[#5243C2] hover:bg-[#4335a9] text-white transition shadow-md shadow-indigo-200 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
