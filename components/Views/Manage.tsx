import React, { useState } from 'react';
import { AppState, ItemType, TrackerItem } from '../../types';
import { Trash2, Plus, X, Database, Server } from 'lucide-react';

interface ManageProps {
  items: TrackerItem[];
  onAddItem: (item: Omit<TrackerItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const Manage: React.FC<ManageProps> = ({ items, onAddItem, onDelete }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    details: '',
    type: ItemType.SUPPLEMENT,
    timeOfDay: 'Morning'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    onAddItem(newItem);
    setIsFormOpen(false);
    setNewItem({ name: '', details: '', type: ItemType.SUPPLEMENT, timeOfDay: 'Morning' });
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-end pb-6 border-b border-white/10">
        <div>
            <h2 className="text-3xl font-light tracking-tighter text-white mb-1">Registry</h2>
            <p className="text-sm text-secondary">Manage protocol database</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </header>

      {isFormOpen && (
        <div className="bg-surface border border-white/10 rounded-xl p-6 space-y-6 shadow-2xl shadow-black/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Server className="w-4 h-4" /> New Registry Entry
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-tertiary hover:text-white transition-colors">
                 <X className="w-5 h-5" />
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6 items-start">
                <label className="text-xs font-mono text-secondary pt-2 uppercase">Designation</label>
                <input 
                    className="bg-surface-hover border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-white/30 text-sm font-medium placeholder-tertiary transition-colors w-full"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g. Vitamin D3, Morning Jog"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6 items-start">
                <label className="text-xs font-mono text-secondary pt-2 uppercase">Parameters</label>
                <input 
                    className="bg-surface-hover border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-white/30 text-sm font-medium placeholder-tertiary transition-colors w-full"
                    value={newItem.details}
                    onChange={e => setNewItem({...newItem, details: e.target.value})}
                    placeholder="e.g. 5000 IU, 30 mins"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6 items-start">
                <label className="text-xs font-mono text-secondary pt-2 uppercase">Category</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setNewItem({...newItem, type: ItemType.SUPPLEMENT})}
                        className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-wide transition-colors ${newItem.type === ItemType.SUPPLEMENT ? 'bg-white text-black border-white' : 'bg-transparent text-secondary border-white/10 hover:border-white/30'}`}
                    >
                        Supplement
                    </button>
                    <button
                        type="button"
                        onClick={() => setNewItem({...newItem, type: ItemType.ROUTINE})}
                        className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-wide transition-colors ${newItem.type === ItemType.ROUTINE ? 'bg-white text-black border-white' : 'bg-transparent text-secondary border-white/10 hover:border-white/30'}`}
                    >
                        Routine
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6 items-start">
                <label className="text-xs font-mono text-secondary pt-2 uppercase">Schedule</label>
                <select 
                    className="bg-surface-hover border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-white/30 text-sm font-medium w-full appearance-none"
                    value={newItem.timeOfDay}
                    onChange={e => setNewItem({...newItem, timeOfDay: e.target.value})}
                >
                    <option>Morning</option>
                    <option>Lunch</option>
                    <option>Evening</option>
                    <option>Night</option>
                    <option>Anytime</option>
                </select>
            </div>

            <div className="pt-4 flex justify-end border-t border-white/5 mt-4">
                <button type="submit" className="bg-white text-black px-6 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors">
                    Confirm Entry
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] px-6 py-3 bg-white/5 border-b border-white/10 text-[10px] font-bold text-secondary uppercase tracking-widest">
            <div>Item</div>
            <div className="hidden sm:block">Specs</div>
            <div className="hidden sm:block">Time</div>
            <div className="text-right">Action</div>
        </div>
        
        <div className="divide-y divide-white/5">
            {items.map(item => (
            <div key={item.id} className="group grid grid-cols-[2fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-white/5 transition-colors">
                <div>
                    <p className="font-medium text-white text-sm">{item.name}</p>
                    <div className="flex sm:hidden gap-2 mt-1">
                        <span className="text-[10px] text-tertiary">{item.details}</span>
                    </div>
                </div>
                <div className="hidden sm:block">
                     <span className="text-xs font-mono text-secondary bg-white/5 px-1.5 py-0.5 rounded">{item.details || 'N/A'}</span>
                </div>
                <div className="hidden sm:block">
                    <span className="text-xs font-mono text-tertiary">{item.timeOfDay}</span>
                </div>
                <div className="text-right">
                    <button 
                    onClick={() => onDelete(item.id)}
                    className="text-tertiary hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            ))}
            
            {items.length === 0 && (
                 <div className="p-8 text-center">
                    <Database className="w-8 h-8 text-tertiary mx-auto mb-3 opacity-20" />
                    <p className="text-sm text-tertiary">Database is empty</p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};