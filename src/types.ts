export type View = 'mission-control' | 'agent' | 'pipeline' | 'kanban' | 'sessions';
export type AgentTab = 'chat' | 'talk' | 'hermes-jarvis' | 'oracle' | 'studio' | 'sessions' | 'workspace';

export interface Agent {
  id: string;
  name: string;
  color: string;
  model: string;
  status: 'online' | 'idle' | 'offline';
  description: string;
  stats: { likes: number; comments: number; shares: number };
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  agentName?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  agent: string;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'in-progress' | 'review' | 'done';
}

export interface Session {
  id: string;
  name: string;
  agent: string;
  messages: number;
  lastActive: string;
  preview: string;
}
