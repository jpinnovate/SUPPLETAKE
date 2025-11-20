import React, { useEffect, useState } from 'react';
import { AppState } from '../../types';
import { getHealthInsights, chatWithAdvisor } from '../../services/geminiService';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { Bot, Send, Sparkles, BrainCircuit } from 'lucide-react';

interface InsightsProps {
  state: AppState;
  todayDate: string;
}

export const Insights: React.FC<InsightsProps> = ({ state, todayDate }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Prepare chart data (Last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = state.logs[dateStr];
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      completed: log ? log.completedItemIds.length : 0,
    };
  });

  useEffect(() => {
    const fetchInsights = async () => {
        if (!process.env.API_KEY) {
            setAdvice("API KEY REQUIRED FOR ANALYSIS MODULE.");
            return;
        }
        setLoadingAdvice(true);
        const todayLog = state.logs[todayDate];
        const completed = todayLog ? todayLog.completedItemIds.length : 0;
        const text = await getHealthInsights(state.items, completed, state.items.length);
        setAdvice(text);
        setLoadingAdvice(false);
    };
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoadingChat(true);

    const prevHistory = chatHistory.map(c => `${c.sender === 'user' ? 'User' : 'AI'}: ${c.text}`);
    const response = await chatWithAdvisor(prevHistory, userMsg);

    setChatHistory(prev => [...prev, { sender: 'ai', text: response }]);
    setLoadingChat(false);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      
       <header className="pb-2 border-b border-white/10">
            <h2 className="text-3xl font-light tracking-tighter text-white mb-1">Analytics</h2>
            <p className="text-sm text-secondary">System performance & intelligence</p>
      </header>

      {/* Chart Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
             <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Adherence Trend</h3>
             <div className="text-[10px] font-mono text-tertiary">LAST 7 CYCLES</div>
        </div>
        <div className="h-56 w-full bg-surface border border-white/10 rounded-xl p-6 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis 
                        dataKey="name" 
                        stroke="#52525b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={15}
                        tick={{ fontFamily: 'DM Sans', textTransform: 'uppercase' }}
                    />
                    <YAxis hide domain={[0, state.items.length + 1]} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '0px', color: '#fff', fontFamily: 'DM Sans', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4'}}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#fff" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Analysis */}
        <div className="bg-surface border border-white/10 p-6 rounded-xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="w-20 h-20 text-white" />
            </div>
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">System Analysis</h3>
            </div>
            
            <div className="min-h-[100px]">
                {loadingAdvice ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-2 bg-white/10 rounded w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded w-1/2"></div>
                        <div className="h-2 bg-white/10 rounded w-5/6"></div>
                    </div>
                ) : (
                    <p className="text-sm text-secondary leading-relaxed font-mono">
                        {advice}
                    </p>
                )}
            </div>
        </div>

        {/* Chat Interface */}
        <div className="flex flex-col h-[400px] border border-white/10 rounded-xl bg-black overflow-hidden shadow-xl relative">
             {/* Terminal Header */}
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">Advisor.exe</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-tertiary space-y-2 opacity-50">
                        <Bot className="w-10 h-10" />
                        <p className="text-xs font-mono">INITIALIZE CONVERSATION</p>
                    </div>
                )}
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[85%] px-4 py-3 text-sm font-mono rounded-lg
                            ${msg.sender === 'user' 
                                ? 'bg-white text-black' 
                                : 'text-secondary border border-white/10 bg-zinc-900/50'}
                        `}>
                            {msg.sender === 'ai' && <span className="text-xs text-tertiary block mb-1 border-b border-white/5 pb-1">> RESPONSE</span>}
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loadingChat && (
                    <div className="flex justify-start">
                        <span className="text-xs text-tertiary animate-pulse font-mono">> PROCESSING...</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/10 bg-white/5">
                <div className="relative flex items-center">
                    <input
                        className="w-full bg-black border border-white/10 rounded-md text-sm text-white placeholder-zinc-700 px-3 py-2.5 outline-none focus:border-white/30 font-mono transition-colors"
                        placeholder="Input query..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={loadingChat}
                    />
                    <button 
                        type="submit"
                        disabled={!chatInput.trim() || loadingChat} 
                        className="absolute right-2 p-1.5 text-white hover:text-secondary transition-colors disabled:opacity-0"
                    >
                        <Send className="w-3 h-3" />
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};