import React, { useState, useEffect } from 'react';
import { Network, Database, Search, FileText, CheckCircle, BookOpen, Share2, Zap, ArrowRight, RefreshCcw, FileSearch } from 'lucide-react';

export default function App() {
    const [retrievalState, setRetrievalState] = useState('idle'); // idle | vectorizing | traversing | complete
    const [logs, setLogs] = useState([]);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { id: Math.random(), msg, type }]);
    };

    const triggerGraphRAG = () => {
        if (retrievalState !== 'idle') return;

        setLogs([]);
        setRetrievalState('vectorizing');
        addLog('Incoming Signal (L2): BPFO Defect predicted on NBC_BRG_001.', 'alert');
        addLog('Initiating Semantic Vector Search (ChromaDB)...', 'info');

        setTimeout(() => {
            addLog('Vector Match Found: "High-frequency outer-race fatigue symptoms".', 'success');
            addLog('Extracting historical repair logs (Accuracy: 94%).', 'info');
            setRetrievalState('traversing');
            addLog('Initiating Deterministic Graph Traversal (Neo4j)...', 'info');

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
                </defs>

                {/* Edges / Relationships */}
                <g strokeWidth="2" fill="none">
                    {/* Asset to Failure Mode */}
                    <path d="M 250 150 L 100 80" stroke={isTraversing ? "#14b8a6" : "#cbd5e1"}
                        strokeDasharray={isTraversing && !isComplete ? "5,5" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} />

                    {/* Asset to Warranty */}
                    <path d="M 250 150 L 400 80" stroke={isTraversing ? "#14b8a6" : "#cbd5e1"}
                        strokeDasharray={isTraversing && !isComplete ? "5,5" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} />

                    {/* Asset to BOM */}
                    <path d="M 250 150 L 250 260" stroke={isTraversing ? "#14b8a6" : "#cbd5e1"}
                        strokeDasharray={isTraversing && !isComplete ? "5,5" : "none"}
                        className={isTraversing && !isComplete ? "animate-[dash_1s_linear_infinite]" : ""} />

                    {/* Failure Mode to Docs */}
                    <path d="M 100 80 L 100 200" stroke={retrievalState !== 'idle' ? "#6366f1" : "#cbd5e1"}
                        strokeDasharray={retrievalState === 'vectorizing' ? "5,5" : "none"}
                        className={retrievalState === 'vectorizing' ? "animate-[dash_1s_linear_infinite]" : ""} />
                </g>

                {/* Relationship Labels */}
                {isTraversing && (
                    <g className="text-[10px] font-bold fill-teal-600 animate-in fade-in duration-500">
                        <text x="150" y="110" transform="rotate(-25 150 110)">EXHIBITS_SYMPTOM</text>
                        <text x="350" y="110" transform="rotate(25 350 110)">COVERED_BY</text>
                        <text x="255" y="210">REQUIRES_PART</text>
                    </g>
                )}

                {/* Nodes */}
                {/* Center Node: The Asset */}
                <g transform="translate(250, 150)">
                    <circle r="25" fill={isComplete ? "#ccfbf1" : "#f1f5f9"} stroke={isComplete ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                    <Database x="-12" y="-12" width="24" height="24" color={isComplete ? "#0d9488" : "#64748b"} />
                    <text y="40" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">Asset: NBC_001</text>
                </g>

                {/* Top Left: Failure Mode (Vector Search) */}
                <g transform="translate(100, 80)">
                    <circle r="20" fill={retrievalState !== 'idle' ? "#e0e7ff" : "#f1f5f9"} stroke={retrievalState !== 'idle' ? "#4f46e5" : "#94a3b8"} strokeWidth="3" />
                    <Zap x="-10" y="-10" width="20" height="20" color={retrievalState !== 'idle' ? "#4f46e5" : "#64748b"} />
                    <text y="-28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">Anomaly: BPFO</text>
                </g>

                {/* Bottom Left: Manuals (Vector Search) */}
                <g transform="translate(100, 200)">
                    <circle r="20" fill={retrievalState !== 'idle' ? "#e0e7ff" : "#f1f5f9"} stroke={retrievalState !== 'idle' ? "#4f46e5" : "#94a3b8"} strokeWidth="3" />
                    <FileText x="-10" y="-10" width="20" height="20" color={retrievalState !== 'idle' ? "#4f46e5" : "#64748b"} />
                    <text y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">Service Manuals</text>
                    {retrievalState !== 'idle' && <text x="25" y="5" fontSize="9" fontWeight="bold" fill="#4f46e5">Similarity: 0.94</text>}
                </g>

                {/* Top Right: Warranty Policy (Graph) */}
                <g transform="translate(400, 80)">
                    <circle r="20" fill={isTraversing ? "#ccfbf1" : "#f1f5f9"} stroke={isTraversing ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                    <BookOpen x="-10" y="-10" width="20" height="20" color={isTraversing ? "#0d9488" : "#64748b"} />
                    <text y="-28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">Policy: Gold SLA</text>
                </g>

                {/* Bottom Center: BOM (Graph) */}
                <g transform="translate(250, 260)">
                    <circle r="20" fill={isTraversing ? "#ccfbf1" : "#f1f5f9"} stroke={isTraversing ? "#0d9488" : "#94a3b8"} strokeWidth="3" />
                    <Share2 x="-10" y="-10" width="20" height="20" color={isTraversing ? "#0d9488" : "#64748b"} />
                    <text y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">BOM: NBC_6205</text>
                </g>

                <style>{`@keyframes dash { to { stroke-dashoffset: -10; } }`}</style>
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-teal-100">

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-teal-600 p-3 rounded-xl shadow-lg shadow-teal-600/20">
                        <Network className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Layer 3: Knowledge & Reasoning
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">GraphRAG Engine & Vector Semantic Intelligence</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
                    <button
                        onClick={reset}
                        className="p-2 text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 rounded-lg"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    <button
                        onClick={triggerGraphRAG}
                        disabled={retrievalState !== 'idle'}
                        className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${retrievalState === 'idle' ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Search className="w-4 h-4" /> Trigger AI Retrieval
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT/CENTER COLUMN: Graph Visualizer */}
                <div className="lg:col-span-8 space-y-6 flex flex-col h-full">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px] relative">

                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center z-10 relative">
                            <div>
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-teal-600" /> Graph Database Traversal
                                </h2>
                                <p className="text-[10px] text-slate-500 mt-1 font-medium">Mapping telemetry constraints to determinist business rules (Neo4j).</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${retrievalState === 'vectorizing' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                                    <FileSearch className="w-3 h-3" /> Vector DB (Milvus)
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${(retrievalState === 'traversing' || retrievalState === 'complete') ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                                    <Network className="w-3 h-3" /> Graph DB (Neo4j)
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50/30 relative flex items-center justify-center p-4">
                            {/* Dot Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                            <div className="w-full max-w-lg h-full relative z-10">
                                {renderKnowledgeGraph()}
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: RAG Logic & Output Payload */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">

                    {/* Reasoning Logs */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-64 flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                            <Database className="w-4 h-4 text-slate-400" /> Reasoning Engine Log
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-400 italic">
                                    Awaiting L2 failure signal...
                                </div>
                            )}
                            {logs.map((log) => (
                                <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className={`p-2.5 rounded-lg border flex gap-2.5
                    ${log.type === 'alert' ? 'bg-red-50 border-red-100 text-red-800' :
                                            log.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                                                log.type === 'graph' ? 'bg-teal-50 border-teal-100 text-teal-800 font-mono text-[11px]' :
                                                    'bg-indigo-50 border-indigo-100 text-indigo-800'}`}>
                                        {log.type === 'alert' && <Zap className="w-4 h-4 shrink-0 text-red-500" />}
                                        {log.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />}
                                        {log.type === 'graph' && <Share2 className="w-4 h-4 shrink-0 text-teal-500" />}
                                        {log.type === 'info' && <Search className="w-4 h-4 shrink-0 text-indigo-500" />}
                                        <span className="leading-snug">{log.msg}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Context Payload (Dispatched to L4) */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 flex-1 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-indigo-500"></div>

                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-teal-400" /> GraphRAG JSON Payload
                            </h3>
                            {retrievalState === 'complete' && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                    DISPATCHED TO L4 <ArrowRight className="w-3 h-3" />
                                </span>
                            )}
                        </div>

                        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-slate-400 overflow-y-auto">
                            {retrievalState === 'idle' ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                                    <Database className="w-8 h-8" />
                                    <span>Awaiting GraphRAG Synthesis</span>
                                </div>
                            ) : retrievalState === 'complete' ? (
                                <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-500">
                                    <p>{"{"}</p>
                                    <p className="pl-4"><span className="text-teal-300">"asset_id"</span>: <span className="text-emerald-300">"NBC_BRG_001"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"predicted_failure"</span>: <span className="text-emerald-300">"BPFO_Defect"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"warranty_status"</span>: <span className="text-indigo-300">true</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"contract_type"</span>: <span className="text-emerald-300">"NBC_Gold_Uptime"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"financial_liability"</span>: <span className="text-emerald-300">"OEM_Covered"</span>,</p>
                                    <p className="pl-4"><span className="text-teal-300">"required_bom"</span>: [</p>
                                    <p className="pl-8 text-amber-300">"NBC_BRG_6205_HighSpd",</p>
                                    <p className="pl-8 text-amber-300">"Lithium_Grease_X1"</p>
                                    <p className="pl-4">],</p>
                                    <p className="pl-4"><span className="text-teal-300">"service_directive"</span>: <span className="text-emerald-300">"Replace bearing and perform shaft alignment check prior to restart."</span></p>
                                    <p>{"}"}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-teal-500 gap-3">
                                    <Search className="w-6 h-6 animate-bounce" />
                                    <span className="text-xs">Synthesizing Context...</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}