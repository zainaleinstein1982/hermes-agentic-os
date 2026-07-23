import { KANBAN_TASKS } from '@/data';
import { KanbanTask } from '@/types';
import { Plus, MoreHorizontal } from 'lucide-react';

const COLUMNS: { id: KanbanTask['status']; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: '#4a5068' },
  { id: 'in-progress', label: 'In Progress', color: '#ff9500' },
  { id: 'review', label: 'Review', color: '#00d4ff' },
  { id: 'done', label: 'Done', color: '#00ff9d' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: '#4a5068',
  medium: '#ff9500',
  high: '#ff5f57',
};

export default function Kanban() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
        <h1 className="text-white font-semibold text-sm">Kanban</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">TASK BOARD</span>
        <button className="ml-auto px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium flex items-center gap-1.5 transition-colors">
          <Plus size={14} /> New Task
        </button>
      </header>

      <div className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const tasks = KANBAN_TASKS.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="w-72 shrink-0 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm text-white font-medium">{col.label}</span>
                  <span className="text-xs font-mono text-[#4a5068]">{tasks.length}</span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {tasks.map((task, i) => (
                    <div
                      key={task.id}
                      className="kanban-card rounded-xl p-3.5 cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                          style={{ background: PRIORITY_COLORS[task.priority] + '20', color: PRIORITY_COLORS[task.priority] }}
                        >
                          {task.priority}
                        </span>
                        <button className="text-[#4a5068] hover:text-white transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      <h3 className="text-sm text-white font-medium mb-1">{task.title}</h3>
                      <p className="text-[11px] text-[#7a8099] leading-relaxed mb-3">{task.description}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#00d4ff]/15 flex items-center justify-center text-[9px] font-mono text-[#00d4ff]">
                          {task.agent[0]}
                        </div>
                        <span className="text-[10px] text-[#7a8099]">{task.agent}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 rounded-xl border border-dashed border-white/[0.06] text-[#4a5068] hover:text-[#7a8099] hover:border-white/[0.12] transition-all flex items-center justify-center gap-1.5 text-xs">
                    <Plus size={14} /> Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
