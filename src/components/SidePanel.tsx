import type { SceneController } from "../lib/sceneController";
import { useScene } from "../scene/SceneContext";
import { useState } from "react";
import * as THREE from "three";

type SidePanelProps = {
  selectedModelRef: React.RefObject<THREE.Object3D | null>;
  controller: SceneController;
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
function SidePanel({ controller, selectedModelRef }: SidePanelProps) {
  const { scene } = useScene();
  const [positionX, setPositionX] = useState(0);
  const handleReset = () => {
    controller.resetAll();
    setPositionX(selectedModelRef.current?.position.x ?? 0);
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
                value={positionX}
                onFocus={() => {
                  setPositionX(selectedModelRef.current?.position.x ?? 0);
                }}
                onChange={(value) => {
                  setPositionX(value);
                  if (selectedModelRef.current) {
                    selectedModelRef.current.position.x = value;
                  }
                }}
              />
              <DimensionInput label="y" value={0} />
              <DimensionInput label="z" value={0} />
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <p className="text-gray-400 text-sm self-end">Rotation</p>
            <div className="grid grid-cols-3 gap-2">
              <DimensionInput label="x" value={0} />
              <DimensionInput label="y" value={0} />
              <DimensionInput label="z" value={0} />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <p className="text-gray-400 text-sm self-end">scale</p>
          <div className="grid grid-cols-3 gap-2">
            <DimensionInput label="x" value={0} />
            <DimensionInput label="y" value={0} />
            <DimensionInput label="z" value={0} />
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
