import { useState, useEffect } from 'react';
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
  const [memoryCount, setMemoryCount] = useState(0);
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    const loadCounts = async () => {
      const [mem, integ] = await Promise.all([
        supabase.from('memories').select('*', { count: 'exact', head: true }),
        supabase.from('integrations').select('*', { count: 'exact', head: true }).eq('connected', true),
      ]);
      setMemoryCount(mem.count || 0);
      setConnectedCount(integ.count || 0);
    };
    loadCounts();
  }, [view]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c]">
      <Sidebar
        view={view}
        onView={setView}
        memoryCount={memoryCount}
        connectedCount={connectedCount}
      />
      {view === 'chat' && <ChatView />}
      {view === 'memory' && <MemoryView />}
      {view === 'dashboard' && <Dashboard onView={setView} />}
      {view === 'integrations' && <IntegrationsView />}
      {view === 'personality' && <PersonalityView />}
      {view === 'skills' && <SkillsView />}
    </div>
  );
}

export default App;
