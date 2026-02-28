import { Zap, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSkills } from '../../context/SkillsContext';
import { useState } from 'react';

export default function ActiveSkills() {
  const { skills, addHours } = useSkills();
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [hoursToAdd, setHoursToAdd] = useState('');
  
  const activeSkills = [...skills]
    .sort((a, b) => (Number(b.streak) || 0) - (Number(a.streak) || 0))
    .slice(0, 2);

  const handleAddHours = (e, id) => {
    e.preventDefault();
    if (!hoursToAdd || isNaN(hoursToAdd)) return;
    addHours(id, hoursToAdd);
    setHoursToAdd('');
    setSelectedSkillId(null);
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#111827] text-lg font-bold uppercase tracking-tight">Skills Progress</h3>
        <Link to="/skills" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-6 flex-1">
        {activeSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-text-secondary text-sm font-medium">No skills tracked yet.</p>
          </div>
        ) : (
          activeSkills.map((skill) => {
            const progress = Math.min(100, (skill.invested / skill.target) * 100);
            const isSelected = selectedSkillId === skill.id;

            return (
              <div key={skill.id} className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setSelectedSkillId(isSelected ? null : skill.id)}
                >
                  <div className="flex flex-col">
                    <p className="text-[#111827] text-sm font-bold group-hover:text-primary transition-colors">{skill.name}</p>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{skill.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#111827] text-sm font-bold">
                    <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    {skill.streak}
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
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{skill.invested}h invested</span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{Math.round(progress)}%</span>
                  </div>
                </div>

                {isSelected && (
                  <form 
                    onSubmit={(e) => handleAddHours(e, skill.id)}
                    className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      autoFocus
                      type="number"
                      step="0.5"
                      placeholder="Hours"
                      value={hoursToAdd}
                      onChange={(e) => setHoursToAdd(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-[#111827]"
                    />
                    <button 
                      type="submit"
                      className="px-3 py-1.5 bg-[#111827] text-white text-[10px] font-bold uppercase rounded-lg hover:opacity-90 transition-all"
                    >
                      Add
                    </button>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>

      <Link
        to="/skills"
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-[#111827] text-sm font-bold rounded-xl hover:bg-gray-100 transition-all border border-border"
      >
        <Plus className="w-4 h-4" />
        Manage Skills
      </Link>
    </div>
  );
}
