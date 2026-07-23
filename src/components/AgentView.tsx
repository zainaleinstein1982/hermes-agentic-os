import { useState, useRef, useEffect } from 'react';
import { Agent, AgentTab, Message } from '@/types';
import { AGENTS, INITIAL_MESSAGES } from '@/data';
import HermesOrb from './HermesOrb';
import {
  MessageSquare,
  Mic,
  Sparkles,
  Eye,
  Monitor,
  History,
  FolderOpen,
  Send,
  Mic2,
  Play,
  Pause,
  Volume2,
  Phone,
  PhoneOff,
  Zap,
  Cpu,
  Activity,
  ChevronRight,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

interface Props {
  agentId: string;
}

const TABS: { id: AgentTab; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'talk', label: 'Talk', icon: Mic },
  { id: 'hermes-jarvis', label: 'Hermes-Jarvis', icon: Sparkles },
  { id: 'oracle', label: 'Oracle', icon: Eye },
  { id: 'studio', label: 'Studio', icon: Monitor },
  { id: 'sessions', label: 'Sessions', icon: History },
  { id: 'workspace', label: 'Workspace', icon: FolderOpen },
];

export default function AgentView({ agentId }: Props) {
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  const [tab, setTab] = useState<AgentTab>('chat');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES[agentId] || []);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(INITIAL_MESSAGES[agentId] || []);
  }, [agentId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toTimeString().slice(0, 8);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: now,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsThinking(true);
    setTimeout(() => {
      const responses = [
        'Acknowledged. Processing your request through the neural pipeline. I\'ll have results shortly.',
        'Analyzing... Cross-referencing with active sessions and agent states. Standby for output.',
        'Request received. I\'m routing this through the appropriate tool chain now.',
        'Understood. Let me break this down into actionable steps and coordinate with the agent fleet.',
        'On it. I\'ll synthesize the relevant context and return a structured response.',
      ];
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toTimeString().slice(0, 8),
        agentName: agent.name,
      };
      setMessages((m) => [...m, agentMsg]);
      setIsThinking(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b0f]">
      {/* Header */}
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#4a5068] text-sm">Agent</span>
          <ChevronRight size={14} className="text-[#4a5068]" />
          <span className="text-white text-sm font-medium">{agent.name}</span>
          <span className="text-[10px] font-mono text-[#4a5068] ml-1">{agent.model}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: agent.status === 'online' ? '#00ff9d' : agent.status === 'idle' ? '#ff9500' : '#4a5068',
                boxShadow: agent.status === 'online' ? '0 0 6px #00ff9d' : 'none',
              }}
            />
            <span className="text-[#7a8099] capitalize">{agent.status}</span>
          </div>
          <button className="text-[#7a8099] hover:text-white transition-colors">
            <Search size={16} />
          </button>
          <button className="text-[#7a8099] hover:text-white transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 border-b border-white/[0.06] shrink-0 bg-[#0c0d12]">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
                active
                  ? 'tab-active'
                  : 'text-[#7a8099] border-transparent hover:text-white'
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {tab === 'chat' && (
            <ChatPanel
              messages={messages}
              input={input}
              setInput={setInput}
              send={send}
              isThinking={isThinking}
              scrollRef={scrollRef}
              agent={agent}
            />
          )}
          {tab === 'talk' && <TalkPanel agent={agent} isListening={isListening} setIsListening={setIsListening} />}
          {tab === 'hermes-jarvis' && <HermesJarvisPanel agent={agent} />}
          {tab === 'oracle' && <OraclePanel agent={agent} />}
          {tab === 'studio' && <StudioPanel agent={agent} />}
          {tab === 'sessions' && <SessionsPanel />}
          {tab === 'workspace' && <WorkspacePanel />}
        </div>

        {/* Right rail */}
        <div className="w-72 shrink-0 border-l border-white/[0.06] bg-[#0c0d12] flex flex-col overflow-y-auto">
          <AgentInfoRail agent={agent} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Chat Panel ---------- */
function ChatPanel({
  messages,
  input,
  setInput,
  send,
  isThinking,
  scrollRef,
  agent,
}: {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  send: () => void;
  isThinking: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  agent: Agent;
}) {
  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
          >
            <div className={`max-w-[70%] ${m.role === 'user' ? 'msg-user' : 'msg-agent'} rounded-2xl px-4 py-3`}>
              {m.role === 'agent' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: agent.color + '30', border: `1px solid ${agent.color}50` }}
                  >
                    <Sparkles size={9} style={{ color: agent.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-[#7a8099]">{m.agentName || agent.name}</span>
                </div>
              )}
              <p className="text-sm text-[#c8cde0] leading-relaxed">{m.content}</p>
              <div className="text-[9px] font-mono text-[#4a5068] mt-1.5 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-fade-up">
            <div className="msg-agent rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                    style={{ animation: `orb-pulse 1s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#7a8099] font-mono">thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 focus-within:border-[#00d4ff]/30 transition-colors">
          <button className="text-[#7a8099] hover:text-[#00d4ff] transition-colors">
            <Plus size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#4a5068] outline-none"
          />
          <button className="text-[#7a8099] hover:text-[#00d4ff] transition-colors">
            <Mic2 size={16} />
          </button>
          <button
            onClick={send}
            className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 flex items-center justify-center transition-colors"
          >
            <Send size={14} className="text-[#00d4ff]" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- Talk Panel ---------- */
function TalkPanel({
  agent,
  isListening,
  setIsListening,
}: {
  agent: Agent;
  isListening: boolean;
  setIsListening: (v: boolean) => void;
}) {
  const [callActive, setCallActive] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
      <div className="relative">
        <HermesOrb active={callActive || isListening} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
            style={{
              background: agent.color + '20',
              border: `2px solid ${agent.color}40`,
            }}
          >
            <Sparkles size={24} style={{ color: agent.color }} />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-white text-xl font-semibold">{callActive ? 'Connected' : 'Voice Interface'}</h2>
        <p className="text-[#7a8099] text-sm mt-1">
          {callActive ? `Talking with ${agent.name}` : 'Tap to start a voice session'}
        </p>
      </div>

      {callActive && (
        <div className="flex items-center gap-1 h-8">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-[#00d4ff]/60 rounded-full"
              style={{
                height: `${4 + Math.random() * 20}px`,
                animation: `orb-pulse ${0.5 + Math.random() * 0.5}s ease-in-out ${i * 0.05}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsListening(!isListening)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isListening ? 'bg-[#00d4ff]/20 text-[#00d4ff] animate-glow-pulse' : 'glass text-[#7a8099] hover:text-white'
          }`}
        >
          <Mic2 size={20} />
        </button>
        {!callActive ? (
          <button
            onClick={() => setCallActive(true)}
            className="w-16 h-16 rounded-full bg-[#00ff9d]/15 hover:bg-[#00ff9d]/25 flex items-center justify-center transition-all animate-glow-pulse"
          >
            <Phone size={24} className="text-[#00ff9d]" />
          </button>
        ) : (
          <button
            onClick={() => setCallActive(false)}
            className="w-16 h-16 rounded-full bg-[#ff5f57]/15 hover:bg-[#ff5f57]/25 flex items-center justify-center transition-all"
          >
            <PhoneOff size={24} className="text-[#ff5f57]" />
          </button>
        )}
        <button className="w-12 h-12 rounded-full glass text-[#7a8099] hover:text-white flex items-center justify-center transition-all">
          <Volume2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-6 text-xs text-[#4a5068] font-mono">
        <span className="flex items-center gap-1.5">
          <Cpu size={12} /> 2.4 GHz
        </span>
        <span className="flex items-center gap-1.5">
          <Activity size={12} /> 48ms latency
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={12} /> 99.2% uptime
        </span>
      </div>
    </div>
  );
}

/* ---------- Hermes-Jarvis Panel ---------- */
function HermesJarvisPanel({ agent }: { agent: Agent }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
      <div className="relative animate-float">
        <HermesOrb active={true} />
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-white text-2xl font-semibold tracking-tight">Hermes-Jarvis</h2>
        <p className="text-[#7a8099] text-sm mt-2 leading-relaxed">
          Your always-on AI companion. Neural link established. Voice, vision, and tool-use capabilities
          fully operational.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { label: 'Neural Link', value: 'Active', color: '#00ff9d' },
          { label: 'Context Window', value: '128K', color: '#00d4ff' },
          { label: 'Tools Available', value: '247', color: '#ff9500' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-[10px] text-[#7a8099] mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button className="px-5 py-2.5 rounded-lg bg-[#00d4ff]/15 hover:bg-[#00d4ff]/25 text-[#00d4ff] text-sm font-medium transition-all flex items-center gap-2">
          <Mic size={16} /> Activate Voice
        </button>
        <button className="px-5 py-2.5 rounded-lg glass hover:bg-white/[0.06] text-white text-sm font-medium transition-all flex items-center gap-2">
          <MessageSquare size={16} /> Open Chat
        </button>
      </div>
    </div>
  );
}

/* ---------- Oracle Panel ---------- */
function OraclePanel({ agent }: { agent: Agent }) {
  const predictions = [
    { event: 'Codex completes memory refactor', confidence: 87, eta: '~14 min' },
    { event: 'Pipeline bottleneck detected', confidence: 64, eta: '~3 min' },
    { event: 'Antigravity will go idle', confidence: 92, eta: '~22 min' },
    { event: 'New session likely from Claude', confidence: 41, eta: '~8 min' },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center">
            <Eye size={20} className="text-[#00d4ff]" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Oracle</h2>
            <p className="text-xs text-[#7a8099]">Predictive analytics from {agent.name}</p>
          </div>
        </div>
        {predictions.map((p, i) => (
          <div key={i} className="glass rounded-xl p-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-white font-medium">{p.event}</p>
              <span className="text-xs font-mono text-[#4a5068] shrink-0 ml-3">{p.eta}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${p.confidence}%`,
                    background: p.confidence > 80 ? '#00ff9d' : p.confidence > 50 ? '#ff9500' : '#ff5f57',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-[#7a8099] w-10 text-right">{p.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Studio Panel ---------- */
function StudioPanel({ agent }: { agent: Agent }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#ff9500]/10 flex items-center justify-center">
          <Monitor size={20} className="text-[#ff9500]" />
        </div>
        <div>
          <h2 className="text-white font-semibold">Studio</h2>
          <p className="text-xs text-[#7a8099]">Agent configuration & tuning — {agent.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {[
          { label: 'Temperature', value: '0.7', icon: Activity },
          { label: 'Max Tokens', value: '4096', icon: Cpu },
          { label: 'Top-P', value: '0.9', icon: Zap },
          { label: 'Frequency Penalty', value: '0.1', icon: Activity },
        ].map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#7a8099]" />
                <span className="text-xs text-[#7a8099] uppercase tracking-wider">{p.label}</span>
              </div>
              <div className="text-xl font-mono text-white">{p.value}</div>
              <div className="mt-3 h-1 rounded-full bg-white/[0.06]">
                <div className="h-full w-1/2 rounded-full bg-[#00d4ff]/50" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="glass rounded-xl p-4 mt-4 max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#7a8099] uppercase tracking-wider">System Prompt</span>
          <button
            onClick={() => setPlaying(!playing)}
            className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 flex items-center justify-center transition-colors"
          >
            {playing ? <Pause size={14} className="text-[#00d4ff]" /> : <Play size={14} className="text-[#00d4ff]" />}
          </button>
        </div>
        <pre className="text-xs font-mono text-[#c8cde0] leading-relaxed whitespace-pre-wrap">
{`You are ${agent.name}, an autonomous agent in the Hermes Agentic OS.
Your role: ${agent.description}
You have access to tools, memory, and multi-agent coordination.
Always act with precision and surface your reasoning.`}
        </pre>
      </div>
    </div>
  );
}

/* ---------- Sessions Panel ---------- */
function SessionsPanel() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-white font-semibold mb-4">Session History</h2>
        <div className="space-y-2">
          {[
            { name: 'Briefing — Pipeline Status', agent: 'Hermes', msgs: 14, time: '19:18' },
            { name: 'Code Review: memory.ts', agent: 'Codex', msgs: 31, time: '18:45' },
            { name: 'Architecture Planning', agent: 'Claude', msgs: 22, time: '17:30' },
            { name: 'Data Pipeline Debug', agent: 'Antigravity', msgs: 9, time: '16:12' },
          ].map((s, i) => (
            <div
              key={i}
              className="glass rounded-xl p-4 hover:border-[#00d4ff]/20 transition-all cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{s.name}</p>
                  <p className="text-xs text-[#7a8099] mt-0.5">{s.agent} · {s.msgs} messages</p>
                </div>
                <span className="text-xs font-mono text-[#4a5068]">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Workspace Panel ---------- */
function WorkspacePanel() {
  const files = [
    { name: 'memory.ts', size: '12.4 KB', modified: '2m ago' },
    { name: 'orchestrator.ts', size: '8.1 KB', modified: '14m ago' },
    { name: 'tools.json', size: '3.2 KB', modified: '1h ago' },
    { name: 'sessions/', size: '—', modified: '—' },
    { name: 'kanban.json', size: '1.8 KB', modified: '3h ago' },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-white font-semibold mb-4">Workspace</h2>
        <div className="glass rounded-xl overflow-hidden">
          {files.map((f, i) => (
            <div
              key={f.name}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer ${
                i !== files.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              <FolderOpen size={16} className="text-[#7a8099]" />
              <span className="text-sm text-white font-mono">{f.name}</span>
              <span className="ml-auto text-xs font-mono text-[#4a5068]">{f.size}</span>
              <span className="text-xs font-mono text-[#4a5068] w-16 text-right">{f.modified}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Right Rail ---------- */
function AgentInfoRail({ agent }: { agent: Agent }) {
  return (
    <div className="p-5 space-y-5">
      {/* Agent avatar */}
      <div className="flex flex-col items-center text-center pt-2">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 animate-float"
          style={{ background: agent.color + '15', border: `1px solid ${agent.color}40` }}
        >
          <Sparkles size={28} style={{ color: agent.color }} />
        </div>
        <h3 className="text-white font-semibold">{agent.name}</h3>
        <p className="text-[10px] font-mono text-[#4a5068] mt-0.5">{agent.model}</p>
      </div>

      {/* Stats */}
      <div>
        <div className="section-label mb-3">Stats</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Likes', value: agent.stats.likes, icon: '♥' },
            { label: 'Comments', value: agent.stats.comments, icon: '💬' },
            { label: 'Shares', value: agent.stats.shares, icon: '↗' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-lg p-2.5 text-center">
              <div className="text-sm font-bold text-white">{s.value.toLocaleString()}</div>
              <div className="text-[9px] text-[#7a8099] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="section-label mb-2">About</div>
        <p className="text-xs text-[#7a8099] leading-relaxed">{agent.description}</p>
      </div>

      {/* Capabilities */}
      <div>
        <div className="section-label mb-2">Capabilities</div>
        <div className="flex flex-wrap gap-1.5">
          {['Tool Use', 'Vision', 'Code', 'Memory', 'Voice', 'Reasoning'].map((c) => (
            <span
              key={c}
              className="px-2 py-1 rounded-md text-[10px] font-medium glass text-[#7a8099]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div>
        <div className="section-label mb-2">Recent Activity</div>
        <div className="space-y-2">
          {[
            { action: 'Completed task', target: 'Kanban → pipeline sync', time: '2m' },
            { action: 'Sent message', target: 'Briefing session', time: '8m' },
            { action: 'Joined session', target: 'Architecture Planning', time: '1h' },
          ].map((a, i) => (
            <div key={i} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#c8cde0]">{a.action}</span>
                <span className="font-mono text-[#4a5068]">{a.time}</span>
              </div>
              <div className="text-[#7a8099] text-[11px]">{a.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
