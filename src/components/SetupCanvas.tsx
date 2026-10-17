import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ChildModel } from "../lib/ParentModel";
import { GizmoManager } from "../lib/GizmoManager";
import { setupScene } from "../scene/createScene";
import { attachInteractions } from "../scene/sceneInteraction";
import { loadSceneModels } from "../scene/loadSceneModels";
import { SceneController } from "../lib/sceneController";
import { useScene } from "../scene/SceneContext";

type SetupCanvasProps = {
  selectedModelRef: React.RefObject<THREE.Object3D | null>;
  controller: SceneController;
};

function SetupCanvas({ selectedModelRef, controller }: SetupCanvasProps) {
  console.log("props controller:", controller);
  const { setScene } = useScene();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene<THREE.Object3DEventMap> | null>(null);
  const childrenRef = useRef<ChildModel[]>([]);
  let disposeInteractions: (() => void) | undefined;

  useEffect(() => {
    if (!canvasRef.current) return;
    let frameId = 0;

    const { scene, camera, renderer, controls } = setupScene(canvasRef.current);
    sceneRef.current = scene;
    setScene(scene);
    const loadScene = async () => {
      const { child, parent } = await loadSceneModels();
      controller.parent = parent;
      childrenRef.current.push(child);
      scene.add(parent.model);

      controller.gizmoManager = new GizmoManager(
        scene,
        renderer,
        camera,
        controls,
      );

      disposeInteractions = attachInteractions(
        camera,
        controller.parent,
        childrenRef,
        sceneRef,
        selectedModelRef,
        controller.gizmoManager,
        controller,
        renderer,
      );
      renderer.render(scene, camera);
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };
    loadScene();

    return () => {
      disposeInteractions?.();
      cancelAnimationFrame(frameId);
      setScene(null);
      controller.gizmoManager?.dispose;
      renderer.dispose();
      //
    };
  }, []);
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default SetupCanvas;
