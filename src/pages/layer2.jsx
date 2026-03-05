import React, { useState, useEffect } from 'react';
import { Database, LineChart, Activity, RefreshCcw, Layers, Network, Cpu, Zap, Thermometer, Waves } from 'lucide-react';

export default function App() {
    const [simulationMode, setSimulationMode] = useState('normal');
    const [day, setDay] = useState(0);
    const [healthIndex, setHealthIndex] = useState(100.0);

    // Advanced State: Twin vs Real Telemetry
    const [modelHistory, setModelHistory] = useState([{ day: 0, health: 100 }]);
    const [telemetryScatter, setTelemetryScatter] = useState([]);

    // Predictive Stats
    const [rul, setRul] = useState(180);
    const [stdDev, setStdDev] = useState(35);
    const [isCritical, setIsCritical] = useState(false);

    // Physics Parameters
    const [physicsParams, setPhysicsParams] = useState({
        wearCoefficient: 0.05,
        thermalStress: 1.0,
        vibrationImpact: 1.0
    });

    // Main Simulation Loop
    useEffect(() => {
        if (healthIndex <= 0) return;

        const interval = setInterval(() => {
            setDay(d => d + 1);

            setHealthIndex(prevHealth => {
                // Normal wear is slow, fatigue wear (BPFO) drops rapidly
                const degradationRate = simulationMode === 'normal' ? 0.35 : 2.8;
                const newHealth = Math.max(0, prevHealth - degradationRate);

                // Update Physics Parameters for UI
                setPhysicsParams({
                    wearCoefficient: simulationMode === 'normal' ? 0.05 : 0.85,
                    thermalStress: simulationMode === 'normal' ? 1.0 + (Math.random() * 0.1) : 3.5 + (Math.random() * 0.5),
                    vibrationImpact: simulationMode === 'normal' ? 1.0 + (Math.random() * 0.2) : 5.8 + (Math.random() * 1.2)
                });

                // Model Line (The Twin's idealized calculation)
                setModelHistory(hist => [...hist, { day: day + 1, health: newHealth }].slice(-80));

                // Real Telemetry (Noisy data points coming from Layer 1 Edge)
                const noise = simulationMode === 'normal' ? (Math.random() * 8 - 4) : (Math.random() * 4 - 2);
                const telemetryPoint = Math.max(0, Math.min(100, newHealth + noise));

                setTelemetryScatter(scatter => [...scatter, { day: day + 1, health: telemetryPoint }].slice(-40));

                // Deterministic RUL
                const currentRate = simulationMode === 'normal' ? 0.35 : 2.95;
                const deterministicRUL = newHealth / currentRate;

                // Bayesian Uncertainty (Shrinks as failure approaches)
                const currentStdDev = Math.max(2.0, deterministicRUL * 0.18);

                setRul(deterministicRUL);
                setStdDev(currentStdDev);

                const criticalThreshold = deterministicRUL < 28;
                setIsCritical(criticalThreshold);

                return newHealth;
            });
        }, 250); // 250ms = 1 simulated day

        return () => clearInterval(interval);
    }, [day, healthIndex, simulationMode]);

    const resetSimulation = () => {
        setDay(0);
        setHealthIndex(100.0);
        setModelHistory([{ day: 0, health: 100 }]);
        setTelemetryScatter([]);
        setSimulationMode('normal');
        setRul(180);
        setStdDev(35);
        setIsCritical(false);
    };

    // --- SVG Generators ---
    const generateModelPath = () => {
        if (modelHistory.length === 0) return "";
        const width = 500;
        const height = 150;
        const maxDays = Math.max(80, modelHistory[modelHistory.length - 1].day);
        const minDay = Math.max(0, maxDays - 80);

        return modelHistory.filter(h => h.day >= minDay).reduce((path, pt, idx) => {
            const x = ((pt.day - minDay) / 80) * width;
            const y = height - (pt.health / 100 * height);
            return `${path} ${idx === 0 ? 'M' : 'L'} ${x},${y}`;
        }, "");
    };

    const getScatterPoints = () => {
        const width = 500;
        const height = 150;
        const maxDays = Math.max(80, modelHistory.length > 0 ? modelHistory[modelHistory.length - 1].day : 0);
        const minDay = Math.max(0, maxDays - 80);

        return telemetryScatter.filter(p => p.day >= minDay).map((pt, i) => {
            const x = ((pt.day - minDay) / 80) * width;
            const y = height - (pt.health / 100 * height);
            const opacity = 0.2 + (i / telemetryScatter.length) * 0.8;
            return { x, y, opacity };
        });
    };

    const generateBellCurve = (mean, sigma) => {
        const width = 500;
        const height = 150;
        const points = [];
        const maxDays = 200;

        const calcPDF = (x, m, s) => (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));
        const maxY = calcPDF(mean, mean, sigma);

        for (let x = 0; x <= maxDays; x += 2) {
            const pdf = calcPDF(x, mean, sigma);
            const scaledX = (x / maxDays) * width;
            const scaledY = height - (pdf / maxY * height * 0.95);
            points.push(`${scaledX},${scaledY}`);
        }

        return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
    };

    const confidenceWindow = [Math.max(0, rul - 1.645 * stdDev), rul + 1.645 * stdDev];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-100">

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/20">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Layer 2: Predictive Intelligence Core
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Physics-Informed Twins & Real-to-Sim Calibration (Particle Filters)</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
                    <button
                        onClick={resetSimulation}
                        className="px-3 py-1.5 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 font-bold text-xs bg-slate-100 rounded-md"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" /> Restart
                    </button>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                    <span className="text-sm font-bold text-slate-500 pl-2 hidden sm:block">Telemetry Feed:</span>

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setSimulationMode('normal')}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${simulationMode === 'normal' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Nominal Telemetry
                        </button>
                        <button
                            onClick={() => setSimulationMode('fatigue')}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${simulationMode === 'fatigue' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Activity className="w-3.5 h-3.5" /> Feed BPFO Anomaly
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Visualizations */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Real-to-Sim Calibration (P-F Curve + Scatter) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <LineChart className={`w-5 h-5 ${isCritical ? 'text-red-600' : 'text-blue-600'}`} /> Real-to-Sim Calibration (P-F Curve)
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Particle Filter continuously aligning Digital Twin with Edge Telemetry.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Raw Telemetry</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase"><div className="w-4 h-1 bg-blue-600"></div> Twin Model</span>
                            </div>
                        </div>

                        <div className="relative h-56 bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            <div className="absolute w-full h-px bg-red-300 border-t border-dashed border-red-400 top-[80%] z-0 flex items-center">
                                <span className="text-[10px] text-red-500 font-bold ml-2 -mt-4 bg-white/80 px-1 rounded">Functional Failure Threshold (20%)</span>
                            </div>

                            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10 relative">
                                {getScatterPoints().map((pt, i) => (
                                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#64748b" opacity={pt.opacity} />
                                ))}

                                <path
                                    d={generateModelPath()}
                                    fill="none"
                                    stroke={isCritical ? "#ef4444" : "#2563eb"}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-colors duration-300"
                                    style={{ filter: isCritical ? 'drop-shadow(0px 3px 6px rgba(239,68,68,0.3))' : 'drop-shadow(0px 3px 6px rgba(37,99,235,0.3))' }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* 2. Probabilistic Forecast & Supply Chain Zones */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Database className="w-5 h-5 text-indigo-600" /> Probabilistic Demand Engine
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Bayesian Inference mapping failure risk against procurement lead times.</p>
                            </div>
                        </div>

                        <div className="relative h-56 bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                            <div className="absolute inset-y-4 left-4 right-4 flex opacity-20 z-0">
                                <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                                <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
                                <div className="h-full bg-slate-300" style={{ width: '60%' }}></div>
                            </div>

                            <div className="absolute top-2 right-4 z-10 flex gap-3 text-[10px] font-bold uppercase text-slate-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> SLA Breach Risk</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> Optimal Fulfillment Window</span>
                            </div>

                            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10 relative mt-2">
                                <path
                                    d={generateBellCurve(rul, stdDev)}
                                    fill={isCritical ? "rgba(239, 68, 68, 0.4)" : "rgba(79, 70, 229, 0.3)"}
                                    stroke={isCritical ? "#ef4444" : "#4f46e5"}
                                    strokeWidth="2.5"
                                    className="transition-all duration-300"
                                />
                                <line
                                    x1={(rul / 200) * 500} y1="0"
                                    x2={(rul / 200) * 500} y2="150"
                                    stroke={isCritical ? "#991b1b" : "#312e81"}
                                    strokeWidth="2" strokeDasharray="5,5"
                                />
                            </svg>

                            <div className="absolute bottom-4 w-full px-4 left-0 z-20">
                                <div className="h-2.5 bg-slate-200/50 rounded-full relative overflow-hidden backdrop-blur-sm border border-slate-300">
                                    <div
                                        className={`absolute h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-indigo-600'}`}
                                        style={{
                                            left: `${(confidenceWindow[0] / 200) * 100}%`,
                                            width: `${((confidenceWindow[1] - confidenceWindow[0]) / 200) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold px-2 uppercase">
                            <span>0 Days (Failure)</span>
                            <span>100 Days</span>
                            <span>200 Days</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Real-time Stats & Physics Twin State */}
                <div className="space-y-6">

                    {/* Digital Twin State */}
                    <div className={`rounded-2xl border shadow-sm p-5 transition-all duration-500 ${isCritical ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Cpu className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-blue-500'}`} /> Asset Intelligence Core
                        </h2>

                        <div className="space-y-3">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">Health Index</span>
                                <span className={`text-2xl font-extrabold ${healthIndex < 20 ? 'text-red-600' : healthIndex < 50 ? 'text-orange-500' : 'text-blue-600'}`}>
                                    {healthIndex.toFixed(1)}%
                                </span>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">Failure Mean (μ)</span>
                                <span className="font-mono text-lg font-bold text-indigo-600">
                                    {Math.max(0, rul).toFixed(1)} d
                                </span>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                                <span className="text-sm text-slate-600 font-medium">90% Confidence Window</span>
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                    <span className="font-mono font-bold text-slate-700">{Math.max(0, confidenceWindow[0]).toFixed(1)}</span>
                                    <span className="text-xs text-slate-400 font-medium tracking-widest">➔</span>
                                    <span className="font-mono font-bold text-slate-700">{confidenceWindow[1].toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physics-Informed Parameters (Replaces GraphRAG in Layer 2) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-teal-600" /> PINN Telemetry State
                                </h2>
                                <p className="text-[10px] text-slate-400 mt-1">Physics-Informed Neural Net Parameters</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-1">
                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                                    <span className="flex items-center gap-1.5"><Waves className="w-3.5 h-3.5 text-slate-400" /> Vibration Stress</span>
                                    <span className="font-mono">{physicsParams.vibrationImpact.toFixed(2)}x</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(100, (physicsParams.vibrationImpact / 8) * 100)}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                                    <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-slate-400" /> Thermal Friction</span>
                                    <span className="font-mono">{physicsParams.thermalStress.toFixed(2)}x</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${isCritical ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(100, (physicsParams.thermalStress / 5) * 100)}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center mt-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Computed Wear Coeff.</span>
                                <span className={`text-sm font-black font-mono ${isCritical ? 'text-red-600' : 'text-slate-700'}`}>α = {physicsParams.wearCoefficient.toFixed(3)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Predictive Sales Trigger to output to Layer 4 */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${isCritical ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-600/30 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        <Network className={`w-6 h-6 shrink-0 ${isCritical ? 'text-indigo-200' : 'text-slate-300'}`} />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide">Output to L4</p>
                            <p className={`text-sm font-semibold mt-0.5 ${isCritical ? 'text-white' : 'text-slate-500'}`}>
                                {isCritical ? 'Predictive Signal Dispatched ➔' : 'Standby'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}