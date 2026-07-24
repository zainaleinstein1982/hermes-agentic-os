import { useState } from 'react';
import AshOrb from './AshOrb';
import {
  Sparkles,
  MessageCircle,
  Brain,
  Zap,
  Shield,
  Volume2,
  Clock,
  Target,
  Save,
} from 'lucide-react';

export default function PersonalityView() {
  const [traits, setTraits] = useState({
    warmth: 65,
    formality: 40,
    humor: 30,
    proactivity: 75,
    verbosity: 35,
    directness: 80,
  });

  const [name, setName] = useState('Asih Winarti');
  const [pronouns, setPronouns] = useState('they/them');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are Asih Winarti, a personal intelligence assistant. You learn the user\'s preferences over time and proactively handle tasks they shouldn\'t be doing themselves. You communicate concisely and directly, without jargon. You remember everything that matters.'
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#b08aff]/10 flex items-center justify-center">
          <Sparkles size={16} className="text-[#b08aff]" />
        </div>
        <h1 className="text-white font-medium text-sm">Personality</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">ASSISTANT CONFIGURATION</span>
        <button className="ml-auto px-3 py-1.5 rounded-lg bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 text-[#7c8aff] text-xs font-medium flex items-center gap-1.5 transition-colors">
          <Save size={13} /> Save
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Identity */}
          <div className="grid grid-cols-3 gap-5">
            <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
              <AshOrb active={false} size={120} />
              <div className="text-center mt-2">
                <div className="text-lg text-white font-semibold">{name}</div>
                <div className="text-[10px] text-[#7e85a0]">{pronouns}</div>
              </div>
            </div>
            <div className="col-span-2 glass rounded-2xl p-5 space-y-4">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <Target size={14} className="text-[#7c8aff]" /> Identity
              </h2>
              <div>
                <label className="section-label block mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7c8aff]/30"
                />
              </div>
              <div>
                <label className="section-label block mb-1.5">Pronouns</label>
                <input
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7c8aff]/30"
                />
              </div>
            </div>
          </div>

          {/* Trait sliders */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Brain size={14} className="text-[#7c8aff]" /> Personality Traits
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(traits).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7e85a0] capitalize">{key}</span>
                    <span className="text-xs font-mono text-white">{val}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => setTraits({ ...traits, [key]: parseInt(e.target.value) })}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/[0.06]"
                    style={{
                      background: `linear-gradient(to right, #7c8aff ${val}%, rgba(255,255,255,0.06) ${val}%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* System prompt */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <MessageCircle size={14} className="text-[#7c8aff]" /> System Prompt
            </h2>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full glass rounded-lg px-3 py-2.5 text-sm text-[#d4d8e8] font-mono outline-none resize-none focus:border-[#7c8aff]/30 leading-relaxed"
            />
            <div className="text-[10px] text-[#4a5068] mt-2">{systemPrompt.length} characters</div>
          </div>

          {/* Behavior settings */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Zap size={14} className="text-[#7c8aff]" /> Behavior
            </h2>
            <div className="space-y-3">
              {[
                { icon: Clock, label: 'Proactive mode', desc: 'Work in the background without being asked', on: true },
                { icon: Volume2, label: 'Voice responses', desc: 'Enable spoken responses', on: false },
                { icon: Brain, label: 'Auto-learn memories', desc: 'Automatically save learned preferences', on: true },
                { icon: Shield, label: 'Sandbox mode', desc: 'Run actions in a safe sandbox first', on: true },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3 py-2">
                    <Icon size={16} className="text-[#7e85a0]" />
                    <div className="flex-1">
                      <div className="text-sm text-white">{s.label}</div>
                      <div className="text-[11px] text-[#7e85a0]">{s.desc}</div>
                    </div>
                    <div className={`toggle ${s.on ? 'on' : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
