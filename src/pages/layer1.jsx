import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Database, FileText, Zap, ShieldCheck, Search, 
  GitMerge, Terminal, Cpu, CheckCircle, AlertTriangle, 
  Hexagon, ScanLine, FileOutput, ServerCog
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
      await new Promise(r => setTimeout(r, 800));
      
      onStepUpdate('RETRIEVER', { status: 'ACTIVE', log: `Querying Qdrant Vector Store for embedded guidelines on ${cadInput.material} / ${cadInput.featureType}...` });
      await new Promise(r => setTimeout(r, 1200));
      
      const retrievedRules = [
        { id: "VAR-MOLD-PC-014", text: "Minimum draft angle for PC/ABS mounting bosses must exceed 2.5 degrees.", vectorDistance: 0.982 },
        { id: "VAR-STRUCT-RIB-09", text: "Rib base thickness must be 40-60% of adjoining nominal wall.", vectorDistance: 0.814 }
      ];
      
      onStepUpdate('VERIFIER', { status: 'ACTIVE', log: `Applying retrieved constraint (VAR-MOLD-PC-014) to deterministic OCCT mathematical extraction (${cadInput.measuredDraft}°)...` });
      await new Promise(r => setTimeout(r, 1500));
      
      const isCompliant = cadInput.measuredDraft >= 2.5;
      
      onStepUpdate('LLM_SYNTHESIS', { status: 'ACTIVE', log: `Llama-3 70B generating deterministic corrective action payload. Temperature: 0.0` });
      await new Promise(r => setTimeout(r, 1000));
      
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

  const getNodeStyle = (nodeId) => {
    if (pipelineState.activeNode === nodeId) return 'border-[#047857] bg-green-50 shadow-[0_0_20px_rgba(4,120,87,0.2)] scale-[1.02] z-20';
    if (
      (nodeId === 'PLANNER' && ['RETRIEVER', 'VERIFIER', 'LLM_SYNTHESIS', 'COMPLETE'].includes(pipelineState.activeNode)) ||
      (nodeId === 'RETRIEVER' && ['VERIFIER', 'LLM_SYNTHESIS', 'COMPLETE'].includes(pipelineState.activeNode)) ||
      (nodeId === 'VERIFIER' && ['LLM_SYNTHESIS', 'COMPLETE'].includes(pipelineState.activeNode)) ||
      (nodeId === 'LLM_SYNTHESIS' && pipelineState.activeNode === 'COMPLETE')
    ) return 'border-black bg-gray-50 opacity-60 scale-100 z-10';
    return 'border-gray-200 bg-white opacity-40 scale-100 z-10';
  };

  const getProgressHeight = () => {
    switch(pipelineState.activeNode) {
      case 'PLANNER': return '25%';
      case 'RETRIEVER': return '50%';
      case 'VERIFIER': return '75%';
      case 'LLM_SYNTHESIS': return '100%';
      case 'COMPLETE': return '100%';
      default: return '0%';
    }
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
        <div className="flex items-center space-x-6 bg-black/20 px-4 py-2 rounded-lg border border-white/10">
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
        
        <div className="col-span-3 bg-white border-r-2 border-gray-200 flex flex-col shadow-xl z-20 min-h-0">
          <div className="shrink-0 p-6 pb-4">
            <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
              <Database size={16} className="mr-2 text-[#047857]" /> Knowledge Ingestion
            </h2>
            <p className="text-[11px] text-gray-500 mb-4 font-semibold uppercase tracking-wider">LlamaParse VLM Extraction</p>
            
            <div className="h-[52px] w-full">
              <button 
                onClick={handleDocumentUpload}
                disabled={ingestionState === 'INGESTING'}
                className="w-full h-full relative overflow-hidden bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold px-4 rounded shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <FileText size={18} className="mr-3 text-[#10b981]" />
                  <span className="tracking-wide text-sm">{ingestionState === 'INGESTING' ? 'Processing PDF...' : 'Upload APQP Standard'}</span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center">
                  {ingestionState === 'INGESTING' && <ScanLine size={18} className="animate-pulse text-[#10b981]" />}
                  {ingestionState === 'COMPLETE' && <CheckCircle size={18} className="text-[#10b981]" />}
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 pt-2 flex flex-col min-h-0">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col h-full min-h-0">
              <h3 className="shrink-0 text-[10px] font-extrabold text-gray-400 mb-3 uppercase tracking-widest border-b border-gray-200 pb-2 flex justify-between">
                <span>Vector Database (Qdrant)</span>
                <span className="text-[#047857] bg-green-100 px-1.5 rounded">{vectorDb.length} Indexes</span>
              </h3>
              <div ref={vectorListRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
                {vectorDb.map((v, i) => (
                  <div key={i} className="bg-white p-3 border border-gray-200 rounded shadow-sm hover:border-[#047857] transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-mono font-bold bg-[#047857] text-white px-1.5 py-0.5 rounded shadow-sm">{v.id}</span>
                      <span className="text-[9px] text-gray-400 font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded">{v.dimensions}D</span>
                    </div>
                    <p className="text-xs font-bold text-black truncate mb-1" title={v.doc}>{v.doc}</p>
                    <p className="text-[10px] text-gray-500 truncate mb-2 font-medium">Chunk: <span className="text-gray-700">{v.chunk}</span></p>
                    <p className="text-[9px] font-mono text-green-800 bg-green-50 p-1.5 rounded border border-green-100 truncate">{v.vector}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 bg-[#f8fafc] flex flex-col relative border-r-2 border-gray-200 min-h-0 z-10">
          <div className="shrink-0 bg-white border-b-2 border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm z-20">
            <div className="flex items-center space-x-3">
              <ServerCog size={20} className="text-[#047857]" />
              <div>
                <h2 className="text-sm font-extrabold text-black uppercase tracking-widest leading-tight">Pipeline Matrix</h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">DFA Node Execution</p>
              </div>
            </div>
            <button 
              onClick={simulateIncomingCadPayload}
              disabled={pipelineState.activeNode !== 'IDLE' && pipelineState.activeNode !== 'COMPLETE'}
              className="bg-[#047857] hover:bg-[#065f46] disabled:bg-gray-400 disabled:text-gray-200 text-white px-5 py-2.5 text-xs font-extrabold border border-transparent rounded shadow-md flex items-center transition-all disabled:shadow-none"
            >
              <Zap size={16} className="mr-2" />
              SIMULATE LAYER 1 CAD INPUT
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center relative overflow-y-auto p-8">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#047857" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div className="w-full max-w-2xl relative z-10 my-auto py-8">
              <div className="text-center mb-10 shrink-0 bg-white/90 backdrop-blur py-4 rounded-xl border border-gray-200 shadow-sm inline-block px-10 mx-auto w-full">
                <h2 className="text-xl font-extrabold tracking-[0.2em] text-black">LANGGRAPH ORCHESTRATOR</h2>
                <p className="text-xs font-mono font-bold text-[#047857] uppercase tracking-widest mt-1">Definite Finite Automaton Routing</p>
              </div>

              <div className="flex flex-col space-y-8 relative">
                <div className="absolute left-[3.25rem] top-12 bottom-12 w-1.5 bg-gray-200 z-0 rounded-full overflow-hidden shadow-inner">
                   <div className="w-full bg-[#10b981] transition-all duration-700 ease-in-out shadow-[0_0_10px_#10b981]" style={{ height: getProgressHeight() }} />
                </div>
                
                <div className={`relative z-10 flex items-center p-5 border-2 rounded-xl transition-all duration-500 bg-white ${getNodeStyle('PLANNER')}`}>
                  <div className="w-14 h-14 rounded-full border-2 border-inherit flex items-center justify-center shadow-md shrink-0 mr-6 bg-white z-20">
                    <Search size={22} className="text-inherit" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-black">1. Planner Agent</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">Parses B-Rep topology and formulates semantic constraints query based on tensor attributes.</p>
                  </div>
                </div>

                <div className={`relative z-10 flex items-center p-5 border-2 rounded-xl transition-all duration-500 bg-white ${getNodeStyle('RETRIEVER')}`}>
                  <div className="w-14 h-14 rounded-full border-2 border-inherit flex items-center justify-center shadow-md shrink-0 mr-6 bg-white z-20">
                    <Database size={22} className="text-inherit" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-black">2. Retriever Agent</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">Executes High-Dimensional similarity search in Pinecone/Qdrant to locate domain rules.</p>
                  </div>
                </div>

                <div className={`relative z-10 flex items-center p-5 border-2 rounded-xl transition-all duration-500 bg-white ${getNodeStyle('VERIFIER')}`}>
                  <div className="w-14 h-14 rounded-full border-2 border-inherit flex items-center justify-center shadow-md shrink-0 mr-6 bg-white z-20">
                    <GitMerge size={22} className="text-inherit" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-black">3. Deterministic Verifier</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">Cross-references text rules with deterministic OpenCASCADE measurements to prevent hallucinations.</p>
                  </div>
                </div>

                <div className={`relative z-10 flex items-center p-5 border-2 rounded-xl transition-all duration-500 bg-white ${getNodeStyle('LLM_SYNTHESIS')}`}>
                  <div className="w-14 h-14 rounded-full border-2 border-inherit flex items-center justify-center shadow-md shrink-0 mr-6 bg-white z-20">
                    <Cpu size={22} className="text-inherit" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-black">4. Llama-3 70B Synthesis</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">Generates standardized JSON corrective action payload for CAD overlay. Temperature locked at 0.0.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white flex flex-col z-20 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] min-h-0">
          <div className="shrink-0 p-6 border-b-2 border-gray-100 bg-gray-50">
            <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
              <FileOutput size={16} className="mr-2 text-[#047857]" /> Agentic Output
            </h2>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Synthesized Payload</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col min-h-0">
            {!pipelineState.finalResult ? (
              <div className="flex-1 flex items-center justify-center">
                 <p className="text-xs font-bold text-gray-300 italic text-center px-4 uppercase tracking-widest border-2 border-dashed border-gray-200 p-6 rounded-lg">Awaiting LangGraph execution...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className={`p-5 border-2 rounded-xl shadow-sm ${pipelineState.finalResult.compliant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-4 border-b-2 pb-3 border-inherit">
                    <span className={`text-xs font-extrabold uppercase tracking-[0.2em] flex items-center ${pipelineState.finalResult.compliant ? 'text-green-700' : 'text-red-700'}`}>
                      {pipelineState.finalResult.compliant ? <CheckCircle size={18} className="mr-2"/> : <AlertTriangle size={18} className="mr-2"/>}
                      {pipelineState.finalResult.action}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                      <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-1.5">Target Mesh Entity</span>
                      <span className="font-mono font-bold text-black text-sm">{pipelineState.finalResult.generatedPayload.faceId}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-1.5">Constraint Rule</span>
                         <span className="font-mono font-bold text-[#047857]">{pipelineState.finalResult.generatedPayload.rule}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-1.5">Severity</span>
                         <span className={`font-mono font-bold ${pipelineState.finalResult.compliant ? 'text-green-600' : 'text-red-600'}`}>{pipelineState.finalResult.generatedPayload.severity}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-1.5">Expected Math</span>
                         <span className="font-mono font-bold text-black">{pipelineState.finalResult.generatedPayload.expected}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-inherit shadow-sm">
                         <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-1.5">Extracted Math</span>
                         <span className={`font-mono font-bold ${pipelineState.finalResult.compliant ? 'text-green-600' : 'text-red-600'}`}>{pipelineState.finalResult.generatedPayload.actual}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-inherit shadow-sm mt-3">
                      <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">LLM Recommendation</span>
                      <span className="font-bold text-black leading-relaxed block text-[11px]">{pipelineState.finalResult.generatedPayload.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 h-64 bg-[#0a0a0a] flex flex-col border-t-4 border-black">
            <div className="shrink-0 px-4 py-2.5 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h2 className="text-[10px] font-bold text-[#047857] uppercase tracking-widest flex items-center">
                <Terminal size={14} className="mr-2" /> Inference Telemetry
              </h2>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 leading-relaxed">
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
