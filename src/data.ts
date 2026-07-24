import { MemoryNode } from '@/types';

export const MEMORY_NODES: MemoryNode[] = [
  { id: 'n1', label: 'Communication Style', category: 'preference', x: 400, y: 200, connections: ['n2', 'n3', 'n4'] },
  { id: 'n2', label: 'Concise & Direct', category: 'preference', x: 180, y: 100, connections: ['n1'] },
  { id: 'n3', label: 'No Jargon', category: 'preference', x: 180, y: 300, connections: ['n1'] },
  { id: 'n4', label: 'Bullet Points', category: 'preference', x: 620, y: 100, connections: ['n1', 'n5'] },
  { id: 'n5', label: 'Dark Mode', category: 'preference', x: 620, y: 300, connections: ['n4', 'n1'] },
  { id: 'n6', label: 'Work Schedule', category: 'schedule', x: 400, y: 420, connections: ['n7', 'n8'] },
  { id: 'n7', label: 'Peak: 6am–10am', category: 'schedule', x: 180, y: 480, connections: ['n6'] },
  { id: 'n8', label: 'Runs 5km ×3/wk', category: 'health', x: 620, y: 480, connections: ['n6'] },
  { id: 'n9', label: 'Learning Rust', category: 'learning', x: 400, y: 560, connections: ['n10'] },
  { id: 'n10', label: 'Personal AI Project', category: 'work', x: 400, y: 660, connections: ['n9', 'n6'] },
];

export const CATEGORY_COLORS: Record<string, string> = {
  preference: '#7c8aff',
  schedule: '#5ce8a3',
  health: '#ff8a5c',
  learning: '#b08aff',
  work: '#ff6b8a',
  personal: '#5ce8a3',
  general: '#7e85a0',
};

export const CATEGORY_LABELS: Record<string, string> = {
  preference: 'Preferences',
  schedule: 'Schedule',
  health: 'Health',
  learning: 'Learning',
  work: 'Work',
  personal: 'Personal',
  general: 'General',
};

export const SUGGESTED_PROMPTS = [
  'What do you know about me?',
  'Draft a reply to my last 3 emails',
  'Prep me for my 2pm meeting',
  'Summarize my week so far',
  'What should I focus on today?',
  'Find that article about Rust I saved',
];
