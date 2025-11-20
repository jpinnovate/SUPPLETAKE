import React, { useState } from 'react';
import { AppState } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { ItemCard } from '../ItemCard';
import { Terminal, Sparkles, ArrowRight, Zap, Calendar } from 'lucide-react';
import { smartParseEntry } from '../../services/geminiService';

interface DashboardProps {
  state: AppState;
  todayDate: string;
  onToggle: (id: string) => void;
  onSmartComplete: (ids: string[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, todayDate, onToggle, onSmartComplete }) => {
  const [smartInput, setSmartInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const todayLog = state.logs[todayDate] || { date: todayDate, completedItemIds: [] };
  const completedCount = todayLog.completedItemIds.length;
  const totalCount = state.items.length;

  // Sort items: Pending first, then completed
  const sortedItems = [...state.items].sort((a, b) => {
    const aDone = todayLog.completedItemIds.includes(a.id);
    const bDone = todayLog.completedItemIds.includes(b.id);
    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });

  // Get next pending item
  const nextItem = sortedItems.find(item => !todayLog.completedItemIds.includes(item.id));

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim()) return;
    
    setIsProcessing(true);
    const matchedIds = await smartParseEntry(smartInput, state.items);
    setIsProcessing(false);
    setSmartInput('');
    
    if (matchedIds.length > 0) {
        onSmartComplete(matchedIds);
    }
  };

  const dateDisplay = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-white mb-1">Dashboard</h1>
            <div className="flex items-center gap-2 text-secondary">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{dateDisplay}</span>
            </div>
        </div>
        
        {/* Quick Greeting/Status */}
        <div className="text-sm font-mono text-tertiary text-right hidden md:block">
           SYSTEM ONLINE <br/>
           V.2.4
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProgressBar completed={completedCount} total={totalCount} />
        
        {/* Focus Card */}
        <div className="bg-surface border border-white/10 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-white" />
            </div>
            
            <div>
                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Up Next</h3>
                {nextItem ? (
                    <div>
                        <h2 className="text-2xl font-medium text-white mb-1">{nextItem.name}</h2>
                        <div className="flex gap-2 mt-2">
                            <span className="text-[10px] font-mono px-2 py-1 bg-white/10 rounded text-secondary">{nextItem.details || 'STANDARD'}</span>
                            <span className="text-[10px] font-mono px-2 py-1 bg-white/10 rounded text-secondary">{nextItem.timeOfDay}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-secondary">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-lg">All clear for today</span>
                    </div>
                )}
            </div>

            {nextItem && (
                <button 
                    onClick={() => onToggle(nextItem.id)}
                    className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 rounded border border-white/5 transition-colors uppercase tracking-wider"
                >
                    Mark Complete
                </button>
            )}
        </div>
      </div>

      {/* AI Command Bar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/0 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <form onSubmit={handleSmartSubmit} className="relative bg-black border border-white/10 rounded-lg flex items-center shadow-xl">
            <div className="pl-4 text-white">
                <Terminal className="w-5 h-5" />
            </div>
            <input 
                type="text"
                placeholder="Log routine with AI..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-600 text-sm py-4 px-4 font-mono"
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
                disabled={isProcessing}
            />
            <div className="pr-3">
                {isProcessing ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                ) : (
                    <button 
                        type="submit"
                        disabled={!smartInput.trim()}
                        className="p-2 hover:bg-white/10 rounded text-secondary hover:text-white transition-colors disabled:opacity-0"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
      </div>

      {/* Protocol List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Daily Protocol</h3>
            <span className="text-[10px] font-mono text-tertiary">{completedCount} / {totalCount} OPS</span>
        </div>
        
        <div className="space-y-2">
            {sortedItems.map(item => (
                <ItemCard 
                key={item.id} 
                item={item} 
                isCompleted={todayLog.completedItemIds.includes(item.id)}
                onToggle={(id) => onToggle(id)}
                />
            ))}
            
            {sortedItems.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-lg p-8 text-center">
                    <p className="text-sm text-tertiary">Registry is empty.</p>
                    <p className="text-xs text-zinc-600 mt-1">Initialize via Manage view.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};