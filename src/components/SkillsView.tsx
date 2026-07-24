import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Skill } from '@/types';
import { Zap, Plus, Search } from 'lucide-react';

export default function SkillsView() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('name');
    setSkills(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (skill: Skill) => {
    const newEnabled = !skill.enabled;
    await supabase.from('skills').update({ enabled: newEnabled }).eq('id', skill.id);
    setSkills((list) => list.map((s) => (s.id === skill.id ? { ...s, enabled: newEnabled } : s)));
  };

  const categories = ['all', ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered = skills.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#ff8a5c]/10 flex items-center justify-center">
          <Zap size={16} className="text-[#ff8a5c]" />
        </div>
        <h1 className="text-white font-medium text-sm">Skills</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">{skills.filter((s) => s.enabled).length} ENABLED</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
            <Search size={13} className="text-[#4a5068]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="bg-transparent text-xs text-white placeholder:text-[#4a5068] outline-none w-32"
            />
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 text-[#7c8aff] text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Plus size={14} /> Browse all
          </button>
        </div>
      </header>

      {/* Category filter */}
      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
              filter === cat
                ? 'bg-[#7c8aff]/15 text-[#7c8aff]'
                : 'text-[#7e85a0] hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-w-4xl">
            {filtered.map((skill, i) => (
              <div
                key={skill.id}
                className="glass rounded-xl p-4 animate-fade-up hover:border-[#7c8aff]/20 transition-all"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-xl">
                    {skill.icon}
                  </div>
                  <div
                    className={`toggle ${skill.enabled ? 'on' : ''}`}
                    onClick={() => toggle(skill)}
                  />
                </div>
                <h3 className="text-sm text-white font-medium mb-1">{skill.name}</h3>
                <p className="text-[11px] text-[#7e85a0] leading-relaxed mb-3">{skill.description}</p>
                <span className="text-[9px] font-mono text-[#4a5068] uppercase tracking-wider">{skill.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
