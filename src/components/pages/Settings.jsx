import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

export default function Settings() {
  const { user, setName } = useUser();
  const [nameInput, setNameInput] = useState(user.name);

  useEffect(() => {
    setNameInput(user.name);
  }, [user.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(nameInput.trim() || 'Your Name');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Configure your discipline tracker.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6 max-w-md">
        <h2 className="text-lg font-medium text-text-primary mb-4">Your Name</h2>
        <p className="text-text-secondary text-sm mb-4">
          This name appears in the sidebar and top bar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-text-primary mb-1">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name"
              className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Save
          </button>
        </form>
      </div>

      {/* Help Section */}
      <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          Help & App Documentation
        </h2>
        
        <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">1. Dashboard Overview</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              The Dashboard is your command center. It shows your <span className="font-bold text-text-primary">Best Streak</span>, 
              <span className="font-bold text-text-primary">Active Days</span> this month, and daily completion stats.
              Use the <span className="font-bold text-text-primary">Date Navigator</span> at the top to view past or future schedules.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">2. Habits & Time Blocks</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              <span className="font-bold text-text-primary">Habits:</span> Recurring daily tasks. Checking them off builds your streak.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-bold text-text-primary">Time Blocks:</span> Scheduled periods for specific deep work. 
              The <span className="font-bold text-text-primary">Time Distribution Chart</span> shows how your day is split across categories like Deep Work, Fitness, or Learning.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">3. Analytics & Graphs</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              <span className="font-bold text-text-primary">Completion Rate:</span> This graph measures the combined percentage of habits and time blocks completed each day.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-bold text-text-primary">Year Heatmap:</span> A visual representation of your consistency over the entire year. Darker colors indicate days where you completed more tasks.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">4. Notes & Reminders</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              <span className="font-bold text-text-primary">Quick Notes:</span> Fast entries for immediate reminders. You can set specific times for alerts.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-bold text-text-primary">Notes Library:</span> A full note-taking system. You can <span className="font-bold text-text-primary">Pin</span> important notes to see them on your Dashboard.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">5. Missed Logs</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              If you miss a task, it appears here. You can add a <span className="font-bold text-text-primary">Reason</span> for accountability. 
              Reviewing these helps you identify patterns in why you're breaking discipline.
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold text-primary uppercase tracking-wider mb-2">6. Skills & Goals</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Track long-term growth by leveling up specific skills and setting measurable goals. 
              Goals keep you focused on the "Why" behind your daily habits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
