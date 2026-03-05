import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Layer1 from "./pages/layer1";
import Layer2 from "./pages/layer2";
import Layer3 from "./pages/layer3";
import Layer4 from "./pages/layer4";
import Layer5 from "./pages/layer5";
import Layer6 from "./pages/layer6";
import Layer7 from "./pages/layer7";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/layer1" element={<Layer1 />} />
        <Route path="/layer2" element={<Layer2 />} />
        <Route path="/layer3" element={<Layer3 />} />
        <Route path="/layer4" element={<Layer4 />} />
        <Route path="/layer5" element={<Layer5 />} />
        <Route path="/layer6" element={<Layer6 />} />
        <Route path="/layer7" element={<Layer7 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;