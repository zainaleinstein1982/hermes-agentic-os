import { useState, useEffect, useCallback, memo } from 'react';
import { View } from '@/types';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import ChatView from '@/components/ChatView';
import MemoryView from '@/components/MemoryView';
import Dashboard from '@/components/Dashboard';
import IntegrationsView from '@/components/IntegrationsView';
import PersonalityView from '@/components/PersonalityView';
import SkillsView from '@/components/SkillsView';

function App() {
  const [view, setView] = useState<View>('chat');
  const [counts, setCounts] = useState({ memory: 0, connected: 0 });

  // Load counts ONCE on mount only — not on every view change
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [mem, integ] = await Promise.all([
        supabase.from('memories').select('*', { count: 'exact', head: true }),
        supabase.from('integrations').select('*', { count: 'exact', head: true }).eq('connected', true),
      ]);
      if (!cancelled) {
        // Single setState = single re-render
        setCounts({ memory: mem.count || 0, connected: integ.count || 0 });
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const refreshCounts = useCallback(async () => {
    const [mem, integ] = await Promise.all([
      supabase.from('memories').select('*', { count: 'exact', head: true }),
      supabase.from('integrations').select('*', { count: 'exact', head: true }).eq('connected', true),
    ]);
    setCounts({ memory: mem.count || 0, connected: integ.count || 0 });
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c]">
      <Sidebar
        view={view}
        onView={setView}
        memoryCount={counts.memory}
        connectedCount={counts.connected}
      />
      {/*
        Use display:none instead of conditional rendering to avoid full
        unmount/remount on every tab switch — prevents flickering.
      */}
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'chat' ? 'flex' : 'none' }}>
        <ChatView />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'memory' ? 'flex' : 'none' }}>
        <MemoryView onUpdate={refreshCounts} />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'dashboard' ? 'flex' : 'none' }}>
        <Dashboard onView={setView} />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'integrations' ? 'flex' : 'none' }}>
        <IntegrationsView onUpdate={refreshCounts} />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'personality' ? 'flex' : 'none' }}>
        <PersonalityView />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ display: view === 'skills' ? 'flex' : 'none' }}>
        <SkillsView />
      </div>
    </div>
  );
}

export default App;
