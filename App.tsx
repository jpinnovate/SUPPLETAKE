import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Views/Dashboard';
import { Manage } from './components/Views/Manage';
import { Insights } from './components/Views/Insights';
import { loadState, saveState, getTodayDateString, toggleItemCompletion } from './services/storage';
import { AppState, ViewState, TrackerItem } from './types';
import { LayoutGrid, Database, Activity } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(loadState());
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const todayDate = getTodayDateString();

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleToggleItem = (itemId: string) => {
    const newState = toggleItemCompletion(state, itemId, todayDate);
    setState(newState);
  };

  const handleAddItem = (newItem: Omit<TrackerItem, 'id'>) => {
    const id = Date.now().toString();
    const item: TrackerItem = { ...newItem, id };
    setState(prev => ({
        ...prev,
        items: [...prev.items, item]
    }));
  };

  const handleDeleteItem = (id: string) => {
      setState(prev => ({
          ...prev,
          items: prev.items.filter(i => i.id !== id)
      }));
  };

  const handleSmartComplete = (ids: string[]) => {
      let newState = { ...state };
      ids.forEach(id => {
          const currentLog = newState.logs[todayDate] || { date: todayDate, completedItemIds: [] };
          if (!currentLog.completedItemIds.includes(id)) {
             newState = toggleItemCompletion(newState, id, todayDate);
          }
      });
      setState(newState);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: React.ElementType, label: string }) => (
    <button 
        onClick={() => setCurrentView(view)}
        className={`
            group flex items-center justify-center px-6 h-10 rounded-full transition-all duration-300 ease-out
            ${currentView === view 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                : 'text-secondary hover:text-primary hover:bg-white/5'}
        `}
    >
        <Icon strokeWidth={2} className="w-4 h-4" />
        {currentView === view && (
            <span className="ml-2 text-xs font-semibold tracking-wide animate-fade-in">{label}</span>
        )}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-white selection:text-black relative z-10 flex flex-col">
      {/* Only show Header on large screens or as a very subtle element */}
      <div className="hidden md:block">
         <Header />
      </div>
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-6 pb-32 md:pt-12">
        {currentView === 'DASHBOARD' && (
            <Dashboard 
                state={state} 
                todayDate={todayDate} 
                onToggle={handleToggleItem}
                onSmartComplete={handleSmartComplete}
            />
        )}
        {currentView === 'MANAGE' && (
            <Manage 
                items={state.items} 
                onAddItem={handleAddItem}
                onDelete={handleDeleteItem}
            />
        )}
        {currentView === 'INSIGHTS' && (
            <Insights state={state} todayDate={todayDate} />
        )}
      </main>

      {/* Floating Island Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="glass-panel border border-white/10 rounded-full p-1.5 shadow-2xl shadow-black/50 pointer-events-auto flex gap-1 backdrop-blur-xl">
            <NavButton view="DASHBOARD" icon={LayoutGrid} label="Overview" />
            <NavButton view="INSIGHTS" icon={Activity} label="Analytics" />
            <NavButton view="MANAGE" icon={Database} label="Registry" />
        </nav>
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}