import React, { useState } from 'react';
import { Network, Database, Search, FileText, CheckCircle, BookOpen, Share2, Zap, ArrowRight, RefreshCcw, FileSearch, ArrowLeft, Terminal, Cpu } from 'lucide-react';

export default function App() {
    const [retrievalState, setRetrievalState] = useState('idle'); // idle | vectorizing | traversing | complete
    const [logs, setLogs] = useState([]);

    const addLog = (msg, type = 'info', layer = 'L3') => {
        setLogs(prev => [...prev, { id: Math.random(), time: new Date().toLocaleTimeString([], { hour12: false }), msg, type, layer }]);
    };

    const triggerGraphRAG = () => {
        if (retrievalState !== 'idle') return;

        setLogs([]);
        setRetrievalState('vectorizing');
        addLog('Incoming Signal (L2): BPFO Defect predicted on NBC_BRG_001.', 'alert', 'L2');
        addLog('Initiating Semantic Vector Search (ChromaDB)...', 'info');

        setTimeout(() => {
            addLog('Vector Match Found: "High-frequency outer-race fatigue symptoms".', 'success');
            addLog('Extracting historical repair logs (Similarity: 0.94).', 'info');
            setRetrievalState('traversing');
            addLog('Initiating Deterministic Graph Traversal (Neo4j)...', 'graph');

            setTimeout(() => {
                addLog('Traversing node: [ASSET: NBC_BRG_001] ➔ [WARRANTY_POLICY]', 'graph');
                addLog('Traversing node: [ASSET: NBC_BRG_001] ➔ [REQUIRED_BOM]', 'graph');

                setTimeout(() => {
                    setRetrievalState('complete');
                    addLog('GraphRAG Synthesis Complete. Payload ready for Commerce Layer.', 'success');
                }, 1500);
            }, 1500);
        }, 2000);
    };

    const reset = () => {
        setRetrievalState('idle');
        setLogs([]);
    };

    // SVG Knowledge Graph Visualizer
    const renderKnowledgeGraph = () => {
        const isTraversing = retrievalState === 'traversing' || retrievalState === 'complete';
        const isComplete = retrievalState === 'complete';

        return (
            <svg viewBox="0 0 500 300" className="w-full h-full overflow-visible font-sans">
                <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#14b8a6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Edges / Relationships */}
                <g strokeWidth="2.5" fill="none">
                    {/* Asset to Failure Mode */}
                    <path d="M 250 150 L 100 80" stroke={isTraversing ? "#14b8a6" : "#334155"}
                        strokeDasharray={isTraversing && !isComplete ? "6,6" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} 
                        filter={isTraversing ? "url(#glow)" : ""} />

                    {/* Asset to Warranty */}
                    <path d="M 250 150 L 400 80" stroke={isTraversing ? "#14b8a6" : "#334155"}
                        strokeDasharray={isTraversing && !isComplete ? "6,6" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} 
                        filter={isTraversing ? "url(#glow)" : ""} />

                    {/* Asset to BOM */}
                    <path d="M 250 150 L 250 260" stroke={isTraversing ? "#14b8a6" : "#334155"}
                        strokeDasharray={isTraversing && !isComplete ? "6,6" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} 
                        filter={isTraversing ? "url(#glow)" : ""} />

                    {/* Failure Mode to Docs */}
                    <path d="M 100 80 L 100 200" stroke={retrievalState !== 'idle' ? "#8b5cf6" : "#334155"}
                        strokeDasharray={retrievalState === 'vectorizing' ? "6,6" : "none"}
                        className={retrievalState === 'vectorizing' ? "animate-[dash_1s_linear_infinite]" : ""} 
                        filter={retrievalState !== 'idle' ? "url(#glow)" : ""} />
                </g>

                {/* Relationship Labels */}
                {isTraversing && (
                    <g className="text-[9px] font-black fill-teal-400 tracking-widest animate-in fade-in duration-500" style={{ textShadow: '0 0 10px rgba(20, 184, 166, 0.8)' }}>
                        <text x="145" y="105" transform="rotate(-25 150 110)">EXHIBITS_SYMPTOM</text>
                        <text x="355" y="105" transform="rotate(25 350 110)">COVERED_BY</text>
                        <text x="255" y="210">REQUIRES_PART</text>
                    </g>
                )}

                {/* Nodes */}
                {/* Center Node: The Asset */}
                <g transform="translate(250, 150)">
                    <circle r="26" fill={isComplete ? "#0f766e" : "#1e293b"} stroke={isComplete ? "#2dd4bf" : "#475569"} strokeWidth="3" filter={isComplete ? "url(#glow)" : ""} className="transition-all duration-500" />
                    <Database x="-12" y="-12" width="24" height="24" color={isComplete ? "#ccfbf1" : "#94a3b8"} />
                    <text y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc">Asset: NBC_001</text>
                </g>

                {/* Top Left: Failure Mode (Vector Search) */}
                <g transform="translate(100, 80)">
                    <circle r="22" fill={retrievalState !== 'idle' ? "#5b21b6" : "#1e293b"} stroke={retrievalState !== 'idle' ? "#a78bfa" : "#475569"} strokeWidth="3" filter={retrievalState !== 'idle' ? "url(#glow)" : ""} className="transition-all duration-500" />
                    <Zap x="-11" y="-11" width="22" height="22" color={retrievalState !== 'idle' ? "#ede9fe" : "#94a3b8"} />
                    <text y="-30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">Anomaly: BPFO</text>
                </g>

                {/* Bottom Left: Manuals (Vector Search) */}
                <g transform="translate(100, 200)">
                    <circle r="22" fill={retrievalState !== 'idle' ? "#5b21b6" : "#1e293b"} stroke={retrievalState !== 'idle' ? "#a78bfa" : "#475569"} strokeWidth="3" filter={retrievalState !== 'idle' ? "url(#glow)" : ""} className="transition-all duration-500" />
                    <FileText x="-11" y="-11" width="22" height="22" color={retrievalState !== 'idle' ? "#ede9fe" : "#94a3b8"} />
                    <text y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">Service Manuals</text>
                    {retrievalState !== 'idle' && <text x="28" y="5" fontSize="9" fontWeight="bold" fill="#c4b5fd" filter="url(#glow)">Sim: 0.94</text>}
                </g>

                {/* Top Right: Warranty Policy (Graph) */}
                <g transform="translate(400, 80)">
                    <circle r="22" fill={isTraversing ? "#0f766e" : "#1e293b"} stroke={isTraversing ? "#2dd4bf" : "#475569"} strokeWidth="3" filter={isTraversing ? "url(#glow)" : ""} className="transition-all duration-500" />
                    <BookOpen x="-11" y="-11" width="22" height="22" color={isTraversing ? "#ccfbf1" : "#94a3b8"} />
                    <text y="-30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">Policy: Gold SLA</text>
                </g>

                {/* Bottom Center: BOM (Graph) */}
                <g transform="translate(250, 260)">
                    <circle r="22" fill={isTraversing ? "#0f766e" : "#1e293b"} stroke={isTraversing ? "#2dd4bf" : "#475569"} strokeWidth="3" filter={isTraversing ? "url(#glow)" : ""} className="transition-all duration-500" />
                    <Share2 x="-11" y="-11" width="22" height="22" color={isTraversing ? "#ccfbf1" : "#94a3b8"} />
                    <text y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">BOM: NBC_6205</text>
                </g>

                <style>{`@keyframes dash { to { stroke-dashoffset: -15; } }`}</style>
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-teal-100">

            {/* Top Navigation / Back Button */}
            <div className="max-w-7xl mx-auto mb-6">
                <button 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </div>

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl shadow-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-teal-600/30">
                        <Network className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            Knowledge & Reasoning Engine
                        </h1>
                        <p className="text-sm font-medium mt-1 text-slate-500">
                            GraphRAG Engine & Vector Semantic Intelligence
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-md w-full lg:w-auto">
                    <button
                        onClick={reset}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-bold text-xs bg-slate-100/50 hover:bg-slate-100 rounded-xl"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" /> Restart
                    </button>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                    <button
                        onClick={triggerGraphRAG}
                        disabled={retrievalState !== 'idle'}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${retrievalState === 'idle' ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Search className="w-4 h-4" /> Trigger AI Retrieval
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* LEFT/CENTER COLUMN: Graph Visualizer */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6 flex flex-col h-full">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex-1 flex flex-col min-h-[450px] relative group">
                        
                        {/* Header of Visualizer */}
                        <div className="p-5 border-b border-slate-800/80 bg-slate-900/90 flex justify-between items-center z-10 relative backdrop-blur-md">
                            <div>
                                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-teal-400" /> Multi-Agent Knowledge Traversal
                                </h2>
                                <p className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">Mapping telemetry constraints to deterministic business rules.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${retrievalState === 'vectorizing' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'}`}>
                                    <FileSearch className="w-3 h-3" /> Milvus Vector DB
                                </span>
                                <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${(retrievalState === 'traversing' || retrievalState === 'complete') ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'}`}>
                                    <Network className="w-3 h-3" /> Neo4j Graph DB
                                </span>
                            </div>
                        </div>

                        {/* Interactive Canvas Area */}
                        <div className="flex-1 relative flex items-center justify-center p-6 bg-[#090e17]">
                            {/* Deep grid background */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                            
                            {/* Glow behind the graph */}
                            <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 pointer-events-none
                                ${retrievalState === 'idle' ? 'bg-transparent' : 
                                  retrievalState === 'vectorizing' ? 'bg-purple-600/10' : 'bg-teal-600/10'}`}>
                            </div>

                            <div className="w-full max-w-2xl h-full relative z-10 drop-shadow-2xl">
                                {renderKnowledgeGraph()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: RAG Logic & Output Payload */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col">

                    {/* Reasoning Logs HUD */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 h-[280px] flex flex-col relative overflow-hidden">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0 pb-3 border-b border-slate-100">
                            <Terminal className="w-4 h-4 text-indigo-500" /> Reasoning Engine Trace
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs scrollbar-hide">
                            {logs.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic gap-2 opacity-60">
                                    <Cpu className="w-6 h-6" />
                                    Awaiting predictive signal...
                                </div>
                            )}
                            {logs.map((log) => (
                                <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className={`p-3 rounded-xl border flex items-start gap-3 shadow-sm
                                        ${log.type === 'alert' ? 'bg-red-50 border-red-200 text-red-800' :
                                            log.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                                log.type === 'graph' ? 'bg-slate-900 border-slate-700 text-teal-300 font-mono text-[11px]' :
                                                    'bg-indigo-50 border-indigo-200 text-indigo-800'}`}>
                                        
                                        {/* Icon based on log type */}
                                        <div className={`mt-0.5 shrink-0 ${log.type === 'graph' ? 'text-teal-400' : ''}`}>
                                            {log.type === 'alert' && <Zap className="w-4 h-4 text-red-500" />}
                                            {log.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                            {log.type === 'graph' && <Share2 className="w-4 h-4" />}
                                            {log.type === 'info' && <Search className="w-4 h-4 text-indigo-500" />}
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${log.type === 'graph' ? 'bg-slate-800 text-slate-400' : 'bg-white/60 text-slate-500'}`}>
                                                    {log.layer}
                                                </span>
                                                <span className={`text-[9px] font-mono ${log.type === 'graph' ? 'text-slate-500' : 'text-slate-400'}`}>{log.time}</span>
                                            </div>
                                            <span className="leading-snug font-medium mt-0.5">{log.msg}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Context Payload (Dispatched to L4) */}
                    <div className={`rounded-3xl border shadow-xl p-6 flex-1 flex flex-col relative overflow-hidden transition-all duration-500
                        ${retrievalState === 'complete' ? 'bg-slate-900 border-teal-500/50 shadow-teal-900/20' : 'bg-slate-900 border-slate-800'}`}>
                        
                        {/* Glow Effect for complete state */}
                        {retrievalState === 'complete' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-500 shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>}

                        <div className="flex justify-between items-center mb-4 shrink-0 pb-3 border-b border-slate-800">
                            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${retrievalState === 'complete' ? 'text-teal-400' : 'text-slate-500'}`} /> JSON Context Payload
                            </h3>
                            {retrievalState === 'complete' && (
                                <span className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-black bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 uppercase tracking-widest animate-pulse">
                                    Dispatched to L4 <ArrowRight className="w-3 h-3" />
                                </span>
                            )}
                        </div>

                        <div className="flex-1 bg-[#090e17] rounded-xl border border-slate-800/80 p-5 font-mono text-[11px] leading-loose text-slate-400 overflow-y-auto shadow-inner">
                            {retrievalState === 'idle' ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 opacity-50">
                                    <Database className="w-8 h-8" />
                                    <span className="font-sans font-medium">Awaiting GraphRAG Synthesis</span>
                                </div>
                            ) : retrievalState === 'complete' ? (
                                <div className="animate-in fade-in zoom-in-95 duration-500">
                                    <p>{"{"}</p>
                                    <p className="pl-4"><span className="text-teal-300">"asset_id"</span>: <span className="text-emerald-300">"NBC_BRG_001"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"predicted_failure"</span>: <span className="text-emerald-300">"BPFO_Defect"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"warranty_status"</span>: <span className="text-purple-400">true</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"contract_type"</span>: <span className="text-emerald-300">"NBC_Gold_Uptime"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"financial_liability"</span>: <span className="text-emerald-300">"OEM_Covered"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"required_bom"</span>: [</p>
                                    <p className="pl-8 text-amber-300">"NBC_BRG_6205_HighSpd",</p>
                                    <p className="pl-8 text-amber-300">"Lithium_Grease_X1"</p>
                                    <p className="pl-4">],</p>
                                    <p className="pl-4"><span className="text-teal-300">"service_directive"</span>: <span className="text-emerald-300">"Replace bearing and check alignment."</span></p>
                                    <p>{"}"}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-teal-500 gap-3">
                                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="font-sans font-bold text-xs animate-pulse">Synthesizing Context...</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
