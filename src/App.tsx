import { useState } from 'react';
import { View } from '@/types';
import Sidebar from '@/components/Sidebar';
import MissionControl from '@/components/MissionControl';
import AgentView from '@/components/AgentView';
import Pipeline from '@/components/Pipeline';
import Kanban from '@/components/Kanban';
import Sessions from '@/components/Sessions';

function App() {
  const [view, setView] = useState<View>('mission-control');
  const [selectedAgentId, setSelectedAgentId] = useState('hermes');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0b0f]">
      <Sidebar
        view={view}
        onView={setView}
        selectedAgentId={selectedAgentId}
        onAgentSelect={setSelectedAgentId}
      />
      {view === 'mission-control' && <MissionControl onView={setView} />}
      {view === 'agent' && <AgentView agentId={selectedAgentId} />}
      {view === 'pipeline' && <Pipeline />}
      {view === 'kanban' && <Kanban />}
      {view === 'sessions' && <Sessions />}
    </div>
  );
}

export default App;
