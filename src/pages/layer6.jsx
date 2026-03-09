import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Leaf, Zap, BarChart3, ShieldCheck, Factory, TreePine, ArrowUpRight, CheckCircle2, Globe, ArrowLeft, ArrowUp, Wind } from 'lucide-react';

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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Premium SVG Bar Chart Generator
  const renderMarginChart = () => {
    const width = 500;
    const height = 280;
    const maxMargin = Math.max(revenueStats.proactiveProfit * 1.2, 1000000); 
    
    const reactiveHeight = (revenueStats.reactiveProfit / maxMargin) * height;
    const proactiveHeight = (revenueStats.proactiveProfit / maxMargin) * height;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 relative drop-shadow-xl">
        <defs>
          <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="barEmerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glowG" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
          <line key={ratio} x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="#e2e8f0" strokeDasharray="6,6" strokeWidth="1.5" />
        ))}
        
        {/* Reactive Bar (Red - old way) */}
        <g className="transition-all duration-700">
          <rect x="80" y={height - reactiveHeight} width="120" height={reactiveHeight} fill="url(#barRed)" rx="8" />
          <text x="140" y={height - reactiveHeight - 15} textAnchor="middle" fill="#dc2626" fontSize="16" fontWeight="900" className="tracking-tight">
            {formatINR(revenueStats.reactiveProfit)}
          </text>
        </g>

        {/* Proactive Bar (Emerald - new way) */}
        <g className="transition-all duration-700">
          <rect x="300" y={height - proactiveHeight} width="120" height={proactiveHeight} fill="url(#barEmerald)" rx="8" filter="url(#glowG)" />
          <text x="360" y={height - proactiveHeight - 15} textAnchor="middle" fill="#059669" fontSize="18" fontWeight="900" className="tracking-tight">
            {formatINR(revenueStats.proactiveProfit)}
          </text>
          
          {/* Animated Trend Arrow */}
          <path 
            d={`M 200 ${height - reactiveHeight} Q 250 ${height - proactiveHeight - 40} 290 ${height - proactiveHeight}`} 
            fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_1s_linear_infinite]" 
          />
          <polygon points="290,280 280,265 295,265" fill="#10b981" transform={`translate(0, ${height - proactiveHeight - 275})`} />
          
          {/* Profit Lift Bubble */}
          <rect x="200" y={height - proactiveHeight - 50} width="90" height="30" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" rx="15" />
          <text x="245" y={height - proactiveHeight - 30} textAnchor="middle" fill="#059669" fontSize="12" fontWeight="900">
            +{revenueStats.profitIncreasePct || 280}%
          </text>
        </g>

        <style>{`@keyframes dash { to { stroke-dashoffset: -12; } }`}</style>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-emerald-200">
      
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
          <div className="p-3.5 rounded-2xl shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30 border border-emerald-400/20">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900">
              Monetization & ESG
            </h1>
            <p className="text-sm font-medium mt-1 text-slate-500">
              Outcome-as-a-Service Engine & Sustainability Quantification
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> Live Revenue Capture
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT: Simulation Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Factory className="w-4 h-4 text-blue-500" /> Fleet Parameters
            </h2>
            
            <div className="space-y-8">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Connected Assets</label>
                  <span className="text-sm font-extrabold text-blue-600">{formatNumber(fleetSize)}</span>
                </div>
                <input type="range" min="100" max="5000" step="100" value={fleetSize} onChange={(e) => setFleetSize(parseInt(e.target.value))} 
                       className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Avg. Part Value</label>
                  <span className="text-sm font-extrabold text-slate-700">{formatINR(avgBearingPrice)}</span>
                </div>
                <input type="range" min="5000" max="100000" step="5000" value={avgBearingPrice} onChange={(e) => setAvgBearingPrice(parseInt(e.target.value))}
                       className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/50 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Service SLA</p>
                    <p className="text-sm font-extrabold text-indigo-800 tracking-tight">{uptimeGuaranteed}% Guaranteed Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Financial Transformation (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 h-full flex flex-col relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-4 relative z-10">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                  <BarChart3 className="w-5 h-5 text-emerald-500" /> Margin Transformation
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Shift from Reactive Spares to Proactive Subscriptions.</p>
              </div>
            </div>

            <div className="flex-1 relative mt-6 w-full flex items-center justify-center min-h-[300px] z-10">
              <div className="w-full max-w-lg h-full">
                 {renderMarginChart()}
              </div>
              
              {/* Custom X-Axis Labels */}
              <div className="absolute bottom-0 w-full flex justify-between px-10 text-sm font-bold">
                <div className="text-center w-32 -ml-2">
                  <p className="text-slate-700 tracking-wide">Reactive Model</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Break-Fix Sales</p>
                </div>
                <div className="text-center w-32 mr-2">
                  <p className="text-emerald-700 tracking-wide">Proactive OaaS</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Predictive Uptime</p>
                </div>
              </div>
            </div>

            {/* Bottom KPI row */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-5 relative z-10">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10"><ArrowUp className="w-16 h-16 text-emerald-600" /></div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Margin Expansion</p>
                <div className="flex items-center gap-2">
                    <p className="text-3xl font-black text-emerald-900">+{revenueStats.marginExpansion}<span className="text-xl">%</span></p>
                </div>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10"><IndianRupee className="w-16 h-16 text-indigo-600" /></div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Net Profit Lift</p>
                <p className="text-xl font-black text-indigo-900 mt-1">{formatINR(revenueStats.profitLift)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ESG Impact (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/20 rounded-3xl border border-emerald-200/60 shadow-[0_8px_30px_rgba(16,185,129,0.1)] p-6 flex flex-col h-full relative overflow-hidden">
            
            {/* Background flourish */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-[60px] pointer-events-none"></div>

            <h2 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-emerald-200/50 pb-3 relative z-10">
              <Leaf className="w-4 h-4 text-emerald-600" /> ESG Quantification Agent
            </h2>
            
            <div className="flex-1 space-y-5 relative z-10">
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white/60 p-4 rounded-xl border border-white/80 shadow-sm">
                By detecting early fatigue and replacing the bearing <strong className="text-emerald-700">20 days prior to failure</strong>, we prevent high-friction motor drag.
              </p>

              <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                <div className="absolute right-2 bottom-2 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500"><Globe className="w-24 h-24 text-emerald-600" /></div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5" /> Scope 2 CO₂ Prevented
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-emerald-900 tracking-tighter">{(esgStats.co2Prevented / 1000).toFixed(1)}</span>
                  <span className="text-sm font-extrabold text-emerald-700">Tonnes</span>
                </div>
              </div>

              <div className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Frictional Energy Saved
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-blue-900 tracking-tighter">{formatNumber(Math.floor(esgStats.energySaved / 1000))}</span>
                  <span className="text-sm font-extrabold text-blue-700">MWh</span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200/50 mt-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">Climate Impact Equivalence</p>
                <div className="flex flex-wrap justify-center gap-2 opacity-90">
                  {/* Visual tree indicators */}
                  {[...Array(12)].map((_, i) => (
                    <TreePine key={i} className="w-6 h-6 text-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <div className="mt-4 text-center bg-emerald-100/50 py-2 rounded-xl border border-emerald-200/50">
                  <span className="text-xl font-black text-emerald-900">{esgStats.treesEquivalent.toLocaleString()}</span>
                  <span className="text-xs font-bold text-emerald-700 ml-2">Trees Planted / Year</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 relative z-10 hover:-translate-y-0.5">
              Generate ESG Audit Report <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
