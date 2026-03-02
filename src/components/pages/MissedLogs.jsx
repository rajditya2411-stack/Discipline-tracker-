import { useState, useMemo, useEffect } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, History, Ban } from 'lucide-react';

export default function MissedLogs() {
  const { habits, completions } = useHabits();
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate missed logs for the last 30 days
  const missedLogs = useMemo(() => {
    const logs = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayCompletions = completions[dateStr] || {};
      
      const missed = habits.filter(h => !dayCompletions[h.id]);
      if (missed.length > 0) {
        logs.push({
          date: dateStr,
          items: missed.map(m => m.name),
          totalMissed: missed.length
        });
      }
    }
    return logs;
  }, [habits, completions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
          <Ban className="w-6 h-6" /> Missed Logs & Penalties
        </h1>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">30-Day History</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4 text-center">Monthly Impact</h3>
            <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl">
              <span className="text-5xl font-black text-[#111827] mb-2">{missedLogs.reduce((acc, curr) => acc + curr.totalMissed, 0)}</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Missed Habits</span>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-text-secondary">At Stake</span>
                <span className="text-danger">$ {missedLogs.reduce((acc, curr) => acc + curr.totalMissed, 0) * 5}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-danger w-2/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Log */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Historical Log</h3>
            </div>
            <div className="divide-y divide-border">
              {missedLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-text-secondary font-medium">No missed habits in the last 30 days. Perfect discipline!</p>
                </div>
              ) : (
                missedLogs.map((log) => (
                  <div key={log.date} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-bold text-[#111827]">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        <div className="flex gap-2 mt-1">
                          {log.items.map(name => (
                            <span key={name} className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-text-secondary rounded uppercase">{name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-black text-danger">-{log.totalMissed}</span>
                        <span className="text-[9px] font-bold text-text-secondary uppercase">Missed</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
