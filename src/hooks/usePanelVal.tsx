import { useState } from "react";
import * as THREE from "three";

type Vector3 = { x: number; y: number; z: number };
function usePanelVal() {
  const [position, setPosition] = useState<Vector3 | null>(null);

  const [rotation, setRotation] = useState<Vector3 | null>(null);

  const [scale, setScale] = useState<Vector3 | null>(null);

  function syncModel(model: THREE.Object3D | null) {
    setRotation(
      model
        ? {
            x: model.quaternion.x,
            y: model.quaternion.y,
            z: model.quaternion.z,
          }
        : null,
    );
    setScale(
      model
        ? {
            x: model.scale.x,
            y: model.scale.y,
            z: model.scale.z,
          }
        : null,
    );
    setPosition(
      model
        ? {
            x: model.position.x,
            y: model.position.y,
            z: model.position.z,
          }
        : null,
    );
  }
  return {
    position,
    setPosition,
    rotation,
    setRotation,
    scale,
    setScale,
    syncModel,
  };
}

export default usePanelVal;
export type { Vector3 };
