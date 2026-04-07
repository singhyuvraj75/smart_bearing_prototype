import React, { useState } from 'react';
import { 
  Box, Network, BrainCircuit, Database, Workflow, ShieldCheck, 
  Settings, Activity, ArrowRight, Play, Layers, FileJson, 
  CheckCircle2, Cpu, Zap, ShieldAlert
} from 'lucide-react';

const Dashboard = () => {
  const [activeHover, setActiveHover] = useState(null);

  const layers = [
    {
      id: 'L1',
      title: 'Geometry Capture',
      desc: 'Extracts real-time CAD geometry using B-Rep representation.',
      icon: Box,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: 'L2',
      title: 'Real-Time Pipeline',
      desc: 'Streams CAD data using ultra-low latency HTTP/2 communication.',
      icon: Network,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'hover:border-cyan-500/50'
    },
    {
      id: 'L3',
      title: 'Geometry Intelligence',
      desc: 'Identifies CAD features using PyTorch Graph Neural Networks.',
      icon: BrainCircuit,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'hover:border-purple-500/50'
    },
    {
      id: 'L4',
      title: 'Rule Intelligence',
      desc: 'Retrieves manufacturing rules from structured knowledge base.',
      icon: Database,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'hover:border-amber-500/50'
    },
    {
      id: 'L5',
      title: 'AI Reasoning Engine',
      desc: 'Applies retrieved rules and determines contextual validation logic.',
      icon: Workflow,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'hover:border-blue-500/50'
    },
    {
      id: 'L6',
      title: 'Deterministic Validation',
      desc: 'Mathematically verifies geometry via OCCT scripts to eliminate AI errors.',
      icon: ShieldCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-500/40 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
      isUsp: true
    }
  ];

  const flowSteps = ['CAD', 'Extract', 'Analyze', 'Retrieve Rules', 'Validate', 'Feedback'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Box className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AEGISCAD <span className="text-emerald-400">NEXUS</span></h1>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase">Autonomous Engineering Platform</p>
          </div>
        </div>

        <div className="hidden px-4 py-1.5 text-xs font-semibold tracking-wider border rounded-full md:block bg-slate-900 border-slate-700 text-slate-300">
          VARROC EUREKA 3.0 <span className="mx-2 text-slate-600">|</span> PROBLEM STATEMENT 9
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <button className="hover:text-emerald-400 transition-colors">Architecture</button>
          <button className="hover:text-emerald-400 transition-colors">Data Models</button>
          <button className="hover:text-emerald-400 transition-colors">System Logs</button>
          <button className="p-2 transition-colors rounded-md hover:bg-slate-800 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT GRID */}
      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="space-y-10 lg:col-span-9">
          
          {/* 2. HERO SECTION */}
          <div className="relative p-8 overflow-hidden border rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-4">
                AI-Powered CAD Validation for <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Early-Stage Design Intelligence
                </span>
              </h2>
              <p className="mb-8 text-lg text-slate-400">
                Transforms CAD designs into validated, manufacturable models using AI-driven geometry understanding and deterministic verification.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-lg shadow-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-emerald-500/25">
                  <Play className="w-5 h-5 fill-current" /> Start Validation
                </button>
                <button className="flex items-center gap-2 px-6 py-3 font-semibold transition-all border rounded-lg border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Layers className="w-5 h-5" /> Explore Architecture
                </button>
                <button className="flex items-center gap-2 px-6 py-3 font-semibold transition-all rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <FileJson className="w-5 h-5" /> View Demo Results
                </button>
              </div>
            </div>
          </div>

          {/* 3. CORE SYSTEM MODULES (GRID) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-emerald-400"/> System Architecture Layers
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {layers.map((layer) => (
                <div 
                  key={layer.id}
                  onMouseEnter={() => setActiveHover(layer.id)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`relative p-6 rounded-xl bg-slate-900 border transition-all duration-300 flex flex-col h-full
                    ${layer.border || 'border-slate-800 hover:border-slate-600'} 
                    ${activeHover === layer.id ? 'transform -translate-y-1' : ''}`}
                >
                  {layer.isUsp && (
                    <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold tracking-wider rounded-bl-lg rounded-tr-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg">
                      🔥 CORE USP
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${layer.bg} ${layer.color}`}>
                      <layer.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wider text-slate-500">{layer.id}</div>
                      <h4 className="text-lg font-bold text-slate-100">{layer.title}</h4>
                    </div>
                  </div>
                  
                  <p className="flex-grow text-sm text-slate-400">
                    {layer.desc}
                  </p>
                  
                  <button className="flex items-center gap-2 mt-6 text-sm font-medium transition-colors group text-slate-400 hover:text-white w-fit">
                    Launch Layer 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SYSTEM FLOW VISUAL */}
          <div className="p-6 border rounded-xl bg-slate-900/50 border-slate-800">
            <h3 className="mb-6 text-sm font-bold tracking-widest text-slate-500 uppercase">End-to-End Validation Pipeline</h3>
            <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap">
              {flowSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center justify-center px-4 py-3 text-sm font-medium border rounded-lg bg-slate-900 border-slate-700 text-slate-300 shrink-0 shadow-sm">
                    {step}
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div className="flex-grow flex justify-center text-emerald-500/50">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 6. BOTTOM SECTION (WHY AEGISCAD) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-slate-900 border-slate-800">
              <Zap className="w-8 h-8 text-amber-400" />
              <div>
                <div className="font-bold text-white">Real-Time Validation</div>
                <div className="text-xs text-slate-400">Sub-100ms feedback loop</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-slate-900 border-slate-800">
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="font-bold text-white">AI + Geometry Native</div>
                <div className="text-xs text-slate-400">Direct B-Rep manifold processing</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-slate-900 border-slate-800">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
              <div>
                <div className="font-bold text-white">Deterministic Verification</div>
                <div className="text-xs text-slate-400">Zero AI hallucination risk</div>
              </div>
            </div>
          </div>

        </div>

        {/* 5. RIGHT SIDE PANEL (LIVE STATUS) */}
        <div className="space-y-6 lg:col-span-3">
          <div className="sticky p-6 border rounded-2xl bg-slate-900 border-slate-800 top-24">
            
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">System Status</h3>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">CAD Connection</span>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Active
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">AI Engine (GNN)</span>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Running
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Validation Core</span>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">gRPC Stream</span>
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                  <Network className="w-4 h-4" /> Connected
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Current Action</h4>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-slate-400 animate-pulse mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-emerald-400">Awaiting CAD Input</div>
                  <div className="text-xs text-slate-500 mt-1">Ready to validate geometry against Varroc standards.</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
               <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors border border-slate-700 flex justify-center items-center gap-2">
                 <CheckCircle2 className="w-4 h-4"/> System Health OK
               </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
