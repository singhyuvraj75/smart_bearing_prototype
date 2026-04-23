import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Database, Zap, Cpu, Server, Activity, 
  Hash, Layers, ArrowRight, ShieldCheck, Box, BarChart3,
  Orbit, Binary, Lock, Terminal, ChevronLeft, ChevronRight,
  Download, Settings2, Code2, ScanSearch, CheckCircle, Hexagon,
  Play, Share2, Workflow
} from 'lucide-react';

const GnnInferenceEdge = {
  computeCryptographicHash: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          cacheHit: Math.random() > 0.85,
          timestamp: new Date().toISOString()
        });
      }, 800);
    });
  },

  executeSpatialConvolution: async (onLayerUpdate) => {
    return new Promise(async (resolve) => {
      onLayerUpdate('INPUT_TENSOR', { status: 'MAPPING', log: '[PyG] Mapping raw FAG attributes to N-Dimensional node vectors...\n[CUDA] Allocated 1.2GB VRAM.' });
      await new Promise(r => setTimeout(r, 1200));

      onLayerUpdate('MESSAGE_PASSING', { status: 'AGGREGATING', log: '[BRepGAT] Executing anisotropic message passing across 96 topological edges.\n[Math] H^(l+1) = σ(A * H^(l) * W^(l))' });
      await new Promise(r => setTimeout(r, 1500));

      onLayerUpdate('ATTENTION_HEADS', { status: 'ATTENDING', log: '[GATv2] Computing multi-head attention weights for edge convexity.\n[CUDA] Tensor Core utilization: 88%' });
      await new Promise(r => setTimeout(r, 1400));

      onLayerUpdate('MLP_PROJECTION', { status: 'CLASSIFYING', log: '[Linear] Passing fused geometric-topological vectors through multi-layer perceptron.\n[Softmax] Applying threshold confidence > 0.95' });
      await new Promise(r => setTimeout(r, 1000));

      resolve([
        { id: "NODE-8003", classification: "MOUNTING_BOSS", confidence: 99.84, params: { draft: "0.8°", radius: "4.5mm" } },
        { id: "NODE-8012", classification: "STRUCTURAL_RIB", confidence: 98.12, params: { thickness: "4.15mm", height: "12.0mm" } },
        { id: "NODE-8024", classification: "A_SURFACE_LENS", confidence: 99.91, params: { curvature_u: "0.04", curvature_v: "0.02" } },
        { id: "NODE-8041", classification: "SNAP_FIT_HOOK", confidence: 94.45, params: { undercut: "1.2mm", width: "6.0mm" } }
      ]);
    });
  }
};

export default function AegisCADLayerThree() {
  const [systemState, setSystemState] = useState('STANDBY');
  const [telemetry, setTelemetry] = useState([]);
  const [networkLayers, setNetworkLayers] = useState({});
  const [classifiedFeatures, setClassifiedFeatures] = useState(null);
  const [matrixData, setMatrixData] = useState([]);
  const [hashData, setHashData] = useState(null);
  const [activeTab, setActiveTab] = useState('INFERENCE');
  
  const terminalRef = useRef(null);
  const matrixIntervalRef = useRef(null);

  const logSystem = (msg, type = 'SYS') => {
    setTelemetry(prev => [...prev, { ts: new Date().toISOString().substring(11, 23), msg, type }]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [telemetry]);

  useEffect(() => {
    const initialMatrix = Array.from({ length: 144 }, () => Math.random());
    setMatrixData(initialMatrix);
    
    logSystem('FastAPI Edge Gateway Initialized', 'OK');
    logSystem('Redis Enterprise Cache Connected via VPC', 'OK');
    logSystem('PyTorch Geometric (PyG) CUDA Cores: ALLOCATED', 'OK');

    return () => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    };
  }, []);

  const triggerGrpcPayload = async () => {
    setSystemState('RECEIVING_RPC');
    setHashData(null);
    setClassifiedFeatures(null);
    setNetworkLayers({});
    setActiveTab('TENSORS');
    
    logSystem('HTTP/2 Multiplexed Stream Opened.', 'NET');
    logSystem('Receiving B-Rep Adjacency Graph from Layer 1...', 'NET');

    try {
      const redisResult = await GnnInferenceEdge.computeCryptographicHash();
      setHashData(redisResult);
      
      if (redisResult.cacheHit) {
        setSystemState('CACHE_HIT');
        logSystem(`SHA-256 Hash Match Found: ${redisResult.hash.substring(0, 16)}...`, 'OK');
        logSystem('Bypassing Neural Inference. Serving from Redis Memory.', 'OK');
        setTimeout(() => {
          setClassifiedFeatures([
            { id: "NODE-8003", classification: "MOUNTING_BOSS", confidence: 99.99, params: { draft: "0.8°", radius: "4.5mm" } },
            { id: "NODE-8012", classification: "STRUCTURAL_RIB", confidence: 99.99, params: { thickness: "4.15mm", height: "12.0mm" } }
          ]);
          setSystemState('COMPLETED');
          setActiveTab('SEGMENTATION');
        }, 1000);
      } else {
        setSystemState('TENSOR_PREP');
        logSystem(`Cache Miss. SHA-256: ${redisResult.hash.substring(0, 16)}...`, 'SYS');
        logSystem('Dispatching payload to NVIDIA A100 Tensor Cores.', 'EXE');
      }
    } catch (e) {
      logSystem('RPC Stream Failure', 'ERR');
      setSystemState('FAIL');
    }
  };

  const executePyGInference = async () => {
    setSystemState('INFERENCE_ACTIVE');
    setActiveTab('INFERENCE');
    
    matrixIntervalRef.current = setInterval(() => {
      setMatrixData(Array.from({ length: 144 }, () => Math.random()));
    }, 100);

    try {
      const results = await GnnInferenceEdge.executeSpatialConvolution((layer, data) => {
        setNetworkLayers(prev => ({ ...prev, [layer]: data }));
        logSystem(data.log, 'ML');
      });
      
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      setClassifiedFeatures(results);
      setSystemState('COMPLETED');
      logSystem('Geometric Semantic Segmentation Complete.', 'OK');
      
      setTimeout(() => {
        setActiveTab('SEGMENTATION');
      }, 1500);

    } catch (e) {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      logSystem('CUDA Memory Allocation Error', 'ERR');
      setSystemState('FAIL');
    }
  };

  const dispatchToLayerTwo = () => {
    logSystem('Packaging classified features into Agentic Payload.', 'SYS');
    logSystem('Transmitting to LangGraph Orchestrator (Layer 2)...', 'NET');
    setSystemState('DISPATCHED');
  };

  const inferenceSteps = [
    { id: 'INPUT_TENSOR', title: 'Topological Mapping', desc: 'Map raw FAG attributes to N-Dimensional vectors' },
    { id: 'MESSAGE_PASSING', title: 'Message Passing', desc: 'Execute anisotropic propagation across edges' },
    { id: 'ATTENTION_HEADS', title: 'Multi-Head Attention', desc: 'Compute weights for edge convexity/concavity' },
    { id: 'MLP_PROJECTION', title: 'MLP Classification', desc: 'Linear projection and Softmax confidence scoring' }
  ];

  return (
    <div className="h-screen w-screen bg-[#F4F6F8] text-slate-800 font-sans flex flex-col overflow-hidden selection:bg-cyan-200">
      
      <header className="shrink-0 h-[56px] bg-[#0B1120] text-slate-300 flex items-center justify-between px-6 z-40 border-b border-slate-800">
        <div className="flex items-center space-x-6 text-xs font-semibold tracking-wide">
          <div className="flex items-center space-x-2 text-white cursor-pointer">
            <div className="bg-[#0ea5e9] p-1.5 rounded-lg shadow-[0_0_12px_rgba(14,165,233,0.3)]">
              <Hexagon size={18} className="text-white fill-current" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none">AegisTwin</h1>
            </div>
          </div>
          <div className="w-px h-5 bg-slate-700"></div>
          <button className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={16} className="mr-1"/> Back to Dashboard
          </button>
          <div className="flex items-center space-x-2 bg-slate-800/80 rounded-md px-3 py-1.5 border border-slate-700/50">
            <button className="flex items-center text-slate-400 hover:text-white transition-colors"><ChevronLeft size={14} className="mr-1"/> Prev Layer</button>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded shadow-inner text-[10px] font-black border border-slate-700">L3</span>
            <button className="flex items-center text-slate-400 hover:text-white transition-colors">Next Layer <ChevronRight size={14} className="ml-1"/></button>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[10px] tracking-widest font-bold uppercase">
          <span className="text-slate-500">ACTIVE SESSION</span>
          <div className={`w-2.5 h-2.5 rounded-full ${systemState === 'INFERENCE_ACTIVE' ? 'bg-[#0ea5e9] animate-pulse shadow-[0_0_8px_#0ea5e9]' : 'bg-[#10b981] shadow-[0_0_8px_#10b981]'}`}></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-30">
        
        <aside className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
          <div className="p-6 border-b border-slate-100 flex-1 overflow-y-auto">
            
            <div className="mb-8">
              <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center">
                <Settings2 size={14} className="mr-2" /> Synthesis Controls
              </h2>
              
              <button 
                onClick={triggerGrpcPayload}
                disabled={['RECEIVING_RPC', 'INFERENCE_ACTIVE'].includes(systemState)}
                className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between px-4 transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                <div className="flex items-center text-xs font-bold text-slate-700 group-hover:text-[#0ea5e9] transition-colors">
                  <Download size={14} className="mr-2 text-[#0ea5e9]" /> Fetch Topology
                </div>
                {systemState === 'RECEIVING_RPC' ? (
                  <Activity size={14} className="animate-pulse text-[#0ea5e9]" />
                ) : (
                  <div className="text-[9px] font-mono font-bold text-slate-500 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded">
                    gRPC
                  </div>
                )}
              </button>

              <button 
                onClick={executePyGInference}
                disabled={systemState !== 'TENSOR_PREP'}
                className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 border border-[#0ea5e9] text-white rounded-xl flex items-center justify-between px-4 transition-all shadow-[0_4px_14px_rgba(14,165,233,0.25)] disabled:shadow-none group"
              >
                <div className="flex items-center text-xs font-bold">
                  <Play size={14} className="mr-2" /> Run GNN Solver
                </div>
                <div className="text-[9px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white group-disabled:hidden">
                  PyG
                </div>
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center">
                <Hash size={14} className="mr-2" /> Cryptographic Cache
              </h2>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner flex flex-col">
                {!hashData ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Lock size={28} className="text-slate-300 mb-3" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Awaiting Payload</span>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-extrabold mb-1.5">SHA-256 Hash</span>
                      <span className="font-mono text-[11px] font-bold text-slate-700 break-all bg-white p-2 rounded-lg border border-slate-200 block shadow-sm">{hashData.hash.substring(0, 32)}...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center ${hashData.cacheHit ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                        <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold mb-1">Status</span>
                        <span className={`font-black text-[11px] uppercase tracking-wider ${hashData.cacheHit ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {hashData.cacheHit ? 'HIT' : 'MISS'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg border bg-white border-slate-200 flex flex-col items-center justify-center">
                        <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold mb-1">Latency</span>
                        <span className="font-mono font-bold text-slate-700 text-[11px]">0.38 ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
               <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center">
                <Server size={14} className="mr-2" /> Infrastructure
              </h2>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Instance</span>
                  <span className="text-[10px] font-mono text-slate-800 font-bold">p4d.24xlarge</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Accelerator</span>
                  <span className="text-[10px] font-mono text-slate-800 font-bold">8x A100 Tensor</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">VRAM</span>
                  <span className="text-[10px] font-mono text-slate-800 font-bold">320 GB Total</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        <section className="flex-1 flex flex-col min-w-0 bg-white">
          
          <div className="h-[72px] border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 z-10 shadow-sm">
            <div className="flex space-x-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('TENSORS')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${activeTab === 'TENSORS' ? 'bg-white text-[#0ea5e9] shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Binary size={16} className="mr-2" /> Data Matrices
              </button>
              <button 
                onClick={() => setActiveTab('INFERENCE')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${activeTab === 'INFERENCE' ? 'bg-white text-[#0ea5e9] shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Workflow size={16} className="mr-2" /> GNN Inference
              </button>
              <button 
                onClick={() => setActiveTab('SEGMENTATION')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center ${activeTab === 'SEGMENTATION' ? 'bg-white text-[#0ea5e9] shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Box size={16} className="mr-2" /> Topology Output
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center text-slate-500">Framework: <span className="text-slate-800 ml-1.5">PyG</span></span>
                <div className="w-px h-4 bg-slate-300"></div>
                <span className="flex items-center text-slate-500">Target: <span className="text-[#0ea5e9] ml-1.5">CUDA:0</span></span>
              </div>
              <button className="bg-[#0B1120] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center transition-colors shadow-md border border-slate-700">
                <Share2 size={16} className="mr-2" /> Export Graph
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] relative overflow-y-auto p-10 flex flex-col items-center">
            
            <div className="w-full max-w-5xl flex-1 flex flex-col">
              
              {activeTab === 'TENSORS' && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">Topological Serialization</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Graph Convolution Input Matrices</p>
                    </div>
                    <div className="bg-white border border-slate-200 text-slate-600 font-mono text-[11px] font-bold px-4 py-2 rounded-lg tracking-widest shadow-sm flex items-center">
                      <Layers size={16} className="mr-2 text-[#0ea5e9]" />
                      dim(H) = N × D
                    </div>
                  </div>

                  <div className="p-12 flex items-center justify-between">
                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner flex flex-col items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 mb-8">Adjacency Matrix (A)</h3>
                        <div className="grid grid-cols-12 gap-0.5 w-64 h-64 bg-slate-300 border-4 border-slate-800 p-1 rounded-lg shadow-lg">
                          {matrixData.map((val, idx) => (
                            <div 
                              key={`A-${idx}`} 
                              className="w-full h-full transition-colors duration-100 rounded-sm"
                              style={{ backgroundColor: systemState === 'INFERENCE_ACTIVE' ? `rgba(14, 165, 233, ${val})` : (val > 0.7 ? '#1e293b' : '#f8fafc') }}
                            />
                          ))}
                        </div>
                     </div>

                     <div className="px-10 text-4xl font-light text-slate-300">×</div>

                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner flex flex-col items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 mb-8">Feature Matrix (X)</h3>
                        <div className="grid grid-cols-4 gap-0.5 w-24 h-64 bg-slate-300 border-4 border-slate-800 p-1 rounded-lg shadow-lg">
                          {matrixData.slice(0, 48).map((val, idx) => (
                            <div 
                              key={`X-${idx}`} 
                              className="w-full h-full transition-colors duration-100 rounded-sm"
                              style={{ backgroundColor: systemState === 'INFERENCE_ACTIVE' ? `rgba(16, 185, 129, ${val})` : (val > 0.5 ? '#64748b' : '#f1f5f9') }}
                            />
                          ))}
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'INFERENCE' && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                   <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">PyG Spatial Convolutions</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Graph Neural Network Processing</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-[10px] font-bold text-slate-500 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-slate-200 mr-2"></div> Pending</span>
                      <span className="flex items-center text-[10px] font-bold text-[#0ea5e9] uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] shadow-[0_0_8px_#38bdf8] mr-2"></div> Computing</span>
                    </div>
                  </div>

                  <div className="p-10 relative">
                    <div className="absolute left-[3.8rem] top-10 bottom-10 w-1 bg-slate-100 rounded-full"></div>
                    
                    <div className="flex flex-col space-y-10 relative z-10">
                      {inferenceSteps.map((step, index) => {
                        const isActive = networkLayers[step.id];
                        const isProcessing = isActive && systemState === 'INFERENCE_ACTIVE' && index === Object.keys(networkLayers).length - 1;

                        return (
                          <div key={step.id} className={`flex items-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mr-8 transition-all duration-500 z-10 ${
                              isProcessing ? 'bg-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] scale-110' : 
                              isActive ? 'bg-white border-2 border-[#0ea5e9] text-[#0ea5e9]' : 
                              'bg-slate-100 border-2 border-slate-200 text-slate-400'
                            }`}>
                              <Layers size={24} className="text-inherit" />
                            </div>

                            <div className={`flex-1 bg-white border rounded-xl p-6 transition-all duration-500 ${
                              isProcessing ? 'border-[#0ea5e9] shadow-lg ring-4 ring-[#e0f2fe]' : 
                              isActive ? 'border-slate-200 shadow-sm' : 'border-slate-100'
                            }`}>
                              <div className="flex justify-between items-center mb-1.5">
                                <h3 className={`text-sm font-black tracking-widest uppercase ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                                  {step.title}
                                </h3>
                                {isActive && <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-md tracking-widest border border-slate-200">{isActive.status}</span>}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SEGMENTATION' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  {!classifiedFeatures ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center shadow-xl">
                      <ShieldCheck size={56} className="text-slate-200 mb-6" />
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Semantic Segmentation</h3>
                      <p className="text-xs text-slate-400 mt-2 font-medium">Execute the PyG GNN to classify topological features.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
                            <ScanSearch size={20} className="mr-3 text-[#047857]" /> Detected Topology
                          </h2>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg">
                            {classifiedFeatures.length} Entities Classified
                          </span>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-6 bg-white">
                          {classifiedFeatures.map((feat, idx) => (
                            <div key={idx} className={`p-6 border-2 rounded-2xl shadow-sm transition-all hover:shadow-md ${feat.confidence > 99 ? 'border-slate-300' : 'border-slate-200'}`}>
                              <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-4">
                                <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">
                                  {feat.classification.replace('_', ' ')}
                                </span>
                                <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md ${feat.confidence > 99 ? 'bg-[#047857] text-white shadow-sm' : 'bg-slate-200 text-slate-700'}`}>
                                  {feat.confidence}% CF
                                </span>
                              </div>
                              
                              <div className="space-y-3 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between text-slate-500 mb-3 border-b border-slate-100 pb-2">
                                  <span className="font-bold">UUID:</span>
                                  <span className="text-slate-800 font-bold">{feat.id}</span>
                                </div>
                                {Object.entries(feat.params).map(([k, v]) => (
                                  <div key={k} className="flex justify-between text-slate-500">
                                    <span className="uppercase text-[10px] font-bold tracking-widest">{k}:</span>
                                    <span className="text-[#0ea5e9] font-bold text-sm">{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={dispatchToLayerTwo}
                        disabled={systemState === 'DISPATCHED'}
                        className="w-full bg-[#0B1120] hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none text-white font-black text-sm py-5 px-6 rounded-2xl shadow-xl uppercase tracking-[0.2em] flex items-center justify-center transition-all border border-slate-700"
                      >
                        {systemState === 'DISPATCHED' ? 'Payload Dispatched' : 'Forward to Layer 2 (Agentic RAG)'}
                        <ArrowRight size={18} className="ml-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* HELIXTWIN STYLE TERMINAL WINDOW */}
              <div className="w-full mt-10 bg-[#1E1E1E] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden shrink-0">
                <div className="h-12 bg-[#2D2D2D] flex items-center justify-between px-5 border-b border-black">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                    <div className="w-px h-4 bg-slate-600 ml-3"></div>
                    <span className="ml-3 text-[11px] font-mono text-slate-400 flex items-center font-semibold tracking-wide">
                      <Code2 size={14} className="mr-2"/> terminal ~ /aegis/core/gnn_inference.py
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="flex h-2 w-2 relative mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Trace</span>
                  </div>
                </div>
                <div ref={terminalRef} className="h-48 p-6 font-mono text-[12px] leading-relaxed overflow-y-auto bg-[#1E1E1E]">
                  {telemetry.length === 0 ? (
                    <span className="text-slate-500">System initialized. Awaiting gRPC stream...</span>
                  ) : (
                    telemetry.map((log, idx) => (
                      <div key={idx} className="flex mb-2">
                        <span className="text-slate-500 mr-4 shrink-0">[{log.ts}]</span>
                        <span className={`whitespace-pre-wrap ${
                          log.type === 'ERR' ? 'text-red-400' : 
                          log.type === 'OK' ? 'text-emerald-400' : 
                          log.type === 'ML' ? 'text-sky-300' : 'text-slate-300'
                        }`}>
                          {log.msg}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
