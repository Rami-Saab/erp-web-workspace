import { CheckCircle, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RegisterSuccessPageProps {
  userName: string;
  userEmail: string;
  onContinue: () => void;
}

export function RegisterSuccessPage({ userName, userEmail, onContinue }: RegisterSuccessPageProps) {
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
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 via-blue-500/50 to-indigo-500/50 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Success Message */}
                <div className="relative p-8 md:p-12 flex items-center bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                  <div className="w-full">
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/30 to-blue-500/30 backdrop-blur-sm border border-green-500/50 rounded-full mb-6 animate-bounce">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>

                    {/* Welcome Message */}
                    <h1 className="text-white mb-3">Welcome Aboard!</h1>
                    <h2 className="text-white/90 mb-6">Your account has been created successfully</h2>

                    {/* User Details Card */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Full Name</p>
                          <p className="text-white">{userName}</p>
                        </div>
                        <div className="h-px bg-white/10"></div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Email Address</p>
                          <p className="text-white">{userEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <p className="text-white/80 text-sm">Access to all ERP modules</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <p className="text-white/80 text-sm">Real-time data analytics</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <p className="text-white/80 text-sm">24/7 customer support</p>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={onContinue}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
                    >
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Side - Decorative Image */}
                <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/30 backdrop-blur-sm">
                  <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN1Y2Nlc3MlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjQ0MTU5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Success"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    
                    {/* Animated success elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Pulsing circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/30 rounded-full animate-pulse"></div>
                        
                        {/* Center icon */}
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"></div>
                    <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-40 left-32 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 right-32 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                    
                    {/* Bottom text */}
                    <div className="absolute bottom-8 left-8 right-8 text-center">
                      <h3 className="text-white mb-2">You're All Set! 🎉</h3>
                      <p className="text-white/70 text-sm">Start managing your business today</p>
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
