import { memo } from 'react';
import { View } from '@/types';
import {
  MessageCircle,
  Brain,
  LayoutDashboard,
  Plug,
  Sparkles,
  Zap,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface Props {
  view: View;
  onView: (v: View) => void;
  memoryCount: number;
  connectedCount: number;
}

const NAV: { id: View; label: string; icon: typeof MessageCircle; badge?: (p: Props) => number | undefined }[] = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  {
    id: 'memory',
    label: 'Memory',
    icon: Brain,
    badge: (p) => p.memoryCount,
  },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug,
    badge: (p) => p.connectedCount,
  },
  { id: 'personality', label: 'Personality', icon: Sparkles },
  { id: 'skills', label: 'Skills', icon: Zap },
];

function SidebarInner({ view, onView, memoryCount, connectedCount }: Props) {
  return (
    <aside className="w-60 shrink-0 h-full flex flex-col border-r border-white/[0.05] bg-[#0a0b0f]">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.05]">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#7c8aff]/30 animate-ring-rotate" />
          <div className="absolute inset-1.5 rounded-full border border-[#b08aff]/30" style={{ animation: 'ring-rotate 30s linear infinite reverse' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#7c8aff] to-[#b08aff] animate-orb-breathe" style={{ boxShadow: '0 0 10px rgba(124,138,255,0.6)' }} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-semibold text-sm tracking-tight">Asih Winarti</span>
          <span className="text-[9px] text-[#4a5068] font-mono tracking-widest">PERSONAL INTELLIGENCE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          const badge = item.badge?.({ memoryCount, connectedCount } as Props);
          return (
            <button
              key={item.id}
              onClick={() => onView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive ? 'nav-active' : 'text-[#7e85a0] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="ml-auto text-[10px] font-mono text-[#4a5068] bg-white/[0.05] px-1.5 py-0.5 rounded">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Recent conversations */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="px-3 py-2 section-label flex items-center justify-between">
          <span>Recent</span>
          <ChevronRight size={12} className="text-[#4a5068]" />
        </div>
        <div className="flex flex-col gap-0.5">
          {[
            { title: 'Weekly briefing', time: '2m' },
            { title: 'Email triage', time: '1h' },
            { title: 'Rust learning plan', time: '3h' },
            { title: 'Meeting prep — Q3', time: '5h' },
          ].map((c, i) => (
            <button
              key={i}
              onClick={() => onView('chat')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#7e85a0] hover:text-white hover:bg-white/[0.03] transition-all truncate"
            >
              <span className="truncate">{c.title}</span>
              <span className="ml-auto text-[9px] font-mono text-[#4a5068] shrink-0">{c.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 flex items-center gap-2 px-4 border-t border-white/[0.05] text-[#4a5068]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c8aff]/30 to-[#b08aff]/30 flex items-center justify-center text-[10px] font-bold text-white">
          A
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xs text-white font-medium">Alex</span>
          <span className="text-[9px] text-[#4a5068]">Free plan</span>
        </div>
        <Settings size={14} className="ml-auto hover:text-white transition-colors cursor-pointer" />
      </div>
    </aside>
  );
}

export default memo(SidebarInner);
