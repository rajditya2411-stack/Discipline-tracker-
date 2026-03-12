import { useState, useMemo } from 'react';
import { Plus, Search, Zap, Target, Award, Trash2, X, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import { useSkills } from '../../context/SkillsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SKILL_CATEGORIES = ['All', 'Coding', 'Fitness', 'Business', 'Content', 'Learning', 'Design', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Monetizable'];

export default function Skills() {
  const { skills, addSkill, deleteSkill, updateSkill } = useSkills();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Coding',
    level: 'Beginner',
    target: 100,
    invested: 0,
    streak: 0,
    projects: 0,
    marketReady: false
  });

  const filteredSkills = useMemo(() => {
    return skills.filter(s => activeCategory === 'All' || s.category === activeCategory);
  }, [skills, activeCategory]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    addSkill(newSkill);
    setNewSkill({ name: '', category: 'Coding', level: 'Beginner', target: 100, invested: 0, streak: 0, projects: 0, marketReady: false });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827]">Skills</h1>
        <div className="flex items-center gap-2">
           <span className="text-sm text-text-secondary mr-2">Saturday, February 28, 2026</span>
           <button className="px-4 py-1.5 bg-[#111827] text-white rounded-lg text-sm font-bold">Today</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SKILL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-[#111827] text-white' 
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Skill
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSkills.map(skill => (
          <SkillCard 
            key={skill.id} 
            skill={skill} 
            onDelete={() => deleteSkill(skill.id)} 
            onDetails={() => setSelectedSkill(skill)}
            onToggleMarketReady={() => updateSkill(skill.id, { marketReady: !skill.marketReady })}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl p-6 border border-border shadow-2xl relative">
            <h2 className="text-xl font-bold text-[#111827] mb-6">Add New Skill</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <input required type="text" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg" placeholder="Skill Name" />
              <div className="grid grid-cols-2 gap-4">
                <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg">
                  {SKILL_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg">
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Target Hours" value={newSkill.target} onChange={e => setNewSkill({...newSkill, target: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg" />
                <input type="number" placeholder="Invested" value={newSkill.invested} onChange={e => setNewSkill({...newSkill, invested: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-border rounded-lg" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#111827] text-white rounded-lg font-bold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSkill && (
        <SkillDetailsModal 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)} 
        />
      )}
    </div>
  );
}

function SkillCard({ skill, onDelete, onDetails, onToggleMarketReady }) {
  const progress = Math.min(100, (skill.invested / skill.target) * 100);
  
  return (
    <div className="bg-white rounded-xl p-6 border border-border shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-[#111827]">{skill.name}</h3>
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{skill.category}</p>
        </div>
        <span className="px-4 py-1 bg-[#111827] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
          {skill.level}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          <span>{skill.invested}h invested</span>
          <span>{skill.target}h target</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#111827] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{Math.round(progress)}% complete</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#111827] flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-500 fill-orange-500" /> {skill.streak}
            </span>
            <span className="text-[9px] font-bold text-text-secondary uppercase">streak</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#111827] flex items-center gap-1">
              <Target className="w-3 h-3 text-primary" /> {skill.projects || 0}
            </span>
            <span className="text-[9px] font-bold text-text-secondary uppercase">projects</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onToggleMarketReady}
            className={`px-3 py-1.5 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
              skill.marketReady ? 'bg-sidebar text-white border-sidebar' : 'text-text-secondary hover:bg-gray-50'
            }`}
          >
            Market Ready
          </button>
          <button 
            onClick={onDetails}
            className="px-3 py-1.5 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:bg-gray-50"
          >
            Details →
          </button>
          <button onClick={onDelete} className="p-1.5 text-text-secondary hover:text-danger">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillDetailsModal({ skill, onClose }) {
  const { addHours, updateSkill } = useSkills();
  const [logHours, setLogHours] = useState('');
  const [projectName, setProjectName] = useState('');
  
  const progress = Math.min(100, (skill.invested / skill.target) * 100);
  
  const chartData = useMemo(() => {
    const hoursLog = skill.hoursLog || [];
    if (hoursLog.length === 0) {
      return [{ date: 'No data', val: 0 }];
    }
    
    // Group hours by date and calculate cumulative total
    const dateMap = {};
    hoursLog.forEach(entry => {
      dateMap[entry.date] = (dateMap[entry.date] || 0) + entry.hours;
    });
    
    // Sort dates and create cumulative data
    const sortedDates = Object.keys(dateMap).sort();
    let cumulativeHours = 0;
    const data = sortedDates.map(date => {
      cumulativeHours += dateMap[date];
      const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { date: displayDate, val: cumulativeHours, rawDate: date };
    });
    
    return data;
  }, [skill.hoursLog]);

  const handleLogHours = (e) => {
    e.preventDefault();
    if (!logHours) return;
    addHours(skill.id, logHours);
    setLogHours('');
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectName) return;
    updateSkill(skill.id, { projects: (skill.projects || 0) + 1 });
    setProjectName('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
           {/* Top Stats */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center">
                 <span className="block text-2xl sm:text-3xl font-bold text-[#111827]">{Math.round(skill.invested * 1.5 + skill.streak * 20)}</span>
                 <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase">Skill Score</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center">
                 <span className="block text-2xl sm:text-3xl font-bold text-[#111827]">{skill.invested}h</span>
                 <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase">Hours</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center">
                 <span className="block text-2xl sm:text-3xl font-bold text-[#111827] flex items-center justify-center gap-1">
                    {skill.streak} <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 fill-orange-500" />
                 </span>
                 <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase">Streak</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center">
                 <span className="block text-2xl sm:text-3xl font-bold text-[#111827]">{skill.projects || 0}</span>
                 <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase">Projects</span>
              </div>
           </div>

           {/* Progress Section */}
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <h4 className="text-sm font-bold text-[#111827]">Progress to Goal</h4>
                 <span className="text-xs font-bold text-text-secondary">{skill.invested}h / {skill.target}h</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs font-bold text-text-secondary uppercase">{Math.round(progress)}% complete</p>
           </div>

           {/* Chart Section */}
           <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#111827]">Hours Progress</h4>
              {chartData.length > 0 && chartData[0].date !== 'No data' ? (
                <div className="h-[180px] sm:h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="val" stroke="black" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-text-secondary italic py-8 text-center">No hours logged yet. Start logging hours to see your progress.</p>
              )}
           </div>

           {/* Hours Log Section */}
           {(skill.hoursLog && skill.hoursLog.length > 0) && (
             <div className="space-y-4">
               <h4 className="text-sm font-bold text-[#111827]">Hours Logged</h4>
               <div className="space-y-2 max-h-[150px] overflow-y-auto">
                 {[...(skill.hoursLog || [])].reverse().map((entry, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-border">
                     <span className="text-sm font-medium text-[#111827]">{entry.hours} hours</span>
                     <span className="text-xs text-text-secondary font-bold uppercase">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Inputs */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-3">
                 <h4 className="text-sm font-bold text-[#111827]">Log Hours</h4>
                 <form onSubmit={handleLogHours} className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Hours" 
                      value={logHours} 
                      onChange={e => setLogHours(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" 
                    />
                    <button type="submit" className="p-3 bg-black text-white rounded-xl hover:opacity-90">
                       <Plus className="w-5 h-5" />
                    </button>
                 </form>
              </div>
              <div className="space-y-3">
                 <h4 className="text-sm font-bold text-[#111827]">Add Project</h4>
                 <form onSubmit={handleAddProject} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Project name" 
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" 
                    />
                    <button type="submit" className="p-3 bg-black text-white rounded-xl hover:opacity-90">
                       <Plus className="w-5 h-5" />
                    </button>
                 </form>
              </div>
           </div>
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
           <button onClick={onClose} className="px-6 py-2 border border-border bg-white text-text-secondary rounded-xl font-bold">Close Card</button>
           <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-xl font-bold">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
