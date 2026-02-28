import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-skills';

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const [skills, setSkills] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch (_) {}
  }, [skills]);

  const addSkill = useCallback((skillData) => {
    const id = String(Date.now());
    setSkills((prev) => [...prev, { 
      id, 
      ...skillData, 
      invested: skillData.invested || 0,
      streak: skillData.streak || 0,
      projects: skillData.projects || 0,
      marketReady: skillData.marketReady || false
    }]);
    return id;
  }, []);

  const updateSkill = useCallback((id, updates) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSkill = useCallback((id) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addHours = useCallback((id, hours) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, invested: (Number(s.invested) || 0) + Number(hours) } : s))
    );
  }, []);

  return (
    <SkillsContext.Provider
      value={{
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        addHours
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const ctx = useContext(SkillsContext);
  if (!ctx) throw new Error('useSkills must be used within SkillsProvider');
  return ctx;
}
