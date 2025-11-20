import React from 'react';
import { Command } from 'lucide-react';

export const Header: React.FC = () => {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <header className="w-full py-4 border-b border-white/5">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
          <Command className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">VitalFlow OS</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-tertiary">{date}</span>
            <div className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse-slow"></div>
        </div>
      </div>
    </header>
  );
};