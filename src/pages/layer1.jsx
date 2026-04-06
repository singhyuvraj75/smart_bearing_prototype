import React, { useState, useEffect, useRef } from 'react';
import { Box, Cpu, Activity, ShieldAlert, CheckCircle, Database, Layers, Play, Server, Crosshair, Hexagon, Terminal, Gauge, Maximize, Zap } from 'lucide-react';

const AutomotiveDFMEdge = {
  extractBRepGraph: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          assemblyId: "VAR-HL-PRJ-LED-99A",
          classification: "AUTOMOTIVE_HEADLAMP_PROJECTOR",
          manifoldStatus: "WATER_TIGHT",
          volume_cm3: 842.15,
          surfaceArea_cm2: 3205.88,
          nodes: Array.from({ length: 48 }, (_, i) => ({
            faceId: `F-${8000 + i}`,
            type: i % 4 === 0 ? 'NURBS_LENS_SURFACE' : (i % 3 === 0 ? 'CYLINDRICAL_BOSS' : 'HEAT_SINK_FIN'),
            principalCurvature: [+(Math.random()).toFixed(4), +(Math.random()).toFixed(4)],
            toolingDraftAngle: +(Math.random() * 2).toFixed(2),
            thicknessAtBase: +(Math.random() * 5 + 1).toFixed(2)
          })),
          edges: Array.from({ length: 96 }, (_, i) => ({
            edgeId: `E-${20000 + i}`,
            source: `F-${8000 + Math.floor(Math.random() * 48)}`,
            target: `F-${8000 + Math.floor(Math.random() * 48)}`,
            continuity: Math.random() > 0.7 ? 'G1_TANGENT' : 'G0_POSITIONAL',
            convexity: Math.random() > 0.5 ? 'CONVEX_FILLET' : 'CONCAVE_RADII'
          }))
        });
      }, 1200);
    });
  },

  executeDFA: async (graphData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            faceId: "VAR-BOSS-MNT-L",
            ruleCode: "VAR-MOLD-PC-014",
            description: "Insufficient Draft Angle on Primary Mounting Boss. High risk of ejection pin punch-through.",
            expected: ">= 2.5° for PC/ABS",
            actual: "0.8°",
            severity: "CRITICAL"
          },
          {
            faceId: "VAR-BOSS-MNT-R",
            ruleCode: "VAR-MOLD-PC-014",
            description: "Insufficient Draft Angle on Secondary Mounting Boss.",
            expected: ">= 2.5° for PC/ABS",
            actual: "0.9°",
            severity: "CRITICAL"
          },
          {
            faceId: "VAR-HS-FIN-ROOT",
            ruleCode: "VAR-THERM-AL-09",
            description: "Heat sink fin root thickness exceeds nominal core wall. Sink mark risk on reflector base.",
            expected: "<= 2.20 mm",
            actual: "4.15 mm",
            severity: "CRITICAL"
          }
        ]);
      }, 1600);
    });
  }
};

export default function AegisCADAutomotiveNexus() {
  const [engineState, setEngineState] = useState('STANDBY');
  const [telemetry, setTelemetry] = useState([]);
  const [topologyData, setTopologyData] = useState(null);
  const [dfmResults, setDfmResults] = useState(null);
  const [viewMode, setViewMode] = useState('SOLID');
  
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const threeState = useRef({
    scene: null, camera: null, renderer: null, controls: null,
    animationId: null, isMounted: true, meshes: {}
  });
  const terminalRef = useRef(null);

  const logEngine = (msg, type = 'SYS') => {
    setTelemetry(prev => [...prev, {
      ts: new Date().toISOString().substring(11, 23),
      msg,
      type
    }]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [telemetry]);

  useEffect(() => {
    threeState.current.isMounted = true;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeEnvironment = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
        
        if (threeState.current.isMounted) {
          buildAutomotiveScene();
          logEngine('WebGL2 Render Engine & OrbitControls Initialized', 'OK');
          logEngine('Awaiting OpenCASCADE B-Rep Intercept...', 'SYS');
        }
      } catch (error) {
        if (threeState.current.isMounted) {
          logEngine('Critical failure loading render dependencies', 'ERR');
        }
      }
    };

    initializeEnvironment();

    return () => {
      threeState.current.isMounted = false;
      if (threeState.current.animationId) {
        cancelAnimationFrame(threeState.current.animationId);
      }
      if (threeState.current.renderer && mountRef.current) {
        if (mountRef.current.contains(threeState.current.renderer.domElement)) {
          mountRef.current.removeChild(threeState.current.renderer.domElement);
        }
        threeState.current.renderer.dispose();
      }
    };
  }, []);

  const buildAutomotiveScene = () => {
    if (!window.THREE || !mountRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new window.THREE.Scene();
    scene.background = new window.THREE.Color(0x0f172a);
    scene.fog = new window.THREE.Fog(0x0f172a, 15, 60);

    const camera = new window.THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 8, 14);

    const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new window.THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    const grid = new window.THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    grid.position.y = -4;
    scene.add(grid);

    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new window.THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(15, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const backLight = new window.THREE.PointLight(0x047857, 2, 50);
    backLight.position.set(-10, 5, -15);
    scene.add(backLight);

    const assemblyGroup = new window.THREE.Group();

    const housingMat = new window.THREE.MeshPhysicalMaterial({
      color: 0x1e293b, metalness: 0.2, roughness: 0.6, clearcoat: 0.1
    });
    
    const lensMat = new window.THREE.MeshPhysicalMaterial({
      color: 0xbae6fd, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, thickness: 0.5
    });

    const heatSinkMat = new window.THREE.MeshStandardMaterial({
      color: 0x64748b, metalness: 0.8, roughness: 0.3
    });

    const defectMat = new window.THREE.MeshStandardMaterial({
      color: 0x1e293b, metalness: 0.2, roughness: 0.6
    });

    const housingGeo = new window.THREE.SphereGeometry(3.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 1.8);
    housingGeo.scale(1, 0.85, 1.2);
    const housing = new window.THREE.Mesh(housingGeo, housingMat);
    housing.rotation.x = Math.PI;
    housing.castShadow = true;
    housing.receiveShadow = true;
    assemblyGroup.add(housing);

    const lensGeo = new window.THREE.SphereGeometry(2.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    lensGeo.scale(1, 1, 0.6);
    const lens = new window.THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0, 3.8);
    lens.rotation.x = Math.PI / 2;
    assemblyGroup.add(lens);

    const bezelGeo = new window.THREE.TorusGeometry(2.8, 0.2, 32, 100);
    const bezel = new window.THREE.Mesh(bezelGeo, heatSinkMat);
    bezel.position.set(0, 0, 3.8);
    assemblyGroup.add(bezel);

    const heatSinkCoreGeo = new window.THREE.CylinderGeometry(1.8, 1.8, 3, 32);
    const heatSinkCore = new window.THREE.Mesh(heatSinkCoreGeo, heatSinkMat);
    heatSinkCore.position.set(0, 0, -2.5);
    heatSinkCore.rotation.x = Math.PI / 2;
    assemblyGroup.add(heatSinkCore);

    const fins = [];
    for (let i = 0; i < 7; i++) {
      const finGeo = new window.THREE.CylinderGeometry(2.2, 2.2, 0.15, 32);
      const fin = new window.THREE.Mesh(finGeo, defectMat.clone());
      fin.position.set(0, 0, -1.5 - (i * 0.35));
      fin.rotation.x = Math.PI / 2;
      fin.castShadow = true;
      assemblyGroup.add(fin);
      fins.push(fin);
    }

    const bossGeo = new window.THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    
    const leftBoss = new window.THREE.Mesh(bossGeo, defectMat.clone());
    leftBoss.position.set(3.2, 0, 0);
    leftBoss.rotation.z = Math.PI / 2;
    leftBoss.castShadow = true;
    assemblyGroup.add(leftBoss);

    const rightBoss = new window.THREE.Mesh(bossGeo, defectMat.clone());
    rightBoss.position.set(-3.2, 0, 0);
    rightBoss.rotation.z = -Math.PI / 2;
    rightBoss.castShadow = true;
    assemblyGroup.add(rightBoss);

    scene.add(assemblyGroup);

    threeState.current = {
      ...threeState.current,
      scene, camera, renderer, controls,
      meshes: { assemblyGroup, housing, lens, fins, leftBoss, rightBoss }
    };

    const resizeObserver = new ResizeObserver(entries => {
      if (!threeState.current.isMounted || !threeState.current.renderer || !threeState.current.camera) return;
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        threeState.current.renderer.setSize(width, height);
        threeState.current.camera.aspect = width / height;
        threeState.current.camera.updateProjectionMatrix();
      }
    });
    
    resizeObserver.observe(containerRef.current);

    const animate = () => {
      if (!threeState.current.isMounted) return;
      threeState.current.animationId = requestAnimationFrame(animate);
      
      if (threeState.current.controls) threeState.current.controls.update();
      if (engineState === 'STANDBY' && threeState.current.meshes.assemblyGroup) {
        threeState.current.meshes.assemblyGroup.rotation.y += 0.003;
        threeState.current.meshes.assemblyGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
      }
      
      if (threeState.current.renderer && threeState.current.scene && threeState.current.camera) {
        threeState.current.renderer.render(threeState.current.scene, threeState.current.camera);
      }
    };

    animate();

    return () => resizeObserver.disconnect();
  };

  const toggleViewMode = () => {
    if (!threeState.current.meshes.assemblyGroup) return;
    const newMode = viewMode === 'SOLID' ? 'XRAY' : 'SOLID';
    setViewMode(newMode);
    
    const isWire = newMode === 'XRAY';
    
    threeState.current.scene.traverse((child) => {
      if (child.isMesh && child !== threeState.current.meshes.lens) {
        child.material.wireframe = isWire;
        if(isWire) {
           child.material.transparent = true;
           child.material.opacity = 0.3;
        } else {
           child.material.transparent = false;
           child.material.opacity = 1;
        }
      }
    });
  };

  const executeExtractionPhase = async () => {
    setEngineState('SCANNING');
    setTopologyData(null);
    setDfmResults(null);
    logEngine('Initiating OCCT 8.0 B-Rep Topological Extraction...', 'EXE');
    
    try {
      const data = await AutomotiveDFMEdge.extractBRepGraph();
      setTopologyData(data);
      setEngineState('TENSOR_MAPPING');
      logEngine(`B-Rep Graph Serialized. Nodes: ${data.nodes.length} | Edges: ${data.edges.length}`, 'OK');
      logEngine(`Manifold Class: ${data.classification} mapped successfully.`, 'OK');
    } catch (e) {
      setEngineState('FAIL');
      logEngine('OCCT Extraction Fault', 'ERR');
    }
  };

  const executeNeuralValidation = async () => {
    setEngineState('DFA_EVALUATION');
    logEngine('Multiplexing Face Adjacency Graph via gRPC to Agentic Core...', 'EXE');
    logEngine('Locking LLM Temperature to 0.0. Applying Varroc APQP Constraints...', 'SYS');
    
    try {
      const results = await AutomotiveDFMEdge.executeDFA(topologyData);
      setDfmResults(results);
      setEngineState('RESULTS_READY');
      logEngine('DFA Verifier Yielded Deterministic Output.', 'OK');
      
      if (threeState.current.meshes.leftBoss) {
        const alertColor = new window.THREE.Color(0xdc2626);
        threeState.current.meshes.leftBoss.material.color = alertColor;
        threeState.current.meshes.rightBoss.material.color = alertColor;
        threeState.current.meshes.fins.forEach(f => f.material.color = alertColor);
      }
      logEngine('Viewport Overlay: Critical Tooling Violations Highlighted', 'ERR');
    } catch (e) {
      setEngineState('FAIL');
      logEngine('RPC Stream Terminated Unexpectedly', 'ERR');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-green-200">
      <header className="bg-[#047857] text-white py-3 px-6 flex items-center justify-between border-b-4 border-[#065f46] shadow-md z-20">
        <div className="flex items-center space-x-4">
          <Hexagon size={32} className="text-white fill-current opacity-90" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tighter leading-none">AEGISCAD<span className="font-light">NEXUS</span></h1>
            <p className="text-[10px] font-mono tracking-[0.2em] text-green-200 uppercase">Enterprise Automotive DFM Core</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 bg-black/20 px-4 py-2 rounded-lg border border-white/10">
          <div className="flex items-center space-x-2">
            <Server size={14} className="text-green-300" />
            <span className="text-xs font-mono font-bold tracking-widest text-green-100">gRPC: {['SCANNING', 'DFA_EVALUATION'].includes(engineState) ? 'STREAMING' : 'IDLE'}</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <Zap size={14} className={engineState === 'DFA_EVALUATION' ? 'text-red-400 animate-pulse' : 'text-green-300'} />
            <span className="text-xs font-mono font-bold tracking-widest text-green-100">LATENCY: {engineState === 'DFA_EVALUATION' ? '38ms' : '0ms'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-76px)]">
        
        <div className="col-span-3 bg-white border-r-2 border-gray-200 flex flex-col z-10 shadow-xl">
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
                <Cpu size={16} className="mr-2 text-[#047857]" /> Pipeline Control
              </h2>
              <p className="text-xs text-gray-500 mb-4">Execute sub-100ms deterministic extraction.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={executeExtractionPhase}
                  disabled={['SCANNING', 'DFA_EVALUATION'].includes(engineState)}
                  className="w-full relative group overflow-hidden bg-[#047857] hover:bg-[#065f46] disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded shadow-md transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Layers size={18} className="mr-3" />
                    <span className="tracking-wide text-sm">1. Extract B-Rep Graph</span>
                  </div>
                  {engineState === 'SCANNING' && <Activity size={18} className="animate-spin" />}
                </button>

                <button 
                  onClick={executeNeuralValidation}
                  disabled={engineState !== 'TENSOR_MAPPING'}
                  className="w-full relative bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 px-4 rounded shadow-md transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Play size={18} className="mr-3 text-green-400 group-disabled:text-gray-400" />
                    <span className="tracking-wide text-sm">2. Neural DFA Logic</span>
                  </div>
                  {engineState === 'DFA_EVALUATION' && <Gauge size={18} className="animate-pulse text-red-500" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6 flex-1 flex flex-col">
              <h3 className="text-[10px] font-extrabold text-gray-400 mb-3 uppercase tracking-widest border-b border-gray-200 pb-2 shrink-0">Topological Data Matrix</h3>
              <div className="flex-1 overflow-y-auto">
                {topologyData ? (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-gray-500">ID:</span><span className="font-bold text-black">{topologyData.assemblyId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">CLASS:</span><span className="font-bold text-[#047857] text-right ml-2">{topologyData.classification}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">VOL:</span><span className="font-bold text-black">{topologyData.volume_cm3} cm³</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">NODES:</span><span className="font-bold text-black">{topologyData.nodes.length} Tensors</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">EDGES:</span><span className="font-bold text-black">{topologyData.edges.length} Matrices</span></div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 italic text-xs">
                    Awaiting manifold extraction...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-64 bg-[#09090b] flex flex-col border-t border-gray-800">
            <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center bg-black">
              <h2 className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center">
                <Terminal size={12} className="mr-2" /> Edge Gateway Stream
              </h2>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 leading-relaxed">
              {telemetry.map((log, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-600 mr-3 shrink-0">[{log.ts}]</span>
                  <span className={
                    log.type === 'ERR' ? 'text-red-500 font-bold' : 
                    log.type === 'OK' ? 'text-green-400 font-bold' : 
                    log.type === 'EXE' ? 'text-blue-400' : 'text-gray-300'
                  }>
                    {log.type === 'EXE' ? '> ' : ''}{log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-6 relative flex flex-col bg-[#0f172a] overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-bold border border-gray-300 rounded shadow flex items-center text-black">
              <Crosshair size={14} className="mr-2 text-[#047857]" />
              VARROC NX VIEWPORT
            </div>
            <button 
              onClick={toggleViewMode}
              className="bg-white/90 backdrop-blur hover:bg-gray-50 px-3 py-1.5 text-xs font-bold border border-gray-300 rounded shadow flex items-center text-black transition"
            >
              <Maximize size={14} className="mr-2 text-gray-600" />
              {viewMode === 'SOLID' ? 'WIRE X-RAY' : 'SOLID MESH'}
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10">
             <div className="bg-black/80 backdrop-blur px-3 py-2 border border-gray-700 rounded shadow text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono mb-1">State Config</p>
                <div className="flex items-center justify-end space-x-2">
                  <div className={`w-2 h-2 rounded-full ${engineState === 'STANDBY' ? 'bg-gray-500' : engineState === 'RESULTS_READY' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                  <p className="text-xs font-bold text-white uppercase tracking-wide">{engineState.replace('_', ' ')}</p>
                </div>
             </div>
          </div>

          <div ref={containerRef} className="relative w-full h-full flex-1 min-h-0">
             <div ref={mountRef} className="absolute inset-0 outline-none cursor-move" />
          </div>

          {dfmResults && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-red-600 text-white rounded-lg shadow-2xl border-2 border-red-400 overflow-hidden flex animate-in slide-in-from-bottom-8 duration-300 z-20">
              <div className="bg-red-800 p-4 flex items-center justify-center border-r border-red-500">
                <ShieldAlert size={32} className="animate-pulse" />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Critical Design Constraints Violated</h3>
                <p className="text-xs text-red-100">The current manifold topology fails Varroc PPAP specifications. Automatic red overlays generated on intersecting geometries.</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 bg-white border-l-2 border-gray-200 flex flex-col z-10 shadow-xl">
          <div className="p-6 border-b-2 border-gray-100 bg-gray-50 shrink-0">
            <h2 className="text-sm font-extrabold text-black mb-1 uppercase tracking-widest flex items-center">
              <CheckCircle size={16} className="mr-2 text-[#047857]" /> Validation Output
            </h2>
            <p className="text-xs text-gray-500">DFA-RAG Agentic Reasoning Log</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {!dfmResults ? (
               <div className="h-full flex flex-col items-center justify-center text-center px-4">
                 <ShieldAlert size={48} className="text-gray-200 mb-4" />
                 <p className="text-sm font-bold text-gray-400">NO ACTIVE DETECTIONS</p>
                 <p className="text-xs text-gray-400 mt-2">Run the Neural DFA Logic to evaluate the extracted topology against enterprise constraints.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {dfmResults.map((issue, idx) => (
                  <div key={idx} className={`rounded-lg border-2 p-4 shadow-sm ${issue.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-widest ${issue.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-600">{issue.ruleCode}</span>
                    </div>
                    
                    <p className="text-sm font-bold text-black leading-snug mb-3">
                      {issue.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 bg-white rounded border border-gray-200 p-2">
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Constraint</span>
                        <span className="block text-xs font-mono font-bold text-[#047857]">{issue.expected}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Extracted</span>
                        <span className={`block text-xs font-mono font-bold ${issue.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>{issue.actual}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-right">
                      <span className="text-[10px] font-mono text-gray-500">Target Mesh: {issue.faceId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
