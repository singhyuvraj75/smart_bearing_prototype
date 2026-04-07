import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Cpu, 
  Target, 
  Activity, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight,
  ChevronLeft,
  Zap
} from 'lucide-react';

// --- DATA: Architectural Layers ---
const layers = [
  {
    id: 'L1',
    title: 'Client & Extraction Layer',
    description: 'Intercepts real-time CAD modifications and extracts precise B-Rep geometry via OpenCASCADE.',
    icon: Terminal,
    iconColor: 'text-[#a78bfa]' // Purple
  },
  {
    id: 'L2',
    title: 'API & Transport Layer',
    description: 'Enables ultra-low-latency bidirectional communication using gRPC/Protobufs over HTTP/2.',
    icon: Database,
    iconColor: 'text-[#60a5fa]' // Blue
  },
  {
    id: 'L3',
    title: 'Geometric Deep Learning',
    description: 'Converts CAD geometry into Attributed Adjacency Graphs (AAG) for PyTorch Geometric convolution.',
    icon: Cpu,
    iconColor: 'text-[#22d3ee]' // Cyan
  },
  {
    id: 'L4',
    title: 'Knowledge & Data Core',
    description: 'LlamaParse extracts structured manufacturing rules from PDFs, stored in Qdrant vector space.',
    icon: Target,
    iconColor: 'text-[#4ade80]' // Green
  },
  {
    id: 'L5',
    title: 'Cognitive & Reasoning Core',
    description: 'LangGraph coordinates the multi-step reasoning workflow, powered by the Llama-3 inference engine.',
    icon: Activity,
    iconColor: 'text-[#facc15]' // Yellow
  },
  {
    id: 'L6',
    title: 'Validation & Compliance',
    description: 'Synthesizes DFA-RAG logic against deterministic OCCT API scripts, ensuring mathematical accuracy.',
    icon: ShieldCheck,
    iconColor: 'text-[#f87171]' // Red
  }
];

const omniLayer = {
  id: 'L7',
  title: 'Master CAD Environment',
  description: 'The Master Command Center. Aggregate all layers into a single 3D interactive viewport with real-time semantic highlighting.',
  icon: LayoutDashboard,
  iconColor: 'text-[#f95d24]' // Orange
};

export default function AegisCADDashboard() {
  const [activeLayer, setActiveLayer] = useState(null);

  // --- Active Layer Placeholder View ---
  if (activeLayer) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-200 p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setActiveLayer(null)}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wide text-sm uppercase">Return to Dashboard</span>
          </button>
          
          <div className="flex flex-col items-center justify-center h-[60vh] border border-dashed border-[#2a3655] rounded-2xl bg-[#16203a]/50">
            <activeLayer.icon className={`w-16 h-16 ${activeLayer.iconColor} mb-6 opacity-80`} />
            <h2 className="text-3xl font-light tracking-tight text-white mb-3">
              <span className="font-bold">{activeLayer.id}:</span> {activeLayer.title}
            </h2>
            <p className="text-slate-400 max-w-lg text-center leading-relaxed">
              Module code for this layer goes here. Waiting for your command to build out this component.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#040814] text-slate-300 font-sans relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        
        {/* Header Section */}
        <header className="mb-16 text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1e293b]/50 border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] font-bold tracking-widest uppercase mb-8">
            <Zap className="w-3 h-3 text-[#f95d24]" fill="#f95d24" />
            <span>Autonomous Engineering Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl tracking-tight mb-4">
            <span className="font-bold text-white">Aegis</span><span className="font-bold text-[#38bdf8]">CAD</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-1">
            An Agentic Geometric Intelligence System for <span className="font-semibold text-white">Early-Stage CAD Validation</span>.
          </p>
          <p className="text-md text-slate-400 font-light">
            Select a layer to begin the autonomous design lifecycle.
          </p>
        </header>

        {/* L1-L6 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {layers.map((layer) => (
            <div 
              key={layer.id}
              onClick={() => setActiveLayer(layer)}
              className="group bg-[#16203a] rounded-2xl p-6 border border-[#2a3655] hover:border-[#4b5e8c] transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1e2a4a] border border-[#2a3655] flex items-center justify-center mb-5 group-hover:bg-[#233257] transition-colors">
                <layer.icon className={`w-5 h-5 ${layer.iconColor}`} strokeWidth={2} />
              </div>

              <div className="flex-grow">
                <h3 className="text-[17px] font-bold text-white mb-3 tracking-wide">
                  {layer.id}: {layer.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {layer.description}
                </p>
              </div>

              <div className="flex items-center text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors mt-8 uppercase tracking-widest">
                <span>Launch Layer</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* L7: Omni-Dashboard (Full Width) */}
        <div 
          onClick={() => setActiveLayer(omniLayer)}
          className="group bg-[#16203a] rounded-2xl p-6 md:px-8 border border-[#2a3655] hover:border-[#4b5e8c] transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between"
        >
          <div className="flex items-start md:items-center flex-col md:flex-row mb-6 md:mb-0">
            <div className="w-10 h-10 rounded-lg bg-[#1e2a4a] border border-[#2a3655] flex items-center justify-center mb-4 md:mb-0 md:mr-6 group-hover:bg-[#233257] transition-colors shrink-0">
              <omniLayer.icon className={`w-5 h-5 ${omniLayer.iconColor}`} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[19px] font-bold text-white mb-2 tracking-wide">
                {omniLayer.id}: {omniLayer.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                {omniLayer.description}
              </p>
            </div>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-[#f95d24] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#f95d24]/20 group-hover:scale-105 transition-transform self-end md:self-auto">
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>

      </div>
    </div>
  );
}
