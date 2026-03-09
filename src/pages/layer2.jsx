import React, { useState, useEffect } from 'react';
import { Database, LineChart, Activity, RefreshCcw, Layers, Network, Cpu, Zap, Thermometer, Waves, ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';

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

    // --- Premium SVG Generators ---
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

    const generateModelAreaPath = () => {
        const linePath = generateModelPath();
        if (!linePath) return "";
        const width = 500;
        const height = 150;
        // Close the path to create a fillable area
        return `${linePath} L ${width},${height} L 0,${height} Z`;
    };

    const getScatterPoints = () => {
        const width = 500;
        const height = 150;
        const maxDays = Math.max(80, modelHistory.length > 0 ? modelHistory[modelHistory.length - 1].day : 0);
        const minDay = Math.max(0, maxDays - 80);

        return telemetryScatter.filter(p => p.day >= minDay).map((pt, i) => {
            const x = ((pt.day - minDay) / 80) * width;
            const y = height - (pt.health / 100 * height);
            const opacity = 0.3 + (i / telemetryScatter.length) * 0.7; // Fade older points
            return { x, y, opacity };
        });
    };

    const calcPDF = (x, m, s) => (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));

    const generateBellCurve = (mean, sigma) => {
        const width = 500;
        const height = 150;
        const points = [];
        const maxDays = 200;
        const maxY = calcPDF(mean, mean, sigma);

        for (let x = 0; x <= maxDays; x += 2) {
            const pdf = calcPDF(x, mean, sigma);
            const scaledX = (x / maxDays) * width;
            const scaledY = height - (pdf / maxY * height * 0.95);
            points.push(`${scaledX},${scaledY}`);
        }
        return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
    };

    const generateConfidenceArea = (mean, sigma, minX, maxX) => {
        const width = 500;
        const height = 150;
        const points = [];
        const maxDays = 200;
        const maxY = calcPDF(mean, mean, sigma);

        // Map X bounds to pixel bounds
        const startX = Math.max(0, minX);
        const endX = Math.min(maxDays, maxX);

        for (let x = startX; x <= endX; x += 1) {
            const pdf = calcPDF(x, mean, sigma);
            const scaledX = (x / maxDays) * width;
            const scaledY = height - (pdf / maxY * height * 0.95);
            points.push(`${scaledX},${scaledY}`);
        }

        if (points.length === 0) return "";
        const firstX = (startX / maxDays) * width;
        const lastX = (endX / maxDays) * width;
        return `M ${firstX},${height} L ${points.join(' L ')} L ${lastX},${height} Z`;
    };

    const confidenceWindow = [Math.max(0, rul - 1.645 * stdDev), rul + 1.645 * stdDev];

    return (
        <div className={`min-h-screen font-sans p-4 md:p-6 lg:p-8 transition-colors duration-700 ${isCritical ? 'bg-red-50/60 text-slate-900 selection:bg-red-200' : 'bg-slate-50 text-slate-800 selection:bg-indigo-100'}`}>

            {/* Top Navigation / Back Button */}
            <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
                <button 
                    onClick={() => alert("This would route back to the L7 OmniDashboard (Home Portal)")}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                {isCritical && (
                    <div className="flex items-center gap-2 bg-red-100/80 text-red-700 px-4 py-2 rounded-xl border border-red-200 shadow-sm animate-pulse">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-xs font-black tracking-widest uppercase">System Critical</span>
                    </div>
                )}
            </div>

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-2xl shadow-xl transition-all duration-500 ${isCritical ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-600/40' : 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-600/30'}`}>
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            Predictive Intelligence Core
                        </h1>
                        <p className={`text-sm font-medium mt-1 ${isCritical ? 'text-red-600/80' : 'text-slate-500'}`}>
                            Physics-Informed Twins & Real-to-Sim Calibration (Particle Filters)
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-md w-full lg:w-auto">
                    <button
                        onClick={resetSimulation}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 font-bold text-xs bg-slate-100/50 hover:bg-slate-100 rounded-xl"
                    >
                        <RefreshCcw className="w-3.5 h-3.5" /> Restart
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Telemetry Injection:</span>

                    <div className="flex items-center bg-slate-100/50 rounded-xl p-1 border border-slate-200/50">
                        <button
                            onClick={() => setSimulationMode('normal')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${simulationMode === 'normal' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Nominal
                        </button>
                        <button
                            onClick={() => setSimulationMode('fatigue')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${simulationMode === 'fatigue' ? 'bg-red-50 text-red-600 shadow-sm border border-red-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Zap className="w-3.5 h-3.5" /> BPFO Fatigue
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* LEFT COLUMN: Visualizations (Spans 8 cols) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. Real-to-Sim Calibration (P-F Curve + Scatter) */}
                    <div className={`bg-white rounded-3xl border shadow-lg overflow-hidden relative p-6 transition-all duration-500 ${isCritical ? 'border-red-300 shadow-red-900/10' : 'border-slate-200/80 shadow-slate-200/50'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold flex items-center gap-2">
                                    <LineChart className={`w-6 h-6 ${isCritical ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} /> Real-to-Sim Calibration 
                                    <span className="text-slate-400 font-medium text-lg">| P-F Curve</span>
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                                    Particle Filter syncing Digital Twin with Edge Telemetry stream.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-slate-400/80"></div> Raw Edge Data</span>
                                <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-600' : 'text-indigo-600'}`}><div className={`w-5 h-1.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-indigo-500'}`}></div> Predicted Path</span>
                            </div>
                        </div>

                        <div className="relative h-64 bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 overflow-hidden">
                            {/* Grid Background */}
                            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            {/* Failure Threshold Line */}
                            <div className="absolute w-full h-px bg-red-400 border-t border-dashed border-red-500 top-[80%] z-0 flex items-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                <span className="text-[10px] text-white font-bold ml-4 -mt-5 bg-red-500 px-2 py-1 rounded-md shadow-sm">Functional Failure Threshold (20%)</span>
                            </div>

                            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10 relative">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={isCritical ? "#ef4444" : "#6366f1"} stopOpacity="0.2" />
                                        <stop offset="100%" stopColor={isCritical ? "#ef4444" : "#6366f1"} stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Area Fill */}
                                <path 
                                    d={generateModelAreaPath()} 
                                    fill="url(#areaGradient)" 
                                    className="transition-colors duration-500" 
                                />

                                {/* Scatter Points */}
                                {getScatterPoints().map((pt, i) => (
                                    <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={isCritical ? "#f87171" : "#64748b"} opacity={pt.opacity} />
                                ))}

                                {/* Model Line */}
                                <path
                                    d={generateModelPath()}
                                    fill="none"
                                    stroke={isCritical ? "#ef4444" : "#4f46e5"}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-colors duration-500"
                                    style={{ filter: isCritical ? 'drop-shadow(0px 4px 8px rgba(239,68,68,0.4))' : 'drop-shadow(0px 4px 8px rgba(79,70,229,0.3))' }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* 2. Probabilistic Forecast & Supply Chain Zones */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden relative p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold flex items-center gap-2">
                                    <Database className={`w-6 h-6 ${isCritical ? 'text-red-500' : 'text-teal-500'}`} /> Probabilistic Demand Forecast
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">Mapping Bayesian failure probability against supply chain lead times.</p>
                            </div>
                        </div>

                        <div className="relative h-64 bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-inner overflow-hidden">
                            {/* Procurement Background Zones (Dark Mode styles) */}
                            <div className="absolute inset-y-0 left-0 right-0 flex opacity-20 z-0">
                                <div className="h-full bg-red-500 border-r border-red-400" style={{ width: '15%' }}></div>
                                <div className="h-full bg-emerald-500 border-r border-emerald-400" style={{ width: '25%' }}></div>
                                <div className="h-full bg-slate-500" style={{ width: '60%' }}></div>
                            </div>

                            {/* Zone Labels */}
                            <div className="absolute top-4 right-6 z-10 flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> SLA Breach</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Optimal Delivery</span>
                            </div>

                            {/* SVG Chart */}
                            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10 relative mt-2">
                                <defs>
                                    <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={isCritical ? "#ef4444" : "#14b8a6"} stopOpacity="0.6" />
                                        <stop offset="100%" stopColor={isCritical ? "#ef4444" : "#14b8a6"} stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Base Bell Curve Area */}
                                <path 
                                    d={generateBellCurve(rul, stdDev)} 
                                    fill="rgba(255,255,255,0.02)" 
                                    className="transition-all duration-500"
                                />

                                {/* 90% Confidence Interval Area (Highlighted) */}
                                <path 
                                    d={generateConfidenceArea(rul, stdDev, confidenceWindow[0], confidenceWindow[1])} 
                                    fill="url(#bellGradient)" 
                                    className="transition-all duration-500"
                                />

                                {/* Bell Curve Line */}
                                <path
                                    d={generateBellCurve(rul, stdDev)}
                                    fill="none"
                                    stroke={isCritical ? "#f87171" : "#2dd4bf"}
                                    strokeWidth="2.5"
                                    className="transition-all duration-500"
                                    style={{ filter: isCritical ? 'drop-shadow(0px 0px 8px rgba(239,68,68,0.6))' : 'drop-shadow(0px 0px 8px rgba(20,184,166,0.5))' }}
                                />
                                
                                {/* Mean Line */}
                                <line
                                    x1={(rul / 200) * 500} y1="0"
                                    x2={(rul / 200) * 500} y2="150"
                                    stroke={isCritical ? "#fca5a5" : "#fff"}
                                    strokeWidth="2" strokeDasharray="4,4"
                                    className="transition-all duration-500 opacity-80"
                                />
                            </svg>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-[11px] text-slate-400 mt-4 font-black px-4 uppercase tracking-widest">
                            <span className={isCritical ? "text-red-500" : ""}>0 Days (Failure)</span>
                            <span>100 Days</span>
                            <span>200 Days</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Real-time HUD (Spans 4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Digital Twin State HUD */}
                    <div className={`rounded-3xl border shadow-lg p-6 transition-all duration-500 relative overflow-hidden ${isCritical ? 'bg-slate-900 border-red-500/50 shadow-red-900/20 text-white' : 'bg-white border-slate-200/80 shadow-slate-200/50'}`}>
                        {/* Critical Glare Effect */}
                        {isCritical && <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/30 blur-[50px] rounded-full pointer-events-none"></div>}

                        <h2 className={`text-xs font-black mb-6 uppercase tracking-widest flex items-center gap-2 ${isCritical ? 'text-red-400' : 'text-slate-500'}`}>
                            <Cpu className={`w-4 h-4 ${isCritical ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} /> HUD: Core Analytics
                        </h2>

                        <div className="space-y-4">
                            {/* Health Index Card */}
                            <div className={`p-5 rounded-2xl border flex flex-col gap-1 transition-colors ${isCritical ? 'bg-slate-800/80 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-slate-400' : 'text-slate-500'}`}>Current Health Index</span>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-black tracking-tighter ${healthIndex < 20 ? 'text-red-500' : healthIndex < 50 ? 'text-amber-500' : 'text-indigo-600'}`}>
                                        {healthIndex.toFixed(1)}<span className="text-2xl">%</span>
                                    </span>
                                </div>
                            </div>

                            {/* RUL Card */}
                            <div className={`p-5 rounded-2xl border flex flex-col gap-1 transition-colors ${isCritical ? 'bg-red-950/30 border-red-900/50' : 'bg-slate-50 border-slate-100'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-400' : 'text-slate-500'}`}>Predicted Failure (Mean RUL)</span>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-black font-mono tracking-tighter ${isCritical ? 'text-red-400' : 'text-slate-800'}`}>
                                        {Math.max(0, rul).toFixed(1)}
                                    </span>
                                    <span className={`text-lg font-bold ${isCritical ? 'text-red-500/70' : 'text-slate-400'}`}>days</span>
                                </div>
                            </div>

                            {/* Confidence Window Card */}
                            <div className={`p-5 rounded-2xl border flex flex-col gap-2 transition-colors ${isCritical ? 'bg-slate-800/80 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-slate-400' : 'text-slate-500'}`}>90% Confidence Window</span>
                                <div className={`flex justify-between items-center p-3 rounded-xl bg-black/5 border ${isCritical ? 'border-white/5' : 'border-slate-200/50'}`}>
                                    <span className={`font-mono text-lg font-bold ${isCritical ? 'text-white' : 'text-slate-700'}`}>{Math.max(0, confidenceWindow[0]).toFixed(1)}</span>
                                    <span className={`text-xs font-black tracking-widest ${isCritical ? 'text-red-500' : 'text-slate-400'}`}>➔</span>
                                    <span className={`font-mono text-lg font-bold ${isCritical ? 'text-white' : 'text-slate-700'}`}>{confidenceWindow[1].toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Physics-Informed Parameters */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 flex flex-col relative overflow-hidden">
                        {/* Decorative Background grid */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}></div>
                        
                        <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-teal-500" /> PINN Telemetry
                                </h2>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">Physics-Informed Neural Parameters</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-1">
                            {/* Vibration Track */}
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-bold tracking-wide">
                                    <span className="flex items-center gap-1.5 text-slate-600"><Waves className="w-3.5 h-3.5 text-teal-500" /> Vibration Stress</span>
                                    <span className={`font-mono ${physicsParams.vibrationImpact > 2.0 ? 'text-red-600' : 'text-slate-700'}`}>{physicsParams.vibrationImpact.toFixed(2)}x</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                                    {/* Segmented look */}
                                    <div className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-gradient-to-r from-teal-400 to-teal-500'}`} style={{ width: `${Math.min(100, (physicsParams.vibrationImpact / 8) * 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Thermal Track */}
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-bold tracking-wide">
                                    <span className="flex items-center gap-1.5 text-slate-600"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Thermal Friction</span>
                                    <span className={`font-mono ${physicsParams.thermalStress > 1.5 ? 'text-red-600' : 'text-slate-700'}`}>{physicsParams.thermalStress.toFixed(2)}x</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`} style={{ width: `${Math.min(100, (physicsParams.thermalStress / 5) * 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Wear Coefficient Badge */}
                            <div className={`p-4 rounded-xl border flex justify-between items-center mt-2 transition-all duration-500 ${isCritical ? 'bg-red-50 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-800' : 'text-slate-500'}`}>Computed Wear Coeff (α)</span>
                                <span className={`text-base font-black font-mono bg-white px-2 py-1 rounded-lg border ${isCritical ? 'text-red-600 border-red-100 shadow-sm' : 'text-slate-700 border-slate-200'}`}>
                                    {physicsParams.wearCoefficient.toFixed(3)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Predictive Sales Trigger to output to Layer 4 */}
                    <div className={`p-1 rounded-2xl transition-all duration-500 ${isCritical ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_25px_rgba(99,102,241,0.4)]' : 'bg-slate-200'}`}>
                        <div className={`p-5 rounded-xl flex items-center gap-5 transition-colors duration-500 h-full w-full ${isCritical ? 'bg-slate-900 border-none' : 'bg-slate-50 border border-slate-200'}`}>
                            <div className={`p-3 rounded-xl ${isCritical ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white border border-slate-200 text-slate-400 shadow-sm'}`}>
                                <Network className="w-7 h-7 shrink-0" />
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-indigo-400' : 'text-slate-400'}`}>Output to L4 Engine</p>
                                <p className={`text-sm font-bold mt-1 tracking-wide ${isCritical ? 'text-white' : 'text-slate-500'}`}>
                                    {isCritical ? 'Predictive Signal Dispatched ➔' : 'System Standby / Nominal'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
