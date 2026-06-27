// ==================== KPI CARD COMPONENT ====================
import React from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight,
  DollarSign, Users, Package, ShoppingCart, Activity, Target,
  Wallet, Receipt, Clock, Factory, Calculator, BarChart3, RefreshCw,
  UserMinus, Layers, Brain
} from 'lucide-react';
import type { KPICardProps } from '../types/analytics.types';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Wallet: <Wallet className="w-6 h-6" />,
  Receipt: <Receipt className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Factory: <Factory className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  UserMinus: <UserMinus className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  TrendingDown: <TrendingDown className="w-6 h-6" />,
};

// Color configuration for different KPI colors
const colorConfig: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  blue: { 
    bg: 'bg-blue-500/20', 
    border: 'border-blue-400/30', 
    text: 'text-blue-300',
    gradient: 'from-blue-500/10 to-blue-600/5'
  },
  green: { 
    bg: 'bg-green-500/20', 
    border: 'border-green-400/30', 
    text: 'text-green-300',
    gradient: 'from-green-500/10 to-green-600/5'
  },
  purple: { 
    bg: 'bg-purple-500/20', 
    border: 'border-purple-400/30', 
    text: 'text-purple-300',
    gradient: 'from-purple-500/10 to-purple-600/5'
  },
  cyan: { 
    bg: 'bg-cyan-500/20', 
    border: 'border-cyan-400/30', 
    text: 'text-cyan-300',
    gradient: 'from-cyan-500/10 to-cyan-600/5'
  },
  yellow: { 
    bg: 'bg-yellow-500/20', 
    border: 'border-yellow-400/30', 
    text: 'text-yellow-300',
    gradient: 'from-yellow-500/10 to-yellow-600/5'
  },
  red: { 
    bg: 'bg-red-500/20', 
    border: 'border-red-400/30', 
    text: 'text-red-300',
    gradient: 'from-red-500/10 to-red-600/5'
  },
  orange: { 
    bg: 'bg-orange-500/20', 
    border: 'border-orange-400/30', 
    text: 'text-orange-300',
    gradient: 'from-orange-500/10 to-orange-600/5'
  },
  pink: { 
    bg: 'bg-pink-500/20', 
    border: 'border-pink-400/30', 
    text: 'text-pink-300',
    gradient: 'from-pink-500/10 to-pink-600/5'
  },
};

// Mini sparkline component
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    yellow: '#f59e0b',
    red: '#ef4444',
    orange: '#f97316',
    pink: '#ec4899',
  };
  
  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={colorMap[color] || colorMap.blue}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-60"
      />
    </svg>
  );
};

// Progress bar for target vs actual
const ProgressBar: React.FC<{ target: number; actual: number; color: string }> = ({ target, actual, color }) => {
  const percentage = Math.min((actual / target) * 100, 100);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };
  
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>Progress</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-500 ${colorMap[color] || colorMap.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon,
  color = 'blue',
  sparklineData,
  target,
  actual,
  onClick,
  loading = false,
  className = '',
}) => {
  const colors = colorConfig[color] || colorConfig.blue;
  const iconElement = typeof icon === 'string' ? iconMap[icon] : icon;
  
  const trendIcon = trend === 'up' 
    ? <ArrowUpRight className="w-4 h-4" />
    : trend === 'down' 
      ? <ArrowDownRight className="w-4 h-4" />
      : <Minus className="w-4 h-4" />;
  
  const trendColor = trend === 'up' 
    ? 'text-green-400' 
    : trend === 'down' 
      ? 'text-red-400' 
      : 'text-white/60';

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-lg" />
          <div className="w-16 h-4 bg-white/10 rounded" />
        </div>
        <div className="w-24 h-3 bg-white/10 rounded mb-2" />
        <div className="w-32 h-8 bg-white/10 rounded" />
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6
        bg-gradient-to-br ${colors.gradient}
        transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-xl
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}>
          <span className={colors.text}>{iconElement}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {trendIcon}
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      <p className="text-white/70 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-white/50 text-xs mt-1">{changeLabel}</p>
      
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3">
          <Sparkline data={sparklineData} color={color} />
        </div>
      )}
      
      {target !== undefined && actual !== undefined && (
        <ProgressBar target={target} actual={actual} color={color} />
      )}
      
      {onClick && (
        <div className="mt-3 flex items-center text-xs text-white/50 hover:text-white/70 transition-colors">
          <span>View details</span>
          <ArrowUpRight className="w-3 h-3 ml-1" />
        </div>
      )}
    </div>
  );
};

// KPI Card Grid Component
export const KPIGrid: React.FC<{ children: React.ReactNode; columns?: 2 | 3 | 4 | 5 | 6 }> = ({ 
  children, 
  columns = 4 
}) => {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
};

export default KPICard;


















































