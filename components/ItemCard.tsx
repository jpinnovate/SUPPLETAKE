import React from 'react';
import { Check, Clock, Info } from 'lucide-react';
import { TrackerItem } from '../types';

interface ItemCardProps {
  item: TrackerItem;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isCompleted, onToggle }) => {
  
  return (
    <div 
      onClick={() => onToggle(item.id)}
      className={`
        group relative flex items-center justify-between py-4 px-4 
        bg-surface hover:bg-surface-hover
        border border-white/5 hover:border-white/10
        rounded-lg transition-all duration-200 cursor-pointer
        ${isCompleted ? 'opacity-60 grayscale' : 'opacity-100'}
      `}
    >
      {/* Active Indicator */}
      <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-all duration-300 ${isCompleted ? 'bg-transparent' : 'bg-white'}`}></div>

      <div className="flex items-center gap-4 overflow-hidden">
        {/* Custom Checkbox */}
        <div className={`
          flex-shrink-0 w-5 h-5 rounded border transition-all duration-300 flex items-center justify-center ml-2
          ${isCompleted 
            ? 'bg-white border-white text-black' 
            : 'bg-transparent border-white/20 text-transparent group-hover:border-white/50'}
        `}>
          <Check className="w-3.5 h-3.5 stroke-[3px]" />
        </div>

        <div className="min-w-0 flex flex-col">
          <h3 className={`text-sm font-medium truncate transition-colors ${isCompleted ? 'text-tertiary line-through' : 'text-primary'}`}>
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isCompleted ? 'text-zinc-700' : 'text-secondary'}`}>
                {item.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
         {/* Metadata Chips */}
        {item.details && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-tertiary group-hover:text-secondary transition-colors">
                <Info className="w-3 h-3" />
                <span className="font-mono text-[10px]">{item.details}</span>
            </div>
        )}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-tertiary group-hover:text-secondary transition-colors">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[10px]">{item.timeOfDay}</span>
        </div>
      </div>
    </div>
  );
};