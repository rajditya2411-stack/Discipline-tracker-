import { useMemo } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export default function MissedLogsWidget() {
  const navigate = useNavigate();
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();

  const { missedItems, yesterdayLabel } = useMemo(() => {
    const yesterday = getYesterday();
    const dayCompletions = completions[yesterday] || {};
    const dayBlocks = blocks.filter(b => b.date === yesterday);

    const missedHabits = habits
      .filter(h => !dayCompletions[h.id])
      .map(h => ({ id: h.id, name: h.name, type: 'habit' }));

    const incompleteBlocks = dayBlocks
      .filter(b => !b.done)
      .map(b => ({ id: b.id, name: b.title, type: 'block' }));

    const d = new Date(yesterday + 'T00:00:00');
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return { missedItems: [...missedHabits, ...incompleteBlocks], yesterdayLabel: label };
  }, [habits, completions, blocks]);

  const nothingMissed = missedItems.length === 0;

  return (
    <div
      onClick={() => navigate('/missed-logs')}
      className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Missed Yesterday</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {!nothingMissed && (
            <span className="text-xs font-black text-danger bg-red-50 px-2 py-0.5 rounded-full">
              {missedItems.length}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Date label */}
      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-3">{yesterdayLabel}</p>

      {/* Content */}
      {nothingMissed ? (
        <div className="flex items-center gap-2 py-2">
          <CheckCircle2 className="w-4 h-4 text-gray-300 shrink-0" />
          <p className="text-sm font-medium text-text-secondary">Nothing missed</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {missedItems.slice(0, 4).map(item => (
            <li key={item.id} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.type === 'habit' ? 'bg-black' : 'bg-gray-400'}`} />
              <span className="text-xs font-medium text-text-primary truncate">{item.name}</span>
              <span className="text-[10px] text-text-secondary shrink-0 ml-auto">
                {item.type === 'habit' ? 'Habit' : 'Block'}
              </span>
            </li>
          ))}
          {missedItems.length > 4 && (
            <li className="text-[11px] text-text-secondary font-medium pl-3.5">
              +{missedItems.length - 4} more…
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
