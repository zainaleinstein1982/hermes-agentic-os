import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation, ChatMessage } from '@/types';
import { SUGGESTED_PROMPTS } from '@/data';
import AshOrb from './AshOrb';
import {
  Send,
  Sparkles,
  Plus,
  Mic,
  Paperclip,
  Brain,
  Clock,
  ChevronRight,
  Trash2,
  MessageCircle,
} from 'lucide-react';

export default function ChatView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      if (data && data.length > 0) {
        setConversations(data);
        setActiveConvId(data[0].id);
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ title: 'New conversation' })
          .select()
          .single();
        if (newConv) {
          setConversations([newConv]);
          setActiveConvId(newConv.id);
        }
      }
    } catch {
      // non-fatal
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId);
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const newConversation = async () => {
    const { data } = await supabase
      .from('conversations')
      .insert({ title: 'New conversation' })
      .select()
      .single();
    if (data) {
      setConversations((c) => [data, ...c]);
      setActiveConvId(data.id);
      setMessages([]);
    }
  };

  const deleteConversation = async (id: string) => {
    await supabase.from('conversations').delete().eq('id', id);
    setConversations((c) => c.filter((conv) => conv.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConvId(remaining[0]?.id || null);
      setMessages([]);
    }
  };

  const send = async () => {
    if (!input.trim() || !activeConvId) return;
    const text = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversation_id: activeConvId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    await supabase.from('messages').insert({
      conversation_id: activeConvId,
      role: 'user',
      content: text,
    });

    if (messages.length === 0) {
      const title = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      await supabase.from('conversations').update({ title, updated_at: new Date().toISOString() }).eq('id', activeConvId);
      setConversations((c) => c.map((conv) => (conv.id === activeConvId ? { ...conv, title } : conv)));
    }

    setThinking(true);
    setTimeout(async () => {
      const response = generateResponse(text);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: activeConvId,
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, aiMsg]);
      setThinking(false);
      await supabase.from('messages').insert({
        conversation_id: activeConvId,
        role: 'assistant',
        content: response,
      });
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConvId);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Conversation list */}
      <div className="w-64 shrink-0 border-r border-white/[0.05] bg-[#0a0b0f] flex flex-col">
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.05]">
          <span className="text-white font-medium text-sm">Conversations</span>
          <button
            onClick={newConversation}
            className="w-7 h-7 rounded-lg bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 flex items-center justify-center transition-colors"
          >
            <Plus size={15} className="text-[#7c8aff]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="px-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg shimmer" />
              ))}
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-all ${
                  activeConvId === conv.id ? 'bg-[#7c8aff]/10' : 'hover:bg-white/[0.03]'
                }`}
              >
                <MessageCircle size={14} className={activeConvId === conv.id ? 'text-[#7c8aff]' : 'text-[#4a5068]'} />
                <span className={`text-xs truncate flex-1 ${activeConvId === conv.id ? 'text-white' : 'text-[#7e85a0]'}`}>
                  {conv.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#4a5068] hover:text-[#ff6b8a] transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#08090c]">
        {/* Header */}
        <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c8aff]/20 to-[#b08aff]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[#7c8aff]" />
          </div>
          <div>
            <h2 className="text-white text-sm font-medium">Asih Winarti</h2>
            <span className="text-[10px] text-[#5ce8a3] flex items-center gap-1">
              <span className="w-1 h-1 rounded-full dot-on" /> Online
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs text-[#4a5068] font-mono">
            <span className="flex items-center gap-1"><Brain size={12} /> 8 memories</span>
            <span className="flex items-center gap-1"><Clock size={12} /> 128k ctx</span>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !thinking ? (
            <WelcomeScreen onPrompt={(p) => setInput(p)} />
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c8aff]/20 to-[#b08aff]/20 flex items-center justify-center shrink-0 mt-1 mr-2.5">
                      <Sparkles size={13} className="text-[#7c8aff]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      m.role === 'user' ? 'msg-user' : 'msg-ai'
                    }`}
                  >
                    <p className="text-sm text-[#d4d8e8] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    <div className="text-[9px] font-mono text-[#4a5068] mt-1.5">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c8aff]/20 to-[#b08aff]/20 flex items-center justify-center shrink-0 mt-1 mr-2.5">
                    <Sparkles size={13} className="text-[#7c8aff]" />
                  </div>
                  <div className="msg-ai rounded-2xl px-4 py-3.5 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#7c8aff]"
                        style={{ animation: `pulse-soft 1s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.05]">
          <div className="max-w-2xl mx-auto flex items-center gap-2 glass rounded-2xl px-3 py-2.5 focus-within:border-[#7c8aff]/30 transition-colors">
            <button className="text-[#4a5068] hover:text-[#7c8aff] transition-colors">
              <Paperclip size={17} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask Asih Winarti anything..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#4a5068] outline-none"
            />
            <button className="text-[#4a5068] hover:text-[#7c8aff] transition-colors">
              <Mic size={17} />
            </button>
            <button
              onClick={send}
              className="w-8 h-8 rounded-xl bg-[#7c8aff]/15 hover:bg-[#7c8aff]/25 flex items-center justify-center transition-colors"
            >
              <Send size={14} className="text-[#7c8aff]" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-[#4a5068]">
            <Brain size={10} /> Asih Winarti remembers your preferences and learns over time
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      <div className="animate-float">
        <AshOrb active={false} size={180} />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Hi, I'm <span className="text-gradient">Asih Winarti</span>
        </h1>
        <p className="text-[#7e85a0] text-sm max-w-md">
          Your personal intelligence assistant. I learn your preferences, remember what matters,
          and handle the work you shouldn't be doing yourself.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
        {SUGGESTED_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => onPrompt(p)}
            className="glass rounded-xl px-4 py-3 text-left text-xs text-[#7e85a0] hover:text-white hover:border-[#7c8aff]/20 transition-all animate-fade-up flex items-center gap-2 group"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <ChevronRight size={12} className="text-[#4a5068] group-hover:text-[#7c8aff] transition-colors shrink-0" />
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('know about me') || lower.includes('remember')) {
    return `Here's what I know about you so far:

• You prefer concise, direct communication — no jargon
• Your peak working hours are 6am–10am
• You're currently learning Rust for systems programming
• You're vegetarian with a shellfish allergy
• You run 5km three times a week
• You prefer dark mode in all apps
• Your main project is building a personal AI assistant

I'm always learning more. The more we interact, the better I get at anticipating your needs.`;
  }
  if (lower.includes('email') || lower.includes('reply')) {
    return `I've scanned your inbox. Here's the triage:

**Needs your input (3):**
• Q3 budget review — Sarah needs approval by EOD
• Client onboarding — new contract ready for signature
• Team offsite — venue options need your pick

**Drafted replies (8):**
Ready for your review in the Drafts folder. I matched your usual tone — concise, professional, no fluff.

**Archived (36):**
Newsletters, receipts, and automated notifications — filed and out of your way.`;
  }
  if (lower.includes('meeting') || lower.includes('prep')) {
    return `Meeting prep for your 2pm:

**Attendees:**
• Sarah Chen — VP Engineering, prefers data-driven discussions
• Mike Park — Product Lead, big-picture thinker
• Jen Liu — Design, values user impact

**Context:**
This is a Q3 planning sync. Last meeting you aligned on shipping the memory system. Sarah will likely push for timeline commitments.

**Suggested talking points:**
1. Memory system progress — show the demo
2. Resource needs for Q3
3. Risk: integration dependencies

**Pre-brief sent to your notes 30 min before.**`;
  }
  if (lower.includes('focus') || lower.includes('today') || lower.includes('briefing')) {
    return `Here's your daily briefing:

**Top 3 priorities today:**
1. Review the memory refactor PR (Codex submitted it overnight)
2. 2pm Q3 planning meeting — prep is ready
3. Reply to Sarah about the budget approval

**Schedule:**
• 10:00 — Standup
• 2:00 — Q3 Planning (Sarah, Mike, Jen)
• 4:30 — Focus block (no meetings)

**Background work done overnight:**
• 47 emails triaged, 3 flagged for you
• Research compiled on Rust async patterns
• Calendar optimized — moved your focus block to afternoon

You're in your peak hours right now. I'd tackle the PR review first.`;
  }
  if (lower.includes('week') || lower.includes('summar')) {
    return `Your week so far:

**Completed (12 tasks):**
• Memory system v2 shipped
• 3 code reviews approved
• Email triage running daily
• 2 client calls wrapped

**In progress (4):**
• Rust learning — 60% through chapter 3
• Pipeline sync feature
• Personality tuning
• Integration testing

**Insights:**
• Your most productive day was Tuesday (14 tasks touched)
• You spent 3.2 hours in meetings — down 40% from last week
• Suggested: block Thursday morning for deep work

**Energy trend:** ↑ up 12% vs last week`;
  }
  return `Got it. I'm processing that and cross-referencing with what I know about your preferences and current projects.

Based on your context — you're working on a personal AI assistant and learning Rust — I can help break this down into actionable steps. Would you like me to:

1. Create a task in your workspace
2. Research this topic deeper
3. Draft a response or document

Just let me know which direction you'd like to go, and I'll handle the rest.`;
}
