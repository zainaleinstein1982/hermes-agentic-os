import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Memory, Integration, Skill } from '@/types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/data';
import AshOrb from './AshOrb';
import {
  Brain,
  Zap,
  Plug,
  Activity,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onView: (v: 'memory' | 'integrations' | 'skills' | 'chat') => void;
}

export default function Dashboard({ onView }: Props) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const load = useCallback(async () => {
    const [mem, integ, skl] = await Promise.all([
      supabase.from('memories').select('*'),
      supabase.from('integrations').select('*'),
      supabase.from('skills').select('*'),
    ]);
    setMemories(mem.data || []);
    setIntegrations(integ.data || []);
    setSkills(skl.data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const connectedCount = integrations.filter((i) => i.connected).length;
  const enabledSkills = skills.filter((s) => s.enabled).length;
  const categoryCount = new Set(memories.map((m) => m.category)).size;

  const activities = [
    { icon: Mail, color: '#ff8a5c', text: 'Triaged 47 emails overnight', time: '2h ago' },
    { icon: Calendar, color: '#5ce8a3', text: 'Prepped you for 2pm meeting', time: '3h ago' },
    { icon: Brain, color: '#7c8aff', text: 'Learned: you prefer concise summaries', time: '5h ago' },
    { icon: Sparkles, color: '#b08aff', text: 'Drafted 8 email replies', time: '6h ago' },
    { icon: CheckCircle2, color: '#5ce8a3', text: 'Completed: memory system v2', time: '1d ago' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
        <h1 className="text-white font-medium text-sm">Dashboard</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">OVERVIEW</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-[#5ce8a3]">
          <div className="w-1.5 h-1.5 rounded-full dot-on" />
          <span>All systems operational</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Hero + Orb */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: '#7c8aff' }} />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#7c8aff]" />
              <span className="text-[10px] font-mono text-[#4a5068] tracking-widest">DAILY BRIEFING</span>
            </div>
            <h2 className="text-xl text-white font-semibold mb-2">Good morning, Alex</h2>
            <p className="text-sm text-[#7e85a0] leading-relaxed max-w-md mb-4">
              Asih Winarti has been working while you slept. 47 emails triaged, 3 flagged for your input.
              Your 2pm meeting is prepped. You're in peak hours — I'd tackle the PR review first.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onView('chat')}
                className="px-4 py-2 rounded-xl bg-[#7c8aff]/15 hover:bg-[#7c8aff]/25 text-[#7c8aff] text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Sparkles size={14} /> Open full briefing
              </button>
              <button className="px-4 py-2 rounded-xl glass hover:bg-white/[0.05] text-white text-sm font-medium transition-colors">
                View emails
              </button>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
            <AshOrb active={true} size={140} />
            <div className="text-center mt-2">
              <div className="text-sm text-white font-medium">Asih Winarti</div>
              <div className="text-[10px] text-[#5ce8a3] flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full dot-on" /> Active & learning
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Memories Stored', value: memories.length, sub: `${categoryCount} categories`, icon: Brain, color: '#7c8aff', trend: '+3', onView: () => onView('memory') },
            { label: 'Integrations', value: `${connectedCount}/${integrations.length}`, sub: 'connected', icon: Plug, color: '#5ce8a3', trend: '+1', onView: () => onView('integrations') },
            { label: 'Skills Active', value: `${enabledSkills}/${skills.length}`, sub: 'enabled', icon: Zap, color: '#ff8a5c', trend: '+2', onView: () => onView('skills') },
            { label: 'Tasks Automated', value: '127', sub: 'this week', icon: Activity, color: '#b08aff', trend: '+18%', onView: () => {} },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={s.onView}
                className="glass rounded-xl p-4 text-left relative overflow-hidden hover:border-[#7c8aff]/20 transition-all group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10" style={{ background: s.color }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '15' }}>
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-[#5ce8a3] flex items-center gap-0.5">
                    <ArrowUpRight size={10} /> {s.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
                <div className="text-[10px] text-[#7e85a0] uppercase tracking-wider mt-1">{s.label}</div>
                <div className="text-[10px] text-[#4a5068]">{s.sub}</div>
                <ChevronRight size={14} className="absolute bottom-3 right-3 text-[#4a5068] group-hover:text-[#7c8aff] transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Two column */}
        <div className="grid grid-cols-3 gap-5">
          {/* Activity feed */}
          <div className="col-span-2 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
              <Clock size={14} className="text-[#4a5068]" />
            </div>
            <div className="space-y-1">
              {activities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: a.color + '15' }}>
                      <Icon size={14} style={{ color: a.color }} />
                    </div>
                    <span className="text-sm text-[#d4d8e8] flex-1">{a.text}</span>
                    <span className="text-[10px] font-mono text-[#4a5068]">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory breakdown */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Memory Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const count = memories.filter((m) => m.category === cat).length;
                const pct = memories.length > 0 ? (count / memories.length) * 100 : 0;
                const color = CATEGORY_COLORS[cat] || '#7e85a0';
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-xs text-[#7e85a0]">{label}</span>
                      </div>
                      <span className="text-xs font-mono text-white">{count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Automation Performance</h2>
            <TrendingUp size={14} className="text-[#5ce8a3]" />
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {[45, 62, 38, 75, 68, 91, 78, 95, 72, 88, 81, 96, 84, 92, 79, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all hover:opacity-100"
                style={{
                  height: `${h}%`,
                  background: 'linear-gradient(to top, rgba(124,138,255,0.2), rgba(124,138,255,0.6))',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#4a5068]">
            <span>16 days ago</span>
            <span className="text-[#5ce8a3]">+18% vs last period</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
