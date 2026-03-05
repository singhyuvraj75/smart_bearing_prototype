import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Globe,
    LayoutDashboard,
    Activity,
    ShieldCheck,
    IndianRupee,
    Leaf,
    AlertTriangle,
    ArrowUpRight,
    Box,
    Cpu,
    Network,
    TrendingUp,
    Search,
    Bell,
    Menu,
    Factory,
    Zap,
    Database
} from "lucide-react";

export default function Layer7Dashboard() {

    const [activeTab, setActiveTab] = useState("fleet");
    const navigate = useNavigate();

    const menuItems = [
        { id: "fleet", label: "Omni-Dashboard", icon: LayoutDashboard, route: "/layer7" },
        { id: "edge", label: "L1: Edge Telemetry", icon: Activity, route: "/layer1" },
        { id: "twin", label: "L2: Digital Twin", icon: Cpu, route: "/layer2" },
        { id: "rag", label: "L3: Knowledge Base", icon: Database, route: "/layer3" },
        { id: "commerce", label: "L4: Auto-Commerce", icon: Box, route: "/layer4" },
        { id: "fed", label: "L5: Federated AI", icon: ShieldCheck, route: "/layer5" },
        { id: "esg", label: "L6: Monetization", icon: TrendingUp, route: "/layer6" }
    ];

    const globalStats = {
        activeAssets: 12402,
        criticalAlerts: 14,
        projectedRevenue: 42500000,
        co2Prevented: 842.5
    };

    const liveInsights = [
        { id: 1, type: "commerce", layer: "L4", time: "Just now", msg: "Auto-Sales Order dispatched to Tata Steel.", status: "success" },
        { id: 2, type: "security", layer: "L5", time: "12m ago", msg: "Federated learning round completed.", status: "security" },
        { id: 3, type: "esg", layer: "L6", time: "45m ago", msg: "800 Tonnes CO2 prevented.", status: "esg" },
        { id: 4, type: "twin", layer: "L2", time: "1h ago", msg: "Predictive Alert issued for refinery asset.", status: "warning" },
        { id: 5, type: "edge", layer: "L1", time: "2h ago", msg: "Edge filter update deployed.", status: "info" }
    ];

    const formatINR = (num) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#090e17] text-slate-400 flex flex-col border-r border-slate-800">

                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Network className="w-6 h-6" />
                    </div>
                    <span className="text-white font-black text-xl">
                        Bearing<span className="text-blue-500">IQ</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">

                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                navigate(item.route);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
              ${activeTab === item.id
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800 hover:text-slate-200"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}

                </nav>

                <div className="p-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500">System Health</p>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-white">Federated Core</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <header className="h-16 bg-white border-b px-8 flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <Menu className="w-5 h-5 text-slate-500" />

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input
                                className="pl-9 pr-4 py-2 border rounded-lg text-sm"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-slate-500" />
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold">
                            NBC
                        </div>
                    </div>

                </header>

                {/* DASHBOARD CONTENT */}
                <div className="p-8 space-y-6">

                    <h1 className="text-2xl font-extrabold">
                        Executive Command Center
                    </h1>

                    {/* KPI */}
                    <div className="grid grid-cols-4 gap-4">

                        <div className="bg-white p-5 rounded-xl border">
                            <Factory className="text-blue-600 mb-2" />
                            <h2 className="text-2xl font-bold">{globalStats.activeAssets}</h2>
                            <p className="text-xs text-slate-500">Connected Assets</p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border">
                            <AlertTriangle className="text-red-600 mb-2" />
                            <h2 className="text-2xl font-bold">{globalStats.criticalAlerts}</h2>
                            <p className="text-xs text-slate-500">Critical Alerts</p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border">
                            <IndianRupee className="text-green-600 mb-2" />
                            <h2 className="text-2xl font-bold">
                                {formatINR(globalStats.projectedRevenue)}
                            </h2>
                            <p className="text-xs text-slate-500">Projected Revenue</p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border">
                            <Leaf className="text-teal-600 mb-2" />
                            <h2 className="text-2xl font-bold">
                                {globalStats.co2Prevented}
                            </h2>
                            <p className="text-xs text-slate-500">CO2 Prevented</p>
                        </div>

                    </div>

                    {/* LIVE FEED */}
                    <div className="bg-white p-6 rounded-xl border">

                        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Platform Intelligence Feed
                        </h2>

                        <div className="space-y-3">

                            {liveInsights.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3 border rounded-lg hover:border-blue-400 transition"
                                >
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>{log.time}</span>
                                        <span>{log.layer}</span>
                                    </div>

                                    <p className="text-sm">{log.msg}</p>

                                    <ArrowUpRight className="w-4 h-4 mt-1 text-slate-400" />
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}