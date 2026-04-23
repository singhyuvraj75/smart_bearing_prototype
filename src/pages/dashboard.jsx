import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    Database,
    Network,
    Truck,
    ShieldCheck,
    TrendingUp,
    LayoutDashboard,
    ChevronRight,
    Zap,
    ArrowRight,
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();

    const layers = [
        {
            id: "L1",
            title: "Edge Intelligence",
            route: "/layer1",
            description:
                "Capture raw telemetry via Piezo/MEMS sensors and perform embedded FFT processing for early micro-crack detection.",
            icon: Activity,
            color: "text-purple-400",
        },
        {
            id: "L2",
            title: "Predictive Asset Core",
            route: "/layer2",
            description:
                "Physics-Informed Digital Twins and Bayesian Particle Filters for real-time Remaining Useful Life (RUL) estimation.",
            icon: Database,
            color: "text-blue-400",
        },
        {
            id: "L3",
            title: "Knowledge & Reasoning",
            route: "/layer3",
            description:
                "GraphRAG engine for deterministic reasoning across failure modes, ERP logs, service records, and warranty rules.",
            icon: Network,
            color: "text-teal-400",
        },
        {
            id: "L4",
            title: "Commerce Orchestration",
            route: "/layer4",
            description:
                "Autonomous order capture and combinatorial optimization for dynamic reordering and dealer channel allocation.",
            icon: Truck,
            color: "text-emerald-400",
        },
        {
            id: "L5",
            title: "Federated Intelligence",
            route: "/layer5",
            description:
                "Privacy-preserving local training frameworks with zero-knowledge (zk-SNARK) validation for global AI scaling.",
            icon: ShieldCheck,
            color: "text-amber-400",
        },
        {
            id: "L6",
            title: "Revenue Monetization",
            route: "/layer6",
            description:
                "Transition to Outcome-as-a-Service, subscription billing APIs, and physical ESG carbon emission quantification.",
            icon: TrendingUp,
            color: "text-rose-400",
        },
    ];

    return (
        <div className="min-h-screen bg-[#090e17] flex flex-col items-center justify-center py-16 px-4 font-sans relative overflow-hidden text-slate-300">

            {/* Background Glow */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center z-10 max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Zap className="w-3 h-3" /> Predictive Aftermarket Platform
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-5">
                    Bearing<span className="text-blue-500">IQ</span>
                </h1>

                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    A Predictive Sales & Autonomous Commerce Platform for
                    <strong className="text-slate-200"> Industrial Bearings</strong>.
                    <br />
                    Select a layer to begin the autonomous aftermarket lifecycle.
                </p>
            </div>

            {/* Layers Grid */}
            <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl w-full">
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        onClick={() => navigate(layer.route)}
                        className="group cursor-pointer bg-[#0f172a]/60 backdrop-blur-md border border-slate-800 hover:border-slate-600 hover:bg-[#1e293b]/60 transition-all duration-300 rounded-3xl p-7 flex flex-col"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <layer.icon className={`w-6 h-6 ${layer.color}`} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">
                            {layer.id}: {layer.title}
                        </h2>

                        <p className="text-sm text-slate-400 leading-relaxed flex-1">
                            {layer.description}
                        </p>

                        <div className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-blue-400">
                            Launch Layer <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Layer 7 Banner */}
            <div className="z-10 max-w-6xl w-full mt-5">
                <div
                    onClick={() => navigate("/layer7")}
                    className="group cursor-pointer bg-gradient-to-r from-[#0f172a]/80 to-[#1e293b]/40 backdrop-blur-md border border-slate-800 hover:border-slate-600 transition-all duration-300 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/50"></div>

                    <div className="flex items-start md:items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                            <LayoutDashboard className="w-7 h-7" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">
                                L7: Interface Layer (Omni-Dashboard)
                            </h2>
                            <p className="text-sm text-slate-400 max-w-2xl">
                                The Master Command Center. Aggregate fleet demand heatmaps,
                                dynamic revenue forecasting, and dealer execution logs.
                            </p>
                        </div>
                    </div>

                    <div className="w-14 h-14 rounded-full bg-[#ff5a1f] hover:bg-[#ff6a33] text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </div>
            </div>

        </div>
    );
}
