import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsSuccess(true);
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
                  <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1728281144091-b743062a9bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JrcGxhY2UlMjBkZXNrfGVufDF8fHx8MTc2NDQxNDU3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="ERP System"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    
                    {/* Floating text */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-white mb-2">Account Recovery</h2>
                      <p className="text-white/80">Reset your password securely</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex items-center">
                  <div className="w-full">
                    {isSuccess ? (
                      /* Success State */
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-full mb-6">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-white mb-3">Check Your Email</h2>
                        <p className="text-white/70 mb-6">
                          We've sent a password reset link to <strong className="text-white">{email}</strong>
                        </p>
                        <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl mb-6 backdrop-blur-sm">
                          <p className="text-sm text-blue-200">
                            Please check your inbox and follow the instructions to reset your password.
                          </p>
                        </div>
                        <button
                          onClick={onNavigateToLogin}
                          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                        >
                          Back to Login
                        </button>
                      </div>
                    ) : (
                      /* Form State */
                      <>
                        <div className="mb-8">
                          <h1 className="text-white mb-2">Forgot Password?</h1>
                          <p className="text-white/70">Enter your email to receive a reset link</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 backdrop-blur-sm">
                              <AlertCircle className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm">{error}</span>
                            </div>
                          )}

                          {/* Info Message */}
                          <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl backdrop-blur-sm">
                            <p className="text-sm text-blue-200">
                              Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>
                          </div>

                          {/* Email Input */}
                          <div>
                            <label htmlFor="email" className="block text-white/90 mb-2 text-sm">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                <Mail className="w-5 h-5" />
                              </div>
                              <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                                placeholder="you@company.com"
                              />
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/40"
                          >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                          </button>

                          {/* Back to Login */}
                          <button
                            type="button"
                            onClick={onNavigateToLogin}
                            className="w-full flex items-center justify-center gap-2 py-3 text-white/70 hover:text-white transition"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                          </button>
                        </form>
                      </>
                    )}
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
