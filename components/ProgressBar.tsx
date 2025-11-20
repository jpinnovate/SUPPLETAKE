import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const circumference = 2 * Math.PI * 32; // Radius 32
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="bg-surface border border-white/10 rounded-xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-white" />
        </div>

        <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col justify-between h-full min-h-[100px]">
                <div>
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Daily Velocity</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-light tracking-tighter text-white">{completed}</span>
                        <span className="text-lg text-tertiary font-light">/ {total}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-secondary">
                        {total - completed} REMAINING
                    </div>
                </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform">
                    <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-white/5"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-white transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    {percentage === 100 ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                        <span className="text-xs font-bold text-white">{percentage}%</span>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};