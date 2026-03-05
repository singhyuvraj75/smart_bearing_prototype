import React, { useState, useEffect } from 'react';
import { Activity, Cpu, AlertTriangle, CheckCircle, Zap, Thermometer, Wifi, Database, Filter, Network, Server } from 'lucide-react';

export default function App() {
    const [isFaulty, setIsFaulty] = useState(false);
    const [isFiltered, setIsFiltered] = useState(true);
    const [meshState, setMeshState] = useState('normal'); // 'normal' | 'blocked'
    const [tick, setTick] = useState(0);

    // Simulated Edge Data State
    const [sensorData, setSensorData] = useState({
        kurtosis: 2.8,
        rms: 1.2,
        crestFactor: 3.1,
        temperature: 45.2,
        cpuLoad: 12
    });

    const [waveformData, setWaveformData] = useState(Array(50).fill(25));
    const [fftData, setFftData] = useState(Array(20).fill(2));
    const [meshLogs, setMeshLogs] = useState([]);

    // Main simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);

            // 1. Simulate Raw Waveform (Time Domain)
            let newValue;
            // High noise if unfiltered, low noise if band-pass filter is on
            const noiseLevel = isFiltered ? (Math.random() * 4 - 2) : (Math.random() * 16 - 8);

            if (!isFaulty) {
                // Healthy: Sine wave + noise
                newValue = 25 + Math.sin(tick * 0.5) * 8 + noiseLevel;
            } else {
                // Faulty: Sine wave + noise + severe high-frequency impacts (BPFO)
                const impact = (tick % 6 === 0) ? 22 : 0;
                newValue = 25 + Math.sin(tick * 0.5) * 8 + noiseLevel + impact;
            }

            setWaveformData(prev => {
                const next = [...prev, newValue];
                return next.slice(-50); // Keep last 50 points
            });

            // 2. Simulate FFT, Features & CPU Load
            if (!isFaulty) {
                setSensorData({
                    kurtosis: 2.8 + (Math.random() * 0.4),
                    rms: 1.2 + (Math.random() * 0.1),
                    crestFactor: 3.1 + (Math.random() * 0.2),
                    temperature: 45.0 + (Math.random() * 1.5),
                    cpuLoad: isFiltered ? 18 + Math.random() * 4 : 12 + Math.random() * 2
                });

                setFftData(prev => prev.map((v, i) => i < 5 ? 10 + Math.random() * 5 : 2 + Math.random() * 2));
            } else {
                setSensorData(prev => ({
                    kurtosis: Math.min(6.5, prev.kurtosis + 0.5 + Math.random()),
                    rms: Math.min(3.5, prev.rms + 0.2),
                    crestFactor: Math.min(7.0, prev.crestFactor + 0.4),
                    temperature: Math.min(68.0, prev.temperature + 1.2),
                    cpuLoad: 35 + Math.random() * 10 // CPU spikes when processing anomalies
                }));

                setFftData(prev => prev.map((v, i) => {
                    if (i === 12) return 45 + Math.random() * 10; // The BPFO Spike!
                    if (i < 5) return 15 + Math.random() * 5;
                    return 5 + Math.random() * 5;
                }));
            }

        }, 150);

        return () => clearInterval(interval);
    }, [isFaulty, tick, isFiltered]);

    // Simulate Mesh Gateway Transmission every 2 seconds
    useEffect(() => {
        const txInterval = setInterval(() => {
            const isAnomaly = sensorData.kurtosis > 4.0 || sensorData.temperature > 55.0;
            const path = meshState === 'normal' ? 'Node_A ➔ Gateway' : 'Node_A ➔ Node_C ➔ Gateway';

            const newLog = {
                id: Math.random().toString(36).substring(7),
                time: new Date().toLocaleTimeString(),
                isAnomaly,
                path,
                payload: {
                    kurt: sensorData.kurtosis.toFixed(2),
                    state: isAnomaly ? "DEFECT" : "CLEAR"
                }
            };

            setMeshLogs(prev => [newLog, ...prev].slice(0, 3));
        }, 2000);

        return () => clearInterval(txInterval);
    }, [sensorData, meshState]);

    // SVG Path generator for waveform
    const generatePath = () => {
        const width = 500;
        const height = 100;
        const step = width / (waveformData.length - 1);

        return waveformData.reduce((path, val, idx) => {
            const x = idx * step;
            const y = Math.max(0, Math.min(height, height - (val / 50 * height)));
            return `${path} ${idx === 0 ? 'M' : 'L'} ${x},${y}`;
        }, "");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-100">

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
                        <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Layer 1: Edge Intelligence
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Hybrid Piezo/MEMS + Embedded ARM Cortex Processor</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
                    <span className="text-sm font-bold text-slate-500 pl-2 hidden sm:block">Controls:</span>

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setIsFiltered(!isFiltered)}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${isFiltered ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Filter className="w-3.5 h-3.5" /> Band-Pass Filter
                        </button>
                    </div>

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setIsFaulty(false)}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${!isFaulty ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Healthy
                        </button>
                        <button
                            onClick={() => setIsFaulty(true)}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${isFaulty ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Zap className="w-3.5 h-3.5" /> Inject Defect
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Sensor Data & Signal Processing */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Waveform Panel */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${isFaulty ? 'bg-red-500' : 'bg-blue-600'}`}></div>
                        <div className="p-5 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className={`w-5 h-5 ${isFaulty ? 'text-red-500' : 'text-blue-600'}`} /> Raw Vibration Signal
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Time-domain waveform (10kHz Sampling)</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isFiltered ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {isFiltered ? 'FILTER ACTIVE' : 'NOISY SIGNAL'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 relative h-60 bg-white flex items-center justify-center">
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible z-10">
                                <path
                                    d={generatePath()}
                                    fill="none"
                                    stroke={isFaulty ? "#ef4444" : "#2563eb"}
                                    strokeWidth={isFiltered ? "2.5" : "1.5"}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-colors duration-300"
                                    style={{ filter: isFaulty ? 'drop-shadow(0px 2px 4px rgba(239,68,68,0.3))' : 'drop-shadow(0px 2px 4px rgba(37,99,235,0.2))' }}
                                />
                            </svg>

                            {isFaulty && isFiltered && (
                                <div className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm animate-pulse flex items-center gap-1.5 z-20">
                                    <AlertTriangle className="w-4 h-4" /> BPFO IMPACTS ISOLATED
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* FFT Frequency Spectrum */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative">
                            <h2 className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-2">
                                Embedded FFT Processor
                            </h2>
                            <p className="text-[10px] text-slate-400 mb-4">Translating time-domain to frequency spectrum.</p>

                            <div className="h-32 flex items-end justify-between gap-1.5 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                {fftData.map((val, i) => (
                                    <div key={i} className="w-full flex flex-col items-center group relative">
                                        <div
                                            className={`w-full rounded-t-sm transition-all duration-75 ${i === 12 && isFaulty ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-blue-400 group-hover:bg-blue-500'}`}
                                            style={{ height: `${val}%` }}
                                        ></div>
                                        {i === 12 && isFaulty && (
                                            <span className="absolute -top-6 text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded border border-red-100">BPFO</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold px-1">
                                <span>0 Hz</span>
                                <span>Defect Frequencies</span>
                                <span>500 Hz</span>
                            </div>
                        </div>

                        {/* ARM Cortex Edge Compute Load */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h2 className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-2">
                                <Server className="w-4 h-4" /> Edge Compute Metrics
                            </h2>
                            <p className="text-[10px] text-slate-400 mb-4">Processing power retained at the factory level.</p>

                            <div className="space-y-6 mt-2">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600 font-medium">ARM CPU Load</span>
                                        <span className={`font-mono font-bold ${sensorData.cpuLoad > 30 ? 'text-orange-500' : 'text-blue-600'}`}>
                                            {sensorData.cpuLoad.toFixed(1)} %
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${sensorData.cpuLoad > 30 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${sensorData.cpuLoad}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm text-slate-600 font-medium flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-slate-400" /> Ambient Temp</span>
                                    <span className={`text-sm font-bold ${isFaulty ? 'text-red-600' : 'text-slate-600'}`}>{sensorData.temperature.toFixed(1)}°C</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Feature Extraction & Mesh */}
                <div className="space-y-6">

                    {/* Edge AI Analytics Box */}
                    <div className={`rounded-2xl border shadow-sm p-5 transition-all duration-500 ${isFaulty ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Database className={`w-4 h-4 ${isFaulty ? 'text-red-500' : 'text-blue-500'}`} /> Extracted Health Indicators
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                                <span className="text-sm text-slate-600 font-medium">Kurtosis (Impulses)</span>
                                <span className={`font-mono text-lg font-bold ${sensorData.kurtosis > 4.0 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {sensorData.kurtosis.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                                <span className="text-sm text-slate-600 font-medium">RMS (Total Energy)</span>
                                <span className={`font-mono text-lg font-bold ${sensorData.rms > 2.5 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {sensorData.rms.toFixed(2)} g
                                </span>
                            </div>
                        </div>

                        {/* Edge Decision Logic */}
                        <div className={`mt-5 pt-5 border-t ${isFaulty ? 'border-red-200' : 'border-slate-100'}`}>
                            <h3 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Local Edge Decision</h3>
                            {isFaulty ? (
                                <div className="bg-red-100/50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-red-700">Anomaly Flag: TRUE</p>
                                        <p className="text-xs text-red-600/80 mt-1 font-medium leading-tight">BPFO threshold exceeded. Bypassing standard telemetry schedule.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm font-bold text-blue-700">Status: Nominal</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Mesh Network Visualizer */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Network className="w-4 h-4 text-indigo-500" /> Wirepas Mesh Network
                                </h2>
                                <p className="text-[10px] text-slate-400 mt-1">Multi-hop Self-Healing Topology</p>
                            </div>
                            <button
                                onClick={() => setMeshState(prev => prev === 'normal' ? 'blocked' : 'normal')}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${meshState === 'blocked' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                            >
                                {meshState === 'blocked' ? 'Clear Blockage' : 'Simulate RF Blockage'}
                            </button>
                        </div>

                        {/* Visual Mesh Topology */}
                        <div className="relative h-28 bg-slate-50 rounded-xl border border-slate-100 mb-4 p-2">
                            <svg className="w-full h-full" viewBox="0 0 200 80">
                                {/* Node A -> Gateway (Direct Path) */}
                                <line x1="30" y1="40" x2="170" y2="40" stroke={meshState === 'normal' ? '#818cf8' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 2" className={meshState === 'normal' ? 'animate-[dash_1s_linear_infinite]' : ''} />
                                {meshState === 'blocked' && <line x1="90" y1="30" x2="110" y2="50" stroke="#ef4444" strokeWidth="3" />}
                                {meshState === 'blocked' && <line x1="90" y1="50" x2="110" y2="30" stroke="#ef4444" strokeWidth="3" />}

                                {/* Reroute Path: Node A -> Node C -> Gateway */}
                                <line x1="30" y1="40" x2="100" y2="15" stroke={meshState === 'blocked' ? '#818cf8' : '#e2e8f0'} strokeWidth="2" strokeDasharray="4 2" className={meshState === 'blocked' ? 'animate-[dash_1s_linear_infinite]' : ''} />
                                <line x1="100" y1="15" x2="170" y2="40" stroke={meshState === 'blocked' ? '#818cf8' : '#e2e8f0'} strokeWidth="2" strokeDasharray="4 2" className={meshState === 'blocked' ? 'animate-[dash_1s_linear_infinite]' : ''} />

                                {/* Unused Path: Node A -> Node B */}
                                <line x1="30" y1="40" x2="100" y2="65" stroke="#e2e8f0" strokeWidth="2" />

                                {/* Nodes */}
                                <circle cx="30" cy="40" r="8" fill={isFaulty ? '#ef4444' : '#3b82f6'} />
                                <text x="30" y="58" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">Node A</text>

                                <circle cx="100" cy="15" r="6" fill="#94a3b8" />
                                <text x="100" y="28" fontSize="6" textAnchor="middle" fill="#94a3b8">Node C</text>

                                <circle cx="100" cy="65" r="6" fill="#94a3b8" />
                                <text x="100" y="78" fontSize="6" textAnchor="middle" fill="#94a3b8">Node B</text>

                                <circle cx="170" cy="40" r="10" fill="#4f46e5" />
                                <text x="170" y="58" fontSize="8" textAnchor="middle" fill="#4f46e5" fontWeight="bold">Gateway</text>
                            </svg>
                            <style>{`@keyframes dash { to { stroke-dashoffset: -12; } }`}</style>
                        </div>

                        {/* Payload Logs */}
                        <div className="flex-1 flex flex-col gap-1.5">
                            {meshLogs.map((log, idx) => (
                                <div key={log.id} className={`text-[10px] font-mono p-2 rounded-lg border transition-all ${idx === 0 ? 'opacity-100 shadow-sm' : 'opacity-50'} ${log.isAnomaly ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                    <div className="flex justify-between mb-1 opacity-80 font-bold">
                                        <span className={meshState === 'blocked' ? 'text-amber-600' : ''}>{log.path}</span>
                                        <span>{log.time}</span>
                                    </div>
                                    <div className="bg-white/60 px-1.5 py-1 rounded border border-white/40">
                                        {`{kurt:${log.payload.kurt}, state:"${log.payload.state}"}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}