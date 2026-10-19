import "./App.css";
import SetupCanvas from "./components/SetupCanvas";
import SidePanel from "./components/SidePanel";
import { useState, useRef } from "react";
import * as THREE from "three";
import { SceneController } from "./lib/sceneController";
import { SceneProvider } from "./scene/SceneContext";
import usePanelVal from "./hooks/usePanelVal";

function App() {
  const selectedModelRef = useRef<THREE.Object3D | null>(null);
  const [controller] = useState(() => new SceneController());
  const {
    position,
    setPosition,
    rotation,
    setRotation,
    scale,
    setScale,
    syncModel,
  } = usePanelVal();

  console.log("App controller:", controller); // ← ضيف ده
  return (
    <SceneProvider>
      <div className="App">
        <SetupCanvas
          selectedModelRef={selectedModelRef}
          controller={controller}
          onSelectionChange={syncModel}
        />

        <SidePanel
          selectedModelRef={selectedModelRef}
          controller={controller}
          position={position}
          onPositionChange={setPosition}
          rotation={rotation}
          onRotationChange={setRotation}
          scale={scale}
          onScaleChange={setScale}
        />

        <div className="absolute top-0">
          <p className="text-white">
            change the mode of gizmo with T for translate, R for rotation,and S
            for scale
          </p>
        </div>
      </div>
    </SceneProvider>
  );
}

export default App;
