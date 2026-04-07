import React, { useState } from "react";
import Dashboard from "./Dashboard";
import {
  Terminal, Database, Cpu, Target, Activity, ShieldCheck
} from "lucide-react";

export default function App() {
  const [activeLayer, setActiveLayer] = useState(null);

  const layerMap = {
    1: { id: "L1", title: "Semantic Intent", icon: Terminal, color: "text-purple-400" },
    2: { id: "L2", title: "Knowledge Helix", icon: Database, color: "text-blue-400" },
    3: { id: "L3", title: "Generative Design", icon: Cpu, color: "text-cyan-400" },
    4: { id: "L4", title: "Calibration Matrix", icon: Target, color: "text-green-400" },
    5: { id: "L5", title: "Co-Simulation", icon: Activity, color: "text-yellow-400" },
    6: { id: "L6", title: "Compliance Sentinel", icon: ShieldCheck, color: "text-red-400" },
  };

  // 👉 When a layer is clicked
  const handleNavigate = (layerId) => {
    setActiveLayer(layerMap[layerId]);
  };

  // 👉 Back to dashboard
  if (activeLayer) {
    const Icon = activeLayer.icon;

    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-8">
        
        {/* Back Button */}
        <button
          onClick={() => setActiveLayer(null)}
          className="mb-6 text-slate-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Layer View */}
        <div className="flex flex-col items-center justify-center h-[70vh] border border-dashed border-slate-600 rounded-xl">
          <Icon className={`w-16 h-16 mb-4 ${activeLayer.color}`} />
          <h1 className="text-3xl font-bold mb-2">
            {activeLayer.id}: {activeLayer.title}
          </h1>
          <p className="text-slate-400 text-center max-w-lg">
            This is your detailed layer view. You can now build full workflow, diagrams, simulation, etc.
          </p>
        </div>
      </div>
    );
  }

  // 👉 Default Dashboard
  return <Dashboard onNavigate={handleNavigate} />;
}
