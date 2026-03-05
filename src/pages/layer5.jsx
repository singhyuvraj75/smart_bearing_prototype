import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, Server, Network, Lock, AlertOctagon, CheckCircle, Database, ArrowRight, Play, AlertTriangle, RefreshCcw, LineChart, Factory, Terminal, Activity, Zap } from 'lucide-react';

export default function App() {
    const [round, setRound] = useState(0);
    const [globalAccuracy, setGlobalAccuracy] = useState(45.0);
    const [accuracyHistory, setAccuracyHistory] = useState([45.0]);
    const [simulationState, setSimulationState] = useState('idle');
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    // Mock Enterprise Nodes
    const [nodes, setNodes] = useState([
        { id: 'tata_01', name: 'Tata Steel Plant', status: 'idle', malicious: false, traffic: false },
        { id: 'reliance_ref', name: 'Reliance Refinery', status: 'idle', malicious: false, traffic: false },
        { id: 'adani_pwr', name: 'Adani Power Gen', status: 'idle', malicious: false, traffic: false },
    ]);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [{
            id: Math.random(),
            time: new Date().toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            msg,
            type,
            hex: `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`
        }, ...prev].slice(0, 12));
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

        setNodes(prev => prev.map((n, i) => i === 2 ? { ...n, name: 'Compromised Node (EXT)', status: 'training', malicious: true } : { ...n, status: 'idle' }));

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
                        { id: 'tata_01', name: 'Tata Steel Plant', status: 'idle', malicious: false, traffic: false },
                        { id: 'reliance_ref', name: 'Reliance Refinery', status: 'idle', malicious: false, traffic: false },
                        { id: 'adani_pwr', name: 'Adani Power Gen', status: 'idle', malicious: false, traffic: false },
                    ]);
                }, 3000);
            }, 2000);
        }, 2000);
    };

    const reset = () => {
        setRound(0);
        setGlobalAccuracy(45.0);
        setAccuracyHistory([45.0]);
        setSimulationState('idle');
        setLogs([]);
        setNodes([
            { id: 'tata_01', name: 'Tata Steel Plant', status: 'idle', malicious: false, traffic: false },
            { id: 'reliance_ref', name: 'Reliance Refinery', status: 'idle', malicious: false, traffic: false },
            { id: 'adani_pwr', name: 'Adani Power Gen', status: 'idle', malicious: false, traffic: false },
        ]);
    };

    const renderAccuracyChart = () => {
        const width = 400;
        const height = 180;
        const maxRounds = Math.max(5, round);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <line x1="0" y1={height - ((95 - 40) / 60) * height} x2={width} y2={height - ((95 - 40) / 60) * height} stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />

                <path
                    d={accuracyHistory.reduce((path, acc, idx) => {
                        const x = (idx / maxRounds) * width;
                        const y = height - ((acc - 40) / 60) * height;
                        return `${path} ${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                    }, "")}
                    fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-all duration-500"
                />

                {accuracyHistory.map((acc, idx) => {
                    const x = (idx / maxRounds) * width;
                    const y = height - ((acc - 40) / 60) * height;
                    return (
                        <g key={idx} className="transition-all duration-500">
                            <circle cx={x} cy={y} r="5" fill="#fff" stroke="#6366f1" strokeWidth="2" />
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8">

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Layer 5: Federated Intelligence</h1>
                        <p className="text-sm text-slate-500 font-medium tracking-tight flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5" /> Privacy-Preserving Global Training & Security
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={runFederatedRound}
                        disabled={simulationState !== 'idle'}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${simulationState === 'idle' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Activity className="w-4 h-4" /> Run Federated Round
                    </button>

                    <button
                        onClick={simulatePoisoningAttack}
                        disabled={simulationState !== 'idle'}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${simulationState === 'idle' ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-300 border border-transparent cursor-not-allowed'}`}
                    >
                        <Zap className="w-4 h-4" /> Inject Poisoning
                    </button>

                    <button onClick={reset} className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-lg transition-colors border border-slate-100">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* LEFT: Client Edge Nodes */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Factory className="w-4 h-4" /> Customer Edge Clusters
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Connectivity</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {nodes.map((node) => (
                            <div key={node.id} className={`bg-white rounded-2xl border transition-all duration-500 shadow-sm relative overflow-hidden
                ${node.malicious ? 'border-red-300 bg-red-50' : node.status === 'training' ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-200'}`}
                            >
                                {node.traffic && (
                                    <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 animate-pulse"></div>
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className={`font-bold ${node.malicious ? 'text-red-700' : 'text-slate-800'}`}>{node.name}</h3>
                                        <div className={`p-1.5 rounded-lg ${node.status === 'training' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <Database className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="bg-white/50 border border-slate-100 p-3 rounded-xl">
                                        <div className="flex justify-between items-center text-[10px] mb-2 font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Data Sovereignty</span>
                                            <span className="text-emerald-600 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Secured locally</span>
                                        </div>

                                        <div className={`p-2.5 rounded-lg text-xs font-bold flex items-center gap-2
                      ${node.status === 'idle' ? 'bg-slate-50 text-slate-500' :
                                                node.status === 'training' ? 'bg-indigo-100 text-indigo-700 animate-pulse' :
                                                    node.status === 'validating' ? 'bg-purple-100 text-purple-700' :
                                                        node.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-red-100 text-red-700'}`}
                                        >
                                            {node.status === 'idle' && <><RefreshCcw className="w-3.5 h-3.5" /> Idle / Ready</>}
                                            {node.status === 'training' && <><Cpu className="w-3.5 h-3.5 animate-spin" /> Compute Weights...</>}
                                            {node.status === 'validating' && <><ShieldCheck className="w-3.5 h-3.5" /> ZK Generating...</>}
                                            {node.status === 'success' && <><CheckCircle className="w-3.5 h-3.5" /> Payload Authorized</>}
                                            {node.status === 'rejected' && <><AlertTriangle className="w-3.5 h-3.5" /> Blocked by Validator</>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MIDDLE: Zero-Knowledge Validator */}
                <div className="flex flex-col h-full">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" /> ZK-Validation Circuit
                    </h2>

                    <div className={`flex-1 bg-slate-900 rounded-3xl border-2 p-8 flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden
            ${simulationState === 'validating' ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]' :
                            simulationState === 'poisoned' ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}
                    >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        <div className={`relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 rotate-45 transition-all duration-500 border-2
              ${simulationState === 'validating' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 animate-pulse' :
                                simulationState === 'poisoned' ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-bounce' :
                                    simulationState === 'aggregating' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                                        'bg-slate-800 text-slate-600 border-slate-700'}`}
                        >
                            <div className="-rotate-45">
                                {simulationState === 'poisoned' ? <AlertOctagon className="w-12 h-12" /> :
                                    simulationState === 'aggregating' ? <CheckCircle className="w-12 h-12" /> :
                                        <Lock className="w-12 h-12" />}
                            </div>
                        </div>

                        <div className="z-10 space-y-3">
                            <h3 className="text-white font-black text-xl tracking-tight uppercase">zk-SNARK Engine</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed h-12 flex items-center justify-center">
                                {simulationState === 'idle' && "Awaiting encrypted weight vectors from edge clusters."}
                                {simulationState === 'training' && "Scanning nodes... Data compute occurring at source."}
                                {simulationState === 'validating' && "VALIDATING PROOF π: Ensuring weights adhere to global constraints."}
                                {simulationState === 'aggregating' && <span className="text-emerald-400 font-bold">CRYPTO-VALIDATION SUCCESS: Model updates merged.</span>}
                                {simulationState === 'poisoned' && <span className="text-red-400 font-bold">ATTACK NEUTRALIZED: Proof inconsistency detected.</span>}
                            </p>
                        </div>

                        <div className="w-full mt-10 p-5 bg-black/40 rounded-2xl border border-slate-800 h-32 overflow-hidden z-10 relative backdrop-blur-sm">
                            <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-slate-900 to-transparent z-20"></div>
                            <div className="flex flex-col gap-1.5 text-[11px] font-mono text-left">
                                {simulationState === 'validating' && (
                                    <div className="space-y-1 text-indigo-400/80 animate-in fade-in">
                                        <p className="flex justify-between"><span>[PARSING PROOF]</span> <span>0x8F2A...</span></p>
                                        <p className="flex justify-between text-slate-500"><span>[R1CS MATRIX]</span> <span>CHECKED</span></p>
                                        <p className="flex justify-between text-slate-500"><span>[PAIRING CHECK]</span> <span>TRUE</span></p>
                                        <p className="flex justify-between text-indigo-300"><span>[AGGREGATION]</span> <span>PENDING...</span></p>
                                    </div>
                                )}
                                {simulationState === 'poisoned' && (
                                    <div className="space-y-1 text-red-500/90 font-bold animate-in zoom-in-95">
                                        <p className="flex justify-between"><span>[INTEGRITY ERROR]</span> <span>0xFF00...</span></p>
                                        <p className="flex justify-between"><span>[OUTLIER DETECTED]</span> <span>NODE_2</span></p>
                                        <p className="flex justify-between"><span>[ZK-PROOF FAILURE]</span> <span>INVALID_π</span></p>
                                        <p className="flex justify-between"><span>[ACTION]</span> <span>DROP_PAYLOAD</span></p>
                                    </div>
                                )}
                                {simulationState === 'idle' && (
                                    <p className="text-slate-600 italic">SYSTEM STATUS: READY FOR INBOUND TRAFFIC</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Global NBC Model & TERMINAL AUDIT LOG */}
                <div className="flex flex-col h-full">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
                        <Server className="w-4 h-4 text-indigo-500" /> NBC Global Cloud Core
                    </h2>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">

                        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Predictive Precision</p>
                            <div className="flex items-end gap-3">
                                <h3 className={`text-5xl font-black transition-colors duration-700 ${globalAccuracy > 90 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {globalAccuracy.toFixed(1)}%
                                </h3>
                                {round > 0 && <div className="mb-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-black flex items-center">+{(globalAccuracy - accuracyHistory[accuracyHistory.length - 2] || 0).toFixed(1)}%</div>}
                            </div>
                        </div>

                        <div className="h-40 relative px-6 pt-4 flex flex-col justify-end shrink-0">
                            {renderAccuracyChart()}
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-3">Communication Rounds</p>
                        </div>

                        {/* THE NEW IMPROVED SYSTEM AUDIT LOG */}
                        <div className="flex-1 bg-slate-950 m-5 mt-2 rounded-2xl border border-slate-800 p-5 flex flex-col overflow-hidden shadow-inner min-h-[160px]">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 shrink-0">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> System Audit Log
                                </h4>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 font-mono text-[10px] space-y-2.5">
                                {logs.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-700 italic">
                                        Awaiting system initiation...
                                    </div>
                                ) : logs.map(log => (
                                    <div key={log.id} className="group animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-start gap-3">
                                            <span className="text-slate-600 shrink-0 font-bold">{log.time}</span>
                                            <div className="flex-1">
                                                <div className={`flex items-center gap-2 font-bold mb-0.5 ${log.type === 'error' ? 'text-red-400' :
                                                        log.type === 'success' ? 'text-emerald-400' :
                                                            log.type === 'warning' ? 'text-amber-400' : 'text-indigo-400'
                                                    }`}>
                                                    <span>[{log.type.toUpperCase()}]</span>
                                                    <span className="text-slate-700 text-[9px]">{log.hex}</span>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">{log.msg}</p>
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