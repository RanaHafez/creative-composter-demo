import type { SceneController } from "../lib/sceneController";
import { useScene } from "../scene/SceneContext";
import * as THREE from "three";
import type { Vector3 } from "../hooks/usePanelVal";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { ParentModel } from "../lib/ParentModel";
import { Node3D, Node3DService } from "../lib/Node3d";
import { Box, Boxes, Upload } from "lucide-react";
import { useState } from "react";

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
  const [isParentExpaned, setIsParentExpanded] = useState(true);
  const handleReset = () => {
    controller.resetAll();
    if (controller.boxHelper) {
      scene?.remove(controller.boxHelper);
    }
    controller.boxHelper = null;
  };

  const handleDownload = () => {
    const exporter = new GLTFExporter();
    try {
      if (controller.parent) {
        exporter.parse(
          controller.parent.model,
          (result) => {
            const blob = new Blob([result as ArrayBuffer], {
              type: "model/gltf-binary",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "scene.glb";
            a.click();
            URL.revokeObjectURL(url);
          },
          (error) => {
            console.log(error);
          },
          { binary: true },
        );
      }
    } catch (e) {
      console.log(`Error ${e}`);
    }
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
                onScaleChange({ x: value, y: value, z: value });
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
                onScaleChange({ x: value, y: value, z: value });
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
                onScaleChange({ x: value, y: value, z: value });
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

      <button
        className="rounded m-4 px-3 py-2 bg-amber-600 cursor-pointer"
        onClick={handleDownload}
      >
        Download Output
      </button>
      <label
        htmlFor="parent-input"
        className="inline-flex items-center gap-2 cursor-pointer rounded-md border-2 border-solid border-white px-4 py-2 text-white hover:bg-white/10 transition-colors"
      >
        <Box size={20} color="white" />
        <span>Upload Parent Model</span>
      </label>

      <input
        id="parent-input"
        className="sr-only"
        type="file"
        accept=".glb,model/gltf-binary"
        onChange={async (e) => {
          // URL.createObjectURL();
          if (e.target.files) {
            const file = e.currentTarget.files?.[0];
            const parent = controller.parent;
            if (!file || !parent) return;

            const input = e.currentTarget;
            const url = URL.createObjectURL(file);

            try {
              const parentNode = new Node3D(url, new Node3DService(), "upload");
              await Promise.all([parentNode.loadFromGlb(url)]);
              controller.gizmoManager?.detach();
              if (controller.boxHelper) {
                scene?.remove(controller.boxHelper);
                controller.boxHelper.geometry.dispose();
                controller.boxHelper = null;
              }
              selectedModelRef.current = null;
              onPositionChange(null);
              onRotationChange(null);
              onScaleChange(null);

              const newParent = new ParentModel(parentNode);
              const oldParent = controller.parent;
              controller.parent = newParent;
              if (oldParent) {
                scene?.remove(oldParent?.node3d.root);
              }

              oldParent?.children.map((child) => {
                controller.parent?.addChild(child.node3d);
              });
              controller.parent.updateDimenstions();
              scene?.add(controller.parent.model);
            } catch (e) {
              URL.revokeObjectURL(url);
              input.value = "";
            }
          }
        }}
      />

      <label
        className="inline-flex items-center gap-2 cursor-pointer rounded-md border-2 border-solid border-white px-4 py-2 text-white hover:bg-white/10 transition-colors"
        htmlFor="item-input"
      >
        <div className="flex flex-row gap-1 items-center">
          <Boxes size={20} color="white"></Boxes>
          <p className="">Upload Child Model</p>
        </div>
      </label>
      <input
        id="item-input"
        className="hidden"
        type="file"
        accept=".glb,model/gltf-binary"
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          const parent = controller.parent;
          if (!file || !parent) return;

          const input = event.currentTarget;
          const url = URL.createObjectURL(file);
          try {
            const childNode = new Node3D(
              file.name,
              new Node3DService(),
              "upload",
            );
            await childNode.loadFromGlb(url);
            if (controller.parent !== parent) return;

            controller.gizmoManager?.detach();
            if (controller.boxHelper) {
              scene?.remove(controller.boxHelper);
              controller.boxHelper.geometry.dispose();
              // controller.boxHelper.material.dispose();
              controller.boxHelper = null;
            }
            selectedModelRef.current = null;
            onPositionChange(null);
            onRotationChange(null);
            onScaleChange(null);

            for (const child of parent.children) {
              parent.model.remove(child.model);
            }
            parent.children.length = 0;
            parent.updateDimenstions();
            parent.addChild(childNode);
          } catch (error) {
            console.error("Could not load replacement item:", error);
          } finally {
            URL.revokeObjectURL(url);
            input.value = "";
          }
        }}
      />
    </div>
  );
}

export default SidePanel;
