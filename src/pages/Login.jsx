import { useState } from "react";

import { Link } from "react-router-dom";

import {Eye,EyeOff,Lock,Mail,ArrowRight} from "lucide-react";

const Login=()=>{
    const [showPassword,setShowPassword]=useState(false);

    const [formData,setFormData] =useState({email:"",password:""})


     const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Owner Login:", formData);

   
  };

  return (
     <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">

        {/* Login Card */}
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="text-3xl font-extrabold text-indigo-600"
            >
              KOSHFin
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              Unified Property & Financial Management
            </p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Owner Login
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Login to manage your properties and finances.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-500 focus-within:bg-white">
                <Mail size={18} className="mr-3 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@example.com"
                  required
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-500 focus-within:bg-white">
                <Lock size={18} className="mr-3 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

           
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </Link>
            </div>

          
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              Login
              <ArrowRight size={18} />
            </button>

          </form>

       
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an owner account?
            </p>

            <Link
              to="/register"
              className="mt-1 inline-block text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              Create Owner Account 
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Login;