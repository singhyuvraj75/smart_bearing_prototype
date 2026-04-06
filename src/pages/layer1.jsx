import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Database, FileText, Zap, ShieldCheck, Search, 
  GitMerge, Terminal, Cpu, CheckCircle, AlertTriangle, 
  Hexagon, ScanLine, FileOutput, ServerCog, Activity,
  ArrowRight, Lock
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
      onStepUpdate('PLANNER', { status: 'ACTIVE', log: `Received tensor payload: ${cadInput.featureType}. Formulating semantic query...` });
      await new Promise(r => setTimeout(r, 1200));
      
      onStepUpdate('RETRIEVER', { status: 'ACTIVE', log: `Querying Qdrant Vector Store for embedded guidelines on ${cadInput.material} / ${cadInput.featureType}...` });
      await new Promise(r => setTimeout(r, 1500));
      
      const retrievedRules = [
        { id: "VAR-MOLD-PC-014", text: "Minimum draft angle for PC/ABS mounting bosses must exceed 2.5 degrees.", vectorDistance: 0.982 },
        { id: "VAR-STRUCT-RIB-09", text: "Rib base thickness must be 40-60% of adjoining nominal wall.", vectorDistance: 0.814 }
      ];
      
      onStepUpdate('VERIFIER', { status: 'ACTIVE', log: `Applying retrieved constraint (VAR-MOLD-PC-014) to deterministic OCCT mathematical extraction (${cadInput.measuredDraft}°)...` });
      await new Promise(r => setTimeout(r, 1800));
      
      const isCompliant = cadInput.measuredDraft >= 2.5;
      
      onStepUpdate('LLM_SYNTHESIS', { status: 'ACTIVE', log: `Llama-3 70B generating deterministic corrective action payload. Temperature: 0.0` });
      await new Promise(r => setTimeout(r, 1200));
      
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
  const [systemLogs, setSystemLogs] = useState([]);
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
  
  const terminalRef = useRef(null);
  const vectorListRef = useRef(null);

  const addLog = (msg, type = 'INFO') => {
    setSystemLogs(prev => [...prev, { ts: new Date().toISOString().substring(11, 23), msg, type }]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [systemLogs]);

  useEffect(() => {
    if (vectorListRef.current) {
      vectorListRef.current.scrollTop = 0;
    }
  }, [vectorDb]);

  useEffect(() => {
    addLog('AegisCAD Cognitive Core Initialized', 'OK');
    addLog('LangGraph Orchestrator: STANDBY', 'INFO');
    addLog('Qdrant Vector Database: CONNECTED', 'OK');
    addLog('vLLM Endpoint (Meta Llama-3 70B): ACTIVE', 'OK');
  }, []);

  const handleDocumentUpload = async () => {
    setIngestionState('INGESTING');
    addLog('Vision-Language Parser (LlamaParse) processing VARROC_TOLERANCES_2026.pdf', 'INFO');
    try {
      const result = await AgenticCoreSimulation.ingestEnterpriseDocument('VARROC_TOLERANCES_2026.pdf');
      setVectorDb(prev => [
        { id: `V-${Math.floor(Math.random() * 900) + 100}`, doc: result.name, chunk: 'Table 4.2: Clearance', vector: '[0.771, -0.224, 0.105, ...]', dimensions: 1024 },
        { id: `V-${Math.floor(Math.random() * 900) + 100}`, doc: result.name, chunk: 'Sec 8: Fasteners', vector: '[-0.042, 0.881, -0.334, ...]', dimensions: 1024 },
        ...prev
      ]);
      setIngestionState('COMPLETE');
      addLog(`Ingestion Complete. ${result.chunks} chunks vectorized via Cohere Embed V3.`, 'OK');
      setTimeout(() => setIngestionState('IDLE'), 3000);
    } catch (e) {
      setIngestionState('ERROR');
      addLog('Ingestion Pipeline Failure', 'ERR');
    }
  };

  const simulateIncomingCadPayload = async () => {
    setPipelineState({ activeNode: 'IDLE', stepData: null, finalResult: null });
    addLog('Incoming gRPC Stream: Attributed Adjacency Graph from Layer 1', 'INFO');
    
    const mockCadFeature = {
      faceId: "VAR-BOSS-MNT-L",
      featureType: "CYLINDRICAL_BOSS",
      material: "PC/ABS",
      measuredDraft: 0.8 
    };

    try {
      const result = await AgenticCoreSimulation.executeDfaRagPipeline(mockCadFeature, (node, data) => {
        setPipelineState(prev => ({ ...prev, activeNode: node, stepData: data }));
        addLog(data.log, 'EXEC');
      });
      
      setPipelineState(prev => ({ ...prev, activeNode: 'COMPLETE', finalResult: result }));
      addLog(`Validation complete. Disposition: ${result.action}`, result.compliant ? 'OK' : 'ERR');
    } catch (e) {
      addLog('Agentic Execution Halted.', 'ERR');
    }
  };

  const getProgressHeight = () => {
    switch(pipelineState.activeNode) {
      case 'PLANNER': return '20%';
      case 'RETRIEVER': return '50%';
      case 'VERIFIER': return '75%';
      case 'LLM_SYNTHESIS': return '100%';
      case 'COMPLETE': return '100%';
      default: return '0%';
    }
  };

  const isNodeActive = (nodeId) => pipelineState.activeNode === nodeId;
  const isNodePast = (nodeId) => {
    const sequence = ['IDLE', 'PLANNER', 'RETRIEVER', 'VERIFIER', 'LLM_SYNTHESIS', 'COMPLETE'];
    return sequence.indexOf(pipelineState.activeNode) > sequence.indexOf(nodeId);
  };

  const getNodeClasses = (nodeId) => {
    if (isNodeActive(nodeId)) return 'border-[#047857] bg-white shadow-[0_0_25px_rgba(4,120,87,0.15)] scale-[1.03] z-20 ring-1 ring-[#047857]';
    if (isNodePast(nodeId)) return 'border-gray-300 bg-gray-50 opacity-70 scale-100 z-10';
    return 'border-gray-200 bg-white opacity-40 scale-100 z-10';
  };

  const getIconClasses = (nodeId) => {
    if (isNodeActive(nodeId)) return 'bg-[#047857] text-white border-[#047857]';
    if (isNodePast(nodeId)) return 'bg-gray-200 text-gray-500 border-gray-300';
    return 'bg-white text-gray-400 border-gray-200';
  };

  return (
    <div className="h-screen w-screen bg-gray-100 text-black font-sans flex flex-col overflow-hidden selection:bg-green-200">
      <header className="shrink-0 bg-[#047857] text-white py-3 px-6 flex items-center justify-between border-b-4 border-[#065f46] shadow-md z-30">
        <div className="flex items-center space-x-4">
          <Hexagon size={32} className="text-white fill-current opacity-90" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tighter leading-none">AEGISCAD<span className="font-light">NEXUS</span></h1>
            <p className="text-[10px] font-mono tracking-[0.2em] text-green-200 uppercase">Layer 2 : Agentic Cognitive Core</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 bg-black/20 px-4 py-2 rounded-lg border border-white/10 shadow-inner">
          <div className="flex items-center space-x-2">
            <Cpu size={14} className="text-green-300" />
            <span className="text-xs font-mono font-bold tracking-widest text-green-100">LLM: META_LLAMA-3_70B</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <Network size={14} className={pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE' ? 'text-red-400 animate-pulse' : 'text-green-300'} />
            <span className="text-xs font-mono font-bold tracking-widest text-green-100">LANGGRAPH: {pipelineState.activeNode === 'IDLE' ? 'STANDBY' : pipelineState.activeNode}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-0 min-h-0">
        
        <div className="col-span-3 bg-white border-r-2 border-gray-200 flex flex-col shadow-2xl z-20 min-h-0">
          <div className="shrink-0 p-6 pb-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
              <Database size={16} className="mr-2 text-[#047857]" /> Knowledge Ingestion
            </h2>
            <p className="text-[11px] text-gray-500 mb-5 font-bold uppercase tracking-wider">LlamaParse VLM Extraction</p>
            
            <div className="h-14 w-full shrink-0">
              <button 
                onClick={handleDocumentUpload}
                disabled={ingestionState === 'INGESTING'}
                className="w-full h-full relative overflow-hidden bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:border-gray-300 border-2 border-transparent text-white disabled:text-gray-500 font-bold px-4 rounded shadow-md transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <FileText size={18} className={ingestionState === 'INGESTING' ? 'text-gray-400 mr-3' : 'text-[#10b981] mr-3'} />
                  <span className="tracking-widest text-xs uppercase">
                    {ingestionState === 'INGESTING' ? 'Processing PDF...' : ingestionState === 'COMPLETE' ? 'Ingestion Complete' : 'Upload APQP Standard'}
                  </span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {ingestionState === 'INGESTING' && <ScanLine size={18} className="animate-pulse text-black" />}
                  {ingestionState === 'COMPLETE' && <CheckCircle size={18} className="text-[#10b981]" />}
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col min-h-0 bg-white">
            <div className="flex flex-col h-full min-h-0">
              <h3 className="shrink-0 text-[10px] font-extrabold text-gray-400 mb-4 uppercase tracking-widest border-b-2 border-gray-100 pb-2 flex justify-between items-center">
                <span className="flex items-center"><Lock size={10} className="mr-1"/> Vector Database (Qdrant)</span>
                <span className="text-[#047857] bg-green-50 border border-green-100 px-2 py-0.5 rounded shadow-sm">{vectorDb.length} Indexes</span>
              </h3>
              <div ref={vectorListRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
                {vectorDb.map((v, i) => (
                  <div key={i} className="bg-white p-3.5 border-2 border-gray-100 rounded-lg shadow-sm hover:border-[#047857] transition-colors group">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[9px] font-mono font-bold bg-[#047857] text-white px-2 py-0.5 rounded shadow-sm">{v.id}</span>
                      <span className="text-[9px] text-gray-400 font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">{v.dimensions}D</span>
                    </div>
                    <p className="text-xs font-extrabold text-black truncate mb-1.5" title={v.doc}>{v.doc}</p>
                    <p className="text-[10px] text-gray-500 truncate mb-2.5 font-bold uppercase tracking-wide">Chunk: <span className="text-black">{v.chunk}</span></p>
                    <p className="text-[9px] font-mono text-green-800 bg-green-50 p-2 rounded border border-green-100 truncate shadow-inner">{v.vector}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 bg-[#f8fafc] flex flex-col relative border-r-2 border-gray-200 min-h-0 z-10">
          <div className="shrink-0 h-20 bg-white border-b-2 border-gray-200 px-8 flex justify-between items-center shadow-sm z-30">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-lg border border-gray-200">
                <ServerCog size={24} className="text-[#047857]" />
              </div>
              <div>
                <h2 className="text-sm font-black text-black uppercase tracking-widest leading-tight">Pipeline Matrix</h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">LangGraph DFA Execution</p>
              </div>
            </div>
            <button 
              onClick={simulateIncomingCadPayload}
              disabled={pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE'}
              className="h-12 bg-[#047857] hover:bg-[#065f46] disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none text-white px-6 text-xs font-extrabold border-2 border-[#065f46] rounded-lg shadow-[0_4px_14px_rgba(4,120,87,0.3)] flex items-center transition-all uppercase tracking-widest"
            >
              {pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE' ? (
                <Activity size={18} className="mr-2 animate-pulse" />
              ) : (
                <Zap size={18} className="mr-2" />
              )}
              {pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE' ? 'EXECUTING PIPELINE...' : 'SIMULATE CAD INPUT'}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center relative overflow-y-auto p-10">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#047857" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div className="w-full max-w-3xl relative z-10 py-4">
              <div className="flex flex-col space-y-10 relative">
                
                <div className="absolute left-[3.25rem] top-12 bottom-12 w-2 bg-gray-200 z-0 rounded-full shadow-inner">
                   <div className="w-full bg-[#10b981] transition-all duration-[800ms] ease-in-out shadow-[0_0_15px_#10b981] rounded-full relative" style={{ height: getProgressHeight() }}>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-4 border-[#10b981] rounded-full shadow-[0_0_10px_#10b981]"></div>
                   </div>
                </div>
                
                {[
                  { id: 'PLANNER', title: '1. Planner Agent', desc: 'Parses B-Rep topology & formulates semantic constraints query.', icon: Search },
                  { id: 'RETRIEVER', title: '2. Retriever Agent', desc: 'Executes High-Dimensional similarity search in Vector DB.', icon: Database },
                  { id: 'VERIFIER', title: '3. Deterministic Verifier', desc: 'Cross-references text rules with deterministic OpenCASCADE measurements.', icon: GitMerge },
                  { id: 'LLM_SYNTHESIS', title: '4. Llama-3 70B Synthesis', desc: 'Generates standardized JSON corrective action payload. Temp: 0.0.', icon: Cpu },
                ].map((node) => (
                  <div key={node.id} className={`relative z-10 flex items-center p-6 border-2 rounded-xl transition-all duration-500 ${getNodeClasses(node.id)}`}>
                    <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-sm shrink-0 mr-6 z-20 transition-colors duration-500 ${getIconClasses(node.id)}`}>
                      <node.icon size={24} className="text-inherit" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-black uppercase tracking-[0.15em] mb-1.5 ${isNodeActive(node.id) ? 'text-[#047857]' : 'text-black'}`}>{node.title}</h3>
                      <p className="text-[11px] text-gray-500 font-bold leading-relaxed tracking-wide">{node.desc}</p>
                    </div>
                    
                    {isNodeActive(node.id) && pipelineState.stepData && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full w-64 bg-black border border-gray-700 rounded-lg shadow-2xl p-4 animate-in fade-in slide-in-from-left-4 z-30">
                        <div className="flex items-center mb-2">
                          <Activity size={12} className="text-green-400 mr-2 animate-pulse" />
                          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">Active Tensor Log</span>
                        </div>
                        <p className="text-[10px] font-mono text-green-300 leading-tight">
                          {pipelineState.stepData.log}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white flex flex-col z-20 shadow-2xl min-h-0">
          <div className="shrink-0 p-6 border-b-2 border-gray-200 bg-gray-50 h-20 flex items-center">
            <div>
              <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
                <FileOutput size={16} className="mr-2 text-[#047857]" /> Agentic Output
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Synthesized Correction Payload</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col min-h-0">
            {!pipelineState.finalResult ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
                 <ShieldCheck size={40} className="text-gray-300 mb-4" />
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Awaiting Validation</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className={`p-5 border-2 rounded-xl shadow-sm ${pipelineState.finalResult.compliant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-4 border-b-2 pb-3 border-inherit">
                    <span className={`text-xs font-black uppercase tracking-[0.2em] flex items-center ${pipelineState.finalResult.compliant ? 'text-green-700' : 'text-red-700'}`}>
                      {pipelineState.finalResult.compliant ? <CheckCircle size={18} className="mr-2"/> : <AlertTriangle size={18} className="mr-2"/>}
                      {pipelineState.finalResult.action}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                      <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1.5">Target Mesh Entity</span>
                      <span className="font-mono font-bold text-black text-sm">{pipelineState.finalResult.generatedPayload.faceId}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1.5">Constraint Rule</span>
                         <span className="font-mono font-bold text-[#047857]">{pipelineState.finalResult.generatedPayload.rule}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1.5">Severity</span>
                         <span className={`font-mono font-bold ${pipelineState.finalResult.compliant ? 'text-green-600' : 'text-red-600'}`}>{pipelineState.finalResult.generatedPayload.severity}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1.5">Expected Math</span>
                         <span className="font-mono font-bold text-black">{pipelineState.finalResult.generatedPayload.expected}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1.5">Extracted Math</span>
                         <span className={`font-mono font-bold ${pipelineState.finalResult.compliant ? 'text-green-600' : 'text-red-600'}`}>{pipelineState.finalResult.generatedPayload.actual}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-inherit shadow-sm mt-3 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                      <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2 pl-2">LLM Recommendation</span>
                      <span className="font-bold text-black leading-relaxed block text-[11px] pl-2">{pipelineState.finalResult.generatedPayload.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 h-[30%] min-h-[200px] bg-[#0a0a0a] flex flex-col border-t-4 border-black">
            <div className="shrink-0 px-5 py-3 border-b border-gray-800 bg-black/80">
              <h2 className="text-[10px] font-bold text-[#047857] uppercase tracking-widest flex items-center">
                <Terminal size={14} className="mr-2" /> Inference Telemetry
              </h2>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-5 font-mono text-[10px] space-y-2.5 leading-relaxed">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-600 mr-3 shrink-0">[{log.ts}]</span>
                  <span className={
                    log.type === 'ERR' ? 'text-red-500 font-bold' : 
                    log.type === 'OK' ? 'text-[#10b981] font-bold' : 
                    log.type === 'EXEC' ? 'text-[#38bdf8]' : 'text-gray-300'
                  }>
                    {log.type === 'EXEC' ? '> ' : ''}{log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
