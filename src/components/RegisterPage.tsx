import React, { useState } from 'react';
import { Lock, Mail, User, AlertCircle, Eye, EyeOff, Building } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CustomSelect } from './ui/CustomSelect';

interface RegisterPageProps {
  onRegister: (email: string, name: string) => void;
  onNavigateToLogin: () => void;
}

export function RegisterPage({ onRegister, onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      onRegister(formData.email, formData.fullName);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Glass Card Container */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-indigo-500/50 rounded-3xl blur-xl opacity-75"></div>
            
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Image Section */}
                <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/30 backdrop-blur-sm">
                  <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1762341123207-534f965910df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NDM5NTA2NXww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="ERP System"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    
                    {/* Floating text */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-white mb-2">Join Our Platform</h2>
                      <p className="text-white/80">Start managing your business today</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="p-8 md:p-12 flex items-center">
                  <div className="w-full">
                    <div className="mb-6">
                      <h1 className="text-white mb-2">Create Account</h1>
                      <p className="text-white/70">Fill in your details to register</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 backdrop-blur-sm">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}

                      {/* Full Name Input */}
                      <div>
                        <label htmlFor="fullName" className="block text-white/90 mb-2 text-sm">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <User className="w-5 h-5" />
                          </div>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div>
                        <label htmlFor="email" className="block text-white/90 mb-2 text-sm">
                          Email *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <Mail className="w-5 h-5" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                            placeholder="you@company.com"
                          />
                        </div>
                      </div>

                      {/* Department Select */}
                      <div>
                        <label htmlFor="department" className="block text-white/90 mb-2 text-sm">
                          Department
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
                            <Building className="w-5 h-5" />
                          </div>
                          <CustomSelect
                            value={formData.department}
                            onChange={(value) => setFormData({ ...formData, department: value as string })}
                            options={[
                              { value: '', label: 'Select department' },
                              { value: 'sales', label: 'Sales' },
                              { value: 'marketing', label: 'Marketing' },
                              { value: 'finance', label: 'Finance' },
                              { value: 'hr', label: 'Human Resources' },
                              { value: 'operations', label: 'Operations' },
                              { value: 'it', label: 'IT' },
                            ]}
                            placeholder="Select department..."
                            className="pl-12"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label htmlFor="password" className="block text-white/90 mb-2 text-sm">
                          Password *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <Lock className="w-5 h-5" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                            placeholder="Min. 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password Input */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-white/90 mb-2 text-sm">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <Lock className="w-5 h-5" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                            placeholder="Re-enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/40"
                      >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-5 text-center text-sm">
                      <span className="text-white/70">Already have an account? </span>
                      <button
                        onClick={onNavigateToLogin}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
