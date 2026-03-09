import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Activity, Cpu, Database, Box, ShieldCheck, 
    TrendingUp, Network, Search, Bell, Menu, Factory, AlertTriangle, 
    IndianRupee, Leaf, Zap, ArrowUpRight, CheckCircle2, Globe, MapPin,
    Server, ArrowLeft, BarChart3, Clock
} from 'lucide-react';

export default function Layer7Dashboard() {
    const [activeTab, setActiveTab] = useState('fleet');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Master Navigation Mapping
    const menuItems = [
        { id: 'fleet', label: 'Omni-Dashboard', icon: LayoutDashboard, layer: 'L7' },
        { id: 'edge', label: 'Edge Telemetry', icon: Activity, layer: 'L1' },
        { id: 'twin', label: 'Predictive Twin', icon: Cpu, layer: 'L2' },
        { id: 'rag', label: 'Knowledge Graph', icon: Database, layer: 'L3' },
        { id: 'commerce', label: 'Auto-Commerce', icon: Box, layer: 'L4' },
        { id: 'fed', label: 'Federated AI', icon: ShieldCheck, layer: 'L5' },
        { id: 'esg', label: 'Monetization & ESG', icon: TrendingUp, layer: 'L6' }
    ];

    // Executive KPIs
    const globalStats = {
        activeAssets: 12402,
        criticalAlerts: 14,
        projectedRevenue: 42500000,
        co2Prevented: 842.5
    };

    // Consolidated Event Feed from all Layers
    const liveInsights = [
        { id: 1, layer: 'L4', type: 'commerce', title: 'Autonomous Sale Executed', msg: 'Order SO-NBC-8821 routed to Jaipur HQ. 55% Margin captured.', time: 'Just now', icon: Box, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 2, layer: 'L5', type: 'security', title: 'Global Model Synced', msg: 'Round #42 complete. zk-SNARK validation successful across 3 edge nodes.', time: '2m ago', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
        { id: 3, layer: 'L2', type: 'warning', title: 'Predictive Alert: BPFO', msg: 'Tata Steel [NBC_001] RUL dropped to 28 days. Triggering GraphRAG context.', time: '12m ago', icon: Cpu, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
        { id: 4, layer: 'L3', type: 'rag', title: 'Context Synthesized', msg: 'Gold SLA active. Required BOM: [NBC_6205, Grease_X1].', time: '12m ago', icon: Database, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200' },
        { id: 5, layer: 'L6', type: 'esg', title: 'ESG Milestone Reached', msg: '800 Tonnes of CO₂ prevented this quarter via early friction detection.', time: '1h ago', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { id: 6, layer: 'L1', type: 'info', title: 'Edge Filter Deployed', msg: 'New Band-Pass coefficients deployed to 1,200 nodes via Wirepas mesh.', time: '3h ago', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' }
    ];

    const formatINR = (num) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${new Intl.NumberFormat('en-IN').format(num)}`;
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-blue-200">
            
            {/* DARK MODE SIDEBAR */}
            <aside className="w-72 bg-[#0a0f1c] flex flex-col border-r border-slate-800 shadow-2xl z-20 shrink-0">
                <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Network className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-black tracking-tight text-2xl">
                            Bearing<span className="text-blue-500">IQ</span>
                        </span>
                    </div>
                </div>

                <div className="p-4 pt-6">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-slate-700/50 hover:border-slate-600"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Launchpad
                    </button>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 mt-2">Architecture Layers</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (item.id !== 'fleet') {
                                    alert(`Routing to ${item.layer}... (In full app, this redirects)`);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group
                                ${activeTab === item.id 
                                    ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]" 
                                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"}`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} />
                            <div className="flex flex-col items-start">
                                <span>{item.label}</span>
                                {item.layer !== 'L7' && (
                                    <span className={`text-[9px] uppercase tracking-widest ${activeTab === item.id ? 'text-blue-200' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                        {item.layer} Module
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>

                {/* System Health Module */}
                <div className="p-6 border-t border-slate-800/80 bg-[#0f172a]/50">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Core Status</p>
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
                                <span>Edge Sync</span>
                                <span className="text-white font-mono">100%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
                                <span>ZK Validator</span>
                                <span className="text-white font-mono">99.8%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full w-[99.8%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-6">
                        <Menu className="w-5 h-5 text-slate-400 cursor-pointer lg:hidden" />
                        <div className="relative group hidden sm:block">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                className="pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                                placeholder="Search asset ID, location, or anomaly..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-bold text-slate-600 font-mono tracking-wide">{currentTime}</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-extrabold text-slate-800">NBC Exec</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white shadow-md border-2 border-white">
                                NE
                            </div>
                        </div>
                    </div>
                </header>

                {/* DASHBOARD SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            Executive Command Center
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Aggregated fleet intelligence, autonomous commerce execution, and global revenue tracking.
                        </p>
                    </div>

                    {/* KPI STRIP */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {/* Connected Assets */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Factory className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +124</span>
                            </div>
                            <div className="relative z-10 mt-4">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{globalStats.activeAssets.toLocaleString()}</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Connected Fleet</p>
                            </div>
                        </div>

                        {/* Critical Alerts */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 bg-red-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 animate-pulse">Action Req</span>
                            </div>
                            <div className="relative z-10 mt-4">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{globalStats.criticalAlerts}</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Predicted Failures</p>
                            </div>
                        </div>

                        {/* Projected Revenue */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 bg-indigo-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                    <IndianRupee className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">OaaS Model</span>
                            </div>
                            <div className="relative z-10 mt-4">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{formatINR(globalStats.projectedRevenue)}</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Projected Revenue</p>
                            </div>
                        </div>

                        {/* CO2 Prevented */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 bg-emerald-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest">Scope 2</span>
                            </div>
                            <div className="relative z-10 mt-4 flex items-baseline gap-1">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{globalStats.co2Prevented}</h2>
                                <span className="text-sm font-bold text-slate-500">T</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 relative z-10">CO₂ Prevented</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* INDIA FLEET HEATMAP (Spans 2 columns) */}
                        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-sm">
                                        <Globe className="w-5 h-5 text-blue-600" /> Regional Deployment Matrix
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Live telemetry status across industrial sectors.</p>
                                </div>
                                <div className="flex gap-4 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div> Nominal</span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div> Critical Risk</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 relative flex items-center justify-center min-h-[400px] bg-[#f8fafc] overflow-hidden">
                                {/* Topographic background pattern */}
                                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0f172a 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                                
                                {/* Abstract Map SVG */}
                                <svg viewBox="0 0 500 550" className="h-full w-auto drop-shadow-2xl relative z-10 max-h-[400px] py-4">
                                    <path d="M150,50 L200,30 L300,30 L375,100 L400,187 L475,250 L437,375 L350,500 L250,537 L125,500 L62,375 L37,250 L100,125 Z" 
                                          fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" strokeLinejoin="round" className="drop-shadow-lg" />
                                    
                                    {/* Connectivity lines connecting hubs to HQ */}
                                    <g stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" opacity="0.5">
                                        <line x1="200" y1="200" x2="112" y2="350" />
                                        <line x1="200" y1="200" x2="375" y2="287" />
                                        <line x1="200" y1="200" x2="225" y2="450" />
                                    </g>

                                    {/* Jaipur Hub (HQ) */}
                                    <g className="cursor-pointer group">
                                        <circle cx="200" cy="200" r="14" fill="#3b82f6" opacity="0.2" className="animate-ping" />
                                        <circle cx="200" cy="200" r="7" fill="#2563eb" stroke="#fff" strokeWidth="2" />
                                        <text x="215" y="204" className="text-[12px] font-extrabold fill-blue-800">Jaipur HQ</text>
                                    </g>

                                    {/* Mumbai / Reliance Refinery (Critical) */}
                                    <g className="cursor-pointer group">
                                        <circle cx="112" cy="350" r="16" fill="#ef4444" opacity="0.3" className="animate-pulse" />
                                        <circle cx="112" cy="350" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                                        <rect x="20" y="325" width="80" height="20" fill="#fef2f2" rx="4" stroke="#fecaca" opacity="0" className="group-hover:opacity-100 transition-opacity" />
                                        <text x="60" y="339" className="text-[10px] font-bold fill-red-700 opacity-0 group-hover:opacity-100 transition-opacity text-center" textAnchor="middle">2 Critical</text>
                                    </g>

                                    {/* Jamshedpur / Tata Steel (Nominal) */}
                                    <g className="cursor-pointer group">
                                        <circle cx="375" cy="287" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                                        <text x="390" y="291" className="text-[10px] font-bold fill-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">Jamshedpur: Stable</text>
                                    </g>
                                    
                                    {/* Chennai / Adani (Nominal) */}
                                    <g className="cursor-pointer group">
                                        <circle cx="225" cy="450" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                                    </g>
                                </svg>

                                {/* Floating Data Card */}
                                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-700 max-w-[240px] z-20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sector Growth</p>
                                    </div>
                                    <p className="text-xs font-medium leading-relaxed text-slate-200">
                                        Cement & Mining sectors shifted <span className="text-emerald-400 font-bold px-1">+40%</span> to Proactive OaaS contracts this quarter.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* LIVE INTELLIGENCE FEED (Consolidating L1-L6) */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-sm">
                                        <Zap className="w-5 h-5 text-amber-500" /> Platform Event Feed
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Real-time autonomous operations.</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30 custom-scrollbar">
                                {liveInsights.map((log) => (
                                    <div key={log.id} className={`p-4 rounded-2xl border bg-white hover:shadow-md transition-all group relative overflow-hidden ${log.border}`}>
                                        
                                        {/* Subtle left border highlight */}
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${log.bg.replace('50', '400')}`}></div>

                                        <div className="flex justify-between items-start mb-2 pl-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${log.bg} ${log.color}`}>
                                                    <log.icon className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-extrabold text-slate-800 tracking-tight">{log.title}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.time}</span>
                                        </div>
                                        
                                        <p className="text-[11px] font-medium text-slate-600 leading-relaxed pl-2 pr-4">{log.msg}</p>
                                        
                                        <div className="mt-3 pl-2 flex items-center justify-between">
                                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-widest border border-slate-200">
                                                Source: {log.layer}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
            `}</style>
        </div>
    );
}
