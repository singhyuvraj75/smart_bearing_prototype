import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Cpu, 
  Activity, 
  Database, 
  Layers, 
  Server, 
  Crosshair, 
  Hexagon, 
  Terminal, 
  Maximize, 
  Zap,
  Network,
  FileJson,
  CheckCircle2,
  BoxSelect,
  Shapes,
  Binary
} from 'lucide-react';

// Layer 1 specific mock data engine (B-Rep Extraction ONLY)
const ExtractionEdgeEngine = {
  extractBRepGraph: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          assemblyId: "VAR-DOOR-PNL-LH-2026",
          classification: "AUTOMOTIVE_DOOR_ASSEMBLY",
          manifoldStatus: "WATER_TIGHT_MANIFOLD",
          volume_cm3: 15420.75,
          surfaceArea_cm2: 28500.40,
          nodes: Array.from({ length: 486 }, (_, i) => ({
            faceId: `F-${8000 + i}`,
            type: i % 7 === 0 ? 'NURBS_A_SURFACE' : (i % 4 === 0 ? 'STAMPED_CUTOUT' : 'PLANAR_MOUNT'),
            principalCurvature: [+(Math.random()).toFixed(4), +(Math.random()).toFixed(4)],
            area: +(Math.random() * 50 + 5).toFixed(2)
          })),
          edges: Array.from({ length: 1240 }, (_, i) => ({
            edgeId: `E-${20000 + i}`,
            source: `F-${8000 + Math.floor(Math.random() * 486)}`,
            target: `F-${8000 + Math.floor(Math.random() * 486)}`,
            continuity: Math.random() > 0.6 ? 'G1_TANGENT' : 'G0_POSITIONAL',
            convexity: Math.random() > 0.5 ? 'CONVEX' : 'CONCAVE'
          }))
        });
      }, 1800);
    });
  }
};

export default function AegisCADLayer1() {
  const [engineState, setEngineState] = useState('STANDBY'); // STANDBY, EXTRACTING, EXTRACTION_COMPLETE
  const [telemetry, setTelemetry] = useState([]);
  const [topologyData, setTopologyData] = useState(null);
  const [viewMode, setViewMode] = useState('SOLID'); // SOLID, XRAY
  
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
          buildRealisticCarDoorScene();
          logEngine('WebGL2 Render Engine & OrbitControls Initialized', 'OK');
          logEngine('Awaiting OpenCASCADE B-Rep Intercept from Native CAD...', 'SYS');
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

  const buildRealisticCarDoorScene = () => {
    if (!window.THREE || !mountRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new window.THREE.Scene();
    scene.background = new window.THREE.Color(0x0f172a); 
    scene.fog = new window.THREE.Fog(0x0f172a, 15, 60);

    const camera = new window.THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 2, 16);

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

    // Lighting
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new window.THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(15, 20, 25);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new window.THREE.PointLight(0x0ea5e9, 2, 50); // Cyan rim light
    rimLight.position.set(-15, 10, -15);
    scene.add(rimLight);

    const assemblyGroup = new window.THREE.Group();

    // --- MATERIALS ---
    const outerPaintMat = new window.THREE.MeshPhysicalMaterial({
      color: 0x475569, metalness: 0.7, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1, side: window.THREE.DoubleSide
    });
    const innerMetalMat = new window.THREE.MeshStandardMaterial({
      color: 0x64748b, metalness: 0.6, roughness: 0.5, side: window.THREE.DoubleSide
    });
    const glassMat = new window.THREE.MeshPhysicalMaterial({
      color: 0xbae6fd, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, side: window.THREE.DoubleSide
    });
    const wireframeMat = new window.THREE.LineBasicMaterial({ 
      color: 0x10b981, transparent: true, opacity: 0.0, linewidth: 2 
    }); // Emerald wireframe for topological graph visualization

    // --- PROCEDURAL GEOMETRY GENERATION ---
    
    // 1. Base Door Outline (Shared between inner and outer)
    const doorOutline = new window.THREE.Shape();
    doorOutline.moveTo(-5, -4);        // Bottom Left
    doorOutline.lineTo(4, -4);         // Bottom Right
    doorOutline.lineTo(5, 1);          // Beltline Right
    doorOutline.lineTo(3.5, 4.5);      // Roof Right
    doorOutline.lineTo(-2.5, 4.5);     // Roof Left
    doorOutline.lineTo(-5, 1);         // Beltline Left
    doorOutline.lineTo(-5, -4);        // Close

    // 2. Window Cutouts
    const window1 = new window.THREE.Path();
    window1.moveTo(-4.3, 1.3);
    window1.lineTo(-0.2, 1.3);
    window1.lineTo(-0.2, 4.0);
    window1.lineTo(-2.1, 4.0);
    window1.lineTo(-4.3, 1.3);
    
    const window2 = new window.THREE.Path();
    window2.moveTo(0.2, 1.3);
    window2.lineTo(4.3, 1.3);
    window2.lineTo(3.1, 4.0);
    window2.lineTo(0.2, 4.0);
    window2.lineTo(0.2, 1.3);

    // OUTER PANEL
    const outerShape = new window.THREE.Shape().copy(doorOutline);
    outerShape.holes.push(window1);
    outerShape.holes.push(window2);

    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
    const outerGeo = new window.THREE.ExtrudeGeometry(outerShape, extrudeSettings);

    // Apply Tumblehome Curvature (Displace Z based on Y)
    const curveGeometry = (geo, zOffset = 0) => {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i);
        let normalizedY = (y + 4) / 8.5; // Map -4..4.5 to 0..1
        let bulge = Math.sin(normalizedY * Math.PI) * 0.8; // Creates the side curve
        pos.setZ(i, pos.getZ(i) + bulge + zOffset);
      }
      geo.computeVertexNormals();
    };
    curveGeometry(outerGeo, 0);

    const outerPanel = new window.THREE.Mesh(outerGeo, outerPaintMat);
    outerPanel.castShadow = true;
    outerPanel.receiveShadow = true;
    assemblyGroup.add(outerPanel);

    // INNER STAMPED PANEL (Complex topology)
    const innerShape = new window.THREE.Shape().copy(doorOutline);
    innerShape.holes.push(window1);
    innerShape.holes.push(window2);
    
    // Procedurally punch complex structural holes in the inner panel
    const createHole = (x, y, radius) => {
      const hole = new window.THREE.Path();
      hole.absarc(x, y, radius, 0, Math.PI * 2, false);
      innerShape.holes.push(hole);
    };
    // Grid of structural cutouts
    for(let x = -4; x <= 3; x += 2.5) {
      for(let y = -3; y <= 0; y += 1.5) {
        if(x !== -4 || y !== -3) createHole(x, y, 0.6); // Skip bottom left for speaker
      }
    }
    // Large Speaker/Mechanism cutouts
    createHole(-3, -2.5, 1.2); 
    createHole(2.5, -2.5, 1.0);
    
    // Long rectangular cutouts for mechanisms
    const rectHole = new window.THREE.Path();
    rectHole.moveTo(-2, -0.5); rectHole.lineTo(2, -0.5); rectHole.lineTo(2, 0); rectHole.lineTo(-2, 0); rectHole.lineTo(-2, -0.5);
    innerShape.holes.push(rectHole);

    const innerGeo = new window.THREE.ExtrudeGeometry(innerShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05 });
    curveGeometry(innerGeo, -0.3); // Set slightly behind outer panel

    const innerPanel = new window.THREE.Mesh(innerGeo, innerMetalMat);
    innerPanel.castShadow = true;
    innerPanel.receiveShadow = true;
    assemblyGroup.add(innerPanel);

    // SIDE IMPACT BEAM (Structural)
    const beamGeo = new window.THREE.BoxGeometry(9.5, 0.5, 0.2);
    const beamPos = beamGeo.attributes.position;
    // Bend beam to match door curve
    for (let i = 0; i < beamPos.count; i++) {
        let y = beamPos.getY(i) - 1.5; // Target height
        let normalizedY = (y + 4) / 8.5;
        let bulge = Math.sin(normalizedY * Math.PI) * 0.8;
        beamPos.setZ(i, beamPos.getZ(i) + bulge - 0.2);
    }
    beamGeo.computeVertexNormals();
    const beam = new window.THREE.Mesh(beamGeo, innerMetalMat);
    beam.position.set(0, -1.5, 0);
    beam.rotation.z = 0.15; // Angled across the door
    assemblyGroup.add(beam);

    // GLASS PANELS
    const glassShape1 = new window.THREE.Shape();
    glassShape1.moveTo(-4.2, 1.4); glassShape1.lineTo(-0.3, 1.4); glassShape1.lineTo(-0.3, 3.9); glassShape1.lineTo(-2.0, 3.9); glassShape1.lineTo(-4.2, 1.4);
    const glassGeo1 = new window.THREE.ShapeGeometry(glassShape1);
    curveGeometry(glassGeo1, -0.15);

    const glassShape2 = new window.THREE.Shape();
    glassShape2.moveTo(0.3, 1.4); glassShape2.lineTo(4.2, 1.4); glassShape2.lineTo(3.0, 3.9); glassShape2.lineTo(0.3, 3.9); glassShape2.lineTo(0.3, 1.4);
    const glassGeo2 = new window.THREE.ShapeGeometry(glassShape2);
    curveGeometry(glassGeo2, -0.15);

    const glass1 = new window.THREE.Mesh(glassGeo1, glassMat);
    const glass2 = new window.THREE.Mesh(glassGeo2, glassMat);
    assemblyGroup.add(glass1, glass2);

    // --- TOPOLOGICAL GRAPH VISUALIZATION (WIREFRAMES) ---
    const wireframes = [];
    [outerGeo, innerGeo, beamGeo].forEach(geo => {
      const edges = new window.THREE.EdgesGeometry(geo, 15); // 15 degree threshold to show key structural edges
      const wireframe = new window.THREE.LineSegments(edges, wireframeMat.clone());
      wireframes.push(wireframe);
    });
    
    // Add wireframes as children to their respective meshes
    outerPanel.add(wireframes[0]);
    innerPanel.add(wireframes[1]);
    beam.add(wireframes[2]);

    scene.add(assemblyGroup);

    threeState.current = {
      ...threeState.current,
      scene, camera, renderer, controls,
      meshes: { assemblyGroup, outerPanel, innerPanel, glass1, glass2, beam, wireframes }
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
        threeState.current.meshes.assemblyGroup.rotation.y += 0.002;
      }
      
      // Topological Graph Extraction Animation (Pulse wireframes)
      if (threeState.current.meshes.wireframes) {
         if (engineState === 'EXTRACTING') {
           // Pulsing effect
           const targetOpacity = 0.3 + Math.sin(Date.now() * 0.008) * 0.3;
           threeState.current.meshes.wireframes.forEach(wf => wf.material.opacity = targetOpacity);
         } else if (engineState === 'EXTRACTION_COMPLETE') {
           // Solid mapped wireframe overlay
           threeState.current.meshes.wireframes.forEach(wf => {
             wf.material.opacity += (0.6 - wf.material.opacity) * 0.05;
             wf.material.color.setHex(0x06b6d4); // Cyan
           });
         } else {
           threeState.current.meshes.wireframes.forEach(wf => wf.material.opacity = 0);
         }
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
    const { outerPanel, innerPanel, beam, glass1, glass2 } = threeState.current.meshes;
    
    [outerPanel, innerPanel, beam].forEach(mesh => {
      mesh.material.wireframe = isWire;
      mesh.material.transparent = isWire;
      mesh.material.opacity = isWire ? 0.15 : 1.0;
    });
    
    // Keep glass slightly more transparent in X-RAY
    [glass1, glass2].forEach(glass => {
      glass.material.opacity = isWire ? 0.05 : 1.0;
    });
  };

  const executeExtractionPhase = async () => {
    setEngineState('EXTRACTING');
    setTopologyData(null);
    logEngine('Intercepted native Save event via C++ Plugin...', 'SYS');
    logEngine('Initiating OCCT 8.0 B-Rep Topological Extraction...', 'EXE');
    
    try {
      setTimeout(() => logEngine('Bypassing legacy trees. Mapping TopoDS_Shape structures...', 'EXE'), 400);
      setTimeout(() => logEngine('Calculating principal curvatures and bounding boxes...', 'EXE'), 900);
      setTimeout(() => logEngine('Indexing Face Adjacency Graph (FAG)...', 'EXE'), 1400);
      
      const data = await ExtractionEdgeEngine.extractBRepGraph();
      setTopologyData(data);
      setEngineState('EXTRACTION_COMPLETE');
      logEngine(`B-Rep Graph Serialized. Found ${data.nodes.length} Nodes (Faces) and ${data.edges.length} Edges (Co-edges)`, 'OK');
      logEngine(`Manifold Class: ${data.classification} mapped successfully.`, 'OK');
      logEngine('Sub-graph delta hashed. Preparing gRPC stream for Layer 2 transport...', 'SYS');
    } catch (e) {
      setEngineState('FAIL');
      logEngine('OCCT Extraction Fault', 'ERR');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-emerald-200">
      <header className="bg-white text-slate-800 py-3 px-6 flex items-center justify-between border-b border-gray-200 shadow-sm z-20">
        <div className="flex items-center space-x-4">
          <div className="bg-[#047857] p-2 rounded-lg">
             <Hexagon size={24} className="text-white fill-current opacity-90" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none text-slate-900">
              LAYER 1: <span className="font-light text-gray-500">CLIENT & EXTRACTION</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-[#047857] uppercase font-bold mt-1">AegisCAD Nexus • Topology Extraction</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Server size={14} className="text-[#06b6d4]" />
            <span className="text-xs font-mono font-bold tracking-widest text-slate-600">STATE: {engineState === 'EXTRACTING' ? 'PROCESSING' : engineState === 'EXTRACTION_COMPLETE' ? 'EXTRACTED' : 'IDLE'}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <Activity size={14} className={engineState === 'EXTRACTING' ? 'text-emerald-500 animate-spin' : 'text-slate-400'} />
            <span className="text-xs font-mono font-bold tracking-widest text-slate-600">KERNEL: OCCT 8.0</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-70px)]">
        
        {/* Left Panel: Pipeline Control */}
        <div className="col-span-3 bg-white border-r border-gray-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-sm font-extrabold text-slate-900 mb-1 uppercase tracking-widest flex items-center">
                <Cpu size={16} className="mr-2 text-[#047857]" /> Extraction Control
              </h2>
              <p className="text-xs text-slate-500 mb-4">Execute sub-100ms deterministic B-Rep abstraction.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={executeExtractionPhase}
                  disabled={['EXTRACTING', 'EXTRACTION_COMPLETE'].includes(engineState)}
                  className="w-full relative group overflow-hidden bg-[#047857] hover:bg-[#065f46] disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white font-bold py-3.5 px-4 rounded shadow-sm transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Layers size={18} className="mr-3" />
                    <span className="tracking-wide text-sm">1. Extract B-Rep Graph</span>
                  </div>
                  {engineState === 'EXTRACTING' && <Activity size={18} className="animate-spin text-emerald-500" />}
                  {engineState === 'EXTRACTION_COMPLETE' && <CheckCircle2 size={18} className="text-emerald-500" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6 flex-1 flex flex-col shadow-inner">
              <h3 className="text-[10px] font-extrabold text-slate-400 mb-3 uppercase tracking-widest border-b border-slate-200 pb-2 shrink-0">Topological Data Matrix</h3>
              <div className="flex-1 overflow-y-auto">
                {topologyData ? (
                  <div className="space-y-2 text-xs font-mono animate-in fade-in duration-500">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">ID:</span><span className="font-bold text-slate-800">{topologyData.assemblyId}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">CLASS:</span><span className="font-bold text-[#047857] text-right ml-2">{topologyData.classification}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">VOL:</span><span className="font-bold text-slate-800">{topologyData.volume_cm3} cm³</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">NODES (FACES):</span><span className="font-bold text-slate-800">{topologyData.nodes.length} Tensors</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">EDGES (CO-EDGES):</span><span className="font-bold text-slate-800">{topologyData.edges.length} Matrices</span></div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic text-xs">
                    Awaiting manifold extraction...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-64 bg-[#0f172a] flex flex-col border-t-4 border-[#047857]">
            <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-[#020617]">
              <h2 className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-widest flex items-center">
                <Terminal size={12} className="mr-2" /> Local Extraction Stream
              </h2>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 leading-relaxed">
              {telemetry.length === 0 && <span className="text-slate-600 italic">Listening for CAD save events...</span>}
              {telemetry.map((log, idx) => (
                <div key={idx} className="flex">
                  <span className="text-slate-600 mr-3 shrink-0">[{log.ts}]</span>
                  <span className={
                    log.type === 'ERR' ? 'text-rose-500 font-bold' : 
                    log.type === 'OK' ? 'text-emerald-400 font-bold' : 
                    log.type === 'EXE' ? 'text-[#06b6d4]' : 'text-slate-300'
                  }>
                    {log.type === 'EXE' ? '> ' : ''}{log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: 3D Viewport */}
        <div className="col-span-6 relative flex flex-col bg-[#1e293b] overflow-hidden shadow-inner" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <div className="bg-white/95 backdrop-blur px-3 py-1.5 text-[10px] tracking-widest font-bold border border-slate-200 rounded shadow-sm flex items-center text-slate-800">
              <Crosshair size={14} className="mr-2 text-[#047857]" />
              NATIVE CAD VIEWPORT
            </div>
            <button 
              onClick={toggleViewMode}
              className="bg-white/95 backdrop-blur hover:bg-slate-50 px-3 py-1.5 text-[10px] tracking-widest font-bold border border-slate-200 rounded shadow-sm flex items-center text-slate-700 transition cursor-pointer z-50"
            >
              <Maximize size={14} className="mr-2 text-slate-500" />
              {viewMode === 'SOLID' ? 'WIRE X-RAY' : 'SOLID MESH'}
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10">
             <div className="bg-slate-900/80 backdrop-blur px-3 py-2 border border-slate-700 rounded shadow-lg text-right">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mb-1">Graph Mapping Status</p>
                <div className="flex items-center justify-end space-x-2">
                  <div className={`w-2 h-2 rounded-full ${engineState === 'STANDBY' ? 'bg-slate-500' : engineState === 'EXTRACTION_COMPLETE' ? 'bg-[#06b6d4]' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <p className="text-xs font-bold text-white uppercase tracking-wide">
                    {engineState === 'STANDBY' ? 'UNMAPPED' : engineState === 'EXTRACTING' ? 'BUILDING GRAPH...' : 'AAG SERIALIZED'}
                  </p>
                </div>
             </div>
          </div>

          <div ref={containerRef} className="relative w-full h-full flex-1 min-h-0">
             <div ref={mountRef} className="absolute inset-0 outline-none cursor-move" />
          </div>

          {/* Extraction Success Indicator overlaid on 3D */}
          {engineState === 'EXTRACTION_COMPLETE' && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-cyan-900/90 backdrop-blur-md border border-[#06b6d4] px-6 py-3 rounded-full flex items-center space-x-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-in slide-in-from-bottom-10 fade-in duration-500">
              <Network className="text-cyan-400 w-5 h-5" />
              <span className="text-cyan-50 text-sm font-bold tracking-wide">Topology Graph Successfully Mapped</span>
            </div>
          )}
        </div>

        {/* Right Panel: B-Rep Topology Inspector */}
        <div className="col-span-3 bg-white border-l border-gray-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 border-b border-gray-100 bg-gray-50 shrink-0">
            <h2 className="text-sm font-extrabold text-slate-900 mb-1 uppercase tracking-widest flex items-center">
              <BoxSelect size={16} className="mr-2 text-[#06b6d4]" /> B-Rep Topology Inspector
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Geometric Abstraction Metrics</p>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-0">
            {engineState !== 'EXTRACTION_COMPLETE' ? (
               <div className="h-full flex flex-col items-center justify-center text-center px-6">
                 <Shapes size={48} className="text-slate-200 mb-4" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Topology Mapped</p>
                 <p className="text-xs text-slate-400 mt-2">Trigger the B-Rep extraction to view the structural analysis of the CAD geometry.</p>
               </div>
            ) : (
              <div className="p-6 bg-white min-h-full border-t border-slate-100 animate-in fade-in duration-700 flex flex-col space-y-6">
                
                {/* Topological Hierarchy */}
                <div>
                   <h3 className="text-[10px] font-extrabold text-slate-400 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Manifold Hierarchy</h3>
                   <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center"><span className="text-slate-500">Assemblies</span><span className="font-bold text-slate-800">1</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500">Solids</span><span className="font-bold text-slate-800">1</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500">Shells</span><span className="font-bold text-slate-800">3</span></div>
                      <div className="flex justify-between items-center bg-emerald-50 p-1.5 rounded -mx-1.5 px-1.5"><span className="text-emerald-700 font-semibold">Faces (Nodes)</span><span className="font-bold text-emerald-700">{topologyData?.nodes.length}</span></div>
                      <div className="flex justify-between items-center bg-[#06b6d4]/10 p-1.5 rounded -mx-1.5 px-1.5"><span className="text-[#0369a1] font-semibold">Co-Edges (Links)</span><span className="font-bold text-[#0369a1]">{topologyData?.edges.length}</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-500">Vertices</span><span className="font-bold text-slate-800">2,840</span></div>
                   </div>
                </div>

                {/* Surface Classification */}
                <div>
                   <h3 className="text-[10px] font-extrabold text-slate-400 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Surface Classification</h3>
                   <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-slate-600">NURBS (A-Surface)</span><span className="text-[#06b6d4]">65%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#06b6d4] h-1.5 rounded-full" style={{ width: '65%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-slate-600">Planar (Mounts/Ribs)</span><span className="text-[#047857]">25%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#047857] h-1.5 rounded-full" style={{ width: '25%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-slate-600">Cylindrical (Bosses/Holes)</span><span className="text-slate-500">10%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '10%' }}></div></div>
                      </div>
                   </div>
                </div>

                {/* gRPC Tensor Metrics */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner mt-auto">
                   <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                     <Binary size={12} className="mr-1.5 text-slate-400" /> Tensor Serialization
                   </h3>
                   <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                      <div>
                         <span className="block text-slate-400 mb-0.5">Node Matrix</span>
                         <span className="font-bold text-slate-800">[{topologyData?.nodes.length}, 12] FP32</span>
                      </div>
                      <div>
                         <span className="block text-slate-400 mb-0.5">Edge Matrix</span>
                         <span className="font-bold text-slate-800">[{topologyData?.edges.length}, 5] FP32</span>
                      </div>
                      <div>
                         <span className="block text-slate-400 mb-0.5">Compression</span>
                         <span className="font-bold text-[#047857]">Protobuf (8.4x)</span>
                      </div>
                      <div>
                         <span className="block text-slate-400 mb-0.5">Transport</span>
                         <span className="font-bold text-slate-800">HTTP/2 gRPC</span>
                      </div>
                   </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
