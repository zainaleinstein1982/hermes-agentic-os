import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Memory } from '@/types';
import { MEMORY_NODES, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data';
import {
  Brain,
  Plus,
  Search,
  Trash2,
  Star,
  Tag,
  Clock,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function MemoryView({ onUpdate }: { onUpdate?: () => void }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newMemory, setNewMemory] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  const loadMemories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('memories')
      .select('*')
      .order('importance', { ascending: false })
      .order('created_at', { ascending: false });
    setMemories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    await supabase.from('memories').insert({
      content: newMemory.trim(),
      category: newCategory,
      importance: 3,
      source: 'manual',
    });
    setNewMemory('');
    setShowAdd(false);
    loadMemories();
    onUpdate?.();
  };

  const deleteMemory = async (id: string) => {
    await supabase.from('memories').delete().eq('id', id);
    setMemories((m) => m.filter((mem) => mem.id !== id));
    onUpdate?.();
  };

  const categories = ['all', ...Array.from(new Set(memories.map((m) => m.category)))];
  const filtered = memories.filter((m) => {
    const matchSearch = m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || m.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c]">
      {/* Header */}
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#7c8aff]/10 flex items-center justify-center">
          <Brain size={16} className="text-[#7c8aff]" />
        </div>
        <h1 className="text-white font-medium text-sm">Memory</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">{memories.length} MEMORIES</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
            <Search size={13} className="text-[#4a5068]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories..."
              className="bg-transparent text-xs text-white placeholder:text-[#4a5068] outline-none w-36"
            />
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-3 py-1.5 rounded-lg bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 text-[#7c8aff] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} /> Add Memory
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Graph canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <div className="section-label mb-2">Knowledge Graph</div>
            <div className="text-[11px] text-[#4a5068] max-w-[200px]">
              Visual map of everything Asih Winarti has learned about you.
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="800" height="700" className="max-w-full max-h-full">
              {/* Edges */}
              {MEMORY_NODES.flatMap((node) =>
                node.connections.map((targetId) => {
                  const target = MEMORY_NODES.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="rgba(124,138,255,0.15)"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                    />
                  );
                })
              )}
              {/* Nodes */}
              {MEMORY_NODES.map((node, i) => {
                const color = CATEGORY_COLORS[node.category] || '#7e85a0';
                const isHub = node.connections.length > 2;
                return (
                  <g key={node.id} className="mem-node" style={{ cursor: 'pointer' }}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHub ? 28 : 20}
                      fill={color + '15'}
                      stroke={color + '50'}
                      strokeWidth="1.5"
                      style={{ animation: `pulse-soft ${3 + i * 0.3}s ease-in-out infinite` }}
                    />
                    <circle cx={node.x} cy={node.y} r={isHub ? 6 : 4} fill={color} />
                    <text
                      x={node.x}
                      y={node.y + (isHub ? 42 : 34)}
                      textAnchor="middle"
                      fill="#7e85a0"
                      fontSize="10"
                      fontFamily="Inter"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-3 space-y-1.5">
            <div className="section-label mb-1">Categories</div>
            {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-[11px]">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[#7e85a0]">{CATEGORY_LABELS[cat] || cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory list */}
        <div className="w-96 shrink-0 border-l border-white/[0.05] bg-[#0a0b0f] flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-1.5 overflow-x-auto">
            <Filter size={12} className="text-[#4a5068] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#7c8aff]/15 text-[#7c8aff]'
                    : 'text-[#7e85a0] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="p-4 border-b border-white/[0.05] animate-fade-up">
              <textarea
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="What should Asih Winarti remember?"
                className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#4a5068] outline-none resize-none focus:border-[#7c8aff]/30"
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="glass rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#161922]">
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addMemory}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-[#7c8aff]/15 hover:bg-[#7c8aff]/25 text-[#7c8aff] text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              [...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl shimmer" />)
            ) : (
              filtered.map((mem, i) => (
                <div
                  key={mem.id}
                  className="group glass rounded-xl p-3.5 animate-fade-up hover:border-[#7c8aff]/20 transition-all"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[9px] font-medium"
                      style={{
                        background: (CATEGORY_COLORS[mem.category] || '#7e85a0') + '15',
                        color: CATEGORY_COLORS[mem.category] || '#7e85a0',
                      }}
                    >
                      {CATEGORY_LABELS[mem.category] || mem.category}
                    </span>
                    <button
                      onClick={() => deleteMemory(mem.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#4a5068] hover:text-[#ff6b8a] transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-sm text-[#d4d8e8] leading-relaxed">{mem.content}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    {/* Importance */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className="w-2 h-2 rounded-sm"
                          style={{
                            background: n <= mem.importance ? '#7c8aff' : 'rgba(255,255,255,0.06)',
                          }}
                        />
                      ))}
                    </div>
                    {/* Tags */}
                    {mem.tags.length > 0 && (
                      <div className="flex items-center gap-1 overflow-hidden">
                        {mem.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] text-[#4a5068] font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="ml-auto text-[9px] font-mono text-[#4a5068] flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(mem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-[#4a5068] text-sm">
                No memories found. Add one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
