import { useState, useMemo } from 'react';
import { Plus, Target, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext';
import { useHabits } from '../../context/HabitsContext';

export default function GoalsTemplates() {
  const { goals, addGoal } = useGoals();
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Personal',
    type: 'Count',
    target: 30,
    unit: 'days',
    current: 0,
    habitId: 'None',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    isTemplate: false
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
             <span className="text-text-secondary">»</span> GoalsTemplates
           </h1>
           <div className="flex items-center gap-2 ml-4">
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4 text-text-secondary" /></button>
              <span className="text-sm font-medium text-text-primary">Saturday, February 28, 2026</span>
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4 text-text-secondary" /></button>
              <button className="ml-2 px-3 py-1 bg-[#111827] text-white text-xs font-bold rounded-lg">Today</button>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Goals & Templates</h2>
          <p className="text-sm text-text-secondary mt-1">{filteredGoals.length} active goals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="flex gap-2">
        {['Active', 'Templates', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all border ${
              activeTab === tab 
                ? 'bg-[#111827] text-white border-[#111827]' 
                : 'bg-white text-text-secondary border-border hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
        {filteredGoals.length === 0 ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-border">
              <Target className="w-8 h-8 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">No {activeTab.toLowerCase()} goals yet</h3>
              <p className="text-sm text-text-secondary mt-1">Create your first goal to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Goal cards implementation */}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-bold text-[#111827]">New Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddGoal} className="p-8 space-y-6 overflow-y-auto">
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

              <div className="grid grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newGoal.startDate} 
                      onChange={e => setNewGoal({...newGoal, startDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newGoal.endDate} 
                      onChange={e => setNewGoal({...newGoal, endDate: e.target.value})}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                    />
                  </div>
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

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8 sticky bottom-0 bg-white py-4">
                 <button type="submit" className="w-full py-3 bg-[#111827] text-white rounded-lg font-bold">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
