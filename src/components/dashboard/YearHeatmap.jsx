import { useMemo } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

const heatColors = ['#EBEDF0', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#374151'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Mon', 'Wed', 'Fri'];

export default function YearHeatmap() {
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();

  const grid = useMemo(() => {
    const data = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    // Start from 52 weeks ago
    const start = new Date(now);
    start.setDate(now.getDate() - (51 * 7)); // 52 weeks including current
    // Adjust to Monday
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    start.setDate(diff);

    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const d = new Date(start);
        d.setDate(start.getDate() + (week * 7) + day);
        const dateStr = d.toISOString().slice(0, 10);
        
        const dayCompletions = completions[dateStr] || {};
        const completedHabits = habits.filter(h => dayCompletions[h.id]).length;
        
        // Calculate Time Block completion for this day
        const dayBlocks = blocks.filter(b => b.date === dateStr);
        const completedBlocks = dayBlocks.filter(b => b.done).length;
        
        const totalPossible = habits.length + dayBlocks.length;
        const totalDone = completedHabits + completedBlocks;
        
        let level = 0;
        if (totalPossible > 0) {
          const ratio = totalDone / totalPossible;
          if (ratio >= 1) level = 4;
          else if (ratio > 0.6) level = 3;
          else if (ratio > 0.3) level = 2;
          else if (ratio > 0) level = 1;
        }
        weekData.push({ level, count: totalDone, total: totalPossible, date: dateStr });
      }
      data.push(weekData);
    }
    return data;
  }, [habits, completions, blocks]);

  return (
    <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6 border border-border w-full">
      <h3 className="text-text-primary text-lg font-bold mb-6">Year in Review - Completion Heatmap</h3>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="inline-flex gap-1 min-w-max">
          <div className="flex flex-col justify-around pr-4 text-text-secondary text-[10px] font-bold uppercase tracking-wider">
            {days.map((d) => (
              <span key={d} className="h-3.5 leading-none flex items-center">{d}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-sm hover:ring-2 hover:ring-primary/50 cursor-default transition-all"
                    style={{ backgroundColor: heatColors[day.level] }}
                    title={`${day.date} • ${day.count}/${day.total} tasks completed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="flex gap-4 sm:gap-8 text-text-secondary text-[10px] font-bold uppercase tracking-wider overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-text-secondary text-[10px] sm:text-xs font-medium shrink-0">
          <span>Less</span>
          <div className="flex gap-1">
            {heatColors.map((c, i) => (
              <div key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
