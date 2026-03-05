import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Leaf, Zap, BarChart3, PieChart, ShieldCheck, Factory, TreePine, ArrowUpRight, CheckCircle2, Globe } from 'lucide-react';

export default function App() {
    // Business Drivers
    const [fleetSize, setFleetSize] = useState(1200);
    const [avgBearingPrice, setAvgBearingPrice] = useState(18500);
    const [uptimeGuaranteed, setUptimeGuaranteed] = useState(99.9);

    // Financial State
    const [revenueStats, setRevenueStats] = useState({
        reactiveProfit: 0,
        proactiveProfit: 0,
        profitLift: 0,
        marginExpansion: 0
    });

    // ESG State
    const [esgStats, setEsgStats] = useState({
        energySaved: 0,
        co2Prevented: 0,
        treesEquivalent: 0
    });

    // Business Logic Engine
    useEffect(() => {
        // 1. Financial Calculation
        // Reactive: 15% Margin | Proactive (OaaS): 45% Margin
        const reactiveProfit = (fleetSize * avgBearingPrice) * 0.15;
        const proactiveProfit = (fleetSize * (avgBearingPrice * 1.6)) * 0.45;
        const profitLift = proactiveProfit - reactiveProfit;
        const marginExpansion = 30; // Percentage points

        setRevenueStats({
            reactiveProfit,
            proactiveProfit,
            profitLift,
            marginExpansion
        });

        // 2. ESG Calculation (Physics-Informed)
        // Avoided friction = ~8% motor efficiency gain
        const kwPerMotor = 180;
        const hoursPreventedRunningDegraded = 480; // 20 days
        const energySaved = fleetSize * (kwPerMotor * 0.08 * hoursPreventedRunningDegraded);
        const co2Prevented = energySaved * 0.709; // 0.709 kg CO2 per kWh (India Grid Avg)
        const treesEquivalent = Math.floor(co2Prevented / 21); // 21kg absorbed per tree/year

        setEsgStats({ energySaved, co2Prevented, treesEquivalent });
    }, [fleetSize, avgBearingPrice]);

    const formatINR = (num) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${new Intl.NumberFormat('en-IN').format(num)}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8">

            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Layer 6: Monetization & ESG</h1>
                        <p className="text-sm text-slate-500 font-medium">Outcome-as-a-Service Engine & Sustainability Quantification</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">Platform Status</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" /> Live Revenue Capture
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Simulation Controls */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Factory className="w-4 h-4" /> Fleet Parameters
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Connected Fleet</label>
                                    <span className="text-blue-600 font-bold">{fleetSize}</span>
                                </div>
                                <input type="range" min="100" max="5000" step="100" value={fleetSize} onChange={(e) => setFleetSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">Avg. Part Value</label>
                                    <span className="text-slate-900 font-bold">{formatINR(avgBearingPrice)}</span>
                                </div>
                                <input type="range" min="5000" max="100000" step="5000" value={avgBearingPrice} onChange={(e) => setAvgBearingPrice(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-400" />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-400 uppercase">Service SLA</p>
                                        <p className="text-sm font-bold text-blue-700">{uptimeGuaranteed}% Guaranteed Uptime</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Financial Transformation */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-indigo-600" /> Margin Transformation (NBC Perspective)
                            </h2>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">PROFIT LIFT: {formatINR(revenueStats.profitLift)}</span>
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-center items-center">
                            <div className="w-full max-w-md h-64 flex items-end justify-around gap-8 relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between opacity-50 pointer-events-none">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-slate-100"></div>)}
                                </div>

                                {/* Reactive Bar */}
                                <div className="flex flex-col items-center group w-full max-w-[120px]">
                                    <div className="h-24 w-full bg-slate-200 rounded-t-xl transition-all duration-500 group-hover:bg-slate-300 relative">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-500">{formatINR(revenueStats.reactiveProfit)}</div>
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase">Legacy Product Sale</p>
                                    <p className="text-[10px] text-slate-400 font-medium">(15% Margin)</p>
                                </div>

                                {/* Proactive Bar */}
                                <div className="flex flex-col items-center group w-full max-w-[120px]">
                                    <div className="h-56 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-500 shadow-lg shadow-indigo-100 relative">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-indigo-600">{formatINR(revenueStats.proactiveProfit)}</div>
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/20 px-2 py-1 rounded backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-tighter">
                                            OaaS Shift
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-indigo-800 uppercase">Outcome-as-a-Service</p>
                                    <p className="text-[10px] text-indigo-500 font-medium">(45% Margin)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Margin Expansion</p>
                                    <p className="text-xl font-extrabold text-slate-900">+{revenueStats.marginExpansion}%</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><IndianRupee className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Recurring Revenue</p>
                                    <p className="text-xl font-extrabold text-slate-900">Subscription</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ESG Impact */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-600" /> ESG Quantification Agent
                        </h2>

                        <div className="flex-1 space-y-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
                                <div className="absolute right-[-10px] bottom-[-10px] opacity-10"><Globe className="w-20 h-20 text-emerald-600" /></div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Carbon Prevented</p>
                                <div className="flex items-end gap-1">
                                    <span className="text-3xl font-black text-emerald-900">{(esgStats.co2Prevented / 1000).toFixed(1)}</span>
                                    <span className="text-sm font-bold text-emerald-700 mb-1">Tonnes CO₂</span>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Energy Efficiency Gain</p>
                                <div className="flex items-end gap-1">
                                    <span className="text-2xl font-black text-blue-900">{Math.floor(esgStats.energySaved / 1000)}</span>
                                    <span className="text-sm font-bold text-blue-700 mb-1">MWh Saved</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Climate Impact Equivalence</p>
                                <div className="flex flex-wrap justify-center gap-1.5 opacity-80">
                                    {/* Visual tree indicators */}
                                    {[...Array(12)].map((_, i) => (
                                        <TreePine key={i} className="w-5 h-5 text-emerald-500 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-2xl font-black text-slate-900">{esgStats.treesEquivalent.toLocaleString()}</span>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Trees Absorbing CO₂/Year</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                            Download ESG Audit Report <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}