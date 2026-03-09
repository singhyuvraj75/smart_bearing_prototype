import React, { useState, useEffect } from 'react';
import { ShoppingCart, Truck, Box, CheckCircle, AlertTriangle, Cpu, Network, Clock, FileText, ArrowRight, Activity, TrendingUp, ArrowLeft, PackageX, Server, CheckCircle2 } from 'lucide-react';

export default function App() {
    // Input from Layer 3 (Predicted Remaining Useful Life of the Customer's Asset)
    const [daysUntilFailure, setDaysUntilFailure] = useState(28);
    const [customerStock, setCustomerStock] = useState(0);

    // Optimization State
    const [selectedHub, setSelectedHub] = useState(null);
    const [orderStatus, setOrderStatus] = useState('evaluating');
    const [salesOrderNumber, setSalesOrderNumber] = useState('');

    // NBC's Fulfillment Network (Authorized Dealers & Hubs)
    const nbcNetwork = [
        { id: 'NBC_DL_01', name: 'Authorized Local Dealer', type: 'Tier 3', leadTime: 2, margin: 25, fulfillmentCost: 150 },
        { id: 'NBC_HUB_REG', name: 'NBC Regional Warehouse', type: 'Tier 2', leadTime: 12, margin: 40, fulfillmentCost: 80 },
        { id: 'NBC_HQ_MFG', name: 'NBC Jaipur Main Plant', type: 'Tier 1', leadTime: 24, margin: 55, fulfillmentCost: 40 },
    ];

    // Combinatorial Optimization Logic (Max Margin + Meet Deadline)
    useEffect(() => {
        setOrderStatus('evaluating');

        const timer = setTimeout(() => {
            if (customerStock > 0) {
                setSelectedHub(null);
                setOrderStatus('local_stock');
                return;
            }

            // SLA Buffer: Must arrive 2 days before failure
            const customerDeadline = daysUntilFailure - 2;

            let bestChoice = null;
            let highestMargin = -Infinity;

            nbcNetwork.forEach(node => {
                if (node.leadTime <= customerDeadline) {
                    if (node.margin > highestMargin) {
                        highestMargin = node.margin;
                        bestChoice = node;
                    }
                }
            });

            setSelectedHub(bestChoice);

            if (bestChoice) {
                setOrderStatus('dispatched');
                setSalesOrderNumber(`SO-NBC-${Math.floor(10000 + Math.random() * 90000)}`);
            } else {
                setOrderStatus('failed'); 
            }
        }, 500); // Visual evaluation delay

        return () => clearTimeout(timer);
    }, [daysUntilFailure, customerStock]);

    // Premium Combo-Chart SVG (Matches Python Matplotlib layout)
    const renderOptimizationGraph = () => {
        const maxLeadTime = 35;
        const maxMargin = 60;
        const minMargin = 10;
        const width = 600;
        const height = 220;
        const customerDeadline = Math.max(0, daysUntilFailure - 2);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 relative">
                {/* Y-Axis Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio) => (
                    <line key={ratio} x1="30" y1={height * ratio} x2={width - 30} y2={height * ratio} stroke="#f1f5f9" strokeWidth="2" />
                ))}

                {/* Customer Deadline Constraint Line (Red) */}
                <line
                    x1="30" y1={(1 - customerDeadline / maxLeadTime) * height}
                    x2={width - 30} y2={(1 - customerDeadline / maxLeadTime) * height}
                    stroke="#ef4444" strokeWidth="2" strokeDasharray="6,6"
                    className="transition-all duration-500"
                />
                <text
                    x={width - 30}
                    y={(1 - customerDeadline / maxLeadTime) * height - 8}
                    fill="#ef4444"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="end"
                    className="transition-all duration-500 tracking-wider uppercase"
                >
                    SLA Deadline ({customerDeadline}d)
                </text>

                {/* Nodes & Bars */}
                {nbcNetwork.map((node, idx) => {
                    const x = 120 + idx * 180;
                    const leadTimeY = height - (node.leadTime / maxLeadTime) * height;
                    const marginY = height - ((node.margin - minMargin) / (maxMargin - minMargin)) * height;
                    
                    const isSelected = selectedHub?.id === node.id;
                    const isTooLate = node.leadTime > customerDeadline;
                    const barWidth = 60;

                    return (
                        <g key={node.id} className="transition-all duration-500">
                            {/* Lead Time Bar */}
                            <rect 
                                x={x - barWidth/2} 
                                y={leadTimeY} 
                                width={barWidth} 
                                height={(node.leadTime / maxLeadTime) * height} 
                                fill={isTooLate ? "#fca5a5" : isSelected ? "#93c5fd" : "#e2e8f0"} 
                                rx="4"
                                className="transition-all duration-500"
                            />
                            
                            <text x={x} y={leadTimeY - 10} textAnchor="middle" fill={isTooLate ? "#dc2626" : isSelected ? "#2563eb" : "#64748b"} fontSize="12" fontWeight="800">
                                {node.leadTime}d
                            </text>

                            {/* X-Axis Dealer Label */}
                            <text x={x} y={height + 25} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="800" className="uppercase tracking-wider">
                                {node.name}
                            </text>
                            <text x={x} y={height + 40} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" className="uppercase tracking-widest">
                                [{node.type}]
                            </text>
                        </g>
                    );
                })}

                {/* Margin Line Path (Connecting Nodes) */}
                <path 
                    d={nbcNetwork.reduce((path, node, idx) => {
                        const x = 120 + idx * 180;
                        const y = height - ((node.margin - minMargin) / (maxMargin - minMargin)) * height;
                        return `${path} ${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                    }, "")}
                    fill="none" stroke="#6366f1" strokeWidth="3" className="transition-all duration-500"
                />

                {/* Margin Nodes */}
                {nbcNetwork.map((node, idx) => {
                    const x = 120 + idx * 180;
                    const marginY = height - ((node.margin - minMargin) / (maxMargin - minMargin)) * height;
                    const isSelected = selectedHub?.id === node.id;

                    return (
                        <g key={`margin-${node.id}`} className="transition-all duration-500">
                            <circle
                                cx={x} cy={marginY} r={isSelected ? "8" : "5"}
                                fill={isSelected ? "#4f46e5" : "#fff"}
                                stroke="#4f46e5" strokeWidth={isSelected ? "0" : "3"}
                                className={isSelected ? "animate-pulse" : ""}
                            />
                            <text
                                x={x} y={marginY - 15}
                                textAnchor="middle"
                                fill="#4f46e5"
                                fontSize="12" fontWeight="900"
                            >
                                {node.margin}%
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-100">
            
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
                    <div className="p-3.5 rounded-2xl shadow-lg bg-blue-600 text-white">
                        <Network className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900">
                            Commerce Orchestration
                        </h1>
                        <p className="text-sm font-medium mt-1 text-slate-500">
                            Predictive Sales Execution & Combinatorial Fulfillment Routing
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

                {/* LEFT COLUMN: Controls & Graph (Spans 8 cols) */}
                <div className="xl:col-span-8 space-y-8">
                    
                    {/* Top Control Panel: Asset Status & Spares */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* RUL Slider Input */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" /> AI Predictive Status
                                </span>
                                <span className={`text-sm font-black px-3 py-1 rounded-lg border ${daysUntilFailure < 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                    Failure in {daysUntilFailure} Days
                                </span>
                            </div>
                            
                            <input
                                type="range"
                                min="3" max="35"
                                value={daysUntilFailure}
                                onChange={(e) => setDaysUntilFailure(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            
                            <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                                <span className="text-red-500">Critical (3d)</span>
                                <span>Optimal (15d)</span>
                                <span>Early (35d)</span>
                            </div>
                        </div>

                        {/* Customer Inventory Check */}
                        <div className={`p-6 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center transition-colors duration-500 ${customerStock === 0 ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-1 ${customerStock === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                        <Box className="w-4 h-4" /> Onsite Spares (Customer)
                                    </h3>
                                    <p className="text-lg font-extrabold text-slate-800 tracking-tight">Part: NBC_6205</p>
                                </div>
                                <div className={`p-2.5 rounded-xl border ${customerStock === 0 ? 'bg-red-100 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                    {customerStock === 0 ? <PackageX className="w-6 h-6 animate-pulse" /> : <CheckCircle className="w-6 h-6" />}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200/50">
                                <p className="text-sm font-bold text-slate-500">Stock Level: <span className={customerStock === 0 ? 'text-red-600 text-lg ml-1' : 'text-slate-800 text-lg ml-1'}>{customerStock} Units</span></p>
                                {customerStock === 0 && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-100 px-2 py-1 rounded-md border border-red-200 shadow-sm animate-pulse">
                                        Triggering Auto-Sale
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Combinatorial Optimization Graph */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                        
                        {/* Graph Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-blue-600" /> Combinatorial Routing Engine
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Maximizing NBC margins while strictly satisfying the customer SLA deadline.</p>
                            </div>
                            <div className="flex items-center gap-4 hidden sm:flex bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-3 h-3 rounded-md bg-blue-200"></div> Valid Route</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="w-3 h-3 rounded-md bg-red-300"></div> SLA Risk</span>
                            </div>
                        </div>

                        {/* Interactive Canvas Area */}
                        <div className="relative h-[300px] p-6 pb-12 flex items-center justify-center">
                            {/* Y-Axis Label (Left) */}
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-400 uppercase tracking-widest z-20">
                                Delivery Lead Time (Days)
                            </div>

                            {/* Y-Axis Label (Right) */}
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black text-indigo-400 uppercase tracking-widest z-20">
                                NBC Profit Margin (%)
                            </div>

                            {renderOptimizationGraph()}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Execution & PO Generation (Spans 4 cols) */}
                <div className="xl:col-span-4 space-y-6 flex flex-col">

                    {/* Dealer Network Evaluation Feed */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Network className="w-4 h-4 text-slate-400" /> Fulfillment Evaluation
                        </h2>

                        <div className="space-y-4">
                            {nbcNetwork.map((node) => {
                                const requiredTime = Math.max(0, daysUntilFailure - 2);
                                const isSelected = selectedHub?.id === node.id;
                                const isTooLate = node.leadTime > requiredTime;

                                return (
                                    <div key={node.id} className={`p-4 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden
                                        ${isSelected ? 'bg-blue-50/50 border-blue-400 shadow-md' : 
                                          isTooLate ? 'bg-slate-50 border-slate-100 opacity-60 grayscale' : 
                                          'bg-white border-slate-200'}`}>
                                        
                                        {isSelected && <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>}

                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className={`text-sm font-extrabold tracking-tight ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{node.name}</span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{node.type}</p>
                                            </div>
                                            {isSelected && <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3 h-3" /> ALLOCATED</span>}
                                            {isTooLate && <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-1 rounded-md border border-red-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> TOO LATE</span>}
                                        </div>

                                        <div className="flex justify-between text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Transit: {node.leadTime}d</span>
                                            <span className={`flex items-center gap-1.5 ${isSelected ? 'text-indigo-600' : ''}`}><TrendingUp className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} /> Margin: {node.margin}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Autonomous Execution Receipt Terminal (Light, clean modern code block) */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 relative overflow-hidden flex-1 flex flex-col">
                        {/* Subtle top edge highlight */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-1000 ${orderStatus === 'dispatched' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>

                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Server className={`w-4 h-4 ${orderStatus === 'dispatched' ? 'text-emerald-500' : 'text-slate-400'}`} /> Automated ERP Receipt
                        </h2>

                        <div className="flex-1 flex flex-col justify-center">
                            {orderStatus === 'evaluating' && (
                                <div className="flex flex-col items-center justify-center text-slate-400 gap-4 my-8">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs font-black tracking-widest uppercase animate-pulse">Routing Optimization...</p>
                                </div>
                            )}

                            {orderStatus === 'failed' && (
                                <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 rounded-2xl border border-red-200 p-6 my-4 shadow-inner">
                                    <AlertTriangle className="w-10 h-10 mb-3 text-red-500" />
                                    <p className="text-sm font-extrabold tracking-wide text-center">Expedited Shipping Required</p>
                                    <p className="text-[11px] mt-2 text-red-700/80 text-center font-medium leading-relaxed">Standard routing cannot meet the {daysUntilFailure - 2} day SLA deadline. Triggering emergency air-freight from HQ.</p>
                                </div>
                            )}

                            {orderStatus === 'dispatched' && selectedHub && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                                        <span className="text-emerald-600 text-sm font-extrabold flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" /> Predictive Sale Captured
                                        </span>
                                        <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{salesOrderNumber}</span>
                                    </div>

                                    {/* Clean Light-Mode Code Block */}
                                    <div className="space-y-2 font-mono text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-600 shadow-inner">
                                        <p>{"{"}</p>
                                        <p className="pl-4"><span className="text-slate-400">"customer"</span>: <span className="text-indigo-600 font-bold">"Tata_Steel_Plant_B"</span>,</p>
                                        <p className="pl-4"><span className="text-slate-400">"sku"</span>: <span className="text-indigo-600 font-bold">"NBC_BRG_6205"</span>,</p>
                                        <p className="pl-4"><span className="text-slate-400">"routing"</span>: <span className="text-indigo-600 font-bold">"{selectedHub.id}"</span>,</p>
                                        <p className="pl-4"><span className="text-slate-400">"margin_captured"</span>: <span className="text-emerald-600 font-bold">"{selectedHub.margin}%"</span>,</p>
                                        <p className="pl-4"><span className="text-slate-400">"trigger_event"</span>: <span className="text-purple-600 font-bold">"L2_PREDICTIVE_FAILURE"</span></p>
                                        <p>{"}"}</p>
                                    </div>

                                    {/* SLA Promise Badge */}
                                    <div className="mt-5 flex items-center gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl relative overflow-hidden">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-emerald-100">
                                            <Truck className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-0.5">SLA Fulfillment Promise</p>
                                            <p className="text-xs font-bold text-slate-700">Asset arrives <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md mx-0.5 border border-emerald-200">{daysUntilFailure - selectedHub.leadTime} days</span> before functional breakdown.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
