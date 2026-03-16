import { useState, useMemo } from 'react';
import { Plus, Target, X, Trash2, Edit3, TrendingUp, Calendar, Tag, CheckCircle } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext';
import { useHabits } from '../../context/HabitsContext';

const CATEGORY_STYLES = {
  Personal:     { dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700' },
  Professional: { dot: 'bg-violet-400', badge: 'bg-violet-50 text-violet-700' },
  Health:       { dot: 'bg-emerald-400',badge: 'bg-emerald-50 text-emerald-700' },
  Finance:      { dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700' },
};

function categoryStyle(cat) {
  return CATEGORY_STYLES[cat] || { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700' };
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function GoalDetailsModal({ goal, onClose }) {
  const { updateGoal } = useGoals();
  const [logVal, setLogVal] = useState('');
  const progress = Math.min(100, (Number(goal.current) / Number(goal.target)) * 100);
  const cs = categoryStyle(goal.category);

  const handleLogProgress = (e) => {
    e.preventDefault();
    if (!logVal) return;
    updateGoal(goal.id, { current: Number(goal.current) + Number(logVal) });
    setLogVal('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-7 overflow-y-auto">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${cs.dot}`} />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cs.badge}`}>{goal.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] truncate">{goal.name}</h2>
            </div>
            <span className="flex-shrink-0 px-3 py-1 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              {goal.status || 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
              <span className="block text-xl sm:text-2xl font-bold text-[#111827]">{goal.current}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase mt-1 block">Current</span>
            </div>
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
              <span className="block text-xl sm:text-2xl font-bold text-[#111827]">{goal.target}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase mt-1 block">Target</span>
            </div>
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
              <span className="block text-xl sm:text-2xl font-bold text-[#111827]">{goal.unit}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase mt-1 block">Unit</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h4 className="text-sm font-bold text-[#111827]">Progress to Goal</h4>
              <span className="text-xs font-bold text-text-secondary">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm font-bold text-[#111827]">Update Progress</h4>
            <form onSubmit={handleLogProgress} className="flex gap-2">
              <input
                type="number"
                placeholder={`Add to ${goal.unit}...`}
                value={logVal}
                onChange={e => setLogVal(e.target.value)}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium"
              />
              <button type="submit" className="flex-shrink-0 px-4 sm:px-6 bg-black text-white rounded-xl font-bold hover:opacity-90 text-sm">
                Add
              </button>
            </form>
          </div>

          {(goal.startDate || goal.endDate) && (
            <div className="grid grid-cols-2 gap-3">
              {goal.startDate && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-sm font-bold text-[#111827]">{formatDate(goal.startDate)}</p>
                </div>
              )}
              {goal.endDate && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Deadline</p>
                  <p className="text-sm font-bold text-[#111827]">{formatDate(goal.endDate)}</p>
                </div>
              )}
            </div>
          )}

          {goal.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#111827]">Description</h4>
              <p className="text-sm text-text-secondary leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-xl break-words">{goal.description}</p>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 border border-border bg-white text-text-secondary rounded-xl font-bold text-sm">Close</button>
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsTemplates() {
  const { goals, addGoal, deleteGoal, updateGoal } = useGoals();
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgressId, setEditingProgressId] = useState(null);
  const [tempProgress, setTempProgress] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [newGoal, setNewGoal] = useState({
    name: '', category: 'Personal', type: 'Count', target: 30, unit: 'days',
    current: 0, habitId: 'None', startDate: new Date().toISOString().split('T')[0],
    endDate: '', description: '', isTemplate: false
  });

  const filteredGoals = useMemo(() => {
    if (activeTab === 'Templates') return goals.filter(g => g.isTemplate);
    if (activeTab === 'Completed') return goals.filter(g => g.status === 'Completed');
    return goals.filter(g => !g.isTemplate && g.status === 'Active');
  }, [goals, activeTab]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    addGoal(newGoal);
    setIsModalOpen(false);
    setNewGoal({
      name: '', category: 'Personal', type: 'Count', target: 30, unit: 'days',
      current: 0, habitId: 'None', startDate: new Date().toISOString().split('T')[0],
      endDate: '', description: '', isTemplate: false
    });
  };

  const handleUpdateProgress = (id, current) => {
    updateGoal(id, { current: Number(current) });
    setEditingProgressId(null);
  };

  const tabCounts = {
    Active: goals.filter(g => !g.isTemplate && g.status === 'Active').length,
    Templates: goals.filter(g => g.isTemplate).length,
    Completed: goals.filter(g => g.status === 'Completed').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-0 sm:px-2 pb-12">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2">
            <Target className="w-7 h-7 shrink-0" />
            Goals & Templates
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {filteredGoals.length} {activeTab.toLowerCase()} {filteredGoals.length === 1 ? 'goal' : 'goals'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['Active', 'Templates', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-text-secondary border-border hover:bg-gray-50'
            }`}
          >
            {tab}
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-secondary'
            }`}>{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Goals grid */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border min-h-[360px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-border mb-4">
            <Target className="w-8 h-8 text-[#111827]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">No {activeTab.toLowerCase()} goals yet</h3>
          <p className="text-sm text-text-secondary mt-1 mb-5">Create your first goal to start tracking progress.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map(goal => {
            const progress = Math.min(100, (Number(goal.current) / Number(goal.target)) * 100);
            const isEditing = editingProgressId === goal.id;
            const cs = categoryStyle(goal.category);
            const remaining = Math.max(0, Number(goal.target) - Number(goal.current));

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-border shadow-sm flex flex-col gap-0 text-left group transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Card top color bar */}
                <div className={`h-1 w-full ${cs.dot}`} />

                <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
                  {/* Title row */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[#111827] leading-snug truncate">{goal.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cs.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                          {goal.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                          {goal.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress numbers */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#111827] leading-none">{goal.current}</span>
                        <span className="text-sm font-bold text-text-secondary">/ {goal.target} {goal.unit}</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="number"
                            value={tempProgress}
                            onChange={(e) => setTempProgress(e.target.value)}
                            autoFocus
                            className="w-16 px-2 py-1 border border-border rounded-lg text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-black"
                          />
                          <button
                            onClick={() => handleUpdateProgress(goal.id, tempProgress)}
                            className="text-[10px] bg-[#111827] text-white px-2 py-1 rounded-lg font-bold"
                          >Save</button>
                          <button onClick={() => setEditingProgressId(null)} className="text-[10px] text-text-secondary">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingProgressId(goal.id); setTempProgress(goal.current); }}
                          className="flex items-center gap-1 text-[10px] text-text-secondary hover:text-[#111827] mt-1 transition-colors"
                        >
                          <Edit3 className="w-2.5 h-2.5" /> Edit progress
                        </button>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-[#111827]">{Math.round(progress)}%</span>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">done</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#111827] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-secondary font-medium">
                      {remaining > 0 ? `${remaining} ${goal.unit} remaining` : '🎉 Goal complete!'}
                    </p>
                  </div>

                  {/* Dates row */}
                  <div className="flex items-center gap-3 text-[10px] text-text-secondary font-medium flex-wrap">
                    {goal.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Started {formatDate(goal.startDate)}
                      </span>
                    )}
                    {goal.endDate && (
                      <span className="flex items-center gap-1 font-bold text-[#111827]">
                        <TrendingUp className="w-3 h-3" />
                        Due {formatDate(goal.endDate)}
                      </span>
                    )}
                    {!goal.startDate && !goal.endDate && (
                      <span className="italic">No dates set</span>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-[#111827] rounded-xl transition-colors border border-gray-100"
                  >
                    View Details & Log Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedGoal && (
        <GoalDetailsModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-5 border-b border-border flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-bold text-[#111827]">New Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Goal Name *</label>
                <input
                  required
                  type="text"
                  value={newGoal.name}
                  onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g. 100 Days of Exercise"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>Personal</option>
                    <option>Professional</option>
                    <option>Health</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Type</label>
                  <select
                    value={newGoal.type}
                    onChange={e => setNewGoal({...newGoal, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>Count</option>
                    <option>Binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Unit</label>
                  <select
                    value={newGoal.unit}
                    onChange={e => setNewGoal({...newGoal, unit: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>days</option>
                    <option>hours</option>
                    <option>sessions</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Current Progress</label>
                  <input
                    type="number"
                    value={newGoal.current}
                    onChange={e => setNewGoal({...newGoal, current: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Link to Habit</label>
                  <select
                    value={newGoal.habitId}
                    onChange={e => setNewGoal({...newGoal, habitId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option value="None">None</option>
                    {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    value={newGoal.startDate}
                    onChange={e => setNewGoal({...newGoal, startDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={newGoal.endDate}
                    onChange={e => setNewGoal({...newGoal, endDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={newGoal.description}
                  onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Optional notes..."
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveTemplate"
                  checked={newGoal.isTemplate}
                  onChange={e => setNewGoal({...newGoal, isTemplate: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="saveTemplate" className="text-sm font-medium text-text-primary">Save as template</label>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button type="submit" className="w-full py-3 bg-[#111827] text-white rounded-lg font-bold">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
