import type { SceneController } from "../lib/sceneController";
import { useScene } from "../scene/SceneContext";
import * as THREE from "three";
import type { Vector3 } from "../hooks/usePanelVal";

type SidePanelProps = {
  selectedModelRef: React.RefObject<THREE.Object3D | null>;
  controller: SceneController;
  position: Vector3 | null;
  onPositionChange: React.Dispatch<React.SetStateAction<Vector3 | null>>;
  rotation: Vector3 | null;
  onRotationChange: React.Dispatch<React.SetStateAction<Vector3 | null>>;
  scale: Vector3 | null;
  onScaleChange: React.Dispatch<React.SetStateAction<Vector3 | null>>;
};

type DimensionInputType = {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  onFocus?: () => void;
};
function DimensionInput({
  label,
  value,
  onChange,
  onFocus,
}: DimensionInputType) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input
        className="w-full min-w-0 rounded border border-gray-600 bg-transparent px-2 py-1 text-sm"
        placeholder={label}
        name={label}
        value={value}
        type="number"
        step={0.1}
        onFocus={onFocus}
        onChange={(event) => {
          const nextValue = event.currentTarget.valueAsNumber;
          if (Number.isFinite(nextValue)) {
            onChange?.(nextValue);
          }
        }}
        readOnly={!onChange}
      />
    </div>
  );
}
function SidePanel({
  controller,
  selectedModelRef,
  position,
  onPositionChange,
  rotation,
  onRotationChange,
  scale,
  onScaleChange,
}: SidePanelProps) {
  const { scene } = useScene();
  const handleReset = () => {
    controller.resetAll();
    if (controller.boxHelper) {
      scene?.remove(controller.boxHelper);
    }
    controller.boxHelper = null;
  };
  return (
    <div className="side-panel">
      <div>
        transform
        <div>
          <div className="flex flex-row gap-2">
            <p className="text-gray-400 text-sm self-end">Position</p>
            <div className="grid grid-cols-3 gap-2">
              <DimensionInput
                label="x"
                value={position?.x ?? 0}
                onFocus={() => {}}
                onChange={(value) => {
                  onPositionChange((prev) => {
                    return { x: value, y: prev?.y ?? 0, z: prev?.z ?? 0 };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.position.x = value;
                  }
                }}
              />
              <DimensionInput
                label="y"
                value={position?.y ?? 0}
                onChange={(value) => {
                  onPositionChange((prev) => {
                    return { x: prev?.x ?? 0, y: value, z: prev?.z ?? 0 };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.position.y = value;
                  }
                }}
              />
              <DimensionInput
                label="z"
                value={position?.z ?? 0}
                onChange={(value) => {
                  onPositionChange((prev) => {
                    return { x: prev?.x ?? 0, y: prev?.y ?? 0, z: value };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.position.z = value;
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <p className="text-gray-400 text-sm self-end">Rotation</p>
            <div className="grid grid-cols-3 gap-2">
              <DimensionInput
                label="x"
                value={rotation?.x ?? 0}
                onChange={(value) => {
                  onRotationChange((prev) => {
                    return { x: value, y: prev?.y ?? 0, z: prev?.z ?? 0 };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.rotation.z = value;
                  }
                }}
              />
              <DimensionInput
                label="y"
                value={rotation?.y ?? 0}
                onChange={(value) => {
                  onRotationChange((prev) => {
                    return { x: prev?.x ?? 0, y: value, z: prev?.z ?? 0 };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.rotation.y = value;
                  }
                }}
              />
              <DimensionInput
                label="z"
                value={rotation?.z ?? 0}
                onChange={(value) => {
                  onRotationChange((prev) => {
                    return { x: prev?.x ?? 0, y: prev?.y ?? 0, z: value };
                  });
                  if (selectedModelRef.current) {
                    selectedModelRef.current.rotation.z = value;
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <p className="text-gray-400 text-sm self-end">scale</p>
          <div className="grid grid-cols-3 gap-2">
            <DimensionInput
              label="x"
              value={scale?.x ?? 0}
              onChange={(value) => {
                onScaleChange((prev) => {
                  return { x: value, y: value, z: value };
                });
                if (selectedModelRef.current) {
                  selectedModelRef.current.scale.x = value;
                  selectedModelRef.current.scale.y = value;
                  selectedModelRef.current.scale.z = value;
                }
              }}
            />
            <DimensionInput
              label="y"
              value={scale?.y ?? 0}
              onChange={(value) => {
                onScaleChange((prev) => {
                  return { x: value, y: value, z: value };
                });
                if (selectedModelRef.current) {
                  selectedModelRef.current.scale.x = value;
                  selectedModelRef.current.scale.y = value;
                  selectedModelRef.current.scale.z = value;
                }
              }}
            />
            <DimensionInput
              label="z"
              value={scale?.z ?? 0}
              onChange={(value) => {
                onScaleChange((prev) => {
                  return { x: value, y: value, z: value };
                });
                if (selectedModelRef.current) {
                  selectedModelRef.current.scale.x = value;
                  selectedModelRef.current.scale.y = value;
                  selectedModelRef.current.scale.z = value;
                }
              }}
            />
          </div>
        </div>
      </div>
      <button
        className="rounded m-4 px-3 py-2 bg-amber-600 cursor-pointer"
        onClick={handleReset}
      >
        Reset Changes
      </button>
    </div>
  );
}

export default SidePanel;
