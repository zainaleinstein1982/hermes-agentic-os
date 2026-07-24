export type View = 'chat' | 'memory' | 'dashboard' | 'integrations' | 'personality' | 'skills';

export interface Memory {
  id: string;
  content: string;
  category: string;
  tags: string[];
  importance: number;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  icon: string;
  connected: boolean;
  status: string;
  last_sync: string | null;
  config: Record<string, unknown>;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: string;
  enabled: boolean;
  icon: string;
}

export interface MemoryNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  connections: string[];
}
