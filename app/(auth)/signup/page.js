"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signup } from "../../../actions/auth-action";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [formState, formAction] = useActionState(signup, {});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [errors, setErrors] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  // const validateForm = () => {
  //   const newErrors = {};

  //   // Name validation
  //   if (!formData.name.trim()) {
  //     newErrors.name = "Name is required";
  //   } else if (formData.name.trim().length < 2) {
  //     newErrors.name = "Name must be at least 2 characters";
  //   }

  //   // Email validation
  //   if (!formData.email.trim()) {
  //     newErrors.email = "Email is required";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  //     newErrors.email = "Please enter a valid email";
  //   }

  //   // Password validation
  //   if (!formData.password) {
  //     newErrors.password = "Password is required";
  //   } else if (formData.password.length < 8) {
  //     newErrors.password = "Password must be at least 8 characters";
  //   } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
  //     newErrors.password = "Password must contain uppercase, lowercase, and number";
  //   }

  //   // Confirm password validation
  //   if (!formData.confirmPassword) {
  //     newErrors.confirmPassword = "Please confirm your password";
  //   } else if (formData.password !== formData.confirmPassword) {
  //     newErrors.confirmPassword = "Passwords do not match";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  //   // Clear error for this field when user starts typing
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     console.log("Sign up data:", formData);
  //     setIsLoading(false);
  //     // Redirect to login or home page
  //     // router.push('/login');
  //   }, 1500);
  // };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center relative overflow-hidden mb-4">
              <Image
                src="/images/logo.png"
                alt="AfriqNet"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join AfriqNet and start watching</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form action={formAction} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full bg-white/10 border ${
                    formState.errors?.name ? "border-red-500" : "border-white/20"
                  } rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#006eeb] transition-colors`}
                  placeholder="John Doe"
                />
              </div>
              {formState.errors?.name && (
                <p className="text-red-500 text-sm mt-1">{formState.errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full bg-white/10 border ${
                    formState.errors?.email ? "border-red-500" : "border-white/20"
                  } rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#006eeb] transition-colors`}
                  placeholder="you@example.com"
                />
              </div>
              {formState.errors?.email && (
                <p className="text-red-500 text-sm mt-1">{formState.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full bg-white/10 border ${
                    formState.errors?.password ? "border-red-500" : "border-white/20"
                  } rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#006eeb] transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formState.errors?.password && (
                <p className="text-red-500 text-sm mt-1">{formState.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full bg-white/10 border ${
                    formState.errors?.confirm_password ? "border-red-500" : "border-white/20"
                  } rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#006eeb] transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formState.errors?.confirm_password && (
                <p className="text-red-500 text-sm mt-1">{formState.errors.confirm_password}</p>
              )}
            </div>
              {formState.errors && (<ul id="form-error">
                {Object.keys(formState.errors).map((error)=>(<li key={error}>
                  {formState.errors[error]}
                </li>))}
              </ul>)}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-color btn-hover text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Sign Up
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-gray-400">Or</span>
            </div>
          </div>

          {/* Social Login (Optional - can be implemented later) */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#006eeb] hover:text-[#589be8] font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
