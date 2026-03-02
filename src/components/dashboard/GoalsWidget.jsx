import { Plus, Target, ArrowRight, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import { useState } from 'react';

export default function GoalsWidget() {
  const { goals, deleteGoal, updateGoal } = useGoals();
  const [editingId, setEditingId] = useState(null);
  const [tempVal, setTempVal] = useState('');
  
  // Show top 3 active goals
  const activeGoals = goals
    .filter(g => g.status === 'Active' && !g.isTemplate)
    .slice(0, 3);

  const handleUpdate = (id, val) => {
    updateGoal(id, { current: Number(val) });
    setEditingId(null);
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#111827] text-lg font-bold uppercase tracking-tight">Active Goals</h3>
        <Link to="/goals" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-6 flex-1">
        {activeGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-border">
              <Target className="w-6 h-6 text-text-secondary" />
            </div>
            <p className="text-text-secondary text-sm font-medium">No active goals yet.</p>
          </div>
        ) : (
          activeGoals.map((goal) => {
            const progress = Math.min(100, (Number(goal.current) / Number(goal.target)) * 100);
            const isEditing = editingId === goal.id;

            return (
              <div key={goal.id} className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-[#111827] text-sm font-bold">{goal.name}</p>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{goal.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[#111827] text-xs font-bold">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            value={tempVal}
                            onChange={(e) => setTempVal(e.target.value)}
                            onBlur={() => handleUpdate(goal.id, tempVal)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(goal.id, tempVal)}
                            autoFocus
                            className="w-12 px-1 border border-border rounded text-[10px]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                          setEditingId(goal.id);
                          setTempVal(goal.current);
                        }}>
                          {goal.current} / {goal.target}
                          <Edit3 className="w-3 h-3 text-text-secondary" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100 border border-border/10">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#111827] transition-all duration-1000"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{Math.round(progress)}% complete</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Link
        to="/goals"
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-[#111827] text-sm font-bold rounded-xl hover:bg-gray-100 transition-all border border-border"
      >
        <Plus className="w-4 h-4" />
        New Goal
      </Link>
    </div>
  );
}
