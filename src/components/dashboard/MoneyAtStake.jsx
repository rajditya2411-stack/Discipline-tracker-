import { DollarSign, TrendingUp } from 'lucide-react';

export default function MoneyAtStake() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#111827] text-lg font-bold uppercase tracking-tight">Financial Stake</h3>
        <TrendingUp className="w-5 h-5 text-text-secondary" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-border text-text-secondary">
          <DollarSign className="w-6 h-6" />
        </div>
        <p className="text-text-secondary text-sm font-medium italic">No active penalties</p>
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-2 opacity-50">Stay Disciplined</p>
      </div>
    </div>
  );
}
