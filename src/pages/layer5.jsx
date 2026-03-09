import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, Server, Network, Lock, AlertOctagon, CheckCircle, Database, ArrowRight, Play, AlertTriangle, RefreshCcw, Factory, Terminal, Activity, Zap, ArrowLeft, CheckCircle2, LineChart } from 'lucide-react';

export default function App() {
    const [round, setRound] = useState(0);
    const [globalAccuracy, setGlobalAccuracy] = useState(45.0);
    const [accuracyHistory, setAccuracyHistory] = useState([45.0]);
    const [simulationState, setSimulationState] = useState('idle'); // idle | training | validating | aggregating | poisoned
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    // Mock Enterprise Nodes
    const [nodes, setNodes] = useState([
        { id: 'tata_01', name: 'Tata Steel Plant', type: 'Heavy Manufacturing', status: 'idle', malicious: false, traffic: false },
        { id: 'reliance_ref', name: 'Reliance Refinery', type: 'Oil & Gas', status: 'idle', malicious: false, traffic: false },
        { id: 'adani_pwr', name: 'Adani Power Gen', type: 'Energy Sector', status: 'idle', malicious: false, traffic: false },
    ]);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [{
            id: Math.random(),
            time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            msg,
            type,
            hex: `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`
        }, ...prev].slice(0, 10));
    };

    const runFederatedRound = () => {
        if (simulationState !== 'idle') return;
        setSimulationState('training');
        setRound(r => r + 1);
        addLog(`INITIALIZING ROUND ${round + 1}: Distribution of global weights to edge.`, 'info');

        // 1. Local Training Phase
        setNodes(prev => prev.map(n => ({ ...n, status: 'training' })));

        setTimeout(() => {
            // 2. Validation Phase
            setSimulationState('validating');
            setNodes(prev => prev.map(n => ({ ...n, status: 'validating', traffic: true })));
            addLog('LOCAL COMPUTE COMPLETE. Generating zk-SNARK proof of legitimacy.', 'info');

            setTimeout(() => {
                // 3. Aggregation Phase
                setSimulationState('aggregating');
                setNodes(prev => prev.map(n => ({ ...n, status: 'success', traffic: false })));
                addLog('CRYPTOGRAPHIC HANDSHAKE SUCCESS: Weights validated via ZK-Circuit.', 'success');
                addLog('COMMENCING FEDERATED AVERAGING (FedAvg) on global cloud.', 'info');

                const accuracyBoost = (100 - globalAccuracy) * 0.28;
                const newAccuracy = Math.min(98.5, globalAccuracy + accuracyBoost);

                setGlobalAccuracy(newAccuracy);
                setAccuracyHistory(prev => [...prev, newAccuracy]);

                setTimeout(() => {
                    setSimulationState('idle');
                    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
                    addLog(`SYSTEM UPDATE: Global Predictive Accuracy now at ${newAccuracy.toFixed(1)}%.`, 'success');
                }, 2000);

            }, 2500);
        }, 2500);
    };

    const simulatePoisoningAttack = () => {
        if (simulationState !== 'idle') return;
        setSimulationState('poisoned');
        addLog('CRITICAL: Malicious weight vector detected from unauthorized source!', 'error');

        setNodes(prev => prev.map((n, i) => i === 2 ? { ...n, name: 'Compromised Node (EXT)', type: 'Unknown IP', status: 'training', malicious: true } : { ...n, status: 'idle' }));

        setTimeout(() => {
            setNodes(prev => prev.map(n => n.malicious ? { ...n, status: 'validating', traffic: true } : n));
            addLog('INTERCEPT: Analyzing proof π for weight gradient consistency...', 'warning');

            setTimeout(() => {
                setNodes(prev => prev.map(n => n.malicious ? { ...n, status: 'rejected', traffic: false } : n));
                addLog('REJECTION: zk-SNARK proof invalid. Malicious updates dropped.', 'error');
                addLog('SECURITY PROTOCOL: Global model integrity preserved.', 'success');

                setTimeout(() => {
                    setSimulationState('idle');
                    setNodes([
                        { id: 'tata_01', name: 'Tata Steel Plant', type: 'Heavy Manufacturing', status: 'idle', malicious: false, traffic: false },
                        { id: 'reliance_ref', name: 'Reliance Refinery', type: 'Oil & Gas', status: 'idle', malicious: false, traffic: false },
                        { id: 'adani_pwr', name: 'Adani Power Gen', type: 'Energy Sector', status: 'idle', malicious: false, traffic: false },
                    ]);
                }, 3500);
            }, 2500);
        }, 2500);
    };

    const reset = () => {
        setRound(0);
        setGlobalAccuracy(45.0);
        setAccuracyHistory([45.0]);
        setSimulationState('idle');
        setLogs([]);
        setNodes([
            { id: 'tata_01', name: 'Tata Steel Plant', type: 'Heavy Manufacturing', status: 'idle', malicious: false, traffic: false },
            { id: 'reliance_ref', name: 'Reliance Refinery', type: 'Oil & Gas', status: 'idle', malicious: false, traffic: false },
            { id: 'adani_pwr', name: 'Adani Power Gen', type: 'Energy Sector', status: 'idle', malicious: false, traffic: false },
        ]);
    };

    const renderAccuracyChart = () => {
        const width = 500;
        const height = 180;
        const maxRounds = Math.max(5, round);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 relative drop-shadow-xl">
                <defs>
                    <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio) => (
                    <line key={ratio} x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,4" />
                ))}

                {/* Target Line */}
                <line x1="0" y1={height - ((95 - 40) / 60) * height} x2={width} y2={height - ((95 - 40) / 60) * height} stroke="#10b981" strokeWidth="2" strokeDasharray="6,6" />
                <text x={width} y={height - ((95 - 40) / 60) * height - 8} textAnchor="end" fill="#10b981" fontSize="11" fontWeight="800" className="uppercase tracking-widest">
                    95% Accuracy Target
                </text>

                {/* Area Fill */}
                {accuracyHistory.length > 1 && (
                    <path
                        d={`M 0,${height} ` + accuracyHistory.reduce((path, acc, idx) => {
                            const x = (idx / maxRounds) * width;
                            const y = height - ((acc - 40) / 60) * height;
                            return `${path} L ${x},${y}`;
                        }, "") + ` L ${(accuracyHistory.length - 1) / maxRounds * width},${height} Z`}
                        fill="url(#accGradient)"
                        className="transition-all duration-500"
                    />
                )}

                {/* Line Path */}
                <path
                    d={accuracyHistory.reduce((path, acc, idx) => {
                        const x = (idx / maxRounds) * width;
                        const y = height - ((acc - 40) / 60) * height;
                        return `${path} ${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                    }, "")}
                    fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-all duration-500"
                    style={{ filter: 'drop-shadow(0px 6px 8px rgba(124,58,237,0.3))' }}
                />

                {/* Points */}
                {accuracyHistory.map((acc, idx) => {
                    const x = (idx / maxRounds) * width;
                    const y = height - ((acc - 40) / 60) * height;
                    return (
                        <g key={idx} className="transition-all duration-500">
                            <circle cx={x} cy={y} r="6" fill="#fff" stroke="#7c3aed" strokeWidth="3" className="drop-shadow-md" />
                            {idx > 0 && (
                                <text x={x} y={y - 15} textAnchor="middle" fill="#5b21b6" fontSize="12" fontWeight="900">
                                    {acc.toFixed(1)}%
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-purple-200">

            {/* Top Navigation / Back Button */}
            <div className="max-w-7xl mx-auto mb-6">
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </div>

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-purple-500/30 border border-purple-400/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900">
                            Federated Intelligence & Security
                        </h1>
                        <p className="text-sm font-medium mt-1 text-slate-500">
                            Privacy-Preserving Global AI Training & Zero-Knowledge Validation
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] w-full lg:w-auto">
                    <button
                        onClick={runFederatedRound}
                        disabled={simulationState !== 'idle'}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${simulationState === 'idle' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Play className="w-4 h-4" /> Trigger FL Round
                    </button>

                    <button
                        onClick={simulatePoisoningAttack}
                        disabled={simulationState !== 'idle'}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${simulationState === 'idle' ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm hover:-translate-y-0.5' : 'bg-slate-50 text-slate-300 border border-transparent cursor-not-allowed'}`}
                    >
                        <AlertOctagon className="w-4 h-4" /> Inject Poisoning
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                    <button onClick={reset} className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100/50 rounded-xl transition-colors border border-slate-200 hover:bg-slate-200">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">

                {/* LEFT: Client Edge Nodes (3 cols) */}
                <div className="lg:col-span-3 flex flex-col h-full space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Factory className="w-4 h-4 text-blue-500" /> Edge Clusters
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>
                    </div>

                    <div className="space-y-5 flex-1">
                        {nodes.map((node) => (
                            <div key={node.id} className={`bg-white rounded-3xl border transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group
                                ${node.malicious ? 'border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : node.status === 'training' ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-slate-200/80 hover:border-slate-300'}`}
                            >
                                {node.traffic && (
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${node.malicious ? 'bg-red-500' : 'bg-indigo-500'} animate-pulse`}></div>
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className={`text-sm font-extrabold tracking-tight ${node.malicious ? 'text-red-700' : 'text-slate-800'}`}>{node.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{node.type}</p>
                                        </div>
                                        <div className={`p-2 rounded-xl transition-colors duration-300 ${node.status === 'training' ? 'bg-indigo-50 text-indigo-600' : node.malicious ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                            <Database className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl">
                                        <div className="flex justify-between items-center text-[9px] mb-3 font-black text-slate-400 uppercase tracking-widest">
                                            <span>Sovereignty</span>
                                            <span className={`flex items-center gap-1 ${node.malicious ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {node.malicious ? <AlertTriangle className="w-3 h-3" /> : <Lock className="w-3 h-3" />} 
                                                {node.malicious ? 'Compromised' : 'Secure'}
                                            </span>
                                        </div>

                                        <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300
                                            ${node.status === 'idle' ? 'bg-white text-slate-500 border border-slate-200 shadow-sm' :
                                                node.status === 'training' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-inner' :
                                                    node.status === 'validating' ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-inner' :
                                                        node.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' :
                                                            'bg-red-50 text-red-700 border border-red-200 shadow-inner'}`}
                                        >
                                            {node.status === 'idle' && <><RefreshCcw className="w-3.5 h-3.5" /> Awaiting Sync</>}
                                            {node.status === 'training' && <><Cpu className="w-3.5 h-3.5 animate-spin" /> Compute Weights</>}
                                            {node.status === 'validating' && <><Lock className="w-3.5 h-3.5 animate-pulse" /> Generating ZK Proof</>}
                                            {node.status === 'success' && <><ArrowRight className="w-3.5 h-3.5" /> Weights Sent Securely</>}
                                            {node.status === 'rejected' && <><AlertOctagon className="w-3.5 h-3.5" /> Payload Blocked</>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MIDDLE: Zero-Knowledge Validator (Secure Enclave) (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full space-y-6">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-purple-500" /> Secure Cryptographic Enclave
                    </h2>

                    <div className={`flex-1 bg-[#0a0f1c] rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center justify-center text-center transition-all duration-700 relative overflow-hidden group
                        ${simulationState === 'validating' ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]' :
                            simulationState === 'poisoned' ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : ''}`}
                    >
                        {/* Deep Grid Background */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                        
                        {/* Dynamic Ambient Glow */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-colors duration-1000
                            ${simulationState === 'validating' ? 'bg-purple-600/20' : 
                              simulationState === 'poisoned' ? 'bg-red-600/20' : 
                              simulationState === 'aggregating' ? 'bg-emerald-600/10' : 'bg-transparent'}`}>
                        </div>

                        {/* Central Animated Shield */}
                        <div className={`relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 rotate-45 transition-all duration-700 border-2
                            ${simulationState === 'validating' ? 'bg-purple-500/10 text-purple-400 border-purple-500/50 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_30px_rgba(168,85,247,0.4)]' :
                                simulationState === 'poisoned' ? 'bg-red-500/10 text-red-500 border-red-500/50 animate-bounce shadow-[0_0_30px_rgba(239,68,68,0.4)]' :
                                    simulationState === 'aggregating' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' :
                                        'bg-[#131b2f] text-slate-500 border-slate-700'}`}
                        >
                            <div className="-rotate-45">
                                {simulationState === 'poisoned' ? <AlertOctagon className="w-10 h-10" /> :
                                    simulationState === 'aggregating' ? <CheckCircle2 className="w-10 h-10" /> :
                                        <ShieldCheck className="w-10 h-10" />}
                            </div>
                        </div>

                        <div className="z-10 space-y-3 w-full">
                            <h3 className="text-slate-100 font-black text-xl tracking-widest uppercase">zk-SNARK Engine</h3>
                            <p className="text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed h-12 flex items-center justify-center font-medium">
                                {simulationState === 'idle' && "Awaiting encrypted weight vectors from edge clusters."}
                                {simulationState === 'training' && "Scanning nodes... Data compute occurring securely at source."}
                                {simulationState === 'validating' && "VALIDATING PROOF: Ensuring weights adhere to global constraints."}
                                {simulationState === 'aggregating' && <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">Validation Success: Updates Merged.</span>}
                                {simulationState === 'poisoned' && <span className="text-red-400 font-bold bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">ATTACK NEUTRALIZED: Proof invalid.</span>}
                            </p>
                        </div>

                        {/* Dark Mode Terminal Hash Stream */}
                        <div className="w-full mt-8 p-4 bg-[#050810] rounded-2xl border border-slate-800/80 h-36 overflow-hidden z-10 relative shadow-inner">
                            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#050810] to-transparent z-20"></div>
                            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#050810] to-transparent z-20"></div>
                            
                            <div className="flex flex-col gap-2 text-[11px] font-mono text-left font-bold tracking-wide">
                                {simulationState === 'validating' && (
                                    <div className="space-y-2 text-purple-400 animate-in fade-in">
                                        <p className="flex justify-between"><span>[PARSING PROOF]</span> <span className="text-slate-500">0x8F2A...</span></p>
                                        <p className="flex justify-between text-slate-400"><span>[R1CS MATRIX]</span> <span className="text-emerald-400">CHECKED</span></p>
                                        <p className="flex justify-between text-slate-400"><span>[PAIRING CHECK]</span> <span className="text-emerald-400">TRUE</span></p>
                                        <p className="flex justify-between text-indigo-400 mt-2 animate-pulse"><span>[AGGREGATION]</span> <span>PENDING...</span></p>
                                    </div>
                                )}
                                {simulationState === 'poisoned' && (
                                    <div className="space-y-2 text-red-500 animate-in zoom-in-95">
                                        <p className="flex justify-between"><span>[INTEGRITY ERROR]</span> <span className="text-red-400">0xFF00...</span></p>
                                        <p className="flex justify-between"><span>[OUTLIER DETECTED]</span> <span>NODE_2</span></p>
                                        <p className="flex justify-between"><span>[ZK-PROOF FAILURE]</span> <span className="bg-red-950 px-1.5 py-0.5 rounded text-red-400 border border-red-900">INVALID_π</span></p>
                                        <p className="flex justify-between text-red-600 mt-2"><span>[ACTION]</span> <span className="underline">DROP_PAYLOAD</span></p>
                                    </div>
                                )}
                                {simulationState === 'idle' && (
                                    <p className="text-slate-600 italic text-center mt-10">SYSTEM STATUS: READY</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Global NBC Model & TERMINAL AUDIT LOG (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Server className="w-4 h-4 text-indigo-500" /> NBC Global Cloud Core
                        </h2>
                        <span className="text-[9px] font-black tracking-widest bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100 uppercase">
                            Aggregation Layer
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex-1 flex flex-col overflow-hidden p-6 relative">
                        
                        {/* Subtle Background Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[60px] pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <LineChart className="w-3.5 h-3.5" /> Global Predictive Accuracy
                                </p>
                                <div className="flex items-end gap-4">
                                    {/* Massive Gradient Typography */}
                                    <h3 className={`text-6xl font-black tracking-tighter transition-all duration-700 bg-clip-text text-transparent ${globalAccuracy > 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
                                        {globalAccuracy.toFixed(1)}<span className="text-4xl">%</span>
                                    </h3>
                                    {round > 0 && (
                                        <div className="mb-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-black flex items-center shadow-sm">
                                            +{ (globalAccuracy - accuracyHistory[accuracyHistory.length - 2] || 0).toFixed(1) }%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="h-52 relative bg-slate-50/80 rounded-2xl border border-slate-200/60 p-4 pb-8 shadow-inner shrink-0 z-10">
                            {/* Y-Axis Label */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black text-slate-400 uppercase tracking-widest z-20">
                                Accuracy (%)
                            </div>
                            
                            <div className="w-full h-full pl-4">
                                {renderAccuracyChart()}
                            </div>
                            
                            {/* X-Axis Label */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Federated Communication Rounds
                            </div>
                        </div>

                        {/* Premium Audit Log */}
                        <div className="flex-1 mt-6 flex flex-col overflow-hidden relative z-10">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 shrink-0">
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-indigo-500" /> System Audit Log
                                </h4>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                {logs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-xs font-medium opacity-60 gap-2">
                                        <Activity className="w-6 h-6" />
                                        Awaiting system initiation...
                                    </div>
                                ) : logs.map(log => (
                                    <div key={log.id} className="group animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className={`p-3.5 rounded-2xl border-l-4 border-t border-r border-b flex items-start gap-3 shadow-sm transition-colors
                                            ${log.type === 'error' ? 'bg-red-50/50 border-l-red-500 border-red-100 text-red-800' :
                                              log.type === 'success' ? 'bg-emerald-50/50 border-l-emerald-500 border-emerald-100 text-emerald-800' :
                                              log.type === 'warning' ? 'bg-amber-50/50 border-l-amber-500 border-amber-100 text-amber-800' :
                                              'bg-slate-50/50 border-l-indigo-500 border-slate-100 text-slate-700'}`}>
                                            
                                            <span className="text-slate-400 shrink-0 font-mono text-[10px] mt-0.5 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold">{log.time}</span>
                                            
                                            <div className="flex-1">
                                                <p className="text-xs font-bold leading-relaxed tracking-wide">{log.msg}</p>
                                                <div className={`text-[9px] font-mono mt-1.5 font-bold opacity-70 flex items-center gap-1
                                                    ${log.type === 'error' ? 'text-red-600' : 
                                                      log.type === 'success' ? 'text-emerald-600' : 
                                                      'text-indigo-600'}`}>
                                                    [{log.type.toUpperCase()}] {log.hex}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
