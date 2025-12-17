import React, { useState } from 'react';
import { FlowCanvas } from './components/Canvas/FlowCanvas';
import { LayerPalette } from './components/Sidebar/LayerPalette';
import { PropertyInspector } from './components/Sidebar/PropertyInspector';
import { CodeExportModal } from './components/Modals/CodeExportModal';
import { Download, Play } from 'lucide-react';

const App = () => {
  const [isExportOpen, setExportOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden font-sans">

      <header className="h-[72px] border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ObscuraFlow" className="h-40 min-w-[50px] w-auto object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded text-xs font-mono font-bold uppercase hover:bg-zinc-200 transition-colors"
          >
            <Download size={14} /> Export Code
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Components Palette */}
        <LayerPalette />

        {/* Center: Canvas */}
        <div className="flex-1 relative">
          <FlowCanvas />
        </div>

        {/* Right: Properties */}
        <PropertyInspector />
      </main>

      {/* Modals */}
      <CodeExportModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};

export default App;
