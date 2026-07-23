import { AGENTS } from '@/data';
import { Workflow, Plus, ChevronRight, GitBranch } from 'lucide-react';

interface PipelineNode {
  id: string;
  label: string;
  agent: string;
  color: string;
  x: number;
  y: number;
}

const NODES: PipelineNode[] = [
  { id: 'n1', label: 'Input Router', agent: 'Hermes', color: '#7c3aed', x: 80, y: 120 },
  { id: 'n2', label: 'Intent Parser', agent: 'Claude', color: '#ff9500', x: 280, y: 60 },
  { id: 'n3', label: 'Code Analysis', agent: 'Codex', color: '#ff5f57', x: 280, y: 180 },
  { id: 'n4', label: 'Tool Orchestrator', agent: 'Antigravity', color: '#00ff9d', x: 480, y: 120 },
  { id: 'n5', label: 'Output Synthesizer', agent: 'OpenClaw', color: '#00d4ff', x: 680, y: 120 },
];

const EDGES: [string, string][] = [
  ['n1', 'n2'],
  ['n1', 'n3'],
  ['n2', 'n4'],
  ['n3', 'n4'],
  ['n4', 'n5'],
];

export default function Pipeline() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
        <h1 className="text-white font-semibold text-sm">Pipeline</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">AGENT ORCHESTRATION</span>
        <button className="ml-auto px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium flex items-center gap-1.5 transition-colors">
          <Plus size={14} /> Add Node
        </button>
      </header>

      <div className="flex-1 overflow-auto p-5">
        <div className="relative" style={{ width: 800, height: 280 }}>
          {/* SVG edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {EDGES.map(([from, to], i) => {
              const f = NODES.find((n) => n.id === from)!;
              const t = NODES.find((n) => n.id === to)!;
              const x1 = f.x + 100;
              const y1 = f.y + 30;
              const x2 = t.x;
              const y2 = t.y + 30;
              const mx = (x1 + x2) / 2;
              return (
                <g key={i}>
                  <path
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                    strokeDasharray="4 4"
                  />
                  <circle cx={x2} cy={y2} r="3" fill="#00d4ff" fillOpacity="0.6" />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map((node, i) => (
            <div
              key={node.id}
              className="absolute glass-bright rounded-xl p-3 w-[100px] animate-fade-up"
              style={{
                left: node.x,
                top: node.y,
                animationDelay: `${i * 0.1}s`,
                borderColor: node.color + '40',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: node.color + '20' }}
                >
                  <Workflow size={11} style={{ color: node.color }} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]" style={{ boxShadow: '0 0 4px #00ff9d' }} />
              </div>
              <div className="text-[11px] text-white font-medium leading-tight">{node.label}</div>
              <div className="text-[9px] font-mono text-[#4a5068] mt-1">{node.agent}</div>
            </div>
          ))}
        </div>

        {/* Pipeline steps list */}
        <div className="mt-8 max-w-2xl">
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <GitBranch size={14} className="text-[#00d4ff]" /> Pipeline Stages
          </h2>
          <div className="space-y-1">
            {NODES.map((node, i) => (
              <div
                key={node.id}
                className="flex items-center gap-3 px-4 py-2.5 glass rounded-lg hover:border-[#00d4ff]/20 transition-all cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-xs font-mono text-[#4a5068] w-6">{String(i + 1).padStart(2, '0')}</span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: node.color, boxShadow: `0 0 6px ${node.color}80` }}
                />
                <span className="text-sm text-white font-medium">{node.label}</span>
                <span className="text-xs text-[#7a8099]">{node.agent}</span>
                <ChevronRight size={14} className="ml-auto text-[#4a5068]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
