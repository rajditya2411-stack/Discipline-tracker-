import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-goals';

const GoalsContext = createContext(null);

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (_) {}
  }, [goals]);

  const addGoal = useCallback((goalData) => {
    const id = String(Date.now());
    setGoals((prev) => [...prev, { id, ...goalData, status: 'Active' }]);
    return id;
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used within GoalsProvider');
  return ctx;
}
