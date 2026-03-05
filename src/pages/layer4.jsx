import React, { useState, useEffect } from 'react';
import { ShoppingCart, Truck, Box, CheckCircle, AlertTriangle, Cpu, Network, Clock, IndianRupee, FileText, ArrowRight, Activity, TrendingUp } from 'lucide-react';

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
        { id: 'NBC_DL_01', name: 'Authorized Local Dealer', leadTime: 2, margin: 25, fulfillmentCost: 150 },
        { id: 'NBC_HUB_REG', name: 'NBC Regional Warehouse', leadTime: 12, margin: 40, fulfillmentCost: 80 },
        { id: 'NBC_HQ_MFG', name: 'NBC Jaipur Main Plant', leadTime: 24, margin: 55, fulfillmentCost: 40 },
    ];

    // The Combinatorial Optimization Logic (Maximizing NBC's Margin while meeting Customer Deadline)
    useEffect(() => {
        setOrderStatus('evaluating');

        const timer = setTimeout(() => {
            if (customerStock > 0) {
                setSelectedHub(null);
                setOrderStatus('local_stock');
                return;
            }

            // SLA Buffer: NBC promises to deliver the part 2 days before the predicted breakdown
            const customerDeadline = daysUntilFailure - 2;

            let bestChoice = null;
            let highestMargin = -Infinity;

            nbcNetwork.forEach(node => {
                // Constraint 1: NBC must fulfill the order before the customer's machine breaks
                if (node.leadTime <= customerDeadline) {
                    // Objective: Maximize NBC's profit margin (central hubs are cheaper to ship from if we have time)
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
                setOrderStatus('failed'); // NBC cannot meet the deadline with standard shipping
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [daysUntilFailure, customerStock]);

    // SVG Graph Generator for Margin vs Lead Time
    const renderOptimizationGraph = () => {
        const maxLeadTime = 30;
        const maxMargin = 60;
        const minMargin = 10;
        const width = 500;
        const height = 180;
        const customerDeadline = Math.max(0, daysUntilFailure - 2);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 relative">
                {/* Customer Deadline Constraint Line (Red) */}
                <line
                    x1={(customerDeadline / maxLeadTime) * width} y1="0"
                    x2={(customerDeadline / maxLeadTime) * width} y2={height}
                    stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"
                    className="transition-all duration-300"
                />
                <text
                    x={(customerDeadline / maxLeadTime) * width + 5}
                    y="15"
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="bold"
                    className="transition-all duration-300"
                >
                    Customer Deadline ({customerDeadline}d)
                </text>

                {nbcNetwork.map((node, idx) => {
                    const x = (node.leadTime / maxLeadTime) * width;
                    // Invert Y axis because higher margin is better (closer to top)
                    const y = height - ((node.margin - minMargin) / (maxMargin - minMargin)) * height;
                    const isSelected = selectedHub?.id === node.id;
                    const isTooLate = node.leadTime > customerDeadline;

                    return (
                        <g key={node.id} className="transition-all duration-500">
                            <line x1={x} y1={y} x2={x} y2={height} stroke={isSelected ? "#2563eb" : "#cbd5e1"} strokeWidth={isSelected ? "2" : "1"} strokeDasharray="3,3" />

                            <circle
                                cx={x} cy={y} r={isSelected ? "8" : "6"}
                                fill={isSelected ? "#2563eb" : isTooLate ? "#f87171" : "#94a3b8"}
                                className={isSelected ? "animate-pulse" : ""}
                                stroke="#fff" strokeWidth="2"
                            />

                            <text
                                x={x} y={y - 15}
                                textAnchor="middle"
                                fill={isSelected ? "#1e40af" : isTooLate ? "#dc2626" : "#64748b"}
                                fontSize="11" fontWeight="bold"
                            >
                                {node.margin}% Margin
                            </text>
                            <text
                                x={x} y={height + 15}
                                textAnchor="middle"
                                fill="#64748b"
                                fontSize="10"
                            >
                                {node.leadTime}d
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-100">

            {/* Header Bar */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
                        <Network className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Layer 4: Commerce Orchestration
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Predictive Sales Execution & NBC Fulfillment Routing</p>
                    </div>
                </div>

                {/* Interactive Slider Input from Layer 3 */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-sm shadow-blue-100 w-full lg:w-96">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-blue-500" /> Customer Asset Status
                        </span>
                        <span className={`text-sm font-bold ${daysUntilFailure < 10 ? 'text-red-600' : 'text-blue-600'}`}>
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
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                        <span>Critical (3d)</span>
                        <span>Optimal (15d)</span>
                        <span>Early Warning (35d)</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Inventory & Optimization Logic */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Dynamic Reorder Engine (DRO) - Customer Inventory Check */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-center">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-shrink-0 flex items-center gap-4">
                            <Box className="w-10 h-10 text-slate-400" />
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Customer Onsite Spares</p>
                                <p className="text-xl font-extrabold text-slate-700">Part: NBC_BRG_6205</p>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center gap-4 w-full">
                            <ArrowRight className="w-6 h-6 text-slate-300 hidden sm:block" />
                            <div className={`flex-1 p-4 rounded-xl border flex items-center justify-between transition-colors ${customerStock === 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                                <div>
                                    <p className="text-sm font-bold text-slate-600">Customer Stock: <span className={customerStock === 0 ? 'text-indigo-600' : 'text-slate-600'}>{customerStock} Units</span></p>
                                    <p className={`text-xs mt-1 font-medium ${customerStock === 0 ? 'text-indigo-500' : 'text-slate-500'}`}>
                                        {customerStock === 0 ? 'Stockout at client site. Initiating predictive sale.' : 'Customer has spares. No sale required.'}
                                    </p>
                                </div>
                                {customerStock === 0 ? <ShoppingCart className="w-6 h-6 text-indigo-500 animate-pulse" /> : <CheckCircle className="w-6 h-6 text-slate-400" />}
                            </div>
                        </div>
                    </div>

                    {/* Combinatorial Optimization Graph */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-blue-600" /> NBC Fulfillment Routing
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Maximizing NBC margins while strictly meeting the customer's failure deadline.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase"><div className="w-3 h-3 rounded-full bg-slate-300 border border-white"></div> Valid Route</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase"><div className="w-3 h-3 rounded-full bg-red-400 border border-white"></div> SLA Breach Risk</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase"><div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div> Dispatched</span>
                            </div>
                        </div>

                        <div className="relative h-60 bg-slate-50/50 rounded-xl border border-slate-100 p-4 pb-8">
                            {/* Y-Axis Label */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                NBC Profit Margin (%)
                            </div>

                            {renderOptimizationGraph()}

                            {/* X-Axis Label */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Shipping Lead Time (Days)
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Execution & PO Generation */}
                <div className="space-y-6">

                    {/* Dealer Network Evaluation Feed */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all">
                        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Network className="w-4 h-4 text-blue-500" /> Fulfillment Node Selection
                        </h2>

                        <div className="space-y-3">
                            {nbcNetwork.map((node) => {
                                const requiredTime = Math.max(0, daysUntilFailure - 2);
                                const isSelected = selectedHub?.id === node.id;
                                const isTooLate = node.leadTime > requiredTime;

                                return (
                                    <div key={node.id} className={`p-3.5 rounded-xl border transition-all duration-300 ${isSelected ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-100' : 'bg-white border-slate-100 opacity-70'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{node.name}</span>
                                            {isSelected && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ALLOCATED</span>}
                                            {isTooLate && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">TOO LATE</span>}
                                        </div>

                                        <div className="flex justify-between text-xs font-medium text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Transit: {node.leadTime}d</span>
                                            <span className={`flex items-center gap-1 font-bold ${isSelected ? 'text-emerald-600' : ''}`}><TrendingUp className="w-3.5 h-3.5" /> Margin: {node.margin}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Autonomous Execution Receipt */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 text-slate-300 relative overflow-hidden">
                        {/* Glossy top edge for tech feel */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                        <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400" /> Automated Sales Order (ERP)
                        </h2>

                        {orderStatus === 'evaluating' && (
                            <div className="h-40 flex items-center justify-center text-slate-500 flex-col gap-3">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs font-mono">Routing order for max margin...</p>
                            </div>
                        )}

                        {orderStatus === 'failed' && (
                            <div className="h-40 flex items-center justify-center text-red-400 flex-col gap-3 bg-red-950/20 rounded-xl border border-red-900/50">
                                <AlertTriangle className="w-8 h-8" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-red-300">Expedited Shipping Required</p>
                                    <p className="text-xs mt-1 text-red-400/80">Standard routing cannot meet the {daysUntilFailure - 2} day deadline. Triggering emergency air-freight from NBC HQ.</p>
                                </div>
                            </div>
                        )}

                        {orderStatus === 'dispatched' && selectedHub && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-3 mb-3">
                                    <span className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Predictive Sale Captured
                                    </span>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">{salesOrderNumber}</span>
                                </div>

                                <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400">
                                    <p><span className="text-slate-500">{"{"}</span></p>
                                    <p className="pl-4"><span className="text-blue-300">"customer_site"</span>: <span className="text-emerald-300">"Tata_Steel_Plant_B"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">"part_sku"</span>: <span className="text-emerald-300">"NBC_BRG_6205"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">"fulfillment_node"</span>: <span className="text-emerald-300">"{selectedHub.id}"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">"nbc_margin"</span>: <span className="text-emerald-300">"{selectedHub.margin}%"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">"trigger_type"</span>: <span className="text-emerald-300">"AI_PREDICTIVE_FAILURE"</span></p>
                                    <p><span className="text-slate-500">{"}"}</span></p>
                                </div>

                                <div className="mt-4 flex items-center gap-3 bg-blue-900/20 border border-blue-800/50 p-3 rounded-xl">
                                    <Truck className="w-6 h-6 text-blue-400 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-blue-300/80 font-bold uppercase tracking-wider">Customer Promise (SLA)</p>
                                        <p className="text-sm font-semibold text-blue-100">Bearing arrives {daysUntilFailure - selectedHub.leadTime} days before asset failure.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}