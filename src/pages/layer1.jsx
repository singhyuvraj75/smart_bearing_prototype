import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Database, FileText, Zap, Search, 
  GitMerge, Cpu, CheckCircle, AlertTriangle, 
  Hexagon, ScanLine, FileOutput, ServerCog, Activity,
  Lock, Settings2, Download, ShieldCheck,
  ChevronLeft, ChevronRight, Play, Terminal,
  Code2, Layers
} from 'lucide-react';

const AgenticCoreSimulation = {
  ingestEnterpriseDocument: async (fileName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `DOC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          name: fileName,
          status: "VECTORIZED",
          chunks: 142,
          embeddingsGenerated: true,
          timestamp: new Date().toISOString()
        });
      }, 2500);
    });
  },

  executeDfaRagPipeline: async (cadInput, onStepUpdate) => {
    return new Promise(async (resolve) => {
      onStepUpdate('PLANNER', { status: 'ACTIVE', log: `Received tensor payload: ${cadInput.featureType}.\nFormulating semantic constraint query...` });
      await new Promise(r => setTimeout(r, 1500));
      
      onStepUpdate('RETRIEVER', { status: 'ACTIVE', log: `Querying Qdrant Vector Store for embedded guidelines...\nContext: ${cadInput.material} / ${cadInput.featureType}` });
      await new Promise(r => setTimeout(r, 1800));
      
      const retrievedRules = [
        { id: "VAR-MOLD-PC-014", text: "Minimum draft angle for PC/ABS mounting bosses must exceed 2.5 degrees.", vectorDistance: 0.982 },
        { id: "VAR-STRUCT-RIB-09", text: "Rib base thickness must be 40-60% of adjoining nominal wall.", vectorDistance: 0.814 }
      ];
      
      onStepUpdate('VERIFIER', { status: 'ACTIVE', log: `Applying retrieved constraint [VAR-MOLD-PC-014]...\nCross-referencing with deterministic OCCT extraction: ${cadInput.measuredDraft}°` });
      await new Promise(r => setTimeout(r, 1800));
      
      const isCompliant = cadInput.measuredDraft >= 2.5;
      
      onStepUpdate('LLM_SYNTHESIS', { status: 'ACTIVE', log: `Llama-3 70B generating deterministic corrective action payload.\nEnforcing Temperature: 0.0` });
      await new Promise(r => setTimeout(r, 1500));
      
      resolve({
        compliant: isCompliant,
        rulesAssessed: retrievedRules,
        action: isCompliant ? "PROCEED" : "REJECT_TOOLING",
        generatedPayload: {
          faceId: cadInput.faceId,
          severity: isCompliant ? "PASS" : "CRITICAL",
          rule: retrievedRules[0].id,
          expected: ">= 2.5°",
          actual: `${cadInput.measuredDraft}°`,
          recommendation: "Increase draft angle via OCCT boolean operation prior to mold flow simulation."
        }
      });
    });
  }
};

export default function AegisCADLayerTwo() {
  const [vectorDb, setVectorDb] = useState([
    { id: 'V-001', doc: 'VARROC_APQP_MOLD_v4.pdf', chunk: 'Sec 3.1: Boss Draft', vector: '[0.014, -0.821, 0.442, ...]', dimensions: 1024 },
    { id: 'V-002', doc: 'VARROC_APQP_MOLD_v4.pdf', chunk: 'Sec 3.2: Rib Ratio', vector: '[-0.112, 0.045, 0.991, ...]', dimensions: 1024 },
    { id: 'V-003', doc: 'VARROC_MAT_SPEC_PCABS.pdf', chunk: 'Thermal Shrinkage', vector: '[0.551, 0.332, -0.118, ...]', dimensions: 1024 },
  ]);
  const [ingestionState, setIngestionState] = useState('IDLE');
  const [pipelineState, setPipelineState] = useState({
    activeNode: 'IDLE',
    stepData: null,
    finalResult: null
  });
  const [activeTab, setActiveTab] = useState('DFA_ROUTING');
  
  const vectorListRef = useRef(null);

  useEffect(() => {
    if (vectorListRef.current) {
      vectorListRef.current.scrollTop = 0;
    }
  }, [vectorDb]);

  const handleDocumentUpload = async () => {
    setIngestionState('INGESTING');
    try {
      const result = await AgenticCoreSimulation.ingestEnterpriseDocument('VARROC_TOLERANCES_2026.pdf');
      setVectorDb(prev => [
        { id: `V-${Math.floor(Math.random() * 900) + 100}`, doc: result.name, chunk: 'Table 4.2: Clearance', vector: '[0.771, -0.224, 0.105, ...]', dimensions: 1024 },
        { id: `V-${Math.floor(Math.random() * 900) + 100}`, doc: result.name, chunk: 'Sec 8: Fasteners', vector: '[-0.042, 0.881, -0.334, ...]', dimensions: 1024 },
        ...prev
      ]);
      setIngestionState('COMPLETE');
      setTimeout(() => setIngestionState('IDLE'), 3000);
    } catch (e) {
      setIngestionState('ERROR');
    }
  };

  const simulateIncomingCadPayload = async () => {
    setPipelineState({ activeNode: 'IDLE', stepData: null, finalResult: null });
    setActiveTab('DFA_ROUTING');
    
    const mockCadFeature = {
      faceId: "VAR-BOSS-MNT-L",
      featureType: "CYLINDRICAL_BOSS",
      material: "PC/ABS",
      measuredDraft: 0.8 
    };

    try {
      const result = await AgenticCoreSimulation.executeDfaRagPipeline(mockCadFeature, (node, data) => {
        setPipelineState(prev => ({ ...prev, activeNode: node, stepData: data }));
      });
      
      setPipelineState(prev => ({ ...prev, activeNode: 'COMPLETE', finalResult: result }));
      setTimeout(() => {
        setActiveTab('PAYLOAD');
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const steps = [
    { id: 'PLANNER', title: '1. PLANNER AGENT', desc: 'Parses B-Rep topology & formulates semantic constraints query.', icon: Search },
    { id: 'RETRIEVER', title: '2. RETRIEVER AGENT', desc: 'Executes High-Dimensional similarity search in Vector DB.', icon: Database },
    { id: 'VERIFIER', title: '3. DETERMINISTIC VERIFIER', desc: 'Cross-references text rules with deterministic OpenCASCADE measurements.', icon: GitMerge },
    { id: 'LLM_SYNTHESIS', title: '4. LLAMA-3 70B SYNTHESIS', desc: 'Generates standardized JSON corrective action payload. Temp: 0.0.', icon: Cpu }
  ];

  const getStepStatus = (stepId) => {
    const sequence = ['IDLE', 'PLANNER', 'RETRIEVER', 'VERIFIER', 'LLM_SYNTHESIS', 'COMPLETE'];
    const currentIndex = sequence.indexOf(pipelineState.activeNode);
    const stepIndex = sequence.indexOf(stepId);

    if (currentIndex === -1 || stepIndex === -1) return 'PENDING';
    if (currentIndex === stepIndex) return 'ACTIVE';
    if (currentIndex > stepIndex) return 'COMPLETED';
    return 'PENDING';
  };

  const getProgressHeight = () => {
    switch(pipelineState.activeNode) {
      case 'PLANNER': return '12%';
      case 'RETRIEVER': return '38%';
      case 'VERIFIER': return '62%';
      case 'LLM_SYNTHESIS': return '88%';
      case 'COMPLETE': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="h-screen w-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col overflow-hidden selection:bg-cyan-200">
      
      {/* 1. DARK TOP NAVIGATION BAR */}
      <div className="h-14 bg-[#0B1120] text-slate-300 flex items-center justify-between px-6 shrink-0 shadow-md z-40 border-b border-slate-800">
        <div className="flex items-center space-x-6 text-xs font-semibold tracking-wide">
          <div className="flex items-center space-x-2 text-white cursor-pointer">
            <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
              <Hexagon size={18} className="text-emerald-400 fill-emerald-500/20" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">AegisCAD<span className="font-light opacity-80">Nexus</span></h1>
            </div>
          </div>
          <div className="w-px h-5 bg-slate-700"></div>
          <button className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={16} className="mr-1"/> Back to Dashboard
          </button>
          <div className="flex items-center space-x-2 bg-slate-800/80 rounded px-3 py-1.5 border border-slate-700/50">
            <button className="flex items-center text-slate-400 hover:text-white transition-colors"><ChevronLeft size={14} className="mr-1"/> Prev Layer</button>
            <span className="bg-slate-700 text-white px-2 py-0.5 rounded text-[10px] font-bold">L2</span>
            <button className="flex items-center text-slate-400 hover:text-white transition-colors">Next Layer <ChevronRight size={14} className="ml-1"/></button>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[10px] tracking-widest font-bold uppercase">
          <span className="text-slate-500">ACTIVE SESSION</span>
          <div className={`w-2.5 h-2.5 rounded-full ${pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE' ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-30">
        
        {/* 2. LEFT SIDEBAR */}
        <aside className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center">
              <Settings2 size={14} className="mr-2" /> Synthesis Controls
            </h2>
            
            <button 
              onClick={simulateIncomingCadPayload}
              disabled={pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE'}
              className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between px-4 transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                <Zap size={16} className="mr-2 text-emerald-500" /> Simulate Input
              </div>
              <div className="text-[10px] font-mono font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-md">
                Layer 1
              </div>
            </button>

            <button 
              onClick={handleDocumentUpload}
              disabled={ingestionState === 'INGESTING'}
              className="w-full h-12 mt-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between px-4 transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                <FileText size={16} className="mr-2 text-slate-400 group-hover:text-emerald-500" /> LlamaParse Ingest
              </div>
              {ingestionState === 'INGESTING' ? (
                <ScanLine size={14} className="animate-pulse text-emerald-600" />
              ) : ingestionState === 'COMPLETE' ? (
                <CheckCircle size={14} className="text-emerald-600" />
              ) : (
                <div className="text-[10px] font-mono font-bold text-slate-500 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md">
                  APQP
                </div>
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.15em] flex items-center">
                <Database size={14} className="mr-2" /> Vector Index
              </h2>
              <span className="bg-emerald-100/50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/50">
                {vectorDb.length} Nodes
              </span>
            </div>
            
            <div ref={vectorListRef} className="flex-1 overflow-y-auto p-5 space-y-3">
              {vectorDb.map((v, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-white px-2 py-1 rounded-md shadow-sm">{v.id}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{v.dimensions}D</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate mb-1">{v.doc}</p>
                  <p className="text-[10px] text-slate-500 truncate mb-3">Chunk: <span className="font-semibold text-slate-700">{v.chunk}</span></p>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg overflow-hidden relative">
                    <p className="text-[9px] font-mono text-emerald-700 truncate opacity-70 group-hover:opacity-100 transition-opacity">{v.vector}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <section className="flex-1 flex flex-col relative bg-slate-50/50 min-w-0">
          
          {/* Secondary Tabs Bar */}
          <div className="h-[72px] border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-sm">
            <div className="flex space-x-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('DFA_ROUTING')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${activeTab === 'DFA_ROUTING' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Network size={16} className="mr-2" /> DFA Routing
              </button>
              <button 
                onClick={() => setActiveTab('PAYLOAD')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${activeTab === 'PAYLOAD' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Code2 size={16} className="mr-2" /> Synthesized Payload
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center"><Lock size={14} className="mr-1.5 text-slate-400"/> Temp: 0.0</span>
                <div className="w-px h-4 bg-slate-300"></div>
                <span className="flex items-center"><ShieldCheck size={14} className="mr-1.5 text-slate-400"/> Hallucination Guard</span>
              </div>
              <button className="bg-[#0B1120] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-md border border-slate-700">
                <Download size={16} className="mr-2" /> Export Package
              </button>
            </div>
          </div>

          {/* Grid Content Area */}
          <div className="flex-1 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] relative overflow-y-auto p-10 flex justify-center items-start">
            
            {activeTab === 'DFA_ROUTING' && (
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-800">Definite Finite Automaton</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">Agentic RAG Routing via LangGraph Orchestrator</p>
                  </div>
                  <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 mr-2"></div> Idle
                    </span>
                    <div className="w-px h-3 bg-slate-200"></div>
                    <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] mr-2"></div> Active Phase
                    </span>
                  </div>
                </div>

                <div className="p-10 relative">
                  {/* Vertical Progress Line */}
                  <div className="absolute left-[3.75rem] top-10 bottom-10 w-1 bg-slate-100 rounded-full"></div>
                  
                  <div 
                    className="absolute left-[3.75rem] top-10 w-1 bg-emerald-500 rounded-full transition-all duration-[800ms] ease-in-out shadow-[0_0_12px_rgba(16,185,129,0.6)] z-0" 
                    style={{ height: getProgressHeight() }}
                  ></div>

                  <div className="flex flex-col space-y-10 relative z-10">
                    {steps.map((step) => {
                      const status = getStepStatus(step.id);
                      return (
                        <div key={step.id} className={`flex items-start transition-all duration-500 ${status === 'PENDING' ? 'opacity-50 grayscale' : 'opacity-100 grayscale-0'}`}>
                          
                          {/* Icon Circle */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mr-8 transition-all duration-500 z-10 ${
                            status === 'ACTIVE' ? 'bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] scale-110' : 
                            status === 'COMPLETED' ? 'bg-white border-2 border-emerald-500 text-emerald-500' : 
                            'bg-slate-100 border-2 border-slate-200 text-slate-400'
                          }`}>
                            {status === 'COMPLETED' ? <CheckCircle size={24} className="text-inherit" /> : <step.icon size={24} className="text-inherit" />}
                          </div>

                          {/* Content Card */}
                          <div className={`flex-1 bg-white border rounded-2xl p-6 transition-all duration-500 ${
                            status === 'ACTIVE' ? 'border-emerald-300 shadow-xl ring-4 ring-emerald-50' : 
                            'border-slate-200 shadow-sm hover:border-slate-300'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`text-sm font-black tracking-widest ${status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-800'}`}>
                                {step.title}
                              </h3>
                              {status === 'ACTIVE' && <Activity size={18} className="text-amber-500 animate-pulse" />}
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            
                            {/* Execution Trace (Only when active) */}
                            {status === 'ACTIVE' && pipelineState.stepData && (
                              <div className="mt-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-inner animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                <div className="flex items-center justify-between mb-3 pl-2">
                                  <div className="flex items-center">
                                    <Terminal size={14} className="text-emerald-400 mr-2" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Trace</span>
                                  </div>
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                </div>
                                <p className="text-xs font-mono text-emerald-50 leading-relaxed whitespace-pre-wrap pl-2">
                                  {pipelineState.stepData.log}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PAYLOAD' && (
              <div className="w-full max-w-4xl mt-4 animate-in fade-in zoom-in-95 duration-300">
                {!pipelineState.finalResult ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center shadow-xl">
                    <Layers size={56} className="text-slate-200 mb-6" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Simulation</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Run the CAD input simulation from the sidebar to generate the final JSON payload.</p>
                  </div>
                ) : (
                  <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="h-14 bg-[#2d2d2d] flex items-center justify-between px-6 border-b border-black">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                        </div>
                        <div className="w-px h-4 bg-slate-600 ml-2"></div>
                        <span className="ml-2 text-xs font-mono text-slate-400 flex items-center font-semibold">
                          <Code2 size={16} className="mr-2"/> output/agentic_payload.json
                        </span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-md border text-[10px] font-black uppercase tracking-widest flex items-center ${pipelineState.finalResult.compliant ? 'bg-emerald-900/30 border-emerald-800/50 text-emerald-400' : 'bg-red-900/30 border-red-800/50 text-red-400'}`}>
                        <ShieldCheck size={14} className="mr-1.5" />
                        FORMAL VERIFICATION: {pipelineState.finalResult.compliant ? 'PASS' : 'FAIL'}
                      </div>
                    </div>
                    <div className="p-8 font-mono text-[14px] leading-relaxed overflow-x-auto text-emerald-400 bg-[#1e1e1e]">
                      <div className="flex">
                        <div className="text-slate-600 text-right pr-6 select-none border-r border-slate-700 mr-6">
                          1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12<br/>13
                        </div>
                        <div>
                          <span className="text-slate-400">{`{`}</span><br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"status"</span>: <span className="text-amber-300">"{pipelineState.finalResult.action}"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"target_entity"</span>: <span className="text-amber-300">"{pipelineState.finalResult.generatedPayload.faceId}"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"violation_severity"</span>: <span className={pipelineState.finalResult.compliant ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>"{pipelineState.finalResult.generatedPayload.severity}"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"apqp_constraint"</span>: <span className="text-amber-300">"{pipelineState.finalResult.generatedPayload.rule}"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"deterministic_math"</span>: <span className="text-slate-400">{`{`}</span><br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">"expected"</span>: <span className="text-amber-300">"{pipelineState.finalResult.generatedPayload.expected}"</span>,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">"extracted"</span>: <span className="text-amber-300">"{pipelineState.finalResult.generatedPayload.actual}"</span><br/>
                          &nbsp;&nbsp;<span className="text-slate-400">{`}`}</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-300">"llm_reasoning"</span>: <span className="text-amber-300">"{pipelineState.finalResult.generatedPayload.recommendation}"</span><br/>
                          <span className="text-slate-400">{`}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}
