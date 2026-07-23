import { AGENTS, KANBAN_TASKS, SESSIONS } from '@/data';
import { View } from '@/types';
import {
  Activity,
  Cpu,
  Zap,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface Props {
  onView: (v: View) => void;
}

export default function MissionControl({ onView }: Props) {
  const online = AGENTS.filter((a) => a.status === 'online').length;
  const idle = AGENTS.filter((a) => a.status === 'idle').length;
  const offline = AGENTS.filter((a) => a.status === 'offline').length;
  const inProgress = KANBAN_TASKS.filter((t) => t.status === 'in-progress').length;
  const done = KANBAN_TASKS.filter((t) => t.status === 'done').length;
  const review = KANBAN_TASKS.filter((t) => t.status === 'review').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]">
      {/* Header */}
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
        <h1 className="text-white font-semibold text-sm">Mission Control</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">SYSTEM OVERVIEW</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-[#7a8099]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]" style={{ boxShadow: '0 0 6px #00ff9d' }} />
          <span>All systems operational</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Agents', value: online, sub: `${idle} idle · ${offline} offline`, icon: Users, color: '#00d4ff', trend: '+2' },
            { label: 'Tasks In Progress', value: inProgress, sub: `${review} in review`, icon: Activity, color: '#ff9500', trend: '+1' },
            { label: 'Completed Today', value: done, sub: 'across all agents', icon: CheckCircle2, color: '#00ff9d', trend: '+5' },
            { label: 'Avg Response', value: '48ms', sub: 'p99 latency', icon: Zap, color: '#ff5f57', trend: '-12ms' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-xl p-4 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
                  style={{ background: s.color }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: s.color + '15' }}
                  >
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  <span
                    className={`text-[10px] font-mono flex items-center gap-0.5 ${
                      s.trend.startsWith('-') ? 'text-[#00ff9d]' : 'text-[#00d4ff]'
                    }`}
                  >
                    {s.trend.startsWith('-') ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                    {s.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
                <div className="text-[10px] text-[#7a8099] uppercase tracking-wider mt-1">{s.label}</div>
                <div className="text-[10px] text-[#4a5068] mt-0.5">{s.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Two-column */}
        <div className="grid grid-cols-3 gap-4">
          {/* Agent fleet status */}
          <div className="col-span-2 glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm">Agent Fleet</h2>
              <button
                onClick={() => onView('agent')}
                className="text-xs text-[#7a8099] hover:text-[#00d4ff] flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
                  onClick={() => onView('agent')}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: agent.color + '15', border: `1px solid ${agent.color}30` }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: agent.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{agent.name}</span>
                      <span className="text-[10px] font-mono text-[#4a5068]">{agent.model}</span>
                    </div>
                    <div className="text-[11px] text-[#7a8099] truncate">{agent.description}</div>
                  </div>
                  {/* Mini activity bars */}
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full"
                        style={{
                          height: `${4 + Math.random() * 16}px`,
                          background:
                            agent.status === 'online' ? '#00d4ff60' : agent.status === 'idle' ? '#ff950040' : '#4a506830',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background:
                        agent.status === 'online' ? '#00ff9d' : agent.status === 'idle' ? '#ff9500' : '#4a5068',
                      boxShadow: agent.status === 'online' ? '0 0 6px #00ff9d' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Pipeline health */}
            <div className="glass rounded-xl p-5">
              <h2 className="text-white font-semibold text-sm mb-4">Pipeline Health</h2>
              <div className="space-y-3">
                {[
                  { label: 'Throughput', value: 87, color: '#00d4ff' },
                  { label: 'Error Rate', value: 12, color: '#ff9500' },
                  { label: 'Queue Depth', value: 34, color: '#00ff9d' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#7a8099]">{m.label}</span>
                      <span className="text-xs font-mono text-white">{m.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${m.value}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sessions */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">Recent Sessions</h2>
                <button
                  onClick={() => onView('sessions')}
                  className="text-xs text-[#7a8099] hover:text-[#00d4ff] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {SESSIONS.slice(0, 3).map((s) => (
                  <div key={s.id} className="text-xs">
                    <div className="text-white font-medium truncate">{s.name}</div>
                    <div className="text-[#7a8099] text-[11px]">
                      {s.agent} · {s.messages} msgs · {s.lastActive}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Task distribution */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Task Distribution</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Backlog', count: KANBAN_TASKS.filter((t) => t.status === 'backlog').length, color: '#4a5068', icon: Clock },
                { label: 'In Progress', count: inProgress, color: '#ff9500', icon: Activity },
                { label: 'Review', count: review, color: '#00d4ff', icon: AlertCircle },
                { label: 'Done', count: done, color: '#00ff9d', icon: CheckCircle2 },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="text-center">
                    <div
                      className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2"
                      style={{ background: c.color + '15' }}
                    >
                      <Icon size={16} style={{ color: c.color }} />
                    </div>
                    <div className="text-lg font-bold text-white font-mono">{c.count}</div>
                    <div className="text-[10px] text-[#7a8099]">{c.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance chart */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm">Performance</h2>
              <TrendingUp size={14} className="text-[#00ff9d]" />
            </div>
            <div className="flex items-end gap-1 h-24">
              {[42, 58, 35, 71, 64, 89, 76, 92, 68, 84, 73, 95, 81, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all hover:opacity-100"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, #00d4ff40, #00d4ff80)`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#4a5068]">
              <span>14h ago</span>
              <span>now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
