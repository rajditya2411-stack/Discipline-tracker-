import { useState, useMemo } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { useMissedLogs } from '../../context/MissedLogsContext';
import { AlertCircle, FileText, Trash2, Plus, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function formatDateLabel(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = getYesterday();
  if (dateStr === yesterday) return 'Yesterday';
  if (dateStr === today) return 'Today';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function MissedLogs() {
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();
  const { missedReasons, addReason, updateReason, deleteReason, getReasonsForTask } = useMissedLogs();

  const [selectedDate, setSelectedDate] = useState(getYesterday());
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [reasonText, setReasonText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const missedItems = useMemo(() => {
    const dayCompletions = completions[selectedDate] || {};
    const dayBlocks = blocks.filter(b => b.date === selectedDate);

    const missedHabits = habits
      .filter(h => !dayCompletions[h.id])
      .map(h => ({ id: h.id, name: h.name, type: 'habit' }));

    const incompleteBlocks = dayBlocks
      .filter(b => !b.done)
      .map(b => ({ id: b.id, name: b.title, type: 'block' }));

    return [...missedHabits, ...incompleteBlocks];
  }, [habits, completions, blocks, selectedDate]);

  const handlePrevMonth = () => {
    setCalendarDate(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleDayClick = (day) => {
    const dateStr = `${calendarDate.year}-${String(calendarDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr > today) return;
    setSelectedDate(dateStr);
    setExpandedTask(null);
    setShowCalendar(false);
  };

  const handleAddReason = (taskId, taskName, date, taskType) => {
    if (!reasonText.trim()) return;
    addReason(taskId, taskName, date, reasonText, taskType);
    setReasonText('');
  };

  const handleUpdateReason = (id) => {
    if (!editText.trim()) return;
    updateReason(id, editText);
    setEditingId(null);
  };

  const daysInMonth = getDaysInMonth(calendarDate.year, calendarDate.month);
  const firstDay = getFirstDayOfMonth(calendarDate.year, calendarDate.month);
  const monthName = new Date(calendarDate.year, calendarDate.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2">
            <AlertCircle className="w-7 h-7 text-danger shrink-0" />
            Missed Logs
          </h1>
          <p className="text-sm text-text-secondary mt-1">Review and log reasons for tasks you didn't complete.</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl sm:text-4xl font-black text-[#111827]">{missedItems.length}</div>
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Missed</p>
        </div>
      </div>

      {/* Date Picker Row */}
      <div className="relative">
        <button
          onClick={() => setShowCalendar(v => !v)}
          className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-base">📅</span>
          {formatDateLabel(selectedDate)}
          <ChevronRight className={`w-4 h-4 text-text-secondary transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
        </button>

        {showCalendar && (
          <div className="absolute top-full left-0 mt-2 z-30 bg-white border border-border rounded-2xl shadow-xl p-4 w-72">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-text-primary" />
              </button>
              <span className="text-sm font-bold text-[#111827]">{monthName}</span>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-text-primary" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-text-secondary py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${calendarDate.year}-${String(calendarDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isFuture = dateStr > today;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === today;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={isFuture}
                    className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg transition-colors
                      ${isFuture ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                      ${isSelected ? 'bg-[#111827] text-white hover:bg-[#111827]' : ''}
                      ${isToday && !isSelected ? 'border border-[#111827] text-[#111827]' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-5 py-4 border-b border-border bg-gray-50/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
            {formatDateLabel(selectedDate)}
          </h3>
          {missedItems.length > 0 && (
            <span className="text-sm font-black text-danger">{missedItems.length} incomplete</span>
          )}
        </div>

        {missedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-base font-semibold text-[#111827]">Nothing missed</p>
            <p className="text-sm text-text-secondary mt-1">All tasks were completed on this day.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {missedItems.map((item) => {
              const reasons = getReasonsForTask(item.id, selectedDate);
              const taskKey = `${item.id}-${selectedDate}`;
              const isExpanded = expandedTask === taskKey;

              return (
                <div key={taskKey} className="p-5">
                  <div
                    className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setExpandedTask(isExpanded ? null : taskKey)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.type === 'habit' ? 'bg-primary' : 'bg-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111827] truncate">{item.name}</p>
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">
                          {item.type === 'habit' ? 'Habit' : 'Time Block'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {reasons.length > 0 && (
                        <span className="text-xs bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full font-bold">
                          {reasons.length} {reasons.length === 1 ? 'reason' : 'reasons'}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {reasons.length > 0 && (
                        <div className="space-y-2">
                          {reasons.map(reason => (
                            <div key={reason.id} className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-start justify-between gap-2">
                              {editingId === reason.id ? (
                                <div className="flex-1 flex gap-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="flex-1 bg-white border border-border rounded px-2 py-1 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-black"
                                  />
                                  <button
                                    onClick={() => handleUpdateReason(reason.id)}
                                    className="bg-[#111827] text-white px-2.5 py-1 rounded text-xs font-bold"
                                  >Save</button>
                                  <button onClick={() => setEditingId(null)} className="text-text-secondary hover:text-danger">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-[#111827] flex-1">{reason.reason}</p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => { setEditingId(reason.id); setEditText(reason.reason); }}
                                      className="text-xs text-text-secondary hover:text-[#111827] font-medium transition-colors"
                                    >Edit</button>
                                    <button onClick={() => deleteReason(reason.id)} className="text-text-secondary hover:text-danger transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {editingId !== `add-${taskKey}` ? (
                        <button
                          onClick={() => { setEditingId(`add-${taskKey}`); setReasonText(''); }}
                          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#111827] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add Reason
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={reasonText}
                            onChange={(e) => setReasonText(e.target.value)}
                            placeholder="Why wasn't this completed?"
                            className="flex-1 bg-white border border-border rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-black"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddReason(item.id, item.name, selectedDate, item.type);
                                setEditingId(null);
                              }
                            }}
                          />
                          <button
                            onClick={() => { handleAddReason(item.id, item.name, selectedDate, item.type); setEditingId(null); }}
                            className="bg-[#111827] text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-black/80 transition-colors"
                          >Save</button>
                          <button onClick={() => setEditingId(null)} className="text-text-secondary hover:text-danger transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
