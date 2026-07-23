import { SESSIONS } from '@/data';
import { Search, Plus, MessageSquare, ChevronRight } from 'lucide-react';

export default function Sessions() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
        <h1 className="text-white font-semibold text-sm">Sessions</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">CONVERSATION HISTORY</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
            <Search size={14} className="text-[#4a5068]" />
            <input
              placeholder="Search sessions..."
              className="bg-transparent text-xs text-white placeholder:text-[#4a5068] outline-none w-40"
            />
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Plus size={14} /> New Session
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-3xl mx-auto space-y-2">
          {SESSIONS.map((s, i) => (
            <div
              key={s.id}
              className="glass rounded-xl p-4 hover:border-[#00d4ff]/20 transition-all cursor-pointer animate-fade-up group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-[#00d4ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm text-white font-medium truncate">{s.name}</h3>
                  </div>
                  <p className="text-xs text-[#7a8099] truncate">{s.preview}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#4a5068]">
                    <span>{s.agent}</span>
                    <span>·</span>
                    <span>{s.messages} messages</span>
                    <span>·</span>
                    <span>Last active {s.lastActive}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#4a5068] group-hover:text-[#00d4ff] transition-colors shrink-0 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
