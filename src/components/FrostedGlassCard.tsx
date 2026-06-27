import React from 'react';

interface FrostedGlassCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FrostedGlassCard({ icon, title, description }: FrostedGlassCardProps) {
  return (
    <div className="group relative">
      {/* Border gradient highlight */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/40 via-white/20 to-white/40 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main card */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Top highlight */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        
        {/* Icon container */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-white mb-3">
          {title}
        </h3>
        
        <p className="text-white/80">
          {description}
        </p>
        
        {/* Bottom shine effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
}
