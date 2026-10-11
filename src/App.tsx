import "./App.css";
import SetupCanvas from "./components/SetupCanvas";
import SidePanel from "./components/SidePanel";
import { useState, useRef } from "react";
import * as THREE from "three";
import { SceneController } from "./lib/sceneController";
function App() {
  const selectedModelRef = useRef<THREE.Object3D | null>(null);
  const [controller] = useState(() => new SceneController());

  console.log("App controller:", controller); // ← ضيف ده
  return (
    <div className="App">
      <SetupCanvas
        selectedModelRef={selectedModelRef}
        controller={controller}
      />
      <SidePanel controller={controller} />
    </div>
  );
}

export default App;
