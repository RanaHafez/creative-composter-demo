import "./App.css";
import SetupCanvas from "./components/SetupCanvas";
import SidePanel from "./components/SidePanel";
import { useState, useRef } from "react";
import * as THREE from "three";
import { SceneController } from "./lib/sceneController";
import { SceneProvider } from "./scene/SceneContext";
import PanelShell from "./components/PanelShell";
function App() {
  const selectedModelRef = useRef<THREE.Object3D | null>(null);
  const [controller] = useState(() => new SceneController());

  console.log("App controller:", controller); // ← ضيف ده
  return (
    <SceneProvider>
      <div className="App">
        <SetupCanvas
          selectedModelRef={selectedModelRef}
          controller={controller}
        />

        <SidePanel
          selectedModelRef={selectedModelRef}
          controller={controller}
        />
      </div>
    </SceneProvider>
  );
}

export default App;
