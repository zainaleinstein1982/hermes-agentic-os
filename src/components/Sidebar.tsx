import { View, Agent } from '@/types';
import {
  LayoutDashboard,
  Bot,
  Workflow,
  Trello,
  History,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { AGENTS } from '@/data';

interface Props {
  view: View;
  onView: (v: View) => void;
  selectedAgentId: string;
  onAgentSelect: (id: string) => void;
}

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard },
  { id: 'agent', label: 'Agent', icon: Bot },
  { id: 'pipeline', label: 'Pipeline', icon: Workflow },
  { id: 'kanban', label: 'Kanban', icon: Trello },
  { id: 'sessions', label: 'Sessions', icon: History },
];

export default function Sidebar({ view, onView, selectedAgentId, onAgentSelect }: Props) {
  return (
    <aside className="w-60 shrink-0 h-full flex flex-col border-r border-white/[0.06] bg-[#0c0d12]">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/[0.06]">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/40 animate-ring-1" />
          <div className="absolute inset-1 rounded-full border border-[#00d4ff]/30 animate-ring-2" />
          <div className="w-3 h-3 rounded-full bg-[#00d4ff] animate-orb-pulse" style={{ boxShadow: '0 0 12px #00d4ff' }} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-semibold text-sm tracking-tight">HERMES</span>
          <span className="text-[9px] text-[#4a5068] font-mono tracking-widest">AGENTIC OS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                active ? 'nav-active' : 'text-[#7a8099] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Agents list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="px-3 py-2 section-label flex items-center justify-between">
          <span>Agents</span>
          <ChevronRight size={12} className="text-[#4a5068]" />
        </div>
        <div className="flex flex-col gap-0.5">
          {AGENTS.map((agent: Agent) => {
            const active = selectedAgentId === agent.id && view === 'agent';
            return (
              <button
                key={agent.id}
                onClick={() => {
                  onAgentSelect(agent.id);
                  onView('agent');
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                  active ? 'nav-active' : 'text-[#7a8099] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0 status-${agent.status}"
                  style={{
                    background:
                      agent.status === 'online' ? '#00ff9d' : agent.status === 'idle' ? '#ff9500' : '#4a5068',
                    boxShadow:
                      agent.status === 'online'
                        ? '0 0 6px #00ff9d'
                        : agent.status === 'idle'
                        ? '0 0 6px #ff9500'
                        : 'none',
                  }}
                />
                <span className="font-medium truncate">{agent.name}</span>
                <span className="ml-auto text-[9px] font-mono text-[#4a5068]">
                  {agent.model.split('-')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 flex items-center gap-2 px-4 border-t border-white/[0.06] text-[#4a5068]">
        <Settings size={14} />
        <span className="text-xs">Settings</span>
        <span className="ml-auto text-[10px] font-mono">v0.3.1</span>
      </div>
    </aside>
  );
}
