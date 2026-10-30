import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, BarChart3, Building2, Bot, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";

const Registration = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Arjun",
    lastName: "Rao",
    email: "arjun@example.com",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: `${formData.firstName} ${formData.lastName}`,
      displayName: formData.firstName,
      email: formData.email,
      initials: `${formData.firstName[0]}${formData.lastName[0] || ""}`,
    }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Branding Side (Matches Figma Navy Panel) */}
      <div className="w-full md:w-[45%] lg:w-[42%] bg-[#1E1B4B] text-white p-8 md:p-14 lg:p-16 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <Link to="/" className="inline-flex items-center space-x-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#5243C2] flex items-center justify-center text-white shadow-md">
              <LayoutGrid className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">FinTracker</span>
          </Link>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Take control of your finances.
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-12">
            Track income, expenses, budgets, and property rent—all in one intelligent platform.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-indigo-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Smart Analytics</h4>
                <p className="text-xs text-slate-300 mt-0.5">Visual insights into your spending patterns</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Property Management</h4>
                <p className="text-xs text-slate-300 mt-0.5">Manage PG rooms, tenants, and rent collection</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-purple-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Assistant</h4>
                <p className="text-xs text-slate-300 mt-0.5">Personalized financial advice powered by AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 text-xs text-slate-400">
          © {new Date().getFullYear()} KOSH FinTracker. All rights reserved.
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create account
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Get started with FinTracker for free.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name (Side by side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Arjun"
                  required
                  className="w-full px-4 py-3.5 bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-[#5243C2] focus:ring-2 focus:ring-[#5243C2]/20 focus:outline-none transition placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  LAST NAME
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Rao"
                  required
                  className="w-full px-4 py-3.5 bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-[#5243C2] focus:ring-2 focus:ring-[#5243C2]/20 focus:outline-none transition placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="arjun@example.com"
                required
                className="w-full px-4 py-3.5 bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-[#5243C2] focus:ring-2 focus:ring-[#5243C2]/20 focus:outline-none transition placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-[#5243C2] focus:ring-2 focus:ring-[#5243C2]/20 focus:outline-none transition placeholder:text-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#5243C2] hover:bg-[#4335a9] text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#5243C2] hover:underline">
              Sign in
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
              ← Back to KOSH Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;